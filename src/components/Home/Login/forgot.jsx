import { Button, Flex, Card, Form, Input, Select, Typography, Divider, message } from "antd";
const { Title } = Typography;
import HomeLayout from "../../Shared/HomeLayout";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { http, trimData, fetchData } from "../../../../module/http";
import { toast } from "react-toastify";
const { Item } = Form;
import useSWR from "swr";
//translation imported 
import { useTranslation } from 'react-i18next';
const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
};
const Forgot = () => {
    const { t } = useTranslation('register');
    const navigate = useNavigate();

    //states colections
    const [isOtp, setIsOtp] = useState(false);
    const [otp, setOtp] = useState(null);
    const [isReset, setIsReset] = useState(true);
    const [isEmail, setIsEmail] = useState(false);
    const [formData, setFormData] = useState(null);
    const [loader, setLoader] = useState(false);

    const otpFnish = async (values) => {
        try {
            if (values.otp == otp) {
                setLoader(true);
                setIsReset(false)
                setIsOtp(false)
            } else {

                toast.error(
                    capitalizeFirstLetter(
                        t("Your OTP is not matching").trim().toLowerCase()
                    )
                );
            }
        } catch (error) {
            console.log(error)
            toast.error(
                capitalizeFirstLetter(
                    t("unable to register, please try again later.").trim().toLowerCase()
                )
            );
        } finally {
            setLoader(false);
        }
    }

    const onReset = async (values) => {
        try {
            const password = values.password;
            const repassword = values.repassword;
            if (password !== repassword)
                return toast.error("Your password and re-password is not matching! ");
            const httpReq = http();
            const { data } = await httpReq.put(`/api/auth/${formData.email}`, { password })
            toast.success("Your password has been changed successfully! ");
            navigate("/login")
        } catch (err) {
            toast.error("Unable to change your password! ");
        }


    }

    const onFinish = async (values) => {

        const httpReq = http();
        const { data } = await httpReq.get(`/api/auth/${values.email}`);

        if (data.data.email === values.email) {

            try {
                setLoader(true);
                const finalObj = trimData(values);

                const httpReq = http();
                const { data } = await httpReq.post(
                    "/api/send-email/otp/change",
                    { email: finalObj.email }
                );
                if (data.isSent) {
                    setIsOtp(true);
                    setIsEmail(true)
                    setOtp(data.otp);
                    setFormData({ email: finalObj.email })
                } else {
                    setIsOtp(false);
                    setOtp(null);
                }
            } catch (error) {

            } finally {
                setLoader(false);
            }

        }

    }


    return (
        <HomeLayout>
            <div className="grid lg:grid-cols-6">
                <div></div>
                <div></div>
                <Card
                    className={`${isEmail && 'hidden'} grid md:col-span-2`}
                >
                    <Form onFinish={onFinish} layout="vertical">

                        <div className=" gap-3">
                            <Item
                                label={capitalizeFirstLetter(t("Enter your Email for"))}
                                name="email"
                                rules={[{ required: true }]}
                            >
                                <Input />
                            </Item>
                        </div>

                        <Item>
                            <Button
                                loading={loader}
                                htmlType="submit"
                                className="bg-[#910a52] font-bold text-white w-full"
                            >
                                {capitalizeFirstLetter(t("Submit"))}
                            </Button>
                        </Item>
                    </Form>


                </Card>
                <Card
                    className={`${isReset && 'hidden'} grid md:col-span-2 shadow-lg rounded-none`}
                >
                    <h2 className=" w-full text-center text-zinc-500 font-semibold text-xl mb-5">Reset your password here!</h2>
                    <Form onFinish={onReset} layout="vertical"

                    >

                        <div className=" gap-3 !mb-5">
                            <Item
                                label={capitalizeFirstLetter(t("Enter new password"))}
                                name="password"
                                rules={[{ required: true }]}
                            >
                                <Input.Password />
                            </Item>
                            <Item
                                label={capitalizeFirstLetter(t("Re-enter new password"))}
                                name="repassword"
                                rules={[{ required: true }]}
                            >
                                <Input.Password />
                            </Item>
                        </div>


                        <Item>
                            <Button
                                loading={loader}
                                htmlType="submit"
                                className="bg-[#910a52] font-bold text-white w-full mt-5"
                            >
                                {capitalizeFirstLetter(t("Submit"))}
                            </Button>
                        </Item>
                    </Form>


                </Card>

                <div className={`${!isOtp && 'hidden'} grid md:grid-cols-3 !text-[#910a52]`}>
                    <div></div>
                    <Card
                        className="md:w-[600px] flex flex-col !text-[#910a52] items-center !justify-center"
                        title="Verify your OTP">
                        <Form onFinish={otpFnish} layout="vertical" >
                            <Item

                                name="otp"
                                label="Enter OTP"
                                rules={[{ required: true }]}
                            >
                                <Input.OTP
                                    mask="🔒"
                                />
                            </Item>
                            <Item>
                                <Button
                                    loading={loader}
                                    htmlType="submit"
                                    className="font-bold bg-[#910a52] text-white w-full"
                                >
                                    {capitalizeFirstLetter(t("verify now"))}

                                </Button>
                            </Item>
                        </Form>
                    </Card>

                    <div></div>
                </div>



            </div>

        </HomeLayout >
    )
}
export default Forgot;