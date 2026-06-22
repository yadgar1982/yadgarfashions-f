import { Card, Table } from "antd";
import Supplier from "../Shared/SupplierLayout";
import { fetchData, formatDate } from "../../../module/http";
import useSWR from "swr";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const SupplierHistory = () => {
    // get token from cookies
    const token = cookies.get("authToken");

    // get user info from localstorage
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const fetchWithToken = (url) => fetchData(url, token); // pass token

    // fetch order data from api
    const { data: history, error: hError } = useSWR(
        token ? `/api/order/supplier?supplierId=${userInfo?.userId}` : null,
        fetchWithToken,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            refreshInterval: 1200000, // 20 mins
        }
    );


    //payment code
    //fetch payments
    //get all payments
    const { data: payments, error: pErr, isLoading } = useSWR(
        `/api/payment/get/${userInfo?.userId}`,
        fetchData,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            refreshInterval: 1200000,
        }
    );

    console.log("payments", payments)
    const credits =
        history?.orders?.map((order) => ({
            key: order?._id,
            type: "credit",
            orderId: order?._id,
            productName: order?.productName || "-",
            productQty: order?.productQty || 0,
            price: order?.productCost || 0,
            amount: (order?.productCost || 0) * (order?.productQty || 0),
            createdAt: order?.createdAt,
        })) || [];

  const debits = payments?.map((payment) => ({
    key: payment?._id,
    type: "debit",
    orderId: payment?.paymentDetail || "-",
    productName: "-",
    productQty: "-",
    price: "-",
    details: payment?.paymentDetail || "-",
    amount: payment?.amount || 0,
    createdAt: payment?.createdAt,
})) || [];

console.log("Raw payments:", payments);
console.log("Debits array:", debits);
    const transactions = [...credits, ...debits].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)


    );

    let balance = 0;
    const dataSource = transactions.map((t, idx) => {
        balance += t.type === "credit" ? t.amount : -t.amount;
        return { ...t, balance };
    });


    let totalDr =
        payments?.reduce(
            (sum, payment) => sum + (payment?.amount || 0),
            0
        ) || 0;
    let totalCr =
        history?.orders?.reduce(
            (sum, order) => sum + (order?.productCost * order?.productQty || 0),
            0
        ) || 0;

    let lastBalance = totalCr - totalDr;

    //end of payment code


    const columns = [
        {
            title: "Date",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (d) => formatDate(d),
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            render: (t) =>
                t === "credit" ? <span style={{ color: "green" }}>Credit</span> : <span style={{ color: "red" }}>Debit</span>,
        },
        {
            title: "OrderId / Payment Details",
            dataIndex: "orderId",
            key: "orderId",
        },
        {
            title: "Product Name",
            dataIndex: "productName",
            key: "productName",
        },
        {
            title: "Quantity",
            dataIndex: "productQty",
            key: "productQty",
            render: (q) => (q === "-" ? "-" : q),
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            render: (p) => (p === "-" ? "-" : `$${(p).toFixed(2)}`),
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (a, row) =>
                row.type === "credit"
                    ? <span style={{ color: "green" }}>+${(a).toFixed(2)}</span>
                    : <span style={{ color: "red" }}>-${(a).toFixed(2)}</span>,
        },

        {
            title: "Balance",
            dataIndex: "balance",
            key: "balance",
            render: (balance) => (
                <span className={balance < 0 ? "text-red-500" : "text-green-500"}>
                    $ {balance}
                </span>
            ),
        },
    ];


    return (
        <Supplier>
            <Card
                title="Supplier History"
                extra={
                    <div className="flex gap-3">
                        <h1 className="font-semibold">
                            Credit
                            <span className="text-green-500"> $ {(totalCr || 0).toFixed(2)},</span>
                        </h1>
                        <h1 className="font-semibold">
                            Debit
                            <span className="text-red-500"> $ {(totalDr || 0).toFixed(2)},</span>
                        </h1>
                        <h1 className="font-semibold">
                            Balance
                            <span className="text-green-500"> $ {(lastBalance || 0).toFixed(2)}</span>
                        </h1>
                    </div>
                }
            >
                <div className="overflow-x-auto">
                    <Table
                        columns={columns}
                        dataSource={dataSource}
                        pagination={{ pageSize: 8 }}
                        bordered
                    />
                </div>
            </Card>
        </Supplier>
    )
}
export default SupplierHistory;