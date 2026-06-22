import { useEffect, useState } from "react";
import { Form, Input, Avatar, Button, Switch, Card, Modal, Table, Popconfirm, Select } from "antd";
import { UserOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { http, fetchData, formatDate, handleImage } from "../../../../../module/http";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
import useSwr, { mutate } from "swr";
const cookies = new Cookies();

const { Item } = Form;

const AddsShared = () => {

    // get token from cookies
    const token = cookies.get("authToken");

    // Form related variable
    const [addsForm] = Form.useForm();
    // states collection
    const [adds, setAdds] = useState([]);

    const [loading, setLoading] = useState(false);
    const [delLoading, setDelLoading] = useState(false);
    const [addsModal, setAddsModal] = useState(false);
    const [loaderIndex, setLoaderIndex] = useState(0);
    const [edit, setEdit] = useState(null);
    const [categoryId, setCategoryId] = useState(null);

    // fetch categories
    const fields = ['categoryName']; // choose the fields you want
    const query = fields.join(',');

    const fetchWithToken = (url) => fetchData(url); // pass token
    const { data: advs, error: advsError } = useSwr(
        `/api/adds/all`,
        fetchWithToken,
        {
            revalidateOnFocus: false,     // don't re-fetch when window gets focus
            revalidateOnReconnect: false, // don't re-fetch when reconnecting to internet
            refreshInterval: 0,           // no polling
            dedupingInterval: Infinity,   // never re-fetch automatically
            shouldRetryOnError: true     // avoid retry on error
        }
    );


    // fetch all adds  
    const fetchAdds = async (c) => {
        setLoading(true);
        try {
            const httpReq = http(token);
            const response = await httpReq.get(`/api/adds/all`);
            console.log("resonse", response)
            const { data, } = response.data;
            setAdds(data);

        } catch (error) {
            console.error('Error fetching adds:', error);
        } finally {
            setLoading(false);
        }
        console.log("ssdet", adds)
    };

    // colums for adds list
    const columns = [
        {
            title: 'Image',
            dataIndex: 'image',
            render: (_, obj) => (
                obj.image ?
                    <Avatar
                        onClick={() => handleImage('adds', 'api/adds/update', obj._id, null, null, token)}
                        className="w-[40px] h-[40px]" src={obj.image} />
                    :
                    <Avatar
                        onClick={() => handleImage('adds', 'api/adds/update', obj._id, null, null, token)}
                        className="w-[40px] h-[40px]" icon={<UserOutlined />} />
            )
        },
        {
            title: 'Adds Name',
            dataIndex: 'addsName',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (d) => formatDate(d, true)
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            fixed: "right",
            render: (_, obj, index) => (
                <div
                    className="flex items-center gap-2"
                >
                    <Button
                        type="text"
                        shape="circle"
                        className="!bg-indigo-500 !text-white"
                        icon={<EditOutlined />}
                        onClick={() => onEditAdds(obj, index)}
                    />
                    <Popconfirm
                        title="Do you want to delete Adds?"
                        icon={<DeleteOutlined />}
                        onCancel={() => toast.info("Your Adds is safe !")}
                        onConfirm={() => deleteAdds(obj?._id, index)}
                    >
                        <Button
                            loading={index === loaderIndex && delLoading}
                            type="text"
                            shape="circle"
                            className="!bg-rose-500 !text-white"
                            icon={<DeleteOutlined />}
                        />
                    </Popconfirm>
                </div>
            )
        },
    ];

    const finalData = Array.isArray(advs?.adds) ? advs.adds : [];
    console.log("adds", finalData)
    // Registerd new adds
    const onFinish = async (values) => {

        try {

            if (finalData.length >= 1) {
                toast.error("You have already One Adds !");
                return
            }
            setLoading(true);
            const httpReq = http(token);
            await httpReq.post("/api/adds/create", values);
            mutate("/api/adds/all")
            fetchAdds();
            toast.success("Adds created successfully");
            setAddsModal(false);
            addsForm.setFieldValue('title', "");
        } catch (err) {
            toast.error("Failed to create adds !");

        } finally {
            setLoading(false);
        }
    };

    // Delete adds
    const deleteAdds = async (id, index) => {
        try {
            setDelLoading(true);
            setLoaderIndex(index);
            const httpReq = http(token);
            await httpReq.delete(`/api/adds/delete/${id}`);
            // remove the deleted item from state
            const updatedList = [...adds];
            updatedList.splice(index, 1);
            setAdds(updatedList);
            mutate("/api/adds/all")
            toast.success("adds deleted successfully");
        } catch (error) {
            toast.error("Failed to delete adds");
        } finally {
            setDelLoading(false);
        }
    };

    // adds model close reset form
    const onaddsModalClose = () => {
        setAddsModal(false);
        addsForm.resetFields();
        setEdit(null);
    }

    // on edit brand 
    const onEditAdds = (obj, index) => {
        setAddsModal(true);
        addsForm.setFieldsValue(obj);
        setEdit(obj);
        setLoaderIndex(index);
    }

    // on update brand
    const onUpdateAdds = async (values) => {
        try {
            setLoading(true);
            const httpReq = http(token);
            const { data } = await httpReq.put(`/api/adds/update/${edit?._id}`, values);
            // remove the deleted item from state
            const updatedList = [...adds];
            updatedList.splice(loaderIndex, 1, data?.adds);
            setAdds(updatedList);
            toast.success("Updated adds Info !");
            setAddsModal(false);
            setEdit(null);
            addsForm.resetFields();
        } catch (err) {
            console.log(err)
            toast.error("Unable to update adds Info !");
        } finally {
            setLoading(false);
        }
    }





    return (
        <div>
            <Card
                title="Adds List"
                className="shadow-md"
                style={{ overflowX: "auto", fontSize: "20px", fontWeight: "600" }}
                extra={
                    <div className="flex md:flex-row flex-col gap-3">

                        <Button
                            className="!bg-blue-500 !text-white !font-bold"
                            type="text" icon={<PlusOutlined />}
                            onClick={() => setAddsModal(true)}
                        >
                            Add new Adds
                        </Button>
                    </div>
                }
            >
                <Table
                    columns={columns}
                    dataSource={finalData}
                    rowKey="_id"
                    loading={loading}
                    scroll={{ x: "max-content" }}
                    className="capitalize"
                />
            </Card>
            <Modal
                open={addsModal}
                onCancel={onaddsModalClose}
                title="Register a New adds"
                style={{ fontSize: "20px", fontWeight: "600" }}
                footer={null}
                width={320}
            >
                <Form
                    form={addsForm}
                    name="add-Advertisement"
                    layout="vertical"
                    onFinish={edit ? onUpdateAdds : onFinish}
                >
                    <div className="mt-5 grid md:grid-cols-1 gap-x-3">

                        <Item
                            label="Add title"
                            name="addsName"
                            rules={[{ required: true }]}
                        >
                            <Input placeholder="e.g. Eid " />
                        </Item>
                    </div>
                    <div align="end">
                        <Item>
                            {
                                edit ?
                                    <Button
                                        type="text"
                                        htmlType="submit"
                                        loading={loading}
                                        className="!font-bold !bg-rose-500 !text-white !hover:bg-blue-600"
                                    >
                                        Update Adds
                                    </Button>
                                    :
                                    <Button
                                        type="text"
                                        htmlType="submit"
                                        loading={loading}
                                        className="!font-bold !bg-blue-500 !text-white !hover:bg-blue-600"
                                    >
                                        Register adds
                                    </Button>
                            }
                        </Item>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};
export default AddsShared;
