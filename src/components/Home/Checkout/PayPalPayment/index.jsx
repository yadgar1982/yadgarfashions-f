import { PayPalButtons } from "@paypal/react-paypal-js";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { http } from "../../../../../module/http";
import { resetOrderDetail, setOrderDetail } from "../../../../../redux/slices/orderDetail.slice";
import { resetTotalPrice } from "../../../../../redux/slices/totalPrice.slice";
import { nextStep } from "../../../../../redux/slices/steps.slice";
import { mutate } from "swr";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const PayPalPayment = () => {
  // get token from cookies
  const token = cookies.get("authToken");
  const dispatch = useDispatch();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const totalPriceSlice = useSelector(res => res.totalPriceSlice);
  const orderDetailSlice = useSelector(res => res.orderDetailSlice);

  const handleSuccess = async (details) => {
    try {
      const updatedOrderDetail = orderDetailSlice.map(ord => ({
        ...ord,
        paymentStatus: "succeeded",
        paymentId: details.id,
        email: userInfo.email
      }));

      dispatch(setOrderDetail(updatedOrderDetail));
      const httpReq = http(token);
      await httpReq.post("/api/order/many", updatedOrderDetail);
      await httpReq.delete(`/api/cart/delete/many/${userInfo.userId}`);
      dispatch(resetOrderDetail());
      dispatch(resetTotalPrice());
      dispatch(nextStep(4));
      mutate(`/api/cart/count?userId=${userInfo?.userId}`);
    } catch (err) {
      toast.error("PayPal: Order processing failed");
      console.error(err);
    }
  };

  return (

    <PayPalButtons
      style={{ layout: "vertical" }}
      createOrder={async () => {
        let cartIds = [];
        orderDetailSlice.map(item=>cartIds.push(item._id));
        const httpReq = http(token);
        const res = await httpReq.post("/api/paypal/create-order", {cartIds});
        return res.data.id;
      }}
      
      onApprove={async (data) => {
        const httpReq = http(token);
        const res = await httpReq.post("/api/paypal/capture-order", {
          orderID: data.orderID
        });
        await handleSuccess(res.data);
      }}

      onError={(err) => {
        console.error("PayPal Error:", err);
        toast.error("PayPal payment failed.");
      }}
    />
  );
};

export default PayPalPayment;
