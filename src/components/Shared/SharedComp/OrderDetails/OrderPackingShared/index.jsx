import useSwr from "swr";
import { fetchData } from "../../../../../../module/http";
import OrderDetails from "../../../Order";

const OrderPackingShared = () => {
    // fetch order details
    const fetchWithToken = (url) => fetchData(url);
    const { data: packedOrders, error: orderError } = useSwr(
        '/api/order/status?status=packed',
        fetchWithToken,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            refreshInterval: 1200000,
        }
    );

    return (
        <div>
            <OrderDetails statusDetail="Orders Packed" ordersList={packedOrders ? packedOrders.orders : []} />
        </div>
    )
}
export default OrderPackingShared;