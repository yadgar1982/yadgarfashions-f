import useSwr from "swr";
import { fetchData } from "../../../../../../module/http";
import OrderDetails from "../../../Order";

const OrderCompletedShared = () => {
    // fetch order details
    const fetchWithToken = (url) => fetchData(url);
    const { data: readyOrders, error: orderError } = useSwr(
        '/api/order/status?status=ready',
        fetchWithToken,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            refreshInterval: 1200000,
        }
    );

    return (
        <div>
            <OrderDetails statusDetail="Orders Completed" ordersList={readyOrders ? readyOrders.orders : []} />
        </div>
    )
}
export default OrderCompletedShared;