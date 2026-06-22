import { Button, Image, Tooltip, Modal, Select } from "antd";
import "@fontsource/playfair-display";
import { memo, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import HomeLayout from "../Shared/HomeLayout";
import CarouselEl from "./Carousel";
import useSWR from "swr";
import { fetchData } from "../../../module/http";
import Product from "./Product";
import 'animate.css';
import { CloseOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
//translation imported
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

//import category fetchers
import { fetchBranding } from "../../../redux/features/branding/brandingSlice";
import { fetchCurrencies } from "../../../redux/features/currency/currencySlice";
import { fetchBrands } from "../../../redux/features/brand/brandSlice";
import { fetchAdds } from "../../../redux/features/adds/addsSlice";
import { fetchShowcases } from "../../../redux/features/showcase/showcaseSlice";
import { fetchCategories } from "../../../redux/features/category/categorySlice";
import { fetchDealers } from "../../../redux/features/dealer/dealerSlice";



const Home = memo(() => {
    const [popModal, setPopModal] = useState(false)
    const [imgLoaded, setImgLoaded] = useState(false);
    const { t, i18n } = useTranslation('home');
    const rtl = i18n.language === "fa" || i18n.language === "ps"; // Dari / Pashto
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        document.documentElement.dir = ['ps', 'fa'].includes(i18n.language) ? 'rtl' : 'ltr';
    }, [i18n.language]);


    // fetch data from redux 
    const brands = useSelector(res => res.brand?.brands || []);
    const adds = useSelector(res => res.adds.adds);
    const showcases = useSelector(res => res.showcase.showcases);
    const branding = useSelector(res => res.branding.branding);
    const currencies = useSelector(res => res.currency.currencies);
    const categories = useSelector(res => res.category.categories);


    useEffect(() => {
        const timer = setTimeout(() => {
            if (adds?.adds?.[0]?.image) {
                setPopModal(true);
            }
        }, 15000);

        return () => clearTimeout(timer);
    }, [adds]);



    // entities
    const entities = [
        { name: "branding", fetcher: fetchBranding },
        { name: "currency", fetcher: fetchCurrencies },
        { name: "brand", fetcher: fetchBrands },
        { name: "adds", fetcher: fetchAdds },
        { name: "showcase", fetcher: fetchShowcases },
        { name: "category", fetcher: fetchCategories },
        { name: "dealer", fetcher: fetchDealers },
    ];

    const useMasterDataLoader = () => {
        const dispatch = useDispatch();
        entities.forEach(({ name, fetcher }) => {
            const status = useSelector((state) => state[name]?.status);
            useEffect(() => {
                if (status === "idle") {
                    dispatch(fetcher());
                }
            }, [status, dispatch, fetcher]);
        });
    };

    useMasterDataLoader();


    // fetch categories
    const fields = ['categoryName']; // choose the fields you want
    const query = fields.join(',');

    const fetchWithToken = (url) => fetchData(url, token); // pass token



    // slider related code
    const NextArrow = (props) => {
        const { className, style, onClick } = props;
        return (
            <div
                className="absolute right-[-1px] top-1/2 transform -translate-y-1/2 z-10 cursor-pointer"
                onClick={onClick}
            >
                <RightOutlined className="!text-sm  text-[#3d3100]" />
            </div>
        );
    };

    const PrevArrow = (props) => {
        const { className, style, onClick } = props;
        return (
            <div
                className="absolute left-[-1px] top-1/2 transform -translate-y-1/2 z-10 !cursor-pointer"
                onClick={onClick}
            >
                <LeftOutlined className="!text-sm  text-[#3d3100]" />
            </div>
        );
    };

    const settings = {
        arrows: true,
        infinite: false,
        speed: 500,
        slidesToShow: 20,
        slidesToScroll: 5,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 15,
                    slidesToScroll: 3,
                },
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 2,
                },
            },
        ],
    };

    const sliderRef = useRef(null);
    useEffect(() => {
        setTimeout(() => {
            sliderRef.current?.slickGoTo(0);
        }, 100);
    }, []);



    //brand select 
    const mbrands = useSelector(res => {
        const b = res.brand?.brands;
        if (b && !Array.isArray(b) && Array.isArray(b.brands)) return b.brands;
        if (Array.isArray(b)) return b;
        return [];
    });
    const brandOptions = () =>
        categories?.categories
            ?.filter(b => b?.categoryName.toLowerCase() !== "home") // exclude "home"
            .map(b => ({
                value: b?._id,
                label: t(b?.categoryName),
            })) || [];

    const handleChange = (categoryId) => {
        // Find the selected category
        const category = categories?.categories?.find(cat => cat._id === categoryId);
        if (category) {
            const slug = category.categoryName
                .trim()
                .toLowerCase()
                .replace(/\s+/g, '');
            navigate(`/cat/${category._id}?categoryName=${slug}`);
        }
    };
    return (
        <HomeLayout>
            <div className="flex flex-col gap-3">
                {/* carousal section */}
                <CarouselEl showcase={showcases ? showcases.showcases : []} className="!w-screen" />

                {/* brand section */}
                <div className="w-full px-8 sm:w-[80%] md:w-[60%] lg:w-[45%] px-5" dir={rtl ? "rtl" : "ltr"}>
                    <h3 className="  text-sm md:text-2xl font-playfair font-bold text-[#3d3100] mb-3">
                        {t("Filter by Category")}
                    </h3>


                    <Select
                        placeholder={t("Select Category Here")}
                        className="shadow-lg justify-center items-center rounded-xl bg-white border border-[#c9a964] hover:border-[#a57c00] transition-all duration-300
               [&_.ant-select-selection-placeholder]:!text-[#8c7332]
               [&_.ant-select-selection-placeholder]:!font-playfair
               [&_.ant-select-selection-placeholder]:!italic
               [&_.ant-select-arrow]:!text-[#a57c00]
               [&_.ant-select-selection-item]:!font-playfair
               [&_.ant-select-selection-item]:!text-[#3d3100]
               [&_.ant-select-selector]:!rounded-xl
               [&_.ant-select-selector]:flex [&_.ant-select-selector]:items-center"

                        style={{
                            width: "45%",
                            borderRadius: 5,
                            padding: "6px",
                            boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                        }}
                        options={brandOptions()}
                        onChange={handleChange}
                        optionLabelProp="label"
                        variant="borderless"
                        direction={rtl ? "rtl" : "ltr"}
                    />
                </div>

                {/* Product section */}
                <div className="m-4 mt-0">
                    <Product />
                </div>
            </div>

            <Modal
                styles={{
                    content: {
                        borderRadius: 0,
                        padding: 0,
                        position: "relative",
                        background: "transparent",
                    },
                    lineHeight: "0px !important"
                }}
                className="animate__animated animate__zoomIn"
                centered
                title={null}
                open={popModal}
                closable={false}
                footer={null}
                onCancel={() => setPopModal(false)}
                width="90vw"



            >
                <button
                    onClick={() => setPopModal(false)}
                    style={{
                        position: "absolute",
                        top: "-12px",
                        right: "-12px",
                        zIndex: "10",
                        background: "#d81515ff",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "white",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}
                >
                    <CloseOutlined />
                </button>
                <div>
                    <Image
                        onClick={() => setPopModal(false)}
                        src={adds?.adds[0]?.image}
                        preview={false}
                        className="!mb-0"
                        style={{ lineHeight: '0px !important' }}
                    />
                </div>
            </Modal>
        </HomeLayout >

    )

})
export default Home;