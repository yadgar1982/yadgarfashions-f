import { useEffect, useState } from "react";
import { Form, Input, Avatar, Button, Switch, Card, Modal, Table, Popconfirm, Select } from "antd";
import { UserOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { http, fetchData, formatDate, handleImage } from "../../../../../module/http";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
import useSwr from "swr";
const cookies = new Cookies();

const { Item } = Form;

const BrandShared = () => {

    // get token from cookies
    const token = cookies.get("authToken");

    // Form related variable
    const [brandForm] = Form.useForm();
    // states collection
    const [brands, setBrands] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
    });
    const [loading, setLoading] = useState(false);
    const [delLoading, setDelLoading] = useState(false);
    const [brandModal, setBrandModal] = useState(false);
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

    // fetch all categories related brand 
    const fetchBrand = async (categoryId, page = 1, pageSize = 10) => {
        setLoading(true);
        try {
            const httpReq = http(token);
            const response = await httpReq.get(`/api/brand/pagination/${categoryId}?page=${page}&limit=${pageSize}`);
            const { data, total } = response.data;
            setBrands(data);
            setPagination({
                current: page,
                pageSize: pageSize,
                total: total,
            });
        } catch (error) {
            console.error('Error fetching brand:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTableChange = (pagination) => {
        fetchBrand(categoryId, pagination.current, pagination.pageSize);
    };

    // Registerd new brand
    const onFinish = async (values) => {
        try {
            setLoading(true);
            const httpReq = http(token);
            await httpReq.post("/api/brand/create", values);
            setCategoryId(values.categoryId);
            fetchBrand(values.categoryId, pagination.current, pagination.pageSize);
            toast.success("Brand created successfully");
            setBrandModal(false);
            brandForm.setFieldValue('brandName', "");
        } catch (err) {
            if (err.status === 400) {
                console.log(err);
                toast.error("This brand already registered !");
            } else {
                toast.error("Failed to create brand !");
            }
        } finally {
            setLoading(false);
        }
    };

    // Delete brand
    const deleteBrand = async (id, index) => {
        try {
            setDelLoading(true);
            setLoaderIndex(index);
            const httpReq = http(token);
            await httpReq.delete(`/api/brand/delete/${id}`);
            // remove the deleted item from state
            const updatedList = [...brands];
            updatedList.splice(index, 1);
            setBrands(updatedList);
            toast.success("brand deleted successfully");
        } catch (error) {
            toast.error("Failed to delete brand");
        } finally {
            setDelLoading(false);
        }
    };

    // brand model close reset form
    const onBrandModalClose = () => {
        setBrandModal(false);
        brandForm.resetFields();
        setEdit(null);
    }

    // on edit brand 
    const onEditBrand = (obj, index) => {
        setBrandModal(true);
        brandForm.setFieldsValue(obj);
        setEdit(obj);
        setLoaderIndex(index);
    }

    // on update brand
    const onUpdateBrand = async (values) => {
        try {
            setLoading(true);
            const httpReq = http(token);
            const { data } = await httpReq.put(`/api/brand/update/${edit?._id}`, values);
            // remove the deleted item from state
            const updatedList = [...brands];
            updatedList.splice(loaderIndex, 1, data?.brand);
            setBrands(updatedList);
            toast.success("Updated brand Info !");
            setBrandModal(false);
            setEdit(null);
            brandForm.resetFields();
        } catch (err) {
            toast.error("Unable to update brand Info !");
        } finally {
            setLoading(false);
        }
    }

    // fetch brand on class change
    const handleCategoryChange = (categoryId) => {
        setCategoryId(categoryId);
        fetchBrand(categoryId, pagination.current, pagination.pageSize);
    }

    // colums for brandes list
    const columns = [
        {
            title: 'Image',
            dataIndex: 'image',
            render: (_, obj) => (
                obj.image ?
                    <Avatar
                        onClick={() => handleImage('brand', 'api/brand/update', obj._id, null, null, token)}
                        className="w-[40px] h-[40px]" src={obj.image} />
                    :
                    <Avatar
                        onClick={() => handleImage('brand', 'api/brand/update', obj._id, null, null, token)}
                        className="w-[40px] h-[40px]" icon={<UserOutlined />} />
            )
        },
        {
            title: 'Brand Name',
            dataIndex: 'brandName',
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
                        onClick={() => onEditBrand(obj, index)}
                    />
                    <Popconfirm
                        title="Do you want to delete Brand?"
                        icon={<DeleteOutlined />}
                        onCancel={() => toast.info("Your brand is safe !")}
                        onConfirm={() => deleteBrand(obj?._id, index)}
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
                title="Brands List"
                className="shadow-md"
                style={{ overflowX: "auto", fontSize: "20px", fontWeight: "600" }}
                extra={
                    <div className="flex md:flex-row flex-col gap-3">
                        <Select
                            onChange={handleCategoryChange}
                            className="min-w-[200px]" placeholder="Select Category">
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
                            onClick={() => setBrandModal(true)}
                        >
                            Add new brand
                        </Button>
                    </div>
                }
            >
                <Table
                    columns={columns}
                    dataSource={brands}
                    rowKey="_id"
                    loading={loading}
                    pagination={pagination}
                    onChange={handleTableChange}
                    scroll={{ x: "max-content" }}
                    className="capitalize"
                />
            </Card>
            <Modal
                open={brandModal}
                onCancel={onBrandModalClose}
                title="Register a New brand"
                style={{ fontSize: "20px", fontWeight: "600" }}
                footer={null}
                width={320}
            >
                <Form
                    form={brandForm}
                    name="add-brand"
                    layout="vertical"
                    onFinish={edit ? onUpdateBrand : onFinish}
                >
                    <div className="mt-5 grid md:grid-cols-1 gap-x-3">
                        <Item
                            label="Select Category"
                            name="categoryId"
                            rules={[{ required: true }]}
                        >
                            <Select
                                placeholder="Select Category"
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
                        </Item>
                        <Item
                            label="brand Name"
                            name="brandName"
                            rules={[{ required: true }]}
                        >
                            <Input placeholder="e.g. 1" />
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
                                        Update brand
                                    </Button>
                                    :
                                    <Button
                                        type="text"
                                        htmlType="submit"
                                        loading={loading}
                                        className="!font-bold !bg-blue-500 !text-white !hover:bg-blue-600"
                                    >
                                        Register brand
                                    </Button>
                            }
                        </Item>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};
export default BrandShared;
