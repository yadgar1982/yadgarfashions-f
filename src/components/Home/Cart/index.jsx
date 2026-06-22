import { DeleteOutlined, MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import HomeLayout from "../../Shared/HomeLayout";
import { Button, Empty, Image, Input, message, Popconfirm, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useSWR, { mutate } from "swr";
import { useSelector } from "react-redux";
import { calculateCartTotals, fetchData, http } from "../../../../module/http";

//translation imported
import { useTranslation } from 'react-i18next';
import { toast } from "react-toastify";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
};
const Cart = () => {
    // get token from cookies
    const token = cookies.get("authToken");

    const { t } = useTranslation('cart');
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    // exchange data from redux
    const exchangeSlice = useSelector(res => res.exchangeSlice);

    // states collections 
    const [loader, setLoader] = useState(false);
    const [inLoader, setInLoader] = useState(false);
    const [dLoader, setDLoader] = useState(false);
    const [finalQty, setFinalQty] = useState(0);
    const [finalPrice, setFinalPrice] = useState(0);
    const [finalDiscount, setFinalDiscount] = useState(0);
    const [finalDCharge, setFinalDCharge] = useState(0);
    const [totalSTax, setTotalSTax] = useState(0);
    const [totalOTax, setTotalOTax] = useState(0);
    const [finalTax, setFinalTax] = useState(0);
    const [totalKg, setTotalKg] = useState(0);
    const [no, setNo] = useState(0);

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
            totalSaleTax,
            totalOtherTax,
            totalPrice,
            totalKg
        } = calculateCartTotals(carts ? carts?.carts : []);
        setFinalQty(totalQty);
        setFinalPrice(totalPrice);
        setFinalDiscount(totalDiscount);
        setFinalDCharge(totalDelivery);
        setTotalKg(totalKg);
        setTotalSTax(totalSaleTax);
        setTotalOTax(totalOtherTax);
    }, [carts]);

    // fetch all tax
    const { data: taxes, error: taxErr } = useSWR(
        "/api/tax/all",
        fetchData,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            refreshInterval: 1200000,
        }
    )


    useEffect(() => {
        let STax = ((Number(finalPrice) * (totalSTax)) / 100);
        let OtherTax = ((Number(finalPrice) * (totalOTax)) / 100);
        setFinalTax(STax + OtherTax);
    }, [finalPrice]);


    //get country:
    const dlvDuration = JSON.parse(localStorage.getItem("dlvDuration"));


    // increase qty
    const increase = async (cart, index) => {
        try {
            let kg = cart.productUnit * (cart.productQty + 1);
            let dlvCost = 0;
            dlvCost = kg >= 2 ? Number(cart.deliveryCostUnit) * kg : Number(cart.deliveryCostUnit) * (2 * kg);
            setNo(index);
            setInLoader(true);
            const finalObj = {
                productQty: Number(cart?.productQty) + 1,
                deliveryCost: dlvCost
            }
            const httpReq = http(token);
            await httpReq.put(`/api/cart/update/${cart?._id}`, finalObj);
            mutate(`/api/cart/user?userId=${userInfo?.userId}`);
        } catch (error) {
            toast.error("Unable to increase qty !");
        } finally {
            setInLoader(false);
        }
    }

    // decrease qty
    //cart?._id, cart?.productQty, cart?.deliveryCost, cart?.deliveryCostUnit
    const decrease = async (cart, index) => {
        let kg = cart?.productUnit * (cart?.productQty - 1);
        let dlvCost = 0;
        dlvCost = kg >= 2 ? Number(cart?.deliveryCostUnit) * kg : Number(cart.deliveryCostUnit) * (2 * kg);
        try {
            setNo(index);
            setDLoader(true);
            if (cart.productQty === 1) return false;
            const finalObj = {
                productQty: Number(cart?.productQty) - 1,
                deliveryCost: dlvCost
            }
            const httpReq = http(token);
            await httpReq.put(`/api/cart/update/${cart?._id}`, finalObj);
            mutate(`/api/cart/user?userId=${userInfo?.userId}`);
        } catch (error) {
            toast.error("Unable to decrease qty !");
        } finally {
            setDLoader(false);
        }
    }

    // remove from cart
    const removeCartData = async (id) => {
        try {
            setLoader(true);
            const httpReq = http(token);
            await httpReq.delete(`/api/cart/delete/${id}`);
            toast.success("Product removed from cart !");
            mutate(`/api/cart/user?userId=${userInfo?.userId}`);
            mutate(`/api/cart/count?userId=${userInfo?.userId}`);
        } catch (err) {
            toast.error("Unable to remove cart data !");
        } finally {
            setLoader(false);
        }
    }

    return (
        <HomeLayout >
            {
                carts && carts?.carts?.length === 0 ?
                    <div className="w-full h-full flex justify-center items-center">
                        <Empty />
                    </div>
                    :
                    <div className="grid md:grid-cols-3 gap-3 ">
                        <div className="p-4 md:p-0 flex flex-col gap-3 md:col-span-2 ">
                            {
                                carts && carts?.carts.map((cart, index) => (
                                    <div key={index} className="border shadow">
                                        <div className="flex md:flex-row flex-col gap-5 p-2 md:p-9 !min-h-[370px]">
                                            <div className="flex flex-col gap-3  items-center md:items-left">
                                                <Image
                                                    width={140}
                                                    src={cart?.productImage}
                                                />
                                                <div className="flex gap-2">
                                                    <Button
                                                        loading={no === index ? dLoader : false}
                                                        type="text"
                                                        icon={<MinusCircleOutlined />}
                                                        shape="circle"
                                                        onClick={() => decrease(cart, index)}
                                                        className="text-[#3d3100]"
                                                    />
                                                    <Input
                                                        className="w-[50px] text-center"
                                                        value={cart?.productQty}
                                                        min={1}
                                                        readOnly
                                                    />
                                                    <Button
                                                        loading={no === index ? inLoader : false}
                                                        type="text"
                                                        className="text-[#3d3100]"
                                                        icon={<PlusCircleOutlined />}
                                                        shape="circle"
                                                        onClick={() => increase(cart, index)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-col text-[#3d3100]">
                                                <b className="mb-1">
                                                    {cart?.productName}
                                                </b>
                                                <div className="mb-1 flex gap-1">
                                                    <b>{(t('Size'))} : </b> <p>{cart?.productSize}</p>
                                                </div>
                                                <div className="mb-1 flex gap-1">
                                                    <b>{(t('Color'))} : </b> <p style={{ background: cart?.productColor }} className="w-[40px] h-[30px] rounded"></p>
                                                </div>
                                                <div className="mb-1 flex gap-1">
                                                    <b>{(t('Delivery Type'))} : </b>
                                                    <p>
                                                        {cart?.deliveryType === "expressDurationCost" ? "Express" : "Normal"}
                                                    </p>
                                                </div>
                                                <div className="mb-1 mt-2 md:mt-5 flex gap-3">
                                                    <b>
                                                        {exchangeSlice.currency} {((+cart?.productFinalPrice) * (exchangeSlice.rate)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                    </b>
                                                    <del>
                                                        {cart?.productDiscountPercent > 0 && (
                                                            <>
                                                                {exchangeSlice.currency}{" "}
                                                                {(+cart?.productRealPrice * exchangeSlice.rate).toLocaleString(undefined, {
                                                                    minimumFractionDigits: 2
                                                                })}
                                                            </>
                                                        )}
                                                    </del>
                                                    {
                                                        cart?.productDiscountPercent > 0 &&
                                                        <b className="text-green-500">
                                                            {cart?.productDiscountPercent} % {(t('off'))}
                                                        </b>
                                                    }
                                                </div>
                                                <div className="mb-1 mt-3 md:mt-[50px] flex gap-3">
                                                    <Popconfirm
                                                        title="Do you want to delete ?"
                                                        onCancel={() => toast.info("Cart data  is safe !")}
                                                        icon={<DeleteOutlined className="!text-red-500" />}
                                                        onConfirm={() => removeCartData(cart?._id)}
                                                    >
                                                        <Button
                                                            loading={loader}
                                                            icon={<DeleteOutlined />}
                                                            className="bg-[#C68E17] font-semibold text-white"
                                                        >
                                                            {(t('Remove'))}
                                                        </Button>
                                                    </Popconfirm>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="p-4 md:p-0 border shadow pb-3 p-2" style={{ height: "fit-content" }}>
                            <div className="flex justify-between items">
                                <h2 className="p-2 text-xl text-nowrap text-[#3d3100]">
                                    {(t('Price Details'))}
                                </h2>
                                <h2 className="p-2 text-xs text-[red]">
                                    amounts ≥ 1.5 are rounded up to 2, amounts ≤ 1.49 are rounded down to 1
                                </h2>
                            </div>
                            <div className="mb-4 flex flex-col gap-5 border-t border-b p-4">
                                <div className="flex justify-between items-center">
                                    <b>{(t('Total Quantity'))}</b>
                                    <b>{finalQty}</b>
                                </div>
                                <div className="flex justify-between items-center text-[#3d3100]">
                                    <b>{(t('Total Price'))}</b>
                                    <b>{exchangeSlice.currency} {((+finalPrice) * (exchangeSlice.rate)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</b>
                                </div>
                                <div className="flex justify-between items-center">
                                    <b>{(t('Discount'))}</b>
                                    <b className="text-gray-500">
                                        <del>{exchangeSlice.currency} {((+finalDiscount) * (exchangeSlice.rate)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</del>
                                    </b>
                                </div>
                                <div className="flex justify-between items-center">
                                    <b>{(t('Delivery Charge'))}</b>
                                    <b className="text-green-500">
                                        {exchangeSlice?.currency} {((+finalDCharge ? finalDCharge : 0) * (exchangeSlice.rate)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </b>
                                </div>
                                <div className="flex justify-between items-center">
                                    <b>{(t('Taxes'))}</b>
                                    <b className="text-green-500">
                                        {exchangeSlice.currency} {((finalTax ? finalTax : 0) * (exchangeSlice.rate)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </b>
                                </div>
                                <div className="flex justify-between items-center">
                                    <b>{(t('Total Amount'))}</b>
                                    <b className="text-green-500">
                                        {exchangeSlice.currency} {((finalPrice + finalDCharge + finalTax) * (exchangeSlice.rate)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </b>
                                </div>
                            </div>
                            <Tooltip
                                title="click here for checkout"
                                color="#3d3100"
                            >
                                <Link to="/checkout">
                                    <Button
                                        className="bg-[#C68E17] font-semibold text-white w-full"
                                    >
                                        {(t('CHECKOUT'))}
                                    </Button>
                                </Link>
                            </Tooltip>
                        </div>
                    </div>
            }
        </HomeLayout>
    )
}
export default Cart;