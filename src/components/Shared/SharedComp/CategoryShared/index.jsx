import { useEffect, useState } from "react";
import { Form, Input, Avatar, Button, Switch, Select, Card, Modal, Table, Popconfirm } from "antd";
import { DeleteOutlined, UserOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { http, formatDate,handleImage } from "../../../../../module/http";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
const cookies = new Cookies();
const { Item } = Form;

const CategoryShared = () => {
    // get token from cookies
    const token = cookies.get("authToken");
    // Form related variable
    const [categoryForm] = Form.useForm();
    // states collection
    const [categories, setCategory] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
    });
    const [loading, setLoading] = useState(false);
    const [delLoading, setDelLoading] = useState(false);
    const [categoryModal, setCategoryModal] = useState(false);
    const [no, setNo] = useState(0);
    const [edit, setEdit] = useState(null);
    const [loaderIndex, setLoaderIndex] = useState(0);

    // fetch all categorys
    const fetchCategories = async (page = 1, pageSize = 10) => {
        setLoading(true);
        try {
            const httpReq = http(token);
            const response = await httpReq.get(`/api/category/pagination?page=${page}&limit=${pageSize}`);
            const { data, total } = response.data;
            setCategory(data);
            setPagination({
                current: page,
                pageSize: pageSize,
                total: total,
            });
        } catch (error) {
            console.error('Error fetching categorys:', error);
        } finally {
            setLoading(false);
        }
    };

    // calling fetchcategory function
    useEffect(() => {
        fetchCategories(pagination.current, pagination.pageSize);
    }, [no]);

    // calling fetchcategory on table
    const handleTableChange = (pagination) => {
        fetchCategories(pagination.current, pagination.pageSize);
    };

    // Register new category
    const onFinish = async (values) => {
        try {
            setLoading(true);
            const httpReq = http(token);
            await httpReq.post("/api/category/create", values);
            toast.success("category created successfully");
            setCategoryModal(false);
            categoryForm.resetFields();
            setNo(no + 1);
        } catch (err) {
            console.log(err);
            if (err.status === 400) {
                toast.error("This category already registered !");
            } else {
                toast.error(err?.response?.data?.message);
            }
        } finally {
            setLoading(false);
        }
    }

    // delete category
    const deleteCategory = async (id, index) => {
        try {
            setDelLoading(true);
            setLoaderIndex(index);
            const httpReq = http(token);
            await httpReq.delete(`/api/category/delete/${id}`);
            // remove the deleted item from state
            const updatedList = [...categories];
            updatedList.splice(index, 1);
            setCategory(updatedList);
            toast.success("category deleted successfully");
        } catch (error) {
            toast.error("Failed to delete category");
        } finally {
            setDelLoading(false);
        }
    };

    // on edit categories 
    const onEditCategory = (obj, index) => {
        setCategoryModal(true);
        categoryForm.setFieldsValue(obj);
        setEdit(obj);
        setLoaderIndex(index);
    }

    // on update categories
    const onUpdateCategory = async (values) => {
        try {
            setLoading(true);
            const httpReq = http(token);
            const { data } = await httpReq.put(`/api/category/update/${edit?._id}`, values);
            // remove the deleted item from state
            const updatedList = [...categories];
            updatedList.splice(loaderIndex, 1, data?.category);
            setCategory(updatedList);
            toast.success("Updated category Info !");
            setCategoryModal(false);
            setEdit(null);
            categoryForm.resetFields();
        } catch (err) {
            toast.error("Unable to update category Info !");
        } finally {
            setLoading(false);
        }
    }

    // category model close reset form
    const onCategoryModalClose = () => {
        setCategoryModal(false);
        setEdit(null);
        categoryForm.resetFields();
    }

    // colums for categories list
    const columns = [
        {
            title: 'Image',
            dataIndex: 'image',
            render : (_,obj) => (
                obj.image ? 
                <Avatar 
                onClick={()=>handleImage('category','api/category/update',obj._id,null,null,token)}
                className="w-[40px] h-[40px]" src={obj.image} />
                :
                <Avatar 
                onClick={()=>handleImage('category','api/category/update',obj._id,null,null,token)}
                className="w-[40px] h-[40px]" icon={<UserOutlined />} />
            )
        },
        {
            title: 'Category Name',
            dataIndex: 'categoryName',
            key: 'categoryName',
        },
        {
            title: 'CreatedAt',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render : (d) => formatDate(d)
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
                        loading={index === loaderIndex && loading}
                        type="text"
                        shape="circle"
                        className="!bg-indigo-500 !text-white"
                        icon={<EditOutlined />}
                        onClick={() => onEditCategory(obj, index)}
                    />
                    <Popconfirm
                        title="Do you wanna delete category?"
                        icon={<DeleteOutlined />}
                        onCancel={() => toast.info("Your category is safe !")}
                        onConfirm={() => deleteCategory(obj?._id, index)}
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
                title="Categories List"
                className="shadow-md"
                style={{ overflowX: "auto", fontSize: "20px", fontWeight: "600" }}
                extra={
                    <Button
                        className="!bg-blue-500 !text-white !font-bold"
                        type="text" icon={<PlusOutlined />}
                        onClick={() => setCategoryModal(true)}
                    >
                        Add new category
                    </Button>
                }
            >
                <Table
                    columns={columns}
                    dataSource={categories}
                    rowKey="_id"
                    loading={loading}
                    pagination={pagination}
                    onChange={handleTableChange}
                    scroll={{ x: "max-content" }}
                />
            </Card>
            <Modal
                open={categoryModal}
                width={320}
                onCancel={onCategoryModalClose}
                title="Register a new category"
                style={{ fontSize: "20px", fontWeight: "600" }}
                footer={null}
            >
                <Form
                    name="add-category"
                    layout="vertical"
                    onFinish={edit ? onUpdateCategory : onFinish}
                    form={categoryForm}
                >
                    <Item
                        label="Category Name"
                        name="categoryName"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="e.g. Mens" />
                    </Item>
                    <Item>
                        {
                            edit ?
                                <Button
                                    type="text"
                                    htmlType="submit"
                                    loading={loading}
                                    className="!w-full !font-bold !bg-rose-500 !text-white !hover:bg-blue-600"
                                >
                                    Update category
                                </Button>
                                :
                                <Button
                                    type="text"
                                    htmlType="submit"
                                    loading={loading}
                                    className="!w-full !font-bold !bg-blue-500 !text-white !hover:bg-blue-600"
                                >
                                    Register category
                                </Button>
                        }
                    </Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CategoryShared;
