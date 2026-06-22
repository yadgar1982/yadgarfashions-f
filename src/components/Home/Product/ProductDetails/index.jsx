import { useEffect, useState } from "react";
import HomeLayout from "../../../Shared/HomeLayout";
import "./style.css"
import { Avatar, Button, Image, Radio, Rate, Flex, Progress, Select, Form, Card, Input, Modal, Tabs, message, } from "antd";
import { BgColorsOutlined, ClockCircleOutlined, FieldTimeOutlined, TruckOutlined, UserOutlined } from "@ant-design/icons";
import { fetchData, formatDate, getDateAfterDays, http, trimData } from "../../../../../module/http";
import useSWR, { mutate } from "swr";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import ProductSlide from "../slideShow";
//translation imported
import { useTranslation } from 'react-i18next';
import { toast } from "react-toastify";
import TextArea from "antd/es/input/TextArea";
import Item from "antd/es/list/Item";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const ProductDetails = () => {
    // get token from cookies
    const token = cookies.get("authToken");

    const { t } = useTranslation('productDetails');


    // exchange data from redux
    const exchangeSlice = useSelector(res => res.exchangeSlice);
    const dlvDuration = JSON.parse(localStorage.getItem("dlvDuration"));

    // get user info from localstorage
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    // get params
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const productId = searchParams.get("productId");


    // form variables
    const [womenForm] = Form.useForm();
    const [menForm] = Form.useForm();
    const [waistForm] = Form.useForm();

    // states collections
    const [productDetail, setProductDetail] = useState({});
    const [imageSrc, setImageSrc] = useState(null)
    const [sizeOfCloth, setSizeOfCloth] = useState(null);
    const [colorOfCloth, setColorOfCloth] = useState(null);
    const [dealerId, setDealerId] = useState(null);
    const [customModalm, setCustomModalm] = useState(false);
    const [customModalw, setCustomModalw] = useState(false);
    const [waistCoatModal, setWaistCoatModal] = useState(false);
    const [loader, setLoader] = useState(false);
    const [refSizeId, setRefSizeId] = useState(null);
    const [refSizeModel, setRefSizeModel] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
        position: ['bottomCenter']
    });



    // fetch category data from api
    const { data: product, error: pError } = useSWR(`/api/product/id/${productId}`, fetchData);
    const { data: ratings, error: rError } = useSWR(`/api/rating/product/${productId}`, fetchData);

    // get average of ratings
    const totalRate = ratings && ratings.reduce((acc, item) => acc + Number(item.rating), 0);


    // fetch dealers from dealers
    const dealers = useSelector(res => res.dealer.dealers);

    // fetch limited products by categoryId
    const fetchProductsByCategory = async (categoryId, page = 1, pageSize = 10) => {
        try {
            setLoading(true);
            const httpReq = http();
            const response = await httpReq.get(`/api/product/category/${categoryId}?page=${page}&limit=${pageSize}`);
            const { data, total } = response.data;
            setProducts(data);
            setPagination(prev => ({
                ...prev,
                current: page,
                pageSize: pageSize,
                total: total
            }));
        } catch (error) {
            console.log("Error fetchings products", error)
        } finally {
            setLoading(false);
        }
    }

    // filter product from products list
    useEffect(() => {
        if (product) {
            setProductDetail(product);
            setImageSrc(product?.images[0]);
            fetchProductsByCategory(product.categoryId, pagination.current, pagination.pageSize);
        }
    }, [product]);

    // Get size of cloths & open custom model
    const getSizeOfClothFunc = (e) => {
        const value = e.target.value.toLowerCase();
        setSizeOfCloth(value);

        const sizingType = productDetail?.sizingType?.toLowerCase();

        if (value === "custom") {
            if (sizingType === "women-size") setCustomModalw(true);
            if (sizingType === "men-size") setCustomModalm(true);
            if (sizingType === "coat-size") setWaistCoatModal(true);
        }
    };


    // close custom model
    const closeCustomModalw = () => {
        //setSizeOfCloth("M");
        setCustomModalw(false);
    }

    // prepare for add to cart 
    const addToCartFunc = async (obj) => {
        let kg = product?.productUnit * 1;
        let dlvCost = 0;
        dlvCost = kg >= 2 ? Number(dlvDuration["normalDurationCost"]) * kg : Number(dlvDuration["normalDurationCost"]) * (2 * kg);
        let salesTax = 0;
        salesTax = (dlvDuration['saleTax']);
        delete obj._id;
        /* if (!selectedDlvType)
            return toast.warning(t("Please select delivery type.")) */
        if (!sizeOfCloth)
            return toast.warning(t("Please select size."))
        if (sizeOfCloth === "custom" && refSizeId === null)
            return toast.warning(t("Please fill custom size form."))
        if (!colorOfCloth)
            return toast.warning(t("Please select color."))
        try {
            let cartObj = {
                userId: userInfo.userId,
                productName: obj.productName,
                deliveryType: "normalDurationCost",
                deliveryCostUnit: dlvDuration["normalDurationCost"],
                deliveryCost: dlvCost,
                saleTax: dlvDuration['saleTax'],
                otherTax: dlvDuration['otherTax'],
                productUnit: product?.productUnit,
                productQty: 1,
                productRealPrice: obj.realPrice,
                productDiscountPercent: obj.discountPercent,
                productFinalPrice: obj.finalPrice,
                sizingType: obj.sizingType,
                supplierId: obj.supplierId,
                productCost: obj.productCost,
                productSize: sizeOfCloth,
                productColor: colorOfCloth,
                productImage: imageSrc,
                productId,
                dealerId,
                refSizeId,
                refSizeModel,
            }
            setLoader(true);
            const httpReq = http(token);
            await httpReq.post("/api/cart/create", cartObj);;
            toast.success(
                "Please check your cart !",
                { position: 'top-left' }
            );
            mutate(`/api/cart/count?userId=${userInfo?.userId}`);
        } catch (error) {
            toast.error(message?.response?.data?.message);
        } finally {
            setLoader(false);
        }
    }

    // men sizing and store in database
    const menSizing = async (values) => {
        const isEmpty = Object.values(values).every(
            (val) => val === undefined || val === null || val === ""
        );

        if (isEmpty) {
            toast.error("enter your custom size");
            return
        }
        try {
            setLoader(true);
            values.userId = userInfo?.userId;
            values.productId = productId;
            const httpReq = http(token);
            const { data } = await httpReq.post("/api/men-size/create", values);
            setRefSizeId(data?.menSize?._id);
            setRefSizeModel("Mensize");
            toast.success("Your custom sizing is stored !");
            womenForm.resetFields();
            setCustomModalm(false);
        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally {
            setLoader(false);
        }
    }

    // waist coat sizing and store in database
    const waistCoatSizing = async (values) => {
        const isEmpty = Object.values(values).every(
            (val) => val === undefined || val === null || val === ""
        );

        if (isEmpty) {
            toast.error("enter your custom size");
            return
        }
        try {
            setLoader(true);
            values.userId = userInfo?.userId;
            values.productId = productId;
            const httpReq = http(token);
            const { data } = await httpReq.post("/api/coat-size/create", values);
            setRefSizeId(data?.coatSize?._id);
            setRefSizeModel("Coatsize");
            toast.success("Your custom sizing is stored !");
            womenForm.resetFields();
            setWaistCoatModal(false);
        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally {
            setLoader(false);
        }
    }

    // women sizing and store in database
    const womenSizing = async (values) => {
        const isEmpty = Object.values(values).every(
            (val) => val === undefined || val === null || val === ""
        );

        if (isEmpty) {
            toast.error("enter your custom size");
            return
        }
        try {
            setLoader(true);
            values.userId = userInfo?.userId;
            values.productId = productId;
            const httpReq = http(token);
            const { data } = await httpReq.post("/api/women-size/create", values);
            setRefSizeId(data?.womenSize?._id);
            setRefSizeModel("Womensize");
            toast.success("Your custom sizing is stored !");
            womenForm.resetFields();
            setCustomModalw(false);
        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally {
            setLoader(false);
        }


    }


    return (
        <HomeLayout>
            <div className="mb-5 grid md:grid-cols-2 gap-3">
                <div className="p-4 md:p-4 flex flex-col  items-start justify-center">
                    <div className=" flex justify-center gap-5  w-[100%] ">
                        <div>
                            <Image
                                //preview={false}
                                src={imageSrc}

                                className="md:!w-[100%]"
                            />

                        </div>


                    </div>
                    <div className="gap-3 mt-3  w-full  w-[100%] flex !justify-center ">
                        {
                            productDetail && productDetail?.images?.map((img, index) => (
                                <Image
                                    key={index}
                                    className=" !w-[50px]  lg:!w-[100px] cursor-pointer"
                                    preview={false}
                                    src={img}
                                    // width={50}
                                    onClick={() => setImageSrc(img)}
                                />
                            ))
                        }
                    </div>

                </div>
                <div className="p-4 md:p-0 ">
                    <h2 className="font-bold text-sm md:text-xl text-[#666049]">
                        {capitalizeFirstLetter(t(productDetail?.productName))}
                    </h2>
                    <p className="text-sm font-semibold text-[#666049]">
                        {capitalizeFirstLetter(t(productDetail?.desc?.slice(0, 50)))}
                    </p>
                    <div className="flex mt-1 gap-3 text-[#666049] ">
                        <b>{exchangeSlice?.currency} {((+productDetail?.finalPrice) * (exchangeSlice?.rate)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</b>
                        <del className="text-zinc-400">
                            <b>{exchangeSlice?.currency} {((+productDetail?.realPrice) * (exchangeSlice?.rate)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</b>
                        </del>
                        <b className="text-green-600">
                            {(+productDetail?.discountPercent).toLocaleString(undefined, { minimumFractionDigits: 2 })}% {capitalizeFirstLetter(t("off"))}
                        </b>
                    </div>
                    <div className="mt-3 flex gap-3">
                        <Rate allowHalf value={Number((totalRate / ratings?.length).toFixed(1))} />
                        <p className="font-semibold text-[#666049]">
                            {ratings?.length} {capitalizeFirstLetter(t("ratings"))}</p>
                        {/* <p className="font-semibold text-zinc-500">599 {capitalizeFirstLetter(t("reviews"))}</p> */}
                    </div>
                    <div className="mt-8 text-[#666049]">
                        <b>{capitalizeFirstLetter(t("Size Chart"))}</b>
                    </div>
                    <div className="mt-2 flex gap-3 mb-4">
                        <Radio.Group
                            value={sizeOfCloth}
                            onChange={getSizeOfClothFunc}
                            buttonStyle="solid"
                            className="radio-group-custom text-[#666049]"
                        >
                            {productDetail?.clothSize?.map((size) => (
                                <Radio.Button
                                    key={size}
                                    value={size.toLowerCase()}
                                    onClick={(e) => {
                                        if (size.toLowerCase() === "custom" && sizeOfCloth === "custom") {
                                            // already selected → still open modal
                                            getSizeOfClothFunc(e); // pass event so value updates
                                        }
                                    }}
                                >
                                    {size}
                                </Radio.Button>
                            ))}
                        </Radio.Group>
                    </div>

                    <div className=" flex gap-3 md:flex-row flex-col">
                        <div className="flex flex-col gap-y-1">
                            <label className="font-semibold flex items-center">{capitalizeFirstLetter(t("select color:"))}</label>
                            <div className="items-center flex gap-1">
                                <span className="!bg-pink-500 text-white flex justify-center text-lg w-[35px] h-8 !rounded-[2px]"> <BgColorsOutlined /></span>
                                <Select
                                    style={{ width: 150 }}
                                    title="Select Color"
                                    onChange={(value) => setColorOfCloth(value)}
                                    dropdownRender={menu => <div>{menu}</div>}
                                >
                                    {productDetail?.clothColor?.map((color, index) => (
                                        <Option key={index} value={color}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <div
                                                    style={{
                                                        width: "100%",
                                                        height: 25,
                                                        backgroundColor: color,
                                                        borderRadius: 5,
                                                        border: '1px solid #ccc',
                                                    }}
                                                />
                                                {/* <span>{color}</span> */}
                                            </div>
                                        </Option>
                                    ))}
                                </Select>

                            </div>
                        </div>
                        <div className="flex flex-col gap-y-1">
                            <label className="font-semibold flex items-center">{capitalizeFirstLetter(t("referred by an agent? select here"))}</label>
                            <Select
                                showSearch
                                style={{ width: 200 }}
                                placeholder="Select dealer"
                                defaultValue="none"
                                onChange={(value) => setDealerId(value)}
                            >
                                {
                                    dealers && dealers?.dealers?.map((item) => (
                                        <Select.Option
                                            key={item?._id}
                                            value={item?._id}
                                        >
                                            {item?.dealerName}
                                        </Select.Option>
                                    ))
                                }
                            </Select>
                        </div>
                    </div>

                    <Button
                        loading={loader}
                        //type="text"
                        className="!text-white !font-semibold !bg-[#C68E17] !mt-5 !border !border-lg !rounded w-full hover:!bg-[#D4AF37] hover:!border-[#D4AF37]"
                        onClick={() => addToCartFunc(productDetail)}
                    >
                        {capitalizeFirstLetter(t("add to cart"))}
                    </Button>
                    <div className="mt-5 ">
                        <div className="grid md:grid-cols-2 gap-3 mb-4">
                            <div>
                                <div className="my-4 md:text-lg text-[#666049]">
                                    <b>{capitalizeFirstLetter(t("Normal Order Normal Delivery"))}</b>
                                </div>
                                <div className="flex gap-3 text-[#3d3100]"> <ClockCircleOutlined className="text-2xl mb-2 text-[#C68E17]" />
                                    <p>
                                        {capitalizeFirstLetter(t("time to ship:"))}&nbsp;

                                        {dlvDuration?.normalDurationValue}
                                        &nbsp;{capitalizeFirstLetter(t(dlvDuration?.durationUnit).toLowerCase())}
                                    </p>
                                </div>
                                <div className="flex gap-3 mb-2" text-zinc-600> <TruckOutlined className="text-2xl text-[#C68E17] " />
                                    <p>
                                        {capitalizeFirstLetter(t("estimated delivery:"))}&nbsp;
                                        {
                                            getDateAfterDays(
                                                dlvDuration?.normalDurationValue,
                                                dlvDuration?.durationUnit
                                            )
                                        }
                                    </p>
                                </div>
                            </div>
                            <div>
                                <div className="my-4 md:text-lg text-[#666049]">
                                    <b>{capitalizeFirstLetter(t("Custom Order Normal Delivery"))}</b>
                                </div>
                                <div className="flex gap-3 text-[#3d3100]"> <FieldTimeOutlined className="text-2xl mb-2 text-[#C68E17]" />
                                    <p className="text-[#3d3100]">
                                        {capitalizeFirstLetter(t("time to ship:"))}&nbsp;

                                        {dlvDuration?.normalDurationValue + productDetail.normalDurationDays}
                                        &nbsp;{capitalizeFirstLetter(t(dlvDuration?.durationUnit).toLowerCase())}
                                    </p>
                                </div>
                                <div className="flex gap-3 mb-2" text-zinc-600> <TruckOutlined className="text-2xl text-[#C68E17] " />
                                    <p className="text-[#3d3100]">
                                        {capitalizeFirstLetter(t("estimated delivery:"))}&nbsp;
                                        {
                                            getDateAfterDays(
                                                (dlvDuration?.normalDurationValue + productDetail.normalDurationDays),
                                                dlvDuration?.durationUnit
                                            )
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="mt-5 ">
                        <b className=" text-sm md:text-xl text-[#666049]">
                            {capitalizeFirstLetter(t("details"))}
                        </b>
                        <p className="text-[#3d3100]">
                            {capitalizeFirstLetter(t(productDetail?.desc))}
                        </p>
                    </div>
                    <div className="mt-5">
                        <b className="md:text-xl text-[#666049]">
                            {capitalizeFirstLetter(t("hilights"))}
                        </b>
                        <div className="text-[#3d3100]"
                            dangerouslySetInnerHTML={{
                                __html: capitalizeFirstLetter(t(productDetail?.highlights || '')),
                            }}
                        ></div>
                    </div>
                </div>
            </div>
            <div className="border border-zinc-200 p-4 md:p-8 mb-16 mx-4 md:mx- mt-9 grid md:grid-cols-5 gap-9">
                <div className="border border-zinc-100 md:col-span-2 p-4 overflow-y-auto max-h-[400px]">
                    <b className="text-xl mb-5 text-[#666049]">{capitalizeFirstLetter(t("Recent Reviews & Rating").toLowerCase())}</b>
                    {
                        ratings && ratings.length > 0 && ratings?.map((rate, index) => (
                            <div className="flex mt-5 gap-3">
                                <Avatar src={rate?.profile || "https://tse2.mm.bing.net/th?id=OIP.HendJ0HBV7N8_7ozAh3eNAHaHk&pid=Api&P=0&h=180"} />
                                <div>
                                    <b>{rate?.fullname}</b>
                                    <p className="font-semibold text-xs">
                                        {
                                            formatDate(rate.createdAt)
                                        }
                                    </p>
                                    <Rate allowHalf value={rate.rating} className="text-sm" />
                                    <p>
                                        {rate.comment}
                                    </p>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className="md:col-span-3 md:ml-16">
                    <b className="text-xl mb-5 !text-[#666049]">{capitalizeFirstLetter(t("product ratings").toLowerCase())}</b>
                    <div className="flex gap-2 mt-2">
                        <Rate allowHalf value={Number((totalRate / ratings?.length).toFixed(1))} />
                        <p className="!text-[#666049]">
                            {totalRate ? (totalRate / ratings?.length).toFixed(1) : 0} {capitalizeFirstLetter(t("Average Ratings").toLowerCase())}</p>
                    </div>
                    <div className="mt-5">
                        <div className="grid grid-cols-4">
                            <div className="flex flex-col gap-3">
                                <b className="!text-[#666049]">{capitalizeFirstLetter(t("Excellent").toLowerCase())}</b>
                                <b className="!text-[#666049]">{capitalizeFirstLetter(t("Very Good").toLowerCase())}</b>
                                <b className="!text-[#666049]">{capitalizeFirstLetter(t("Good").toLowerCase())}</b>
                                <b className="!text-[#666049]">{capitalizeFirstLetter(t("Average").toLowerCase())}</b>
                                <b className="!text-[#666049]">{capitalizeFirstLetter(t("Poor").toLowerCase())}</b>

                            </div>
                            <div className="flex flex-col gap-3 md:col-span-2 col-span-3">
                                <Progress showInfo={false} strokeColor="green" percent={(totalRate / ratings?.length) > 4 ? 100 : 90} />
                                <Progress showInfo={false} strokeColor="blue" percent={(totalRate / ratings?.length) > 3 && 70} />
                                <Progress showInfo={false} strokeColor="indigo" percent={(totalRate / ratings?.length) > 2 && 60} />
                                <Progress showInfo={false} strokeColor="orange" percent={(totalRate / ratings?.length) > 1 && 50} />
                                <Progress showInfo={false} strokeColor="red" percent={(totalRate / ratings?.length) >= 0 && 40} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* women custom size modal */}
            <Modal
                open={customModalw}
                onCancel={closeCustomModalw}
                footer={null}
                title={null}       // hide default title
                closable={false}
                className="!w-[95%] md:!w-[80%] "
                bodyStyle={{ padding: 0 }}
            >
                <div className="bg-[#C68E17] text-white font-bold text-lg px-6 py-4 flex justify-between items-center rounded-t-[4px]">
                    {t('Women Custom Stitched in Inches')}
                    <button
                        onClick={closeCustomModalw}
                        className="text-white hover:text-gray-200 text-xl font-bold"
                    >
                        ×
                    </button>
                </div>
                <div className="md:flex md:justify-between mt-4">
                    <Form form={womenForm} onFinish={womenSizing} layout="vertical" className="p- md:w-[68%]">
                        <div className="grid md:grid-cols-4 grid-cols-2 gap-1">
                            <Form.Item name="neckBackSize" label={t("Back Neck Depth")}>
                                <Input placeholder="اندازه عمق یخن عقب به انچ" className="border !border-[#C68E17] rounded-[2px]" size="large" />
                            </Form.Item>
                            <Form.Item name="neckFrontSize" label={t('Front Neck Depth')}>
                                <Input placeholder="اندازه عمق یخن پیش رو به انچ" className="border !border-[#C68E17] rounded-[2px]" size="large" />
                            </Form.Item>
                            <Form.Item name="sleeveLengthSize" label={t("Sleeve Length")}>
                                <Input placeholder="اندازه طول آستین به انچ" className="border !border-[#C68E17] rounded-[2px]" size="large" />
                            </Form.Item>
                            <Form.Item name="armSize" label={t("Around Arm")}>
                                <Input placeholder="اندازه بازو به انچ" className="border !border-[#C68E17] rounded-[2px]" size="large" />
                            </Form.Item>
                            <Form.Item name="soulderWidthSize" label={t("Shoulder Width")}>
                                <Input placeholder="اندازه عرض شانه ها به انچ" className="border !border-[#C68E17] rounded-[2px]" size="large" />
                            </Form.Item>
                            <Form.Item
                                name="bustSize" label={t("Around Bust")}>
                                <Input placeholder="اندازه دور سینه به انچ" className="border !border-[#C68E17] rounded-[2px]" size="large" />
                            </Form.Item>
                            <Form.Item name="sleaveSize" label={t("Around Sleeve")}>
                                <Input placeholder="اندازه دور آستین انچ" className="border !border-[#C68E17] rounded-[2px]" size="large" />
                            </Form.Item>

                            <Form.Item name="armHoleSize" label={t("Arm Hole")}>
                                <Input placeholder="اندازه دور حلقه آستین بازو به انچ" className="border !border-[#C68E17] rounded-[2px]" size="large" />
                            </Form.Item>
                            <Form.Item name="waistSize" label={t("Around Waist")}>
                                <Input placeholder="اندازه دور کمر به انچ" className="border !border-[#C68E17] rounded-[2px]" size="large" />
                            </Form.Item>
                            <Form.Item name="hipsSize" label={t("Around Hips")}>
                                <Input placeholder="اندازه دور سرین یا باسن به انچ" className="border !border-[#C68E17] rounded-[2px]" size="large" />
                            </Form.Item>
                            <Form.Item name="thighsSize" label={t("Around Thigh")}>
                                <Input placeholder="اندازه ران پا به انچ" className="border !border-[#C68E17] rounded-[2px]" size="large" />
                            </Form.Item>
                            <Form.Item name="calfSize" label={t("Around Calf")}>
                                <Input placeholder="اندازه دور ساق پا به انچ" className="border !border-[#C68E17] rounded-[2px]" size="large" />
                            </Form.Item>

                            <Form.Item name="shirtLengthSize" label={t("Shirt Length")}>
                                <Input placeholder="اندازه طول پیراهن  به انچ" className="border !border-[#C68E17] rounded-[2px]" size="large" />
                            </Form.Item>
                            <Form.Item name="pantsLengthSize" label={t("Shalwar Length")}>
                                <Input placeholder="اندازه طول شلوار به انچ" className="border !border-[#C68E17] rounded-[2px]" size="large" />
                            </Form.Item>

                        </div>
                        <Form.Item name="otherDetails" label={t("Other Details")}>
                            <TextArea placeholder="درصورت ضرورت معلومات اضافی را اینجا وارد کنید" className="border !border-[#C68E17] rounded-[2px]" size="large" />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                loading={loader}
                                type="primary" htmlType="submit" block className="!bg-[#C68E17]">
                                {t("Submit")}
                            </Button>
                        </Form.Item>
                    </Form>

                    <div className="md:w-[30%] flex items-left p-2 items-center">
                        <Image preview={true} src="./women.jpg" className="w-full " alt="" />
                    </div>
                </div>
            </Modal>
            {/* men custom size modal */}
            <Modal
                open={customModalm}
                onCancel={() => setCustomModalm(false)}
                footer={null}
                title={null}       // hide default title
                closable={false}
                className="!w-[95%] md:!w-[80%] "
                bodyStyle={{ padding: 0 }}
            >
                <div className="bg-[#C68E17] text-white font-bold text-lg px-6 py-4 flex justify-between items-center rounded-t-[4px]">
                    {t('Men Custom Stitched in Inches')}
                    <button
                        onClick={() => setCustomModalm(false)}
                        className="text-white hover:text-gray-200 text-xl font-bold"
                    >
                        ×
                    </button>
                </div>
                <div className="grid md:grid-cols-3 gap-3 mt-4">
                    <div className="md:col-span-2">
                        <Form form={menForm} onFinish={menSizing} layout="vertical">
                            <div className="grid md:grid-cols-3 grid-cols-2 gap-x-1">
                                <Form.Item name="heightSize" label={t("Your Height")}>
                                    <Input placeholder="اندازه طول قد به انچ" className="border !border-[#C68E17] rounded-[2px]" size="large" />
                                </Form.Item>
                                <Form.Item name="shoulderSize" label={t("Shoulder Width")}>
                                    <Input placeholder="اندازه عرض شانه به انچ" className="border !border-[#C68E17] rounded-[2px]" size="large" />
                                </Form.Item>
                                <Form.Item name="sleeveSize" label={t("Sleeve Length")}>
                                    <Input placeholder="اندازه طول آستین" className="border !border-[#C68E17] rounded-[2px]" size="large" />
                                </Form.Item>
                                <Form.Item name="collarSize" label={t("Around Collar")}>
                                    <Input placeholder="اندازه دور یخن" className="border !border-[#C68E17] rounded-[2px]" size="large" />
                                </Form.Item>
                                <Form.Item name="waistSize" label={t("Around Waist")}>
                                    <Input placeholder="اندازه دور کمر به انچ" className="border !border-[#C68E17] rounded-[2px]" size="large" />
                                </Form.Item>
                                <Form.Item name="bustSize" label={t("Around Bust")}>
                                    <Input placeholder="اندازه دور بغل به انچ" className="border !border-[#C68E17] rounded-[2px]" size="large" />
                                </Form.Item>
                                <Form.Item name="hipsSize" label={t("Around Hips")}>
                                    <Input placeholder="اندازه دور سرین یا باسن به انچ" className="border !border-[#C68E17] rounded-[2px]" size="large" />
                                </Form.Item>
                                <Form.Item name="armholeSize" label={t("Arm Hole")}>
                                    <Input placeholder="اندازه دور حلقه آستین از بازو" className="border !border-[#C68E17] rounded-[2px]" size="large" />
                                </Form.Item>
                                <Form.Item name="skirtSize" label={t("Skirt/daman width")}>
                                    <Input placeholder="اندازه عرض دامن" className="border !border-[#C68E17] rounded-[2px]" size="large" />
                                </Form.Item>
                                <Form.Item name="pantsSize" label={t("Pants/Tunban length")}>
                                    <Input placeholder="اندازه طول شلوار" className="border !border-[#C68E17] rounded-[2px]" size="large" />
                                </Form.Item>
                                <Form.Item name="ancleSize" label={t("Ancle/Pacha")}>
                                    <Input placeholder="اندازه دور پاچه" className="border !border-[#C68E17] rounded-[2px]" size="large" />
                                </Form.Item>



                            </div>
                            <Form.Item name="otherDetails" label={t("Other Details")}>
                                <TextArea placeholder="درصورت ضرورت معلومات اضافی را اینجا وارد کنید" className="border !border-[#C68E17] rounded-[2px]" size="large" />
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    loading={loader}
                                    type="primary"
                                    htmlType="submit" block className="!bg-[#C68E17]">
                                    {t("Submit")}
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>

                    <div className="">
                        <Image preview={true} src="./men.jpg" className="w-full" alt="" />
                    </div>
                </div>
            </Modal>
            {/* waistcoat custom size modal */}
            <Modal
                open={waistCoatModal}
                onCancel={() => setWaistCoatModal(false)}
                footer={null}
                title={null}       // hide default title
                closable={false}
                bodyStyle={{ padding: 0 }}
                className="!w-[60%]"

            >
                <div className="bg-[#C68E17] text-white font-bold text-lg px-6 py-4 flex justify-between items-center rounded-t-[4px]">
                    {t('Men Waistcoat Custom Stitched in Inches')}
                    <button
                        onClick={() => setWaistCoatModal(false)}
                        className="text-white hover:text-gray-200 text-xl font-bold"
                    >
                        ×
                    </button>
                </div>
                <div className="grid md:grid-cols-3 gap-3 mt-4">
                    <div className="md:col-span-2">
                        <Form form={waistForm} onFinish={waistCoatSizing} layout="vertical">
                            <div className="grid md:grid-cols-3 grid-cols-2 gap-x-1">
                                <Form.Item name="heightSize" label={t("Height")}>
                                    <Input placeholder="اندازه طول قد واسکت به انچ" className="border !border-[#C68E17] rounded-[2px]" size="large" />
                                </Form.Item>
                                <Form.Item name="shoulderSize" label={t("Shoulder Width")}>
                                    <Input placeholder="اندازه عرض شانه به انچ" className="border !border-[#C68E17] rounded-[2px]" size="large" />
                                </Form.Item>
                                <Form.Item name="neckSize" label={t("Around Neck")}>
                                    <Input placeholder="اندازه دور گردن به انچ" className="border !border-[#C68E17] rounded-[2px]" size="large" />
                                </Form.Item>
                                <Form.Item name="armholeSize" label={t("Arm Hole")}>
                                    <Input placeholder="اندازه دور حلقه آستین به انچ" className="border !border-[#C68E17] rounded-[2px]" size="large" />
                                </Form.Item>
                                <Form.Item name="bustSize" label={t("Around Bust")}>
                                    <Input placeholder="اندازه دور بغل به انچ" className="border !border-[#C68E17] rounded-[2px]" size="large" />
                                </Form.Item>
                                <Form.Item name="waistSize" label={t("Around Waist")}>
                                    <Input placeholder="اندازه دور کمر به انچ" className="border !border-[#C68E17] rounded-[2px]" size="large" />
                                </Form.Item>
                                <Form.Item name="hipsSize" label={t("Around Hips")}>
                                    <Input placeholder="اندازه دور سرین یا باسن به انچ" className="border !border-[#C68E17] rounded-[2px]" size="large" />
                                </Form.Item>

                            </div>
                            <Form.Item name="otherDetails" label={t("Other Details")}>
                                <TextArea placeholder="درصورت ضرورت معلومات اضافی را اینجا وارد کنید" className="border !border-[#C68E17] rounded-[2px]" size="large" />
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    loading={loader}
                                    type="primary"
                                    htmlType="submit" block className="!bg-[#C68E17]">
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>

                    <div className="">
                        <Image preview={true} src="./waistcoat.jpg" className="w-full" alt="" />
                    </div>
                </div>


            </Modal>
            {/* similar products */}
            <ProductSlide products={products} />
        </HomeLayout>
    )
}

export default ProductDetails;