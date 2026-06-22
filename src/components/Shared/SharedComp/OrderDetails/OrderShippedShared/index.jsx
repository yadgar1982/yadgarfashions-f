import useSwr from "swr";
import { fetchData } from "../../../../../../module/http";
import OrderDetails from "../../../Order";

const OrderShippedShared = () => {
    // fetch order details
    const fetchWithToken = (url) => fetchData(url);
    const { data: shippedOrders, error: orderError } = useSwr(
        '/api/order/status?status=shipped',
        fetchWithToken,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            refreshInterval: 1200000,
        }
    );

    return (
        <div>
            <OrderDetails statusDetail="Orders Shipped" ordersList={shippedOrders ? shippedOrders.orders : []} />
        </div>
    )
}
export default OrderShippedShared;