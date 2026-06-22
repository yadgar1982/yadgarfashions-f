import useSwr from "swr";
import { fetchData } from "../../../../../../module/http";
import OrderDetails from "../../../Order";
const OrderDeliveredShared = () => {
    // fetch order details
    const fetchWithToken = (url) => fetchData(url);
    const { data: deliveredOrders, error: orderError } = useSwr(
        '/api/order/status?status=delivered',
        fetchWithToken,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            refreshInterval: 1200000,
        }
    );

    return (
        <div>
            <OrderDetails statusDetail="Orders Delivered" ordersList={deliveredOrders ? deliveredOrders.orders : []} />
        </div>
    )
}
export default OrderDeliveredShared;