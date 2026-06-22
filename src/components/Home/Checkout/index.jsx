import HomeLayout from "../../Shared/HomeLayout";
import React, { useState } from 'react';
import { Button, message, Result, Steps, theme } from 'antd';
import DeliveryAddress from "./DeliveryAddress";
import OrderSummary from "./OrderSummary";
import PaymentForm from "./Payment";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { backStep } from "../../../../redux/slices/steps.slice";
import { BackwardOutlined, SmileOutlined } from "@ant-design/icons";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
//const stripePromise = loadStripe(`pk_test_51S1RhXQ58I5I4xkP8MoDZ92dIhAV96N4m5LmIDRNq7wGP90f0tVjABaf3n1qtvngyemNSgo4JlqE3A76UMGFU5YI00zeOQX9s2`);
const stripePromise = loadStripe(`pk_live_51Re6w0JIzHNUdpf1GjzdPpsxNtcjtUW9yKlIPu7htHwsU9qYVW1gK7NJP4mpBaU1d8fP3inmOMWNjGNxhUtGbLXn00mYddLRAD`);

const Checkout = () => {
    const { t } = useTranslation('checkout');
    const navigate = useNavigate();
    const prouctItems = [{ name: 'Product A', price: 20, quantity: 2 }];
    const dispatch = useDispatch();
    const stepsSlice = useSelector(res => res.stepsSlice);
    const current = stepsSlice;

    const shopeMor = () => {
        navigate("/");
        dispatch(backStep(1));
    }

    const steps = [
        {
            title: <span>{t('Login')}</span>,
            content: 'First-content',
        },
        {
            title: <span>{t('Delivery Address')}</span>,
            content: <DeliveryAddress />,
        },
        {
            title: <span>{t('Order Summary')}</span>,
            content: <OrderSummary />,
        },
        {
            title: <span>{t('Payment')}</span>,
            content: <Elements stripe={stripePromise}>
                <PaymentForm items={prouctItems} />
            </Elements>,
        },
        {
            title: <span>{t('Success')}</span>,
            content: <Result
                icon={<SmileOutlined />}
                title={("Your order is complete! Please check your email for details.")}
                extra={<Button type="primary"
                    onClick={shopeMor}
                >{t('Shop More')}</Button>}
            />,
        },
    ];

    const { token } = theme.useToken();
    // const [current, setCurrent] = useState(1);

    //  const next = () => {
    //     setCurrent(current + 1);
    // }; 
    const prev = (num) => {
        current > 1 ? dispatch(backStep(current - 1)) : dispatch(backStep(1));
    };

    const items = steps.map(item => ({ key: item.title, title: item.title }));
    const contentStyle = {
        //lineHeight: '260px',
        //textAlign: 'center',
        //color: token.colorTextTertiary,
        backgroundColor: token.colorFillAlter,
        //borderRadius: token.borderRadiusLG,
        border: `1px dashed ${token.colorBorder}`,
        marginTop: 16,
        padding: 16
    };

    return (
        <HomeLayout>
            <Steps className="p-4 md:p-0" current={current} items={items} />
            {
                current > 1 &&
                <div className="flex items-center justify-start" style={{ marginTop: 24 }}>

                    {current > 0 && (
                        <Button
                            icon={<BackwardOutlined />}
                            disabled={current > 1 ? false : true}
                            style={{ margin: '0 8px' }} onClick={() => prev()}
                            className="!mx-4 md:!mx-0"
                            >
                            {t('Previous')}
                        </Button>
                    )}
                </div>
            }
            <div style={contentStyle}>{steps[current].content}</div>
        </HomeLayout>
    )
}

export default Checkout;