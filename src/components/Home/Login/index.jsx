import { Button, Flex, Card, Form, Divider, Input, Select, Typography, message, Tooltip } from "antd";
const { Title } = Typography;
import HomeLayout from "../../Shared/HomeLayout";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { http, trimData } from "../../../../module/http";
import Cookies from "universal-cookie";
import { useDispatch } from "react-redux";


const { Item } = Form;
const cookies = new Cookies();



//translation imported
import { useTranslation } from 'react-i18next';
import { toast } from "react-toastify";
import { setExchange } from "../../../../redux/slices/exchange.slice";
const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
};
const Login = () => {

    // dispatch
    const dispatch = useDispatch();

    const { t } = useTranslation('login');
    const navigate = useNavigate();

    // states collections
    const [loader, setLoader] = useState(false);

    // create cookie expiry
    const expires = new Date();
    expires.setDate(expires.getDate() + 2);

    const onFinish = async (values) => {
        //get user name from users
        try {
            setLoader(true);
            const finalObj = trimData(values);
            const httpReq = http();
            const { data } = await httpReq.post(
                "/api/auth/login",
                finalObj
            )
            const { token, user } = data;
            if (user.role === "admin") {
                localStorage.setItem("userInfo", JSON.stringify(user));
                cookies.set("authToken", token, {
                    path: "/",
                    expires
                });
                return navigate("/admin");
            }
            if (user.role === "employee") {
                localStorage.setItem("userInfo", JSON.stringify(user));
                cookies.set("authToken", token, {
                    path: "/",
                    expires
                });
                return navigate("/employee");
            }
            if (user.role === "dealer") {
                localStorage.setItem("userInfo", JSON.stringify(user));
                cookies.set("authToken", token, {
                    path: "/",
                    expires
                });
                return navigate("/dealer");
            }
            if (user.role === "supplier") {
                localStorage.setItem("userInfo", JSON.stringify(user));
                cookies.set("authToken", token, {
                    path: "/",
                    expires
                });
                return navigate("/supplier-history");
            }
            if (user.role === "user") {
                const { data } = await httpReq.post(`/api/exchange/rate/${user?.currencyCode}`);
                const { data: dlvDuration } = await httpReq.get(`/api/dlv-duration/country/${user?.countryName}`);
                localStorage.setItem("dlvDuration", JSON.stringify(dlvDuration));
                dispatch(setExchange({
                    currencyCode: user?.currencyCode,
                    rate: data?.rate,
                    currency: user?.currency
                }))
                localStorage.setItem("userInfo", JSON.stringify(user));
                cookies.set("authToken", token, {
                    path: "/",
                    expires
                });
                const productId = sessionStorage.getItem("redirectProductId");
                if (productId) {
                    navigate(`/product-details?productId=${productId}`)

                } else {
                    navigate("/");
                }

            }
        } catch (error) {
            if(error.status === 429)
                return toast.error("Login Failed : " + error?.response?.data)
            toast.error(error?.response?.data?.message)
        } finally {
            setLoader(false);
        }



    }

    return (
        <HomeLayout >
            <div className="grid  grid-cols-1 md:grid-cols-3 flex justify-center items-center py-9">
                <div ></div>
                <div>
                    <Card
                        className="w-full max-w-[95%] md:max-w-[100%]  mx-auto py-5 shadow-lg"
                        title={capitalizeFirstLetter(t("Log in for full access to product details and updates")).trim()}
                    >
                        <Form
                            onFinish={onFinish}
                            layout="vertical">
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
                            <Item>
                                <Button
                                    loading={loader}
                                    htmlType="submit"
                                    className="bg-[#910a52] text-white w-full"
                                >
                                    {capitalizeFirstLetter(t("login"))}
                                </Button>
                            </Item>
                        </Form>
                        <Divider>
                            {capitalizeFirstLetter(t("or"))}
                        </Divider>
                        <div className="flex items-center justify-center">

                            <Tooltip
                                title={(t('Register Here'))}
                                placement='top'
                                color='#910a52'
                            >
                                <Link
                                    to="/register"
                                    className="font-bold text-blue-500 underline text:sm md:text-lg"
                                >
                                    {(t("Register Now"))}
                                </Link>
                            </Tooltip>
                        </div>
                        <div className="flex items-center justify-between mt-5">

                            <Tooltip
                                title={(t('Click here to reset Your password'))}
                                placement='top'
                                color='#910a52'
                            >
                                <Link
                                    to="/forgot"
                                    className="font-semibold text-[#910a52] underline text:sm md:text-lg"
                                >
                                    {(t("Forgot your Password?"))}
                                </Link>
                            </Tooltip>
                        </div>
                    </Card>
                </div>
                <div ></div>
            </div>
        </HomeLayout>
    )
}
export default Login;