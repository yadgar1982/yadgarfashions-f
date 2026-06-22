import { useEffect, useState } from "react";
import { Form, Input, Button, Switch, Select, Card, Modal, Table, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { http, formatDate } from "../../../../../module/http";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
const cookies = new Cookies();
const { Item } = Form;

const DealerShared = () => {
    // get token from cookies
    const token = cookies.get("authToken");
    // Form related variable
    const [dealerForm] = Form.useForm();
    // states collection
    const [dealers, setDealers] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
    });
    const [loading, setLoading] = useState(false);
    const [delLoading, setDelLoading] = useState(false);
    const [dealerModal, setDealerModal] = useState(false);
    const [no, setNo] = useState(0);
    const [edit, setEdit] = useState(null);
    const [loaderIndex, setLoaderIndex] = useState(0);

    // fetch all dealers
    const fetchDealers = async (page = 1, pageSize = 10) => {
        setLoading(true);
        try {
            const httpReq = http(token);
            const response = await httpReq.get(`/api/dealer/pagination?page=${page}&limit=${pageSize}`);
            const { data, total } = response.data;
            setDealers(data);
            setPagination({
                current: page,
                pageSize: pageSize,
                total: total,
            });
        } catch (error) {
            console.error('Error fetching dealers:', error);
        } finally {
            setLoading(false);
        }
    };

    // calling fetchdealers function
    useEffect(() => {
        fetchDealers(pagination.current, pagination.pageSize);
    }, [no]);

    // calling fetchdealers on table
    const handleTableChange = (pagination) => {
        fetchDealers(pagination.current, pagination.pageSize);
    };

    // Register new dealer
    const onFinish = async (values) => {
        try {
            setLoading(true);
            values.dealerPassword = "ealer123@"
            const httpReq = http(token);
            await httpReq.post("/api/dealer/create", values);
            toast.success("dealer created successfully");
            setDealerModal(false);
            dealerForm.resetFields();
            setNo(no + 1);
        } catch (err) {
            console.log(err);
            if (err.status === 400) {
                toast.error("This dealer already registered !");
            } else {
                toast.error(err?.response?.data?.message);
            }
        } finally {
            setLoading(false);
        }
    }

    // update is active 
    const updateDealerStatus = async (id, status, index) => {
        try {
            let obj = { status: !status };
            const httpReq = http(token);
            const { data } = await httpReq.put(`/api/dealer/status/${id}`, obj);
            const updatedList = [...dealers];
            updatedList.splice(index, 1, data?.dealer);
            setDealers(updatedList);
            toast.success("Updated dealer status !");
        } catch (err) {
            toast.error("Unable to update dealer status !");
        }
    }

    // delete dealer
    const deleteDealer = async (id, index) => {
        try {
            setDelLoading(true);
            setLoaderIndex(index);
            const httpReq = http(token);
            await httpReq.delete(`/api/dealer/delete/${id}`);
            // remove the deleted item from state
            const updatedList = [...dealers];
            updatedList.splice(index, 1);
            setDealers(updatedList);
            toast.success("dealer deleted successfully");
        } catch (error) {
            toast.error("Failed to delete dealer");
        } finally {
            setDelLoading(false);
        }
    };

    // on edit dealers 
    const onEditDealer = (obj, index) => {
        setDealerModal(true);
        dealerForm.setFieldsValue(obj);
        setEdit(obj);
        setLoaderIndex(index);
    }

    // on update dealers
    const onUpdateDealer = async (values) => {
        try {
            setLoading(true);
            const httpReq = http(token);
            const { data } = await httpReq.put(`/api/dealer/update/${edit?._id}`, values);
            // remove the deleted item from state
            const updatedList = [...dealers];
            updatedList.splice(loaderIndex, 1, data?.dealer);
            setDealers(updatedList);
            toast.success("Updated dealer Info !");
            setDealerModal(false);
            setEdit(null);
            dealerForm.resetFields();
        } catch (err) {
            toast.error("Unable to update dealer Info !");
        } finally {
            setLoading(false);
        }
    }

    // dealer model close reset form
    const onDealerModalClose = () => {
        setDealerModal(false);
        setEdit(null);
        dealerForm.resetFields();
    }

    // colums for dealers list
    const columns = [
        {
            title: 'Sr no',
            key: 'srNo',
            render: (x, y, index) => (index + 1)
        },
        {
            title: 'Dealer Name',
            dataIndex: 'dealerName',
            key: 'dealerName',
        },
        {
            title: 'Dealer Email',
            dataIndex: 'dealerEmail',
            key: 'dealerEmail',
        },
        {
            title: 'Dealer Mobile',
            dataIndex: 'dealerMobile',
            key: 'dealerMobile',
        },
        {
            title: 'Dealer Amount',
            dataIndex: 'dealerAmount',
            key: 'dealerAmount',
        },
        {
            title: 'Dealer Balance',
            dataIndex: 'dealerBalance',
            key: 'dealerBalance',
        },
        {
            title: 'Dealer Country',
            dataIndex: 'dealerCountry',
            key: 'dealerCountry',
        },
        {
            title: 'Dealer Address',
            dataIndex: 'dealerAddress',
            key: 'dealerAddress',
        },
        {
            title: 'CreatedAt',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render : (d) => formatDate(d)
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            fixed: "right",
            render: (x, obj, index) => (
                <Switch
                    checkedChildren="ACTIVATE"
                    unCheckedChildren="DEACTIVATE"
                    defaultChecked={obj.status}
                    onChange={() => updateDealerStatus(obj?._id, obj?.status, index)}
                />
            )
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
                        onClick={() => onEditDealer(obj, index)}
                    />
                    <Popconfirm
                        title="Do you wanna delete dealer?"
                        icon={<DeleteOutlined />}
                        onCancel={() => toast.info("Your dealers is safe !")}
                        onConfirm={() => deleteDealer(obj?._id, index)}
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
                title="Dealers List"
                className="shadow-md"
                style={{ overflowX: "auto", fontSize: "20px", fontWeight: "600" }}
                extra={
                    <Button
                        className="!bg-blue-500 !text-white !font-bold"
                        type="text" icon={<PlusOutlined />}
                        onClick={() => setDealerModal(true)}
                    >
                        Add new dealer
                    </Button>
                }
            >
                <Table
                    columns={columns}
                    dataSource={dealers}
                    rowKey="_id"
                    loading={loading}
                    pagination={pagination}
                    onChange={handleTableChange}
                    scroll={{ x: "max-content" }}
                />
            </Card>
            <Modal
                open={dealerModal}
                width={720}
                onCancel={onDealerModalClose}
                title="Register a new dealer"
                style={{ fontSize: "20px", fontWeight: "600" }}
                footer={null}
            >
                <Form
                    name="add-dealer"
                    layout="vertical"
                    onFinish={edit ? onUpdateDealer : onFinish}
                    form={dealerForm}
                >
                    <div className="mt-5 grid md:grid-cols-2 gap-x-3">
                        <Item
                            label="Dealer Name"
                            name="dealerName"
                            rules={[{ required: true }]}
                        >
                            <Input placeholder="e.g. Noor Zada" />
                        </Item>
                        <Item
                            label="Dealer Email"
                            name="dealerEmail"
                            rules={[{ required: true }]}
                        >
                            <Input placeholder="e.g. Noor@gmail.com" />
                        </Item>
                    </div>
                    <div className="mt-5 grid md:grid-cols-3 gap-x-3">
                        <Item
                            label="Dealer Mobile"
                            name="dealerMobile"
                            rules={[{ required: true }]}
                        >
                            <Input type="number" placeholder="e.g. 6393640841" />
                        </Item>
                        <Item
                            label="Dealer Country"
                            name="dealerCountry"
                            rules={[{ required: true }]}
                        >
                            <Input placeholder="e.g. india" />
                        </Item>
                        <Item
                            label="Amount/Unit"
                            name="dealerAmount"
                            rules={[{ required: true }]}
                        >
                            <Input type="number" placeholder="e.g. 2" />
                        </Item>
                    </div>
                    <Item
                        label="Dealer Address"
                        name="dealerAddress"
                        rules={[{ required: true }]}
                    >
                        <Input.TextArea placeholder="e.g. Delhi, India" rows={3} />
                    </Item>

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
                                        Update dealer
                                    </Button>
                                    :
                                    <Button
                                        type="text"
                                        htmlType="submit"
                                        loading={loading}
                                        className="!font-bold !bg-blue-500 !text-white !hover:bg-blue-600"
                                    >
                                        Register dealer
                                    </Button>
                            }
                        </Item>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default DealerShared;
