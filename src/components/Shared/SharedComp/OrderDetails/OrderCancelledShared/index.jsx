import useSwr from "swr";
import { fetchData } from "../../../../../../module/http";
import OrderDetails from "../../../Order";

const OrderCancelledShared = () => {
    // fetch order details
    const fetchWithToken = (url) => fetchData(url);
    const { data: cancelledOrders, error: orderError } = useSwr(
        '/api/order/status?status=cancelled',
        fetchWithToken,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            refreshInterval: 1200000,
        }
    );

    return (
        <div>
            <OrderDetails statusDetail="Orders Cancelled" ordersList={cancelledOrders ? cancelledOrders.orders : []} />
        </div>
    )
}

export default OrderCancelledShared;