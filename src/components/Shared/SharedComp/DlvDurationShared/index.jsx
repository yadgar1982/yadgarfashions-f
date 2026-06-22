import { useEffect, useState } from "react";
import { Form, Input, Button, Switch, Select, Card, Modal, Table, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { http, formatDate } from "../../../../../module/http";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
import CurrencyOptions from "../../../../json/currency.json";
const cookies = new Cookies();
const { Item } = Form;

const DlvDurationShared = () => {
    // get token from cookies
    const token = cookies.get("authToken");
    // Form related variable
    const [dlvDurationForm] = Form.useForm();
    // states collection
    const [dlvDurations, setDlvDurations] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
    });
    const [loading, setLoading] = useState(false);
    const [delLoading, setDelLoading] = useState(false);
    const [dlvDurationModal, setDlvDurationModal] = useState(false);
    const [no, setNo] = useState(0);
    const [edit, setEdit] = useState(null);
    const [loaderIndex, setLoaderIndex] = useState(0);

    // fetch all dlvDurations
    const fetchDlvDurations = async (page = 1, pageSize = 10) => {
        setLoading(true);
        try {
            const httpReq = http(token);
            const response = await httpReq.get(`/api/dlv-duration/pagination?page=${page}&limit=${pageSize}`);
            const { data, total } = response.data;
            setDlvDurations(data);
            setPagination({
                current: page,
                pageSize: pageSize,
                total: total,
            });
        } catch (error) {
            console.error('Error fetching dlvDurations:', error);
        } finally {
            setLoading(false);
        }
    };

    // calling fetchdlvDurations function
    useEffect(() => {
        fetchDlvDurations(pagination.current, pagination.pageSize);
    }, [no]);

    // calling fetchdlvDurations on table
    const handleTableChange = (pagination) => {
        fetchDlvDurations(pagination.current, pagination.pageSize);
    };

    // Register new dlvDuration
    const onFinish = async (values) => {
        try {
            setLoading(true);
            const httpReq = http(token);
            await httpReq.post("/api/dlv-duration/create", values);
            toast.success("Duration created successfully");
            setDlvDurationModal(false);
            dlvDurationForm.resetFields();
            setNo(no + 1);
        } catch (err) {
            console.log(err);
            if (err.status === 400) {
                toast.error("This Duration already registered !");
            } else {
                toast.error(err?.response?.data?.message);
            }
        } finally {
            setLoading(false);
        }
    }

    // delete dlvDuration
    const deleteDlvDuration = async (id, index) => {
        try {
            setDelLoading(true);
            setLoaderIndex(index);
            const httpReq = http(token);
            await httpReq.delete(`/api/dlv-duration/delete/${id}`);
            // remove the deleted item from state
            const updatedList = [...dlvDurations];
            updatedList.splice(index, 1);
            setDlvDurations(updatedList);
            toast.success("dlvDuration deleted successfully");
        } catch (error) {
            toast.error("Failed to delete dlvDuration");
        } finally {
            setDelLoading(false);
        }
    };

    // on edit dlvDurations 
    const onEditDlvDuration = (obj, index) => {
        setDlvDurationModal(true);
        dlvDurationForm.setFieldsValue(obj);
        setEdit(obj);
        setLoaderIndex(index);
    }

    // on update dlvDurations
    const onUpdateDlvDuration = async (values) => {
        try {
            setLoading(true);
            const httpReq = http(token);
            const { data } = await httpReq.put(`/api/dlv-duration/update/${edit?._id}`, values);
            // remove the deleted item from state
            const updatedList = [...dlvDurations];
            updatedList.splice(loaderIndex, 1, data?.dlvDuration);
            setDlvDurations(updatedList);
            toast.success("Updated dlvDuration Info !");
            setDlvDurationModal(false);
            setEdit(null);
            dlvDurationForm.resetFields();
        } catch (err) {
            toast.error("Unable to update dlvDuration Info !");
        } finally {
            setLoading(false);
        }
    }

    // dlvDuration model close reset form
    const ondlvDurationModalClose = () => {
        setDlvDurationModal(false);
        setEdit(null);
        dlvDurationForm.resetFields();
    }

    // colums for brandes list
    const columns = [
        {
            title: 'Country',
            dataIndex: 'country',
            key: 'country'
        },
        {
            title: 'Normal Duration Value',
            dataIndex: 'normalDurationValue',
            key: 'normalDurationValue'
        },
        {
            title: 'Normal Duration Cost',
            dataIndex: 'normalDurationCost',
            key: 'normalDurationCost'
        },
        // {
        //     title: 'Express Duration Value',
        //     dataIndex: 'expressDurationValue',
        //     key: 'expressDurationValue'
        // },
        // {
        //     title: 'Express Duration Cost',
        //     dataIndex: 'expressDurationCost',
        //     key: 'expressDurationCost'
        // },
        {
            title: 'Duration Unit',
            dataIndex: 'durationUnit',
            key: 'durationUnit'
        },
        {
            title: 'Sales Tax',
            dataIndex: 'saleTax',
            key: 'saleTax'
        },
        {
            title: 'Other Tax',
            dataIndex: 'otherTax',
            key: 'otherTax'
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
                        onClick={() => onEditDlvDuration(obj, index)}
                    />
                    <Popconfirm
                        title="Do you wanna delete school?"
                        icon={<DeleteOutlined />}
                        onCancel={() => toast.info("Your brand is safe !")}
                        onConfirm={() => deleteDlvDuration(obj?._id, index)}
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
                title="dlvDurations List"
                className="shadow-md"
                style={{ overflowX: "auto", fontSize: "20px", fontWeight: "600" }}
                extra={
                    <Button
                        className="!bg-blue-500 !text-white !font-bold"
                        type="text" icon={<PlusOutlined />}
                        onClick={() => setDlvDurationModal(true)}
                    >
                        Add new duration
                    </Button>
                }
            >
                <Table
                    columns={columns}
                    dataSource={dlvDurations}
                    rowKey="_id"
                    loading={loading}
                    pagination={pagination}
                    onChange={handleTableChange}
                    scroll={{ x: "max-content" }}
                    className="capitalize"
                />
            </Card>
            <Modal
                open={dlvDurationModal}
                width={460}
                onCancel={ondlvDurationModalClose}
                title="Register a new duration"
                style={{ fontSize: "20px", fontWeight: "600" }}
                footer={null}
            >
                <Form
                    name="add-dlvDuration"
                    layout="vertical"
                    onFinish={edit ? onUpdateDlvDuration : onFinish}
                    form={dlvDurationForm}
                >
                    <Item
                        label="Country"
                        name="country"
                        rules={[{ required: true }]}
                    >
                        <Select placeholder="SelectCountry">
                            {
                                CurrencyOptions.map((item) => (
                                    <Option key={item.currencyCode} value={item.countryName}>
                                        {item.countryName}
                                    </Option>
                                ))
                            }
                        </Select>
                    </Item>
                    <div className="grid md:grid-cols-2 gap-x-3">
                        <Item
                            label="Normal Duration Value"
                            name="normalDurationValue"
                            rules={[{ required: true }]}
                        >
                            <Input type="number" placeholder="e.g. 5 " />
                        </Item>

                        <Item
                            label="Normal Duration Cost"
                            name="normalDurationCost"
                            rules={[{ required: true }]}
                        >
                            <Input type="number" placeholder="e.g.  $10" />
                        </Item>
                    </div>
                    <div className="grid md:grid-cols-3 gap-x-3">
                        <Item
                            label="Duration Unit"
                            name="durationUnit"
                            rules={[{ required: true }]}
                        >
                            <Select
                                placeholder="Select Duration Unit"
                                options={[
                                    { label: "Days", value: "days" },
                                    { label: "Weeks", value: "weeks" },
                                    { label: "Months", value: "months" },
                                ]}
                            />
                        </Item>
                        <Item
                            label="Sale Tax"
                            name="saleTax"
                            rules={[{ required: true }]}
                        >
                            <Input type="number" placeholder="e.g.  10 %" />
                        </Item>
                        <Item
                            label="Other Tax"
                            name="otherTax"
                            rules={[{ required: true }]}
                        >
                            <Input type="number" placeholder="e.g.  10 %" />
                        </Item>
                    </div>

                    <Item>
                        {
                            edit ?
                                <Button
                                    type="text"
                                    htmlType="submit"
                                    loading={loading}
                                    className="!w-full !font-bold !bg-rose-500 !text-white !hover:bg-blue-600"
                                >
                                    Update
                                </Button>
                                :
                                <Button
                                    type="text"
                                    htmlType="submit"
                                    loading={loading}
                                    className="w-full !font-bold !bg-blue-500 !text-white !hover:bg-blue-600"
                                >
                                    Register
                                </Button>
                        }
                    </Item>
                </Form>
            </Modal>
        </div>
    );
};

export default DlvDurationShared;
