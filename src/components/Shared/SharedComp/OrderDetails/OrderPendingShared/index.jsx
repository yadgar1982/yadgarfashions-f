import useSwr from "swr";
import { fetchData } from "../../../../../../module/http";
import OrderDetails from "../../../Order";

const OrderPendingShared = () =>{

    // fetch order details
    const fetchWithToken = (url) => fetchData(url);
    const { data: pendingOrders, error: orderError } = useSwr(
        '/api/order/status?status=pending',
        fetchWithToken,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            refreshInterval: 1200000,
        }
    );

    return (
        <div>
            <OrderDetails statusDetail="Orders Pending" ordersList={pendingOrders ? pendingOrders.orders : []} />
        </div>
    )
}
export default OrderPendingShared;