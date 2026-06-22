import { Button, Flex, Card, Form, Input, Select, Typography, Divider, message } from "antd";
const { Option } = Select;
const { Title } = Typography;
import HomeLayout from "../../Shared/HomeLayout";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { http, trimData, fetchData } from "../../../../module/http";
import { toast } from "react-toastify";
const { Item } = Form;
import countryOptions from "../../../json/currency.json"
import useSWR from "swr";
//translation imported 
import { useTranslation } from 'react-i18next';
const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const Register = () => {
    const { t } = useTranslation('register');
    const navigate = useNavigate();

    //states colections
    const [isOtp, setIsOtp] = useState(false);
    const [otp, setOtp] = useState(null);
    const [formData, setFormData] = useState(null);
    const [loader, setLoader] = useState(false);

    const otpFnish = async (values) => {

        try {
            if (values.otp == otp) {
                setLoader(true);
                const httpReq = http();
                formData.userType = "user";
                const { data } = await httpReq.post(
                    "/api/user/create",
                    formData
                );
                toast.success(
                    capitalizeFirstLetter(
                        t("registration complete, now you can login.").trim()
                    )
                );
                navigate("/login");
            } else {

                toast.error(
                    capitalizeFirstLetter(
                        t("wrong otp, please enter correct otp.").trim().toLowerCase()
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

    const { data: country, error: cError } = useSWR(
        `api/currency/all`,
        fetchData
    )
    const onFinish = async (values) => {

        try {
            setLoader(true);
            const finalObj = trimData(values);

            const httpReq = http();
            const { data } = await httpReq.post(
                "/api/send-email/otp",
                { email: finalObj.email }
            );

               setFormData(finalObj);
            if (data.isSent) {
                setIsOtp(true);
                setOtp(data.otp);
            } else {
                setIsOtp(false);
                setOtp(null);
            }
        } catch (error) {
            console.log(error)
            if (error.response?.status === 422) {

                message.error(
                    
                    capitalizeFirstLetter(
                        t("already registered, please try to login.").trim().toLowerCase()
                    )
                );
                console.log(error.response?.data);
            } else {
                message.error(
                    capitalizeFirstLetter(
                        t("unable to register, please try again later.").trim().toLowerCase()
                    )
                );
                message.error("Unable to register, Please try again later.")
            }
        } finally {
            setLoader(false);
        }
    }

    return (
        <HomeLayout>
            <div className="grid lg:grid-cols-4">
                <div></div>
                <Card
                    className={`${isOtp && 'hidden'} grid md:col-span-2`}
                    title={capitalizeFirstLetter(t("registeration form"))}>
                    <Form onFinish={onFinish} layout="vertical">
                        <div className="grid md:grid-cols-2 gap-3">
                            <Item
                                label={capitalizeFirstLetter(t("fullname"))}
                                name="fullname"
                                rules={[{ required: true }]}
                            >
                                <Input />
                            </Item>
                            <Item
                                label={(t("Country"))}
                                name="country"
                                rules={[{ required: true }]}
                            >
                                <Select placeholder="Select Country">
                                    {
                                        country && country.map((item) => (
                                            <Option key={item.countryName} value={item.countryName}>
                                                {capitalizeFirstLetter(item.countryName)}
                                            </Option>
                                        ))
                                    }
                                </Select>
                            </Item>

                        </div>
                        <div className="grid md:grid-cols-2 gap-3">
                            <Item
                                label={capitalizeFirstLetter(t("email"))}
                                name="email"
                                rules={[{ required: true }]}
                            >
                                <Input />
                            </Item>
                            <Item
                                label={capitalizeFirstLetter(t("password"))}
                                name="password"
                                rules={[{ required: true }]}
                            >
                                <Input.Password />
                            </Item>

                        </div>
                        <div className="grid md:grid-cols-2 gap-3">


                        </div>


                        <Item>
                            <Button
                                loading={loader}
                                htmlType="submit"
                                className="bg-[#910a52] font-bold text-white w-full"
                            >
                                {capitalizeFirstLetter(t("register now"))}
                            </Button>
                        </Item>
                    </Form>
                    <Divider>
                        {capitalizeFirstLetter(t("or"))}
                    </Divider>
                    <div className="flex items-center justify-between">
                        <h2 className="font-bold text-xl">
                            {capitalizeFirstLetter(t("already have an account ?"))}

                        </h2>
                        <Link className="font-bold text-blue-500 underline text-lg" to="/login">

                            {capitalizeFirstLetter(t("login now"))}
                        </Link>
                    </div>
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
                <div></div>
            </div>
        </HomeLayout >
    )
}
export default Register;