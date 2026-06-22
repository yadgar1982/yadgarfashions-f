import { Button, Image, Table } from "antd";
import useSWR from "swr";
import { useState, useEffect } from "react";
import { calculateCartTotals, fetchData, getStatusMessage } from "../../../../../module/http";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setTotalPrice } from "../../../../../redux/slices/totalPrice.slice";
import { nextStep } from "../../../../../redux/slices/steps.slice";
import { setOrderDetail } from "../../../../../redux/slices/orderDetail.slice";
import { useTranslation } from "react-i18next";
const OrderSummary = () => {
    const { t } = useTranslation('checkout');
    // dispath 
    const dispatch = useDispatch();
    // exchange data from redux
    const exchangeSlice = useSelector(res => res.exchangeSlice);
    // get userinfo from storage
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const customerAddress = JSON.parse(localStorage.getItem("customerAddress"));

    // state collections
    const [loader, setLoader] = useState(false);
    const [inLoader, setInLoader] = useState(false);
    const [dLoader, setDLoader] = useState(false);
    const [finalQty, setFinalQty] = useState(0);
    const [finalPrice, setFinalPrice] = useState(0);
    const [finalDiscount, setFinalDiscount] = useState(0);
    const [finalDCharge, setFinalDCharge] = useState(0);
    const [saleTax, setSaleTax] = useState(0);
    const [otherTax, setOtherTax] = useState(0);
    const [finalTax, setFinalTax] = useState(0);

    // fetch cart data from api
    const { data: carts, error: cartError } = useSWR(
        `/api/cart/user?userId=${userInfo?.userId}`,
        fetchData,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            refreshInterval: 1200000,
        }
    );

    useEffect(() => {
        const {
            totalQty,
            totalDiscount,
            totalDelivery,
            totalPrice,
            totalSaleTax,
            totalOtherTax
        } = calculateCartTotals(carts ? carts?.carts : []);
        setFinalQty(totalQty);
        setFinalPrice(totalPrice);
        setFinalDiscount(totalDiscount);
        setFinalDCharge(totalDelivery);
        setSaleTax(totalSaleTax);
        setOtherTax(totalOtherTax);
    }, [carts]);

    useEffect(() => {
        let totalTax = (Number(saleTax + otherTax) * Number(finalPrice)) / 100;
        // (Number(finalPrice) * totalTaxAmount) / 100;
        setFinalTax(totalTax);
    }, [finalPrice]);

    // table columns
    const columns = [
        {
            title: <span>{t("Product")}</span>,
            render: (_, obj, index) => (
                <Image
                    src={obj.productImage}
                    width={40}
                    preview={false}
                />
            ),
            key: "product"
        },
        {
            title: <span>{t("Item Name")}</span>,
            dataIndex: "productName",
            key: "productName"
        },
        {
            title: <span>{t("Item Price")}</span>,
            dataIndex: "productFinalPrice",
            key: "productFinalPrice",
            render: (price) => `${exchangeSlice?.currency} ` + (price * exchangeSlice?.rate)
        },
        {
            title: <span>{t("Quantity")}</span>,
            dataIndex: "productQty",
            key: "quantity"
        },
        {
            title: <span>{t("Amount")}</span>,
            dataIndex: "amount",
            key: "amount",
            fixed: "right",
            render: (_, obj) => {
                const total = (obj.productQty * obj.productFinalPrice);
                const rate = exchangeSlice?.rate; // fallback to 1 if undefined
                return `${exchangeSlice?.currency} ` + (total * rate).toFixed(2);
            }
        },
    ]



    // lets prepare the order details

    // adding address with each product
    let statusMessage = getStatusMessage("pending");
    let step = {
        title: <span>{t("Pending")}</span>,
        description: statusMessage
    }
    const orderDetails = carts && carts?.carts.map((items) => ({
        ...items,
        statusDetails: [step],
        userAddress: customerAddress.address,
        totalPrice: (finalPrice + finalDCharge + finalTax)

    }));



    // proceeds with payment
    const proceedWithPayment = () => {
        dispatch(nextStep(3));
        dispatch(setTotalPrice(Number(finalPrice + finalDCharge + finalTax).toFixed(2)));
        dispatch(setOrderDetail(orderDetails));
    }


    return (
        <div className="grid md:grid-cols-6">
            <div></div>
            <div
                style={{ overflowX: 'auto' }}
                className="bg-white p-2 md:p-4 md:col-span-4">
                <h2
                    className="mb-5 text-xl md:text-2xl font-bold text-center p-2 bg-[#c68e17] text-white font-semibold w-full mb-1"
                >
                    {t('Order Summary')}
                </h2>
                <h2 className="text-center  text-1xl md:text-xl mb-5">
                    {t('Please take a moment to review your order.')}
                </h2>
                <div className="border p-4 mb-3 flex items-center text-[#3d3100] justify-start">
                    <b>
                        {t('Address')} : {customerAddress?.address}
                    </b>
                </div>
                <Table
                    columns={columns}
                    dataSource={carts && carts?.carts}
                    pagination={false}
                    scroll={{ x: 'max-content' }}
                />
                <div className="border shadow pb-3 p-2" style={{ height: "fit-content" }}>
                    <div className="flex justify-between items">
                        <h2 className="p-2 text-xl text-nowrap text-[#3d3100]">
                            {(t('Price Details'))}
                        </h2>
                        <h2 className="p-2 text-xs text-[red]">
                            amounts ≥ 1.5 are rounded up to 2, amounts ≤ 1.49 are rounded down to 1
                        </h2>
                    </div>
                    <div className="mb-4 flex flex-col gap-5 border-t text-sm border-b p-4">
                        <div className="flex justify-between items-center">
                            <b>{t('Total Quantity')}</b>
                            <b>{finalQty}</b>
                        </div>
                        <div className="flex justify-between items-center">
                            <b>{t('Total Price')}</b>
                            <b>{exchangeSlice?.currency} {((+finalPrice) * (exchangeSlice.rate)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</b>
                        </div>
                        <div className="flex justify-between items-center">
                            <b>{t('Discount')}</b>
                            <del className="text-gray-500">
                                {exchangeSlice?.currency} {((+finalDiscount) * (exchangeSlice.rate)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </del>
                        </div>
                        <div className="flex justify-between items-center">
                            <b>{t('Delivery Charge')}</b>
                            <b className="text-green-500">
                                {exchangeSlice?.currency} {((+finalDCharge) * (exchangeSlice.rate)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </b>
                        </div>
                        <div className="flex justify-between items-center">
                            <b>{t('Taxes')}</b>
                            <b className="text-green-500">
                                {exchangeSlice?.currency} {((+finalTax) * (exchangeSlice.rate)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </b>
                        </div>
                        <div className="flex justify-between items-center">
                            <b>{t('Total Amount')}</b>
                            <b className="text-green-500">
                                {exchangeSlice?.currency} {((+finalPrice + finalDCharge + finalTax) * (exchangeSlice.rate)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </b>
                        </div>
                    </div>
                </div>
                <Button
                    onClick={proceedWithPayment}
                    className="text-sm md:text-lg bg-green-500 mt-3 p-4 w-full text-white font-semibold"
                >
                    <div className="flex gap-4">
                        <div>
                            {t('PROCEED WITH PAYMENT')}
                        </div>  {exchangeSlice?.currency}  {((+finalPrice + finalDCharge + finalTax) * (exchangeSlice.rate)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                </Button>
            </div>
        </div>
    )
}
export default OrderSummary;