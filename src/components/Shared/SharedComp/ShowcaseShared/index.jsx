import { useEffect, useState } from "react";
import { Form, Input, Avatar, Button, Switch, Card, Modal, Table, Popconfirm, Select } from "antd";
import { UserOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { http, fetchData, formatDate, handleImage } from "../../../../../module/http";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
import useSwr from "swr";
const cookies = new Cookies();

const { Item } = Form;

const ShowcaseShared = () => {

    // get token from cookies
    const token = cookies.get("authToken");

    // Form related variable
    const [showcaseForm] = Form.useForm();
    // states collection
    const [showcases, setShowcases] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
    });
    const [loading, setLoading] = useState(false);
    const [delLoading, setDelLoading] = useState(false);
    const [showcaseModal, setShowcaseModal] = useState(false);
    const [loaderIndex, setLoaderIndex] = useState(0);
    const [edit, setEdit] = useState(null);
    const [categoryId, setCategoryId] = useState(null);

    // fetch categories
    const fields = ['categoryName']; // choose the fields you want
    const query = fields.join(',');

    const fetchWithToken = (url) => fetchData(url); // pass token
    const { data: categories, error: categoryError } = useSwr(
        `/api/category/query?fields=${query}`,
        fetchWithToken,
        {
            revalidateOnFocus: false,     // don't re-fetch when window gets focus
            revalidateOnReconnect: false, // don't re-fetch when reconnecting to internet
            refreshInterval: 0,           // no polling
            dedupingInterval: Infinity,   // never re-fetch automatically
            shouldRetryOnError: true     // avoid retry on error
        }
    );

    // fetch all categories related showcase 
    const fetchShowcase = async (categoryId, page = 1, pageSize = 10) => {
        try {
            setLoading(true);
            const httpReq = http(token);
            const response = await httpReq.get(`/api/showcase/pagination/${categoryId}?page=${page}&limit=${pageSize}`);
            const { data, total } = response.data;
            setShowcases(data);
            setPagination({
                current: page,
                pageSize: pageSize,
                total: total,
            });
        } catch (error) {
            console.error('Error fetching showcase:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTableChange = (pagination) => {
        fetchShowcase(categoryId, pagination.current, pagination.pageSize);
    };

    // Registerd new showcase
    const onFinish = async (values) => {
        try {
            setLoading(true);
            const httpReq = http(token);
            await httpReq.post("/api/showcase/create", values);
            setCategoryId(values.categoryId);
            fetchShowcase(values.categoryId, pagination.current, pagination.pageSize);
            toast.success("showcase created successfully");
            setShowcaseModal(false);
            showcaseForm.setFieldValue('showcaseName', "");
        } catch (err) {
            if (err.status === 400) {
                console.log(err);
                toast.error("This showcase already registered !");
            } else {
                toast.error("Failed to create showcase !");
            }
        } finally {
            setLoading(false);
        }
    };

    // Delete showcase
    const deleteShowcase = async (id, index) => {
        try {
            setDelLoading(true);
            setLoaderIndex(index);
            const httpReq = http(token);
            await httpReq.delete(`/api/showcase/delete/${id}`);
            // remove the deleted item from state
            const updatedList = [...showcases];
            updatedList.splice(index, 1);
            setShowcases(updatedList);
            toast.success("showcase deleted successfully");
        } catch (error) {
            toast.error("Failed to delete showcase");
        } finally {
            setDelLoading(false);
        }
    };

    // showcase model close reset form
    const onShowcaseModalClose = () => {
        setShowcaseModal(false);
        showcaseForm.resetFields();
        setEdit(null);
    }

    // on edit showcase 
    const onEditShowcase = (obj, index) => {
        setShowcaseModal(true);
        showcaseForm.setFieldsValue(obj);
        setEdit(obj);
        setLoaderIndex(index);
    }

    // on update showcase
    const onUpdateShowcase = async (values) => {
        try {
            setLoading(true);
            const httpReq = http(token);
            const { data } = await httpReq.put(`/api/showcase/update/${edit?._id}`, values);
            // remove the deleted item from state
            const updatedList = [...showcases];
            updatedList.splice(loaderIndex, 1, data?.showcase);
            setShowcases(updatedList);
            toast.success("Updated showcase Info !");
            setShowcaseModal(false);
            setEdit(null);
            showcaseForm.resetFields();
        } catch (err) {
            toast.error("Unable to update showcase Info !");
        } finally {
            setLoading(false);
        }
    }

    // fetch showcase on class change
    const handleCategoryChange = (categoryId) => {
        setCategoryId(categoryId);
        fetchShowcase(categoryId, pagination.current, pagination.pageSize);
    }

    // colums for showcasees list
    const columns = [
        {
            title: 'Image',
            dataIndex: 'image',
            render: (_, obj) => (
                obj.image ?
                    <Avatar
                        onClick={() => handleImage('showcase', 'api/showcase/update', obj._id,null,null,token)}
                        className="w-[40px] h-[40px]" src={obj.image} />
                    :
                    <Avatar
                        onClick={() => handleImage('showcase', 'api/showcase/update', obj._id,null,null,token)}
                        className="w-[40px] h-[40px]" icon={<UserOutlined />} />
            )
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
                        onClick={() => onEditShowcase(obj, index)}
                    />
                    <Popconfirm
                        title="Do you wanna delete school?"
                        icon={<DeleteOutlined />}
                        onCancel={() => toast.info("Your showcase is safe !")}
                        onConfirm={() => deleteShowcase(obj?._id, index)}
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

    return (
        <div>
            <Card
                title="showcases List"
                className="shadow-md"
                style={{ overflowX: "auto", fontSize: "20px", fontWeight: "600" }}
                extra={
                    <div className="flex md:flex-row flex-col gap-3">
                        <Select
                            onChange={handleCategoryChange}
                            className="min-w-[200px]" placeholder="Select Category"
                        >
                            {
                                categories && categories?.categories.map((item) => (
                                    <Select.Option
                                        key={item._id}
                                        value={item._id}
                                        className="capitalize"
                                    >{item.categoryName}</Select.Option>
                                ))
                            }
                        </Select>
                        <Button
                            className="!bg-blue-500 !text-white !font-bold"
                            type="text" icon={<PlusOutlined />}
                            onClick={() => setShowcaseModal(true)}
                        >
                            Add new showcase
                        </Button>
                    </div>
                }
            >
                <Table
                    columns={columns}
                    dataSource={showcases && showcases}
                    rowKey="_id"
                    loading={loading}
                    pagination={pagination}
                    onChange={handleTableChange}
                    scroll={{ x: "max-content" }}
                    className="capitalize"
                />
            </Card>
            <Modal
                open={showcaseModal}
                onCancel={onShowcaseModalClose}
                title="Register a New showcase"
                style={{ fontSize: "20px", fontWeight: "600" }}
                footer={null}
                width={320}
            >
                <Form
                    form={showcaseForm}
                    name="add-showcase"
                    layout="vertical"
                    onFinish={edit ? onUpdateShowcase : onFinish}
                >
                    <div className="mt-5 grid md:grid-cols-1 gap-x-3">
                        <Item
                            label="Select Category"
                            name="categoryId"
                            rules={[{ required: true }]}
                        >
                            <Select placeholder="Select Category">
                                {
                                    categories && categories?.categories.map((item) => (
                                        <Select.Option
                                            key={item._id}
                                            value={item._id}
                                            className="capitalize"
                                        >{item.categoryName}</Select.Option>
                                    ))
                                }
                            </Select>
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
                                        Update showcase
                                    </Button>
                                    :
                                    <Button
                                        type="text"
                                        htmlType="submit"
                                        loading={loading}
                                        className="!font-bold !bg-blue-500 !text-white !hover:bg-blue-600"
                                    >
                                        Register showcase
                                    </Button>
                            }
                        </Item>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default ShowcaseShared;
