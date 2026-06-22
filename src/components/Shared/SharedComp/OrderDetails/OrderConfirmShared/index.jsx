import useSwr from "swr";
import { fetchData } from "../../../../../../module/http";
import OrderDetails from "../../../Order";

const OrderConfirmShared = () => {
    
    // fetch order details
    const fetchWithToken = (url) => fetchData(url);
    const { data: confirmedOrders, error: orderError } = useSwr(
        '/api/order/status?status=confirmed',
        fetchWithToken,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            refreshInterval: 1200000,
        }
    );

    return (
        <div>
            <OrderDetails statusDetail="Orders Confirmed" ordersList={confirmedOrders ? confirmedOrders.orders : []} />
        </div>
    )
}
export default OrderConfirmShared;