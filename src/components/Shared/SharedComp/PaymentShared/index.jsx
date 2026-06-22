import { useEffect, useState } from "react";
import { Form, Input, Button, Switch, Select, Card, Modal, Table, Popconfirm, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { http, formatDate, fetchData } from "../../../../../module/http";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
const cookies = new Cookies();
const { Item } = Form;
import useSWR, { mutate } from 'swr';

const PaymentShared = () => {
    // get token from cookies
    const token = cookies.get("authToken");
    // Form related variable
    const [paymentForm] = Form.useForm();
    // states collection
    const [payments, setPayments] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
    });
    const [loading, setLoading] = useState(false);
    const [delLoading, setDelLoading] = useState(false);
    const [paymentsModal, setpaymentsModal] = useState(false);
    const [no, setNo] = useState(0);
    const [edit, setEdit] = useState(null);
    const [loaderIndex, setLoaderIndex] = useState(0);
    const [payeeId, setPayeeId] = useState(0);
    //receiver controlling states
    const [del, setDel] = useState(false);
    const [sup, setSup] = useState(false);
    const [rec, setRec] = useState(false);

    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [pays, setPays] = useState([]);
    const [paymentCopy, setPaymentCopy] = useState([]);


    //fetch userInfo
    const userInfo = JSON.parse(localStorage.getItem("userInfo"))
    let user = {
        userName: userInfo?.name,
        userId: userInfo?.userId
    }
    const [payerId, setPayerId] = useState(user);



    //fetch payments
    const { data: totalPayments, error: pErr, isLoading } = useSWR(
        "/api/payment/all",
        fetchData,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            refreshInterval: 1200000,
        }
    );

    //payment filter
    useEffect(() => {
        if (totalPayments && Array.isArray(totalPayments?.payments)) {

            setPays(totalPayments?.payments);//full payment lists
            setPaymentCopy(totalPayments.payments);  // acopy of payments for filter
        }
    }, [totalPayments]);

    const handleSearchfromTo = () => {

        if (!fromDate || !toDate) {
            toast.warning("Please select both From and To dates!");
            return;
        }

        // Convert dates to JavaScript Date objects
        const from = new Date(fromDate);
        const to = new Date(toDate);

        // date validation
        if (isNaN(from.getTime()) || isNaN(to.getTime())) {
            toast.error("Please enter valid dates for both From and To");
            return;
        }

        // Make sure paymentCopy is an array
        if (Array.isArray(paymentCopy)) {
            const filteredPayments = paymentCopy.filter((payment) => {
                const paymentDate = new Date(payment.createdAt);
                return paymentDate >= from && paymentDate <= to;
            });
            if (filteredPayments.length === 0) {
                toast.info("No payments found for the selected date range.");
            }
            setPays(filteredPayments);  // Set filtered payments to state
        } else {
            toast.error("Invalid data structure for payments.");
        }
    };

    //calculate total payments
    const totalAmount = pays?.reduce((sum, item) => {
        return sum + item.amount;
    }, 0);


    // fetch all currencies
    const { data: currencies, error: curErr } = useSWR(
        "/api/currency/all",
        fetchData,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            refreshInterval: 1200000,
        }
    )

    // fetch all payments
    const fetchpaments = async (page = 1, pageSize = 10) => {
        setLoading(true);
        try {
            const httpReq = http(token);
            const response = await httpReq.get(`/api/payment/pagination?page=${page}&limit=${pageSize}`);
            const { data, total } = response.data;
            setPayments(data);
            setPagination({
                current: page,
                pageSize: pageSize,
                total: total,
            });
        } catch (error) {
            console.error('Error fetching payments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchpaments(pagination.current, pagination.pageSize);
    }, [no]);



    // calling fetPayments for table 
    const handleTableChange = (pagination) => {
        fetchpaments(pagination.current, pagination.pageSize);
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
    // fetch supplier data from api
    const { data: suppliers, error: sError } = useSWR(
        `/api/supplier/all`,
        fetchData,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            refreshInterval: 1200000,
        }
    );

    // fetch dealer data from api
    const { data: dealers, error: dError } = useSWR(
        `/api/dealer/all`,
        fetchData,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            refreshInterval: 1200000,
        }
    );

    //handleChanges
    const handleDealerChange = (selectedId) => {
        const dealer = dealers?.dealers.find((d) => d._id === selectedId);
        if (dealer) {
            setPayeeId({
                _id: dealer._id,
                name: dealer.dealerName,
            });
            setSup(true);
            setRec(true);
            setDel(false);
        }
    };

    const handleSupplierChange = (selectedId) => {
        const supplier = suppliers?.suppliers.find((d) => d._id === selectedId);
        if (supplier) {
            setPayeeId({
                _id: supplier._id,
                name: supplier.supplierName,
            });
            setDel(true);
            setRec(true);
            setSup(false)
        }
    };

    const handleOtherPayment = (e) => {
        const val = e.target.value;
        setPayeeId({ _id: "1001", name: val });
        setSup(true);
        setDel(true);
        setRec(false);

    };
    // Register new payments
    const onFinish = async (values) => {
        values.userId = payerId?.userId;
        values.userName = payerId?.userName;
        values.receiverId = payeeId?._id;
        values.receiver = payeeId?.name;
        try {
            setLoading(true);

            const httpReq = http(token);
            await httpReq.post("/api/payment/create", values);
            toast.success("payment added successfully");
            setpaymentsModal(false);
            paymentForm.resetFields();
            setNo(no + 1);
            setSup(false);
            setDel(false);
            setRec(false);
        } catch (err) {
            console.log(err);
            toast.error(err?.response?.data?.message);

        } finally {
            setLoading(false);
        }
    }

    // delete payments
    const deletePayments = async (id, index) => {
        try {
            setDelLoading(true);
            setLoaderIndex(index);
            const httpReq = http(token);
            await httpReq.delete(`/api/payment/delete/${id}`);
            // remove the deleted item from state
            const updatedList = [...payments];
            updatedList.splice(index, 1);
            setPayments(updatedList);
            toast.success("payment deleted successfully");
        } catch (error) {
            toast.error("Failed to delete payment");
        } finally {
            setDelLoading(false);
        }
    };

    // on edit payments 
    const onEditsupplier = (obj, index) => {
        setpaymentsModal(true);
        paymentForm.setFieldsValue(obj);
        setEdit(obj);
        setLoaderIndex(index);
    }

    // on update payments
    const onUpdatePayment = async (values) => {
        values.userId = payerId?.userId;
        values.userName = payerId?.userName;
        values.receiverId = payeeId?._id;
        values.receiver = payeeId?.name;
        try {
            setLoading(true);
            const httpReq = http(token);
            const { data } = await httpReq.put(`/api/payment/update/${edit?._id}`, values);
            mutate('/api/payment/all')
            // remove the deleted item from state
            const updatedList = [...payments];
            updatedList.splice(loaderIndex, 1, data?.supplier);
            setPayments(updatedList);
            toast.success("Updated payment Info !");
            setpaymentsModal(false);
            setEdit(null);
            paymentForm.resetFields();
        } catch (err) {
            toast.error("Unable to update payment Info !");
        } finally {
            setLoading(false);
        }
    }

    // payment model close reset form
    const onpaymentsModalClose = () => {
        setpaymentsModal(false);
        setEdit(null);
        paymentForm.resetFields();
        setSup(false);
        setDel(false);
        setRec(false);
    }

    // colums for payments list
    const columns = [
        {
            title: 'Sr no',
            key: 'srNo',
            render: (x, y, index) => (index + 1)
        },
        {
            title: 'Receiver Name',
            dataIndex: "receiver",
            key: 'receiver',
        },
        {
            title: 'Paid By',
            dataIndex: 'userName',
            key: 'userName',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },

        {
            title: 'Details',
            dataIndex: 'paymentDetail',
            key: 'paymentDetail',
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
                        onClick={() => onEditsupplier(obj, index)}
                    />
                    <Popconfirm
                        title="Do you wanna delete supplier?"
                        icon={<DeleteOutlined />}
                        onCancel={() => toast.info("Your payments is safe !")}
                        onConfirm={() => deletePayments(obj?._id, index)}
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
                title="Payments List"
                className="shadow-md"
                style={{ overflowX: "auto", fontSize: "20px", fontWeight: "600" }}
                extra={
                    <Button
                        className="!bg-blue-500 !text-white !font-bold"
                        type="text" icon={<PlusOutlined />}
                        onClick={() => setpaymentsModal(true)}
                    >
                        Add new Payment
                    </Button>

                }

            >
                <div className=" flex p-3 w-full bg-zinc-100 rounded gap-5">
                    <span className="flex gap-4">
                        <p className="flex">From</p>
                        <Input
                            onChange={(e) => setFromDate(e.target.value)}
                            className="w-[150px]"
                            type="date"
                        />
                    </span>
                    <span className="flex gap-3">
                        <p className="flex text-lg">To</p>
                        <Input
                            label="to Date"
                            onChange={(e) => setToDate(e.target.value)}
                            type="date"
                            addonAfter={
                                <Tooltip title={`Sort between from  and  to ${toDate || ""}`}>
                                    <SearchOutlined onClick={handleSearchfromTo} className="!bg-blue-500" />
                                </Tooltip>
                            }
                        />
                    </span>

                </div>
                <h3 className="w-full text-right text-lg">TotalPayments: <span className="text-red-400">$ {totalAmount?.toFixed(2)}</span></h3>


                <Table
                    columns={columns}
                    dataSource={pays}
                    rowKey="_id"
                    loading={loading}
                    pagination={pagination}
                    onChange={handleTableChange}
                    scroll={{ x: "max-content" }}
                    className="capitalize"
                />
            </Card>
            <Modal
                open={paymentsModal}
                width={720}
                onCancel={onpaymentsModalClose}
                title="Payment Form"
                style={{ fontSize: "20px", fontWeight: "600" }}
                footer={null}
            >
                <Form
                    name="add-payment"
                    layout="vertical"
                    onFinish={edit ? onUpdatePayment : onFinish}
                    form={paymentForm}
                >
                    <div className="mt-5 grid md:grid-cols-2 gap-x-3">
                        <Item
                            label="Supplier"
                            name="payeeId"

                            onChange={() => setPayeeId(e.target.value)}

                        >

                            <Select
                                className="min-w-[100px] uppercase" placeholder="Select Supplier"
                                onChange={handleSupplierChange}
                                disabled={sup}
                            >
                                {Array.isArray(suppliers?.suppliers) &&
                                    suppliers.suppliers.map((item) => (

                                        <Option key={item._id} value={item._id}>
                                            {item.supplierName}
                                        </Option>
                                    ))}
                            </Select>
                        </Item>
                        <Item
                            label="Dealer"
                            name="payeeId"

                            onChange={() => setPayeeId(e.target.value)}

                        >
                            {

                                <Select
                                    className="min-w-[100px] uppercase"
                                    placeholder="Select dealer"
                                    onChange={handleDealerChange}
                                    disabled={del}
                                >
                                    {Array.isArray(dealers?.dealers) &&
                                        dealers.dealers.map((item) => (
                                            <Option key={item._id} value={item._id}>
                                                {item.dealerName}
                                            </Option>
                                        ))}
                                </Select>
                            }
                        </Item>
                        <Item
                            label="Receiver"
                            name="receiver"
                            onChange={(e) => handleOtherPayment(e)}

                        >

                            <Input placeholder="e.g. supplier Payment" disabled={rec} />
                        </Item>
                        <Item
                            label="Amount"
                            name="amount"
                            rules={[{ required: true }]}
                        >
                            <Input type="number" placeholder="e.g. 200" />
                        </Item>
                        <Item
                            label="Payment Details"
                            name="paymentDetail"
                            rules={[{ required: true }]}
                        >
                            <Input placeholder="e.g. supplier Payment" />
                        </Item>
                        <Item
                            label="Country"
                            name="country"
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
                                        Update Payment
                                    </Button>
                                    :
                                    <Button
                                        type="text"
                                        htmlType="submit"
                                        loading={loading}
                                        className="!font-bold !bg-blue-500 !text-white !hover:bg-blue-600"
                                    >
                                        Add New Payment
                                    </Button>
                            }
                        </Item>

                    </div>                </Form>
            </Modal>
        </div>
    );
};

export default PaymentShared;
