import useSwr from "swr";
import { fetchData } from "../../../../../../module/http";
import OrderDetails from "../../../Order";

const OrderProductionShared = () =>{
    // fetch order details
    const fetchWithToken = (url) => fetchData(url);
    const { data: productionOrders, error: orderError } = useSwr(
        '/api/order/status?status=production',
        fetchWithToken,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            refreshInterval: 1200000,
        }
    );

    return (
        <div>
            <OrderDetails statusDetail="Orders In Production" ordersList={productionOrders ? productionOrders.orders : []} />
        </div>
    )
}
export default OrderProductionShared;