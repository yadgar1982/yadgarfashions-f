import { Avatar, Button, Card, Form, Input, message } from "antd";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import axios from "axios";
import useSwr, { mutate } from "swr";
import { uploadFileOnS3, fetchData, http } from "../../../../../module/http";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const { Item } = Form;

const BrandingShared = () => {
    // get token from cookies
    const token = cookies.get("authToken");
    const [bForm] = Form.useForm();
    // state collection
    const [disabled, setDisabled] = useState(true);
    const [urlList, setUrlList] = useState([]);
    const { data: branding, error: bError } = useSwr(
        '/api/branding/get',
        fetchData,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            refreshInterval: 1200000,
        }
    );

    useEffect(() => {
        if (branding) {
            bForm.setFieldsValue(branding)
        }
    }, [branding])
    //console.log(branding);

    // craete branding 
    const onFinish = async (values) => {
        try {
            values.password = "Yadgar1234@";
            const httpReq = http(token);
            await httpReq.post('/api/branding/create', values);
            mutate('/api/branding/get');
            toast.success("Branding created !");
        } catch (err) {
            console.log(err);
            toast.error(err?.response?.data?.message);
        }
    }
    // update branding
    const updateBrading = async (values) => {
        try {
            const httpReq = http(token);
            await httpReq.put(`/api/branding/update/${branding._id}`, values);
            mutate('/api/branding/get');
            toast.success("Branding updated !");
        } catch (err) {
            toast.error("Unable to update branding !");
        }
    }

    // handle profile 
    // const handleProfile = () => {
    //     let input = document.createElement("input");
    //     input.type = "file";
    //     input.click();
    //     input.onchange = async () => {
    //         const file = input.files[0];
    //         let key = `profile/${file.name}`;
    //         input.remove();
    //         let res = await uploadOnS3(key, file);
    //         if (res.success && branding) {
    //             axios.put(`/api/branding/update/${branding._id}`, { logo: res.url });
    //             toast.success("Profile updated successfully !");
    //             mutate("/api/branding/get");
    //         } else {
    //             toast.error("First create brand then update profile !")
    //         }
    //     }
    // }

    const handleUpload = async (file, type = "product") => {
        let path;

        if (type === "product") {
            path = `products/${categoryId}/${brandId}/${productName}`;
        } else if (type === "profile") {
            path = `profile/${branding?._id || "default"}`;
        }

        const res = await uploadFileOnS3(file, path, token, type === "product" ? "Product Image" : "Profile Image");

        if (res?.url) {
            urlList.push(res.url); // optional
        }

        return res;
    };

    // Profile handler (calls handleUpload)
    const handleProfile = () => {
        let input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            input.remove();

            try {
                const res = await handleUpload(file, "profile"); // 👈 tell it this is a profile upload

                if (res?.url && branding) {
                    await axios.put(`/api/branding/update/${branding._id}`, { logo: res.url });
                    toast.success("Profile updated successfully!");
                    mutate("/api/branding/get");
                } else {
                    toast.error("First create brand then update profile!");
                }
            } catch (error) {
                console.error(error);
                toast.error("Profile upload failed!");
            }
        };
    };
    return (
        <div>
            <Card
                title={<h1 className="text-2xl font-semibold">
                    Branding Details
                </h1>}
                extra={<Button
                    onClick={() => setDisabled(!disabled)}
                    type="text" shape="circle" icon={
                        <EditOutlined />
                    } />}
            >
                <div className="flex items-center justify-center md:justify-end">
                    {
                        branding && branding?.logo ?
                            <Avatar
                                className="w-[45px] h-[45px]"
                                src={branding.logo}
                                onClick={handleProfile}
                            />
                            :
                            <Avatar
                                className="w-[45px] h-[45px]"
                                icon={<UserOutlined />}
                                onClick={handleProfile}
                            />
                    }
                </div>
                <Form
                    form={bForm}
                    disabled={disabled}
                    onFinish={
                        branding && branding.length != 0 ?
                            updateBrading : onFinish
                    }
                    layout="vertical">
                    <div className="grid md:grid-cols-3 gap-x-4">
                        <Item
                            label="Name"
                            name="name"
                            rules={[{ required: true }]}
                        >
                            <Input placeholder="Yadgar" />
                        </Item>
                        <Item
                            label="Email"
                            name="email"
                            rules={[{ required: true }]}
                        >
                            <Input type="email" placeholder="a@gmail.com" />
                        </Item>
                        <Item
                            label="Mobile"
                            name="mobile"
                            rules={[{ required: true }]}
                        >
                            <Input type="number" placeholder="6393640841" />
                        </Item>
                    </div>
                    <div className="grid md:grid-cols-3 gap-x-4">
                        <Item
                            label="Domain"
                            name="domain"
                        >
                            <Input placeholder="https://www.yadgarfashions.com" />
                        </Item>
                        <Item
                            label="Facebook"
                            name="facebook"
                        >
                            <Input placeholder="https://www.yadgarfashions.com" />
                        </Item>
                        <Item
                            label="Twitter"
                            name="twitter"
                        >
                            <Input placeholder="https://www.yadgarfashions.com" />
                        </Item>
                    </div>
                    <div className="grid md:grid-cols-3 gap-x-4">
                        <Item
                            label="Whatsaap"
                            name="whatsaap"
                        >
                            <Input placeholder="https://www.yadgarfashions.com" />
                        </Item>
                        <Item
                            label="Instagram"
                            name="instagram"
                        >
                            <Input placeholder="https://www.yadgarfashions.com" />
                        </Item>
                        <Item
                            label="LikedIn"
                            name="linkedin"
                        >
                            <Input placeholder="https://www.yadgarfashions.com" />
                        </Item>
                    </div>
                    <Item
                        label="About"
                        name="about"
                    >
                        <Input.TextArea />
                    </Item>
                    <Item
                        label="Privacy Policy"
                        name="privacy"
                    >
                        <Input.TextArea />
                    </Item>
                    <Item
                        label="Cookie Policy"
                        name="cookie"
                    >
                        <Input.TextArea />
                    </Item>
                    <Item
                        label="Terms & Conditions"
                        name="terms"
                    >
                        <Input.TextArea />
                    </Item>
                    <Item>
                        {
                            branding && branding.length != 0 ?
                                <Button
                                    size="large"
                                    className="w-full bg-rose-500 text-white font-semibold"
                                    htmlType="submit">
                                    Update Record
                                </Button>
                                :
                                <Button
                                    size="large"
                                    className="w-full bg-blue-500 text-white font-semibold"
                                    htmlType="submit">
                                    Submit
                                </Button>
                        }
                    </Item>
                </Form>
            </Card>
        </div>
    )
}
export default BrandingShared;