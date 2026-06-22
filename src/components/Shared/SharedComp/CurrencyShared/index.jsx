import { useEffect, useState } from "react";
import { Form, Input, Avatar, Button, Switch, Select, Card, Modal, Table, Popconfirm } from "antd";
import { DeleteOutlined, UserOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { http, formatDate, handleImage } from "../../../../../module/http";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
import CurrencyOptions from "../../../../json/currency.json";

const cookies = new Cookies();
const { Item } = Form;

const CurrencyShared = () => {
    // get token from cookies
    const token = cookies.get("authToken");
    // Form related variable
    const [currencyForm] = Form.useForm();
    // states collection
    const [currencies, setCurrency] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
    });
    const [loading, setLoading] = useState(false);
    const [delLoading, setDelLoading] = useState(false);
    const [currencyModal, setCurrencyModal] = useState(false);
    const [no, setNo] = useState(0);
    const [edit, setEdit] = useState(null);
    const [loaderIndex, setLoaderIndex] = useState(0);
    const [selectedFlag, setSelectedFlag] = useState(null);
    const [selectedCurrency, setSelectedCurrency] = useState(null);

    // fetch all Currencys
    const fetchCurrencies = async (page = 1, pageSize = 10) => {
        setLoading(true);
        try {
            const httpReq = http(token);
            const response = await httpReq.get(`/api/currency/pagination?page=${page}&limit=${pageSize}`);
            const { data, total } = response.data;
            setCurrency(data);
            setPagination({
                current: page,
                pageSize: pageSize,
                total: total,
            });
        } catch (error) {
            console.error('Error fetching Currencys:', error);
        } finally {
            setLoading(false);
        }
    };

    // calling fetchCurrency function
    useEffect(() => {
        fetchCurrencies(pagination.current, pagination.pageSize);
    }, [no]);

    // calling fetchCurrency on table
    const handleTableChange = (pagination) => {
        fetchCurrencies(pagination.current, pagination.pageSize);
    };

    // Register new Currency
    const onFinish = async (values) => {
        try {
            setLoading(true);
            const httpReq = http(token);
            await httpReq.post("/api/currency/create", values);
            toast.success("Currency created successfully");
            setCurrencyModal(false);
            currencyForm.resetFields();
            setNo(no + 1);
        } catch (err) {
            console.log(err);
            if (err.status === 400) {
                toast.error("This Currency already registered !");
            } else {
                toast.error(err?.response?.data?.message);
            }
        } finally {
            setLoading(false);
        }
    }

    // delete Currency
    const deleteCurrency = async (id, index) => {
        try {
            setDelLoading(true);
            setLoaderIndex(index);
            const httpReq = http(token);
            await httpReq.delete(`/api/currency/delete/${id}`);
            // remove the deleted item from state
            const updatedList = [...currencies];
            updatedList.splice(index, 1);
            setCurrency(updatedList);
            toast.success("Currency deleted successfully");
        } catch (error) {
            toast.error("Failed to delete Currency");
        } finally {
            setDelLoading(false);
        }
    };

    // on edit currencies 
    const onEditCurrency = (obj, index) => {
        setCurrencyModal(true);
        currencyForm.setFieldsValue(obj);
        setEdit(obj);
        setLoaderIndex(index);
    }

    // on update currencies
    const onUpdateCurrency = async (values) => {
        try {
            setLoading(true);
            const httpReq = http(token);
            const { data } = await httpReq.put(`/api/currency/update/${edit?._id}`, values);
            // remove the deleted item from state
            const updatedList = [...currencies];
            updatedList.splice(loaderIndex, 1, data?.currency);
            setCurrency(updatedList);
            toast.success("Updated Currency Info !");
            setCurrencyModal(false);
            setEdit(null);
            currencyForm.resetFields();
        } catch (err) {
            console.log(err);
            toast.error("Unable to update Currency Info !");
        } finally {
            setLoading(false);
        }
    }

    // Currency model close reset form
    const onCurrencyModalClose = () => {
        setCurrencyModal(false);
        setEdit(null);
        currencyForm.resetFields();
    }

    // colums for currencies list
    const columns = [
        {
            title: "Country Name",
            dataIndex: "countryName",
            key: "countryName"
        },
        {
            title: "Currency Code",
            dataIndex: "currencyCode",
            key: "currencyCode"
        },
        {
            title: "Currency",
            dataIndex: "currency",
            key: "currency"
        },
        {
            title: 'Country',
            dataIndex: 'flag',
            key: 'falg',
            render: (_, obj) =>
                obj.flag ? (
                    <Avatar
                        className="w-[30px] h-[30px]"
                        src={obj.flag}
                    />
                ) : (
                    <Avatar
                        className="w-[30px] h-[30px]"
                        icon={<UserOutlined />}
                    />
                )
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
                        onClick={() => onEditCurrency(obj, index)}
                    />
                    <Popconfirm
                        title="Do you wanna delete Currency?"
                        icon={<DeleteOutlined />}
                        onCancel={() => toast.info("Your Currency is safe !")}
                        onConfirm={() => deleteCurrency(obj?._id, index)}
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
                title="currencies List"
                className="shadow-md"
                style={{ overflowX: "auto", fontSize: "20px", fontWeight: "600" }}
                extra={
                    <Button
                        className="!bg-blue-500 !text-white !font-bold"
                        type="text" icon={<PlusOutlined />}
                        onClick={() => setCurrencyModal(true)}
                    >
                        Add new currency
                    </Button>
                }
            >
                <Table
                    columns={columns}
                    dataSource={currencies}
                    rowKey="_id"
                    loading={loading}
                    pagination={pagination}
                    onChange={handleTableChange}
                    scroll={{ x: "max-content" }}
                />
            </Card>
            <Modal
                open={currencyModal}
                width={320}
                onCancel={onCurrencyModalClose}
                title="Register a new Currency"
                style={{ fontSize: "20px", fontWeight: "600" }}
                footer={null}
            >
               
                <Form
                    form={currencyForm}
                    onFinish={edit ? onUpdateCurrency : onFinish}
                    layout="vertical"
                >
                    {selectedFlag && selectedCurrency && (
                        <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                            <img
                                src={selectedFlag}
                                alt="Selected flag"
                                style={{ width: 40, height: 30, borderRadius: 4 }}
                            />
                            <div className="bg-zinc-100 w-full text-zinc-700 px-2">{selectedCurrency}</div>
                        </div>
                    )}

                    <Item
                        label="Currency"
                        name="currency"
                        rules={[{ required: true, message: "Please select a Currency" }]}
                    >
                        <Select
                            showSearch
                            placeholder="Select a Currency"
                            optionLabelProp="label"
                            onSelect={(value, option) => {
                                currencyForm.setFieldsValue({
                                    flag: option.flag,
                                    countryName: option.countryName,
                                    currencyCode: option.currencyCode,
                                    currency: value, // the symbol, e.g. "$"
                                });
                                setSelectedFlag(option.flag);
                                setSelectedCurrency(value); // symbol like "$"
                            }}
                        >
                            {CurrencyOptions.map((item) => (
                                <Select.Option
                                    key={item.currencyCode}
                                    value={item.value}          // currency symbol
                                    label={item.currency}       // code like "USD"
                                    flag={item.flag}
                                    countryName={item.countryName}
                                    currencyCode={item.currencyCode}
                                >
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <img src={item.flag} alt={item.currency} style={{ width: 20, marginRight: 8 }} />
                                        {item.currency} ({item.value})
                                    </div>
                                </Select.Option>
                            ))}
                        </Select>
                    </Item>

                    {/* hidden flag input */}
                    <Item name="flag" noStyle>
                        <Input type="hidden" />
                    </Item>

                    {/* hidden countryName input */}
                    <Item name="countryName" noStyle>
                        <Input type="hidden" />
                    </Item>

                    {/* hidden currencyCode input */}
                    <Item name="currencyCode" noStyle>
                        <Input type="hidden" />
                    </Item>

                    <Item>
                        {edit ? (
                            <Button
                                type="text"
                                htmlType="submit"
                                loading={loading}
                                className="!w-full !font-bold !bg-rose-500 !text-white !hover:bg-blue-600"
                            >
                                Update category
                            </Button>
                        ) : (
                            <Button
                                type="text"
                                htmlType="submit"
                                loading={loading}
                                className="!w-full !font-bold !bg-blue-500 !text-white !hover:bg-blue-600"
                            >
                                Register category
                            </Button>
                        )}
                    </Item>
                </Form>

            </Modal>
        </div>
    );
};

export default CurrencyShared;
