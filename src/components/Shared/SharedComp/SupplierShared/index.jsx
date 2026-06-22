import { useEffect, useState } from "react";
import { Form, Input, Button, Switch, Select, Card, Modal, Table, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { http, formatDate, fetchData } from "../../../../../module/http";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
const cookies = new Cookies();
const { Item } = Form;
import useSWR, { mutate } from 'swr';

const SupplierShared = () => {
    // get token from cookies
    const token = cookies.get("authToken");
    // Form related variable
    const [supplierForm] = Form.useForm();
    // states collection
    const [suppliers, setSuppliers] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
    });
    const [loading, setLoading] = useState(false);
    const [delLoading, setDelLoading] = useState(false);
    const [supplierModal, setSupplierModal] = useState(false);
    const [no, setNo] = useState(0);
    const [edit, setEdit] = useState(null);
    const [loaderIndex, setLoaderIndex] = useState(0);

    // fetch all suppliers
    const fetchsuppliers = async (page = 1, pageSize = 10) => {
        setLoading(true);
        try {
            const httpReq = http(token);
            const response = await httpReq.get(`/api/supplier/pagination?page=${page}&limit=${pageSize}`);
            const { data, total } = response.data;
            setSuppliers(data);
            setPagination({
                current: page,
                pageSize: pageSize,
                total: total,
            });
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        } finally {
            setLoading(false);
        }
    };

    // calling fetchsuppliers function
    useEffect(() => {
        fetchsuppliers(pagination.current, pagination.pageSize);
    }, [no]);

    // calling fetchsuppliers on table
    const handleTableChange = (pagination) => {
        fetchsuppliers(pagination.current, pagination.pageSize);
    };

    // fetch countries data from api
    const { data: country, error: currError } = useSWR(
        `/api/currency/all`,
        fetchData,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            refreshInterval: 1200000,
        }
    );


    const handleChange = (value) => {
        const currency = currencies.find(item => item?.currencyCode?.toLowerCase() === value);
        fetchExchangeRate(currency?.currencyCode, currency?.currency);
        setSelectedCurrency(value);
    };

    // Register new supplier
    const onFinish = async (values) => {
        try {
            setLoading(true);
            values.supplierPassword = "Supplier123@"
            const httpReq = http(token);
            await httpReq.post("/api/supplier/create", values);
            toast.success("Supplier created successfully");
            setSupplierModal(false);
            supplierForm.resetFields();
            setNo(no + 1);
        } catch (err) {
            console.log(err);
            if (err.status === 400) {
                toast.error("This supplier already registered !");
            } else {
                toast.error(err?.response?.data?.message);
            }
        } finally {
            setLoading(false);
        }
    }


    // update is active 
    const updateSupplierStatus = async (id, status, index) => {
        try {
            let obj = { status: !status };
            const httpReq = http(token);
            const { data } = await httpReq.put(`/api/supplier/status/${id}`, obj);
            const updatedList = [...suppliers];
            updatedList.splice(index, 1, data?.supplier);
            setSuppliers(updatedList);
            toast.success("Updated supplier status !");
        } catch (err) {
            toast.error("Unable to update supplier status !");
        }
    }

    // delete supplier
    const deleteSupplier = async (id, index) => {
        try {
            setDelLoading(true);
            setLoaderIndex(index);
            const httpReq = http(token);
            await httpReq.delete(`/api/supplier/delete/${id}`);
            // remove the deleted item from state
            const updatedList = [...suppliers];
            updatedList.splice(index, 1);
            setSuppliers(updatedList);
            toast.success("supplier deleted successfully");
        } catch (error) {
            toast.error("Failed to delete supplier");
        } finally {
            setDelLoading(false);
        }
    };

    // on edit suppliers 
    const onEditsupplier = (obj, index) => {
        setSupplierModal(true);
        supplierForm.setFieldsValue(obj);
        setEdit(obj);
        setLoaderIndex(index);
    }

    // on update suppliers
    const onUpdateSupplier = async (values) => {
        try {
            setLoading(true);
            const httpReq = http(token);
            const { data } = await httpReq.put(`/api/supplier/update/${edit?._id}`, values);
            // remove the deleted item from state
            const updatedList = [...suppliers];
            updatedList.splice(loaderIndex, 1, data?.supplier);
            setSuppliers(updatedList);
            toast.success("Updated supplier Info !");
            setSupplierModal(false);
            setEdit(null);
            supplierForm.resetFields();
        } catch (err) {
            toast.error("Unable to update supplier Info !");
        } finally {
            setLoading(false);
        }
    }

    // supplier model close reset form
    const onsupplierModalClose = () => {
        setSupplierModal(false);
        setEdit(null);
        supplierForm.resetFields();
    }

    // colums for suppliers list
    const columns = [
        {
            title: 'Sr no',
            key: 'srNo',
            render: (x, y, index) => (index + 1)
        },
        {
            title: 'Supplier Name',
            dataIndex: 'supplierName',
            key: 'supplierName',
        },
        {
            title: 'Supplier Email',
            dataIndex: 'supplierEmail',
            key: 'supplierEmail',
        },
        {
            title: 'Supplier Mobile',
            dataIndex: 'supplierMobile',
            key: 'supplierMobile',
        },
        {
            title: 'Supplier Country',
            dataIndex: 'supplierCountry',
            key: 'supplierCountry',
        },
        {
            title: 'Supplier Address',
            dataIndex: 'supplierAddress',
            key: 'supplierAddress',
        },
        {
            title: 'CreatedAt',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (d) => formatDate(d)
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
                    onChange={() => updateSupplierStatus(obj?._id, obj?.status, index)}
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
                        onClick={() => onEditsupplier(obj, index)}
                    />
                    <Popconfirm
                        title="Do you wanna delete supplier?"
                        icon={<DeleteOutlined />}
                        onCancel={() => toast.info("Your suppliers is safe !")}
                        onConfirm={() => deleteSupplier(obj?._id, index)}
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
                title="Suppliers List"
                className="shadow-md"
                style={{ overflowX: "auto", fontSize: "20px", fontWeight: "600" }}
                extra={
                    <Button
                        className="!bg-blue-500 !text-white !font-bold"
                        type="text" icon={<PlusOutlined />}
                        onClick={() => setSupplierModal(true)}
                    >
                        Add new supplier
                    </Button>
                }
            >
                <Table
                    columns={columns}
                    dataSource={suppliers}
                    rowKey="_id"
                    loading={loading}
                    pagination={pagination}
                    onChange={handleTableChange}
                    scroll={{ x: "max-content" }}
                    className="capitalize"
                />
            </Card>
            <Modal
                open={supplierModal}
                width={720}
                onCancel={onsupplierModalClose}
                title="Register a new supplier"
                style={{ fontSize: "20px", fontWeight: "600" }}
                footer={null}
            >
                <Form
                    name="add-supplier"
                    layout="vertical"
                    onFinish={edit ? onUpdateSupplier : onFinish}
                    form={supplierForm}
                >
                    <div className="mt-5 grid md:grid-cols-2 gap-x-3">
                        <Item
                            label="Supplier Name"
                            name="supplierName"
                            rules={[{ required: true }]}
                        >
                            <Input placeholder="e.g. Noor Zada" />
                        </Item>
                        <Item
                            label="Supplier Email"
                            name="supplierEmail"
                            rules={[{ required: true }]}
                        >
                            <Input placeholder="e.g. Noor@gmail.com" />
                        </Item>
                        <Item
                            label="Supplier Mobile"
                            name="supplierMobile"
                            rules={[{ required: true }]}
                        >
                            <Input type="number" placeholder="e.g. 6393640841" />
                        </Item>
                        <Item
                            label="Country"
                            name="supplierCountry"
                            rules={[{ required: true }]}
                        >

                            <Select
                                className="min-w-[100px] uppercase" placeholder="Select Country"
                            >
                                {
                                    country && country.map((item) => (
                                        <Option key={item.countryName} value={item.countryName}>
                                            {item.countryName}
                                        </Option>
                                    ))
                                }
                            </Select>
                        </Item>
                    </div>
                    <Item
                        label="Supplier Address"
                        name="supplierAddress"
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
                                        Update supplier
                                    </Button>
                                    :
                                    <Button
                                        type="text"
                                        htmlType="submit"
                                        loading={loading}
                                        className="!font-bold !bg-blue-500 !text-white !hover:bg-blue-600"
                                    >
                                        Register supplier
                                    </Button>
                            }
                        </Item>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default SupplierShared;
