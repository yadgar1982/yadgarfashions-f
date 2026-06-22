import { Button, Flex, Card, Form, Input, Select, Typography, Divider, message } from "antd";
const { Title } = Typography;
import Layout from "../../Shared/Layout";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { http, trimData } from "../../../../../module/http";
import countryOptions from "../../../../json/currency.json"
const { Item } = Form;

//translation imported 
import { useTranslation } from 'react-i18next';
const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
};
const RegisterShared = () => {
    const [myUserType, setMyUserType] = useState(null)
    console.log(myUserType)
    const { t } = useTranslation('register');
    const navigate = useNavigate();

    //states colections
    const [isOtp, setIsOtp] = useState(false);
    const [otp, setOtp] = useState(null);
    const [loader, setLoader] = useState(false);



    const onFinish = async (values) => {
        try {

            setLoader(true);
            const httpReq = http();

            await httpReq.post(
                "/api/register",
                values
            );
            await httpReq.post(
                "/api/send-email/",
                { email: values.email }
            );
            message.success(
                capitalizeFirstLetter(
                    t("registration completed successfully !").trim()
                )
            );
        } catch (error) {
            console.log(error)
            if (error.status === 422) {

                message.error(
                    capitalizeFirstLetter(
                        t("already registered, please try to login.").trim().toLowerCase()
                    )
                );
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
        <div>
            <div className="grid lg:grid-cols-4">
                <div></div>
                <Card
                    className={`${isOtp && 'hidden'} grid md:col-span-2`}
                    title={capitalizeFirstLetter(t(" user registeration form"))}>
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
                                label={capitalizeFirstLetter(t("email"))}
                                name="email"
                                rules={[{ required: true }]}
                            >
                                <Input />
                            </Item>
                        </div>
                        <div className="grid md:grid-cols-2 gap-3">
                            <Item
                                label={capitalizeFirstLetter(t("password"))}
                                name="password"
                                rules={[{ required: true }]}
                            >
                                <Input.Password />
                            </Item>
                            <Item
                                label={capitalizeFirstLetter(t("phone number"))}
                                name="number"
                                rules={[{ required: true }]}
                            >
                                <Input />
                            </Item>
                        </div>
                        <div className="grid md:grid-cols-2 gap-3">
                            <Item
                                label={capitalizeFirstLetter(t("dob"))}
                                name="dob"
                                rules={[{ required: true }]}
                            >
                                <Input type="date" />
                            </Item>
                            <Item
                                label={capitalizeFirstLetter(t("userType"))}
                                name="userType"
                                rules={[{ required: true }]}
                                onChange={(meta) => {
                                    console.log('Meta changed:', meta);
                                }}
                            >
                                <Select
                                    placeholder={capitalizeFirstLetter(t("employee"))}
                                    options={[
                                        {
                                            label: capitalizeFirstLetter(t("Admin")),
                                            value: 'admin'
                                        },
                                        {
                                            label: capitalizeFirstLetter(t("Employee")),
                                            value: 'employee'
                                        },
                                        {
                                            label: capitalizeFirstLetter(t("Dealer")),
                                            value: 'dealer'
                                        },
                                        {
                                            label: capitalizeFirstLetter(t("Supplier")),
                                            value: 'supplier'
                                        },

                                    ]}
                                    onChange={(value) => setMyUserType(value)}
                                />
                            </Item>
                            <Item
                                label={capitalizeFirstLetter(t("gender"))}
                                name="gender"
                            // rules={[{ required: true }]}
                            >
                                <Select
                                    placeholder={capitalizeFirstLetter(t("gender"))}
                                    options={[
                                        {
                                            label: capitalizeFirstLetter(t("male")),
                                            value: 'male'
                                        },
                                        {
                                            label: capitalizeFirstLetter(t("female")),
                                            value: 'female'
                                        }
                                    ]}

                                />
                            </Item>
                            <Item
                                label="Country"
                                name="country"
                                rules={[{ required: true }]}
                            >
                                <Select placeholder="Select Country">
                                    {
                                        countryOptions.map((item) => (
                                            <Option key={item.currencyCode} value={item.countryName}>
                                                {item.countryName}
                                            </Option>
                                        ))
                                    }
                                </Select>
                            </Item>
                            <Item
                                label={capitalizeFirstLetter(t("salary"))}
                                name="salary"

                            >
                                <Input disabled={myUserType !== "employee"} />
                            </Item>
                        </div>
                        <Item
                            name="address"
                            label={capitalizeFirstLetter(t("address"))}
                            rules={[{ required: true }]}
                        >
                            <Input.TextArea />
                        </Item>
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
                        <Form onFinish={onFinish} layout="vertical" >
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
        </div>
    )
}
export default RegisterShared;