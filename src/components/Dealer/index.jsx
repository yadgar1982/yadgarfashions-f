import { Card, Table } from "antd";
import DealerLayout from "../Shared/DealerLayout";
import { fetchData, formatDate } from "../../../module/http";
import useSWR from "swr";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const Dealer = () => {

    // get token from cookies
    const token = cookies.get("authToken");
    // get user info from localstorage
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    const fetchWithToken = (url) => fetchData(url, token); // pass token




    // fetch cart data from api
    const { data: history, error: hError } = useSWR(
        token && `/api/dealer-tr-history/get/${userInfo?.userId}`,
        token && fetchWithToken,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            refreshInterval: 1200000,
        }
    );

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

    //payment code
    const credits =
        history?.history?.map((order) => ({
            key: order?.orderId,
            type: "credit",
            orderId: order?.orderId,
            country: "-",
            details: `${userInfo?.dealerName} 's Fees`,
            productQty: order?.quantity || 0,
            amount: (order?.amount || 0) * (order?.quantity || 0),
            createdAt: order?.createdAt,
        })) || [];

    const debits =
        payments?.map((payment) => ({
            key: payment?._id,
            type: "debit",
            orderId: payment?.receiverId || "-",
            productQty: "-",
            country: payment?.country,
            details: payment?.paymentDetail,
            amount: payment?.amount || 0,
            createdAt: payment?.createdAt,
        })) || [];

    console.log("debit", debits)
    const transactions = [...credits, ...debits].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)


    );
    let balance = 0;
    const dataSource = transactions.map((t, idx) => {
        balance += t.type === "credit" ? t.amount : -t.amount;
        return { ...t, balance };
    });



    let lastBalance = dataSource?.reduce((sum, data) => (data.balance || 0), 0);

    let totalDr = dataSource?.reduce((sum, data) => {
        return data.type === "debit" ? sum + (data.amount || 0) : sum;
    }, 0);
    let totalCr = dataSource?.reduce((sum, data) => {
        return data.type === "credit" ? sum + (data.amount || 0) : sum;
    }, 0);

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
            title: "OrderId / Payment Id",
            dataIndex: "orderId",
            key: "orderId",
        },
        {
            title: "Details",
            dataIndex: "details",
            key: "details",
        },
        {
            title: "Country of Payment",
            dataIndex: "country",
            key: "country",
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
                    $ {(balance).toFixed(2)}
                </span>
            ),
        },
    ];


    return (
        <DealerLayout>
            <Card
                title="Dealer History"
                extra={
                    <div className="flex gap-3">
                        <h1 className="font-semibold">
                            Credit
                            <span className="text-green-500"> $ {(totalCr || 0).toFixed(2)},</span>
                        </h1>
                        <h1 className="font-semibold">
                            Debit
                            <span className="text-green-500"> $ {(totalDr || 0).toFixed(2)},</span>
                        </h1>
                        <h1 className="font-semibold">
                            Balance :
                            <span className={lastBalance < 0 ? "text-red-500" : ""}>
                                $ {(lastBalance || 0).toFixed(2)}
                            </span>
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
        </DealerLayout>
    )
}
export default Dealer;