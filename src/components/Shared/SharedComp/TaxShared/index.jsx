import { useEffect, useState } from "react";
import { Form, Input, Avatar, Button, Switch, Select, Card, Modal, Table, Popconfirm } from "antd";
import { DeleteOutlined, UserOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { http, formatDate, handleImage } from "../../../../../module/http";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
const cookies = new Cookies();
const { Item } = Form;

const TaxShared = () => {
    // get token from cookies
    const token = cookies.get("authToken");
    // Form related variable
    const [taxForm] = Form.useForm();
    // states collection
    const [taxes, setTaxes] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
    });
    const [loading, setLoading] = useState(false);
    const [delLoading, setDelLoading] = useState(false);
    const [taxModal, setTaxModal] = useState(false);
    const [no, setNo] = useState(0);
    const [edit, setEdit] = useState(null);
    const [loaderIndex, setLoaderIndex] = useState(0);

    // fetch all tax
    const fetchTaxes = async (page = 1, pageSize = 10) => {
        setLoading(true);
        try {
            const httpReq = http(token);
            const response = await httpReq.get(`/api/tax/pagination?page=${page}&limit=${pageSize}`);
            const { data, total } = response.data;
            setTaxes(data);
            setPagination({
                current: page,
                pageSize: pageSize,
                total: total,
            });
        } catch (error) {
            console.error('Error fetching taxes:', error);
        } finally {
            setLoading(false);
        }
    };

    // calling fetchtax function
    useEffect(() => {
        fetchTaxes(pagination.current, pagination.pageSize);
    }, [no]);

    // calling fetchtax on table
    const handleTableChange = (pagination) => {
        fetchTaxes(pagination.current, pagination.pageSize);
    };

    // Register new tax
    const onFinish = async (values) => {
        console.log(values)
        try {
            setLoading(true);
            const httpReq = http(token);
            await httpReq.post("/api/tax/create", values);
            toast.success("Tax created successfully");
            setTaxModal(false);
            taxForm.resetFields();
            setNo(no + 1);
        } catch (err) {
            console.log(err);
            if (err.status === 400) {
                toast.error("TAx tax already registered !");
            } else {
                toast.error(err?.response?.data?.message);
            }
        } finally {
            setLoading(false);
        }
    }

    // delete tax
    const deleteTax = async (id, index) => {
        try {
            setDelLoading(true);
            setLoaderIndex(index);
            const httpReq = http(token);
            await httpReq.delete(`/api/tax/delete/${id}`);
            // remove the deleted item from state
            const updatedList = [...taxes];
            updatedList.splice(index, 1);
            setTaxes(updatedList);
            toast.success("tax deleted successfully");
        } catch (error) {
            toast.error("Failed to delete tax");
        } finally {
            setDelLoading(false);
        }
    };

    // on edit taxes
    const onEditTax = (obj, index) => {
        setTaxModal(true);
        taxForm.setFieldsValue(obj);
        setEdit(obj);
        setLoaderIndex(index);
    }

    // on update taxes
    const onUpdateTax = async (values) => {
        try {
            setLoading(true);
            const httpReq = http(token);
            const { data } = await httpReq.put(`/api/tax/update/${edit?._id}`, values);
            // remove the deleted item from state
            const updatedList = [...taxes];
            updatedList.splice(loaderIndex, 1, data?.tax);
            setTaxes(updatedList);
            toast.success("Updated tax Info !");
            setTaxModal(false);
            setEdit(null);
            taxForm.resetFields();
        } catch (err) {
            toast.error("Unable to update tax Info !");
        } finally {
            setLoading(false);
        }
    }

    // tax model close reset form
    const onModalClose = () => {
        setTaxModal(false);
        setEdit(null);
        taxForm.resetFields();
    }

    // colums for tax list
    const columns = [

        {
            title: 'Type of Tax',
            dataIndex: 'taxName',
            key: 'taxName',
        },
        {
            title: 'Tax Amount / %',
            dataIndex: 'taxAmount',
            key: 'taxAmount',
        },
        {
            title: 'CreatedAt',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (d) => formatDate(d)
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
                        onClick={() => onEditTax(obj, index)}
                    />
                    <Popconfirm
                        title="Do you want to delete tax?"
                        icon={<DeleteOutlined />}
                        onCancel={() => toast.info("Your tax is safe !")}
                        onConfirm={() => deleteTax(obj?._id, index)}
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
                title="Tax List"
                className="shadow-md"
                style={{ overflowX: "auto", fontSize: "20px", fontWeight: "600" }}
                extra={
                    <Button
                        className="!bg-blue-500 !text-white !font-bold"
                        type="text" icon={<PlusOutlined />}
                        onClick={() => setTaxModal(true)}
                    >
                        Add new Tax
                    </Button>
                }
            >
                <Table
                    columns={columns}
                    dataSource={taxes}
                    rowKey="_id"
                    loading={loading}
                    // pagination={pagination}
                    onChange={handleTableChange}
                    scroll={{ x: "max-content" }}
                />
            </Card>
            <Modal
                open={taxModal}
                width={320}
                onCancel={onModalClose}
                title="Register a new tax"
                style={{ fontSize: "20px", fontWeight: "600" }}
                footer={null}
            >
                <Form
                    name="add-tax"
                    layout="vertical"
                    onFinish={edit ? onUpdateTax : onFinish}
                    form={taxForm}
                >
                    <Item
                        label="Tax Type"
                        name="taxName"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="e.g. Border Tax" />
                    </Item>
                    <Item
                        label="Tax Amount / %"
                        name="taxAmount"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="e.g. 10%" type="Number" />
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
                                    Update Tax
                                </Button>
                                :
                                <Button
                                    type="text"
                                    htmlType="submit"
                                    loading={loading}
                                    className="!w-full !font-bold !bg-blue-500 !text-white !hover:bg-blue-600"
                                >
                                    Register Tax
                                </Button>
                        }
                    </Item>
                </Form>
            </Modal>
        </div>
    );
};

export default TaxShared;
