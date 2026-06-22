import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { mutate } from 'swr';
import { http } from '../../../../../module/http';
import { useDispatch, useSelector } from 'react-redux';
import { nextStep } from '../../../../../redux/slices/steps.slice';
import { resetOrderDetail, setOrderDetail } from "../../../../../redux/slices/orderDetail.slice";
import { resetTotalPrice } from "../../../../../redux/slices/totalPrice.slice";
import { message, Tooltip } from 'antd';
import { toast } from 'react-toastify';
import PayPalPayment from '../PayPalPayment';
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useTranslation } from 'react-i18next';
import Cookies from "universal-cookie";

const cookies = new Cookies();

const initialOptions = {
    "client-id": "Aa0gSkbzj2orx7ls5nt68xxLQi03xWf9tckKvRqPeiCNBd9yaaeAcHfyE1G33rWCBJcHxjFRRd-7efy1",
    currency: "USD",
    intent: "capture",
};

const PaymentForm = ({ items }) => {

    const { t } = useTranslation('checkout');
    // get token from cookies
    const token = cookies.get("authToken");

    const dispatch = useDispatch();
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const totalPriceSlice = useSelector(res => res.totalPriceSlice);
    const orderDetailSlice = useSelector(res => res.orderDetailSlice);

    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('stripe'); // New toggle state

    const handleStripeCheckout = async () => {
        try {
            let cartIds = [];
            orderDetailSlice.map(item => cartIds.push(item._id));

            // Assuming these exist inside your redux slice
            const userId = orderDetailSlice[0]?.userId;
            const userAddress = orderDetailSlice[0]?.userAddress;

            const httpReq = http(token);
            const { data } = await httpReq.post("/api/stripe/create-checkout-session", { 
                cartIds,
                userId,
                userAddress,
                email : userInfo?.email
            });
            console.log(data);
            // Redirect to Stripe Checkout
            window.location.href = data.url;
        } catch (err) {
            message.error(err.response?.data?.error || err.message);
        }
    };

    return (
        <div className="mt-5 grid md:grid-cols-3">
            <div></div>
            <div>
                {/* <h1 className='font-semibold md:text-lg -mt-5 text-green-500'>{t("Select Payment Method")}</h1>
                <div className='mb-4'>
                    <label className='font-semibold !py-4 md:text-lg text-green-500'>Select Payment Method:</label>
                    <br />
                    <Tooltip title="Please Select the Method of Payment here" color='#C68E17'>
                        <select
                            className='w-full border p-2'
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            <option value="stripe">Credit/Debit (Stripe)</option>
                            <option value="paypal">PayPal</option>
                        </select>
                    </Tooltip>
                </div> */}

                {paymentMethod === 'stripe' ? (
                    <button
                        onClick={handleStripeCheckout}
                        className='w-full bg-rose-500 p-3 font-bold text-white'
                    >
                        Pay with Card
                    </button>
                ) : (
                    <div>
                        <PayPalScriptProvider options={initialOptions}>
                            <PayPalPayment />
                        </PayPalScriptProvider>
                    </div>
                )}

            </div>
            <div></div>
        </div>
    );
};

export default PaymentForm;
