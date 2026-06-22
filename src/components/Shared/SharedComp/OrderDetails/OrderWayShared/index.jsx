import useSwr from "swr";
import { fetchData } from "../../../../../../module/http";
import OrderDetails from "../../../Order";

const OrderOntheWayShared = () => {
    // fetch order details
    const fetchWithToken = (url) => fetchData(url);
    const { data: wayOrders, error: orderError } = useSwr(
           '/api/order/status?status=ontheway',
        fetchWithToken,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            refreshInterval: 1200000,
        }
    );
     console.log(wayOrders)
    return (
        <div>
            <OrderDetails ordersList={wayOrders ? wayOrders.orders : []} />
        </div>
    )
}
export default OrderOntheWayShared;