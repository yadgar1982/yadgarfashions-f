import { Card, Popconfirm, Input, Table, Button, Image, message, Switch, Modal, Form, Select, Tooltip } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined, ArrowDownOutlined, PrinterOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import useSwr, { mutate } from "swr";
import { fetchData, http } from "../../../../module/http";
import { useDispatch } from "react-redux";
import { setMenModal, setWaistcoatMoal, setWomenModal } from "../../../../redux/slices/modals.slice";
import { MenModal, WaistcoatModal, WomenModal } from "../Modals";
import { toast } from "react-toastify";
import { printNormalSize, printCustomSize, printSupplierOrders } from "../../../../module/print";
import Cookies from "universal-cookie";

const cookies = new Cookies();

///api/suplier

const OrderDetails = ({ ordersList, statusDetail = "Order Deatils" }) => {

    // get token from cookies
    const token = cookies.get("authToken");

    const [Myform] = Form.useForm();
    const [trackForm] = Form.useForm();
    const [openModal, setOpenModal] = useState(false);
    const [trackModal, setTrackModal] = useState(false);
    const [prdctId, setPrdctId] = useState(null);
    const [indx, setIndx] = useState(null);
    const [orders, setOrders] = useState([]);
    const [ordersCopy, setOrdersCopy] = useState([]);

    useEffect(() => {
        if (ordersList) {
            setOrders(ordersList);
            setOrdersCopy(ordersList);
        }
    }, [ordersList])



    // states collections
    const [loader, setLoader] = useState(false);
    const [no, setNo] = useState(0);
    const [orderId, setOrderId] = useState(null);
    const [supplierId, setSupplierId] = useState(null);
    const [fromOrderId, setFromOrderId] = useState('');
    const [toOrderId, setToOrderId] = useState('');

    // dispatch
    const dispatch = useDispatch();
    // show size
    const showSize = async (refSizeId, sizingType, productName) => {
        try {
            const httpReq = http(token);
            const { data } = await httpReq.get(`/api/${sizingType}/size?sizeId=${refSizeId}`)

            data.productName = productName;

            if (sizingType === "men-size")
                return dispatch(setMenModal({
                    menModal: true,
                    data
                }))
            if (sizingType === "women-size")
                return dispatch(setWomenModal({
                    womenModal: true,
                    data
                }))
            if (sizingType === "coat-size");
            return dispatch(setWaistcoatMoal({
                waistcoatModal: true,
                data
            }))
        } catch (error) {
            message.error("Unable to fetch data!")
        }
    }

    const fetchWithToken = (url) => fetchData(url); // pass token
    const suppField = ['supplierName']; // choose the fields you want
    const suppQuery = suppField.join(',');

    // fetch suppliers
    const { data: suppliers, error: suppliersError } = useSwr(
        `/api/supplier/query?fields=${suppQuery}`,
        fetchWithToken,
        {
            revalidateOnFocus: false,     // don't re-fetch when window gets focus
            revalidateOnReconnect: false, // don't re-fetch when reconnecting to internet
            refreshInterval: 0,           // no polling
            dedupingInterval: Infinity,   // never re-fetch automatically
            shouldRetryOnError: true     // avoid retry on error
        }
    );



    const allStatus = ["confirmed", "production", "ready", "packed", "shipped", "ontheway", "delivered"];
    const SelectStatus = [
        { label: "Confirmed", value: "confirmed" },
        { label: "Production", value: "production" },
        { label: "Product Ready", value: "ready" },
        { label: "Packed", value: "packed" },
        { label: "shipped", value: "shipped" },
        { label: "ontheway", value: "ontheway" },
    ];

    // handle status changes

    const getStatusMessage = (statusText) => {
        const now = new Date();

        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const formattedDate = now.toLocaleDateString('en-US', options);

        return `Product ${statusText} on ${formattedDate}`;
    };

    const handleProductStaus = async (id, newStatus, step, index) => {
        try {
            setLoader(true);
            const httpReq = http(token);
            setNo(index);
            await httpReq.put(`/api/order/status/${id}`, {
                newStatus,
                step
            });
            toast.success("Status Updated Successfully!");
            mutate(`/api/order/status?status=${ordersList[0].status}`);
        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally {
            setLoader(false);
        }
    };

    const handleProductionAndPacked = async (id, size, index) => {
        if (size === "custom") {
            const statusMessage = getStatusMessage("production");
            let step = {
                title: "Production",
                description: statusMessage
            }
            handleProductStaus(id, "production", step, index)
        } else {
            const statusMessage = getStatusMessage("packed");
            let step = {
                title: "Packed",
                description: statusMessage
            }
            handleProductStaus(id, "packed", step, index)
        }
    };

    const handleComplete = async (id, index) => {
        const statusMessage = getStatusMessage("ready");
        let step = {
            title: "Ready",
            description: statusMessage
        }
        handleProductStaus(id, "ready", step, index)
    };

    const handlePacked = async (id, index) => {
        const statusMessage = getStatusMessage("packed");
        let step = {
            title: "Packed",
            description: statusMessage
        }
        handleProductStaus(id, "packed", step, index)
    };

    const handleShipped = async (id, index) => {
        const statusMessage = getStatusMessage("shipped");
        let step = {
            title: "Shipped",
            description: statusMessage
        }
        handleProductStaus(id, "shipped", step, index)
    };

    const handleOntheWayModal = (id, index) => {
        trackForm.setFieldsValue({
            id,
            index
        })
        setTrackModal(true);
    }

    const handleOntheWay = async (values) => {
        const statusMessage = getStatusMessage("ontheway");
        let step = {
            title: "OnTheWay",
            description: `<h1>${statusMessage}, Track No = ${values.trackingNo},Check At = <a className="!text-blue-500" style="color:blue;text-decoration:underline" target="_blank" href="${values.trackingUrl}">${values.trackingUrl}</a></h1>`
        }
        handleProductStaus(values.id, "ontheway", step, values.index);
        trackForm.resetFields();
        setTrackModal(false);
    };

    //obj?._id, obj.userId
    const handleDelivered = async (obj, index) => {
        let dealerId = obj.dealerId;
        let orderId = obj.orderId;
        let qty = obj.productQty;
        const httpReq = http(token);
        if (dealerId) {
            const { data } = await httpReq.get(`/api/dealer/get/${dealerId}`);
            let amount = data?.dealerAmount;
            let balance = data?.dealerBalance;
            data.dealerBalance = balance + (amount * qty);
            let trHistory = {
                dealerId: dealerId,
                orderId: orderId,
                quantity: qty,
                amount: qty * amount,
                type: "cr"
            };
            await httpReq.put(`/api/dealer/update/${dealerId}`, data);
            await httpReq.post(`/api/dealer-tr-history/create`, trHistory);
        }
        const { data } = await httpReq.get(`/api/user/id/${obj.userId}`);
        await httpReq.post("/api/send-email/rating", { email: data.email });
        const statusMessage = getStatusMessage("delivered");
        let step = {
            title: "Delivered",
            description: statusMessage
        }
        handleProductStaus(obj._id, "delivered", step, index);
    };

    //edit mistakes
    const handleEditClick = (productId, index) => {
        setOpenModal(true);
        setPrdctId(productId)
        setIndx(index)

    };

    const onEditFinish = async (values) => {
        const statusMessage = getStatusMessage(values.status + " " + values.statusDetail);
        let step = {
            title: values.status,
            description: statusMessage
        }
        handleProductStaus(prdctId, values.status, step, indx);
        setOpenModal(false)
    };

    // table info
    const columns = [
        {
            title: 'Photo',
            dataIndex: 'productImage',
            key: "productImage",
            render: (url) => <Image width={40} src={url}
            />
        },
        {
            title: 'Order Id',
            dataIndex: 'orderId',
            key: "orderId",
            sorter: (a, b) => {
                if (typeof a.orderId === 'string' && typeof b.orderId === 'string') {
                    return a.orderId.localeCompare(b.orderId); // Sorting as strings
                }
                return a.orderId - b.orderId; // Sorting as numbers
            },
        },
        {
            title: 'Product Name',
            dataIndex: 'productName',
            key: "productName"
        },
        {
            title: 'Product QTY',
            dataIndex: 'productQty',
            key: "productQty"
        },
        {
            title: 'Product Size',
            dataIndex: 'productSize',
            key: "productSize",
            render: (size, obj, index) => (
                size === "custom" ?
                    <div>
                        <span className="capitalize">{size}</span>
                        <Button
                            onClick={() => showSize(obj.refSizeId, obj?.sizingType, obj.productName)}
                            type="!text !text-white bg-[#910a52]"
                            size="small"
                            className="text-[12px] m-2 !rounded-[25px] hover:!bg-white hover:!text-[#910a52] hover:!border-[#910a52]"
                        >Show Size</Button>
                    </div>
                    :
                    <span className="uppercase">{size}</span>
            )
        },
        {
            title: 'Product Color',
            dataIndex: 'productColor',
            key: "productColor",
            render: (color, obj, index) => (
                <div
                    style={{ background: color }}
                    className={`h-[15px] w-[100px] !bg-[${color.toLowerCase()}]`}></div>
            )
        },
        {
            title: 'Delivery Method',
            dataIndex: 'deliveryType',
            key: "deliveryType",
            render: (text) => {
                let type = text === "expressDurationCost" ? "Express" : "Normal";
                return <div
                    className={`rounded w-fit p-2 ${type === "Express" ? "text-red-500 bg-red-100" : "text-green-500 bg-green-100"}`}
                >{type}</div>
            }
        },
        {
            title: 'Payment Status',
            dataIndex: 'paymentStatus',
            key: "paymentStatus",
            fixed: "right",
            render: (text, obj, index) => <Button
            disabled
            className={`uppercase !text-white !font-bold ${text === "paid" ? "!bg-blue-500" : "!bg-rose-500"}`}
            >
                {text}
            </Button>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: "status",
            fixed: "right",
            render: (text, obj, index) => <Switch
                checkedChildren={obj?.status}
                unCheckedChildren={obj?.status}
                checked={obj.status === "pending" ? false : true}
                disabled
            />
        },
        {
            title: 'Action',
            dataIndex: 'action',
            fixed: "right",
            //className : "hidden",
            render: (_, obj, index) => (
                <div className="flex gap-x-2">
                    {
                        allStatus.includes(obj.status) && (
                            <Popconfirm
                                title="Are you sure?"
                                description="Do you want to proceed this order?"
                                onConfirm={
                                    () => obj.status === "confirmed" ?
                                        handleProductionAndPacked(
                                            obj?._id, obj?.productSize, index
                                        ) :
                                        obj.status === "production" ?
                                            handleComplete(
                                                obj?._id, index
                                            ) :
                                            obj.status === "ready" ?
                                                handlePacked(
                                                    obj?._id, index
                                                ) :
                                                //my code starts
                                                obj.status === "packed" ?
                                                    handleShipped(
                                                        obj?._id, index
                                                    ) :
                                                    obj.status === "shipped" ?
                                                        handleOntheWayModal(
                                                            obj?._id, index
                                                        ) :
                                                        handleDelivered(
                                                            obj, index
                                                        )
                                }
                                onCancel={() => toast.info("Your order is not proceed !")}
                            >
                                <Button
                                    loading={index === no && loader}
                                    shape="circle"
                                    className=" !bg-green-500 text-white hover:text-white hover:!bg-white"
                                    icon={<ArrowDownOutlined />}
                                />
                            </Popconfirm>
                        )
                    }
                    {
                        allStatus.includes(obj.status) && (
                            <Button
                                className=" !bg-indigo-500 text-white hover:!text-[#910a52] hover:!border-[#910a52] hover:!bg-white"
                                shape="circle"
                                onClick={() => handlePrint(obj)}
                                icon={<PrinterOutlined />}
                            />
                        )
                    }
                    {
                        allStatus.includes(obj.status) && (
                            <Button
                                className=" !bg-[#910a52] text-white hover:!text-[#910a52] hover:!border-[#910a52] hover:!bg-white"
                                shape="circle"
                                onClick={() =>
                                    handleEditClick(obj._id, index)}
                                icon={<EditOutlined />}
                            />
                        )
                    }
                </div>
            )
        },
    ];

    const hanldeSupplierChange = (supplierId) => {
        setSupplierId(supplierId);
        let filter = ordersCopy.filter((ord) => ord.supplierId === supplierId)
        setOrders(filter);
    }

    const hanldeOnChange = (ord) => {
        setOrderId(ord);
        if (ord?.length <= 0 + 1)
            setOrders(ordersCopy)
    }

    const handleSearch = () => {
        let filter = ordersCopy.filter((ord) => ord.orderId == orderId)
        setOrders(filter);
    }

    const handleSearchfromTo = () => {
        if(!supplierId)
            return toast.warning("Please select suppiler !");
        const from = fromOrderId;
        const to = toOrderId;
        if (isNaN(from) || isNaN(to)) {
            toast.error("Please enter a valid Nubmer for both from and to")
            return
        }
        const filter = ordersCopy.filter((order) => {
            if(order.supplierId === supplierId)
            {
                return order?.orderId >= from && order?.orderId <= to
            }
        });
        setOrders(filter)
    }
    // print order details
    const handlePrint = async (obj) => {
        try {
            const fields = ['highlights', 'desc', 'orderId']; // choose the fields you want
            const query = fields.join(',');

            const httpReq = http(token);
            const { data: supplier } = await httpReq.get(`/api/supplier/id/${obj.supplierId}`);
            const { data: propsList } = await httpReq.get(`/api/product/query/${obj.productId}?fields=${query}`);

            obj.productDesc = propsList[0]?.desc;
            obj.productHighlights = propsList[0]?.highlights;

            if (obj.sizingType === "men-size" && obj.productSize !== "custom")
                return printNormalSize(obj, supplier, "Men / Boys");

            if (obj.sizingType === "women-size" && obj.productSize !== "custom")
                return printNormalSize(obj, supplier, "Women / girls");

            if (obj.sizingType === "coat-size" && obj.productSize !== "custom")
                return printNormalSize(obj, supplier, "Waistcoat");

            if (obj.sizingType === "women-size" && obj.productSize === 'custom') {
                const { data: customSize } = await httpReq.get(`/api/${obj.sizingType}/size/?sizeId=${obj.refSizeId}`);
                printCustomSize(obj, supplier, customSize, obj.sizingType, "Women / girls")
            }

            if (obj.sizingType === "men-size" && obj.productSize === 'custom') {
                const { data: customSize } = await httpReq.get(`/api/${obj.sizingType}/size/?sizeId=${obj.refSizeId}`);
                printCustomSize(obj, supplier, customSize, obj.sizingType, "Men / Boys")
            }

            if (obj.sizingType === "coat-size" && obj.productSize === 'custom') {
                const { data: customSize } = await httpReq.get(`/api/${obj.sizingType}/size/?sizeId=${obj.refSizeId}`);
                printCustomSize(obj, supplier, customSize, obj.sizingType, "Men / Boys")
            }

        } catch (err) {
            toast.error(err?.response?.data?.message);
        }
    }

    // handle supplier list print
    const handleSupplierPrint = async () => {
        try {
            if (!supplierId)
                return toast.warning("Please select supplier !")
            const httpReq = http(token);
            const { data: supplier } = await httpReq.get(`/api/supplier/id/${supplierId}`);
            printSupplierOrders(orders, supplier);
        } catch (err) {
            toast.error(err?.response?.data?.message);
        }
    }

    return (
        <div>
            <Card
                title={statusDetail}
                extra={
                    <div className="flex gap-3 p-2 items-center">
                        <Button
                            className=" !bg-indigo-500 text-white hover:!text-[#910a52] hover:!border-[#910a52] hover:!bg-white"
                            shape="circle"
                            onClick={handleSupplierPrint}
                            icon={<PrinterOutlined />}
                        />
                        <Select
                            onChange={hanldeSupplierChange}
                            placeholder="Select supplier"
                            className="!min-w-[200px]">
                            {
                                suppliers && suppliers?.suppliers.map((sup) => (
                                    <Select.Option
                                        value={sup._id}
                                        className="capitalize"
                                        key={sup._id}
                                    >
                                        {sup.supplierName}
                                    </Select.Option>
                                ))
                            }
                        </Select>
                        <Input
                            onChange={(e) => hanldeOnChange(e.target.value)}
                            placeholder="Search order number"
                            addonAfter={<Tooltip title={`Print your order No: ${orderId || ""}`}>
                                <SearchOutlined onClick={handleSearch} />
                            </Tooltip>}

                        />
                        <div className=" flex p-3 w-full bg-zinc-100 rounded gap-2">
                            <Input
                                onChange={(e) => setFromOrderId(e.target.value)}
                                placeholder="From Order Id"
                                className="w-[150px]"
                            />
                            <Input
                                onChange={(e) => setToOrderId(e.target.value)}
                                placeholder="To Order Id"
                                addonAfter={<Tooltip title={`Print your order ${ fromOrderId ||"" } to order  ${ toOrderId }`}>
                                    <SearchOutlined onClick={handleSearchfromTo} />
                                </Tooltip>}
                            />
                        </div>


                    </div>


                }
                style={{ overflowX: 'auto' }}
            >
                <Table
                    columns={columns}
                    dataSource={orders}
                    scroll={{ x: 'max-content' }}
                    rowKey="_id"
                />
            </Card>
            <MenModal />
            <WomenModal />
            <WaistcoatModal />
            {/* Status Edit modal */}
            <Modal
                open={openModal}
                onCancel={() => setOpenModal(false)}
                footer={null}
                closeIcon={<Button className="
                    !rounded-full text-sm border-none !bg-transparent 
                    shadow-none left-3 bottom-3 font-semibold !text-[#910a52]
                    !h-[20px] !w-[20px] 
                    hover:!bg-transparent hover:!shadow-none hover:!text-[#910a52]
                    active:!bg-transparent focus:!bg-transparent 
                    focus:!shadow-none focus:!outline-none focus:!ring-0
                    ">✕
                </Button>}

                closable={true}
            >
                <Card
                    title="Update Order Status"
                    bordered={false}
                    className="max-w-md mx-auto  shadow-lg rounded-xl  bg-[#faf3f7]"
                >
                    <Form
                        form={Myform}
                        onFinish={onEditFinish}
                        autoComplete="off"
                        layout="vertical"

                    >

                        <Form.Item
                            label="Updated Status"
                            name="status"
                            rules={[{ required: true, message: 'Please enter the  updated status' }]}
                        >
                            <Select
                                showSearch
                                placeholder="Select a person"
                                optionFilterProp="label"
                                options={SelectStatus}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Reason"
                            name="statusDetail"
                            rules={[{ required: true, message: 'Please enter the reason' }]}
                        >
                            <Input placeholder="Enter reason" />
                        </Form.Item>


                        <Form.Item>
                            <Button htmlType="submit" block className="bg-[#910a52] text-white hover:!text-[#910a52] hover:!border-[#910a52]">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Modal>
            {/* Tracking Details modal */}
            <Modal
                open={trackModal}
                onCancel={() => setTrackModal(false)}
                footer={null}
                closeIcon={<Button className="
                    !rounded-full text-sm border-none !bg-transparent 
                    shadow-none left-3 bottom-3 font-semibold !text-[#910a52]
                    !h-[20px] !w-[20px] 
                    hover:!bg-transparent hover:!shadow-none hover:!text-[#910a52]
                    active:!bg-transparent focus:!bg-transparent 
                    focus:!shadow-none focus:!outline-none focus:!ring-0
                    ">✕
                </Button>}

                closable={true}
            >
                <Card
                    title="Update Order Status"
                    bordered={false}
                    className="max-w-md mx-auto  shadow-lg rounded-xl  bg-[#faf3f7]"
                >
                    <Form
                        form={trackForm}
                        onFinish={(values) => handleOntheWay(values)}
                        autoComplete="off"
                        layout="vertical"

                    >

                        <Form.Item
                            label="Tracking Website Url"
                            name="trackingUrl"
                            rules={[{ required: true }]}
                        >
                            <Input type="url" placeholder="https://www.example.com" />
                        </Form.Item>
                        <Form.Item
                            label="Tracking No"
                            name="trackingNo"
                            rules={[{ required: true, }]}
                        >
                            <Input placeholder="12345678" />
                        </Form.Item>
                        <Form.Item
                            name="id"
                            noStyle
                        >
                            <Input type="hidden" />
                        </Form.Item>
                        <Form.Item
                            name="index"
                            noStyle
                        >
                            <Input type="hidden" />
                        </Form.Item>


                        <Form.Item>
                            <Button htmlType="submit" block className="bg-[#910a52] text-white hover:!text-[#910a52] hover:!border-[#910a52]">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Modal>
        </div>
    )
}
export default OrderDetails;