import { Card, Rate, Pagination, Image, Tooltip, Select } from 'antd';
import Cookies from 'universal-cookie';
import { Link } from "react-router-dom";
import { motion } from 'framer-motion';
import React, { useMemo } from "react";
import Slider from "react-slick";
import useSwr from 'swr';
import HomeLayout from '../../Shared/HomeLayout';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const cookies = new Cookies();
const { Meta } = Card;
import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import CarouselEl from '../Carousel';
//translation imported
import { useTranslation } from 'react-i18next';
import { fetchData, http } from '../../../../module/http';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
};


const Cat = () => {
    const { t, i18n } = useTranslation('home');
    const rtl = i18n.language === "fa" || i18n.language === "prs"; // Dari / Pashto
    const exchangeSlice = useSelector(res => res.exchangeSlice);
    const token = cookies.get("authToken");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [prdct, setPrdct] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 6,
        total: 0,
        position: ['bottomCenter']
    });
    const { categoryId } = useParams();
    const [searchParams] = useSearchParams();
    const categoryName = searchParams.get("categoryName");

    // fetch showcase data from api
    const { data: showcases, error: sError } = useSwr(
        `/api/showcase/category/${categoryId}`,
        fetchData,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            refreshInterval: 1200000,
        }
    );

    // receive product for brands
    const { data: product, error: pError } = useSwr(
        `/api/product/category/${categoryId}`,
        fetchData,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            refreshInterval: 1200000,
        }

    );

    // fetch limited products by pagination
    const fetchProducts = async (page = 1, pageSize = 10) => {
        try {
            setLoading(true);
            const httpReq = http();
            const response = await httpReq.get(`/api/product/category/${categoryId}?page=${page}&limit=${pageSize}`);
            const { data, total } = response.data;
            setProducts(prev =>
                page === 1 ? data : [...prev, ...data]
            );
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

    useEffect(() => {
        if (categoryId) {
            fetchProducts(pagination.current, pagination.pageSize, categoryId);
        }
    }, [categoryId]);

    const handlePageChange = (page, pageSize) => {
        setPagination(prev => ({
            ...prev,
            current: page,
            pageSize: pageSize
        }));
        fetchProducts(page, pageSize);
    }



    // slider related code

    const brands = useSelector(res => res.brand.brands);
    // const myproducts = useSelector(res => res.product.products);
    const brandArray = useMemo(() => {
        if (Array.isArray(brands)) return brands;
        if (Array.isArray(brands?.brands)) return brands.brands;
        return [];
    }, [brands]);

    // 2) Normalize products into an array (important!)
    const productArray = useMemo(() => {
        if (Array.isArray(product)) return product;         // if already an array
        if (Array.isArray(product?.data)) return product?.data; // API shape: { data: [...] }
        return [];
    }, [product]);

    // 3) Make a Set of used brandIds
    const usedBrandIds = useMemo(() => {
        return new Set(productArray?.map(p => String(p?.brandId)));
    }, [productArray]);

    // 4) Filter brands by those used in products
    const filteredBrands = useMemo(() => {
        return brandArray?.filter(b => usedBrandIds?.has(String(b._id)));
    }, [brandArray, usedBrandIds]);

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

    //brand select code
    const brandOptions = filteredBrands.map(b => ({
        value: b?._id,
        label: t(b?.brandName || b?.brandName),
    }));


    const handleChange = (brandId) => {
        // Find the selected brand by id
        const brand = filteredBrands.find(b => b?._id === brandId);
        if (brand) {
            // Navigate to the brand page
            navigate(`/brand/${brand?._id.toLowerCase().replace(/\s+/g, '')}?brandName=${brand.brandName}`);
        }
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
    return (
        <HomeLayout>
            <div className='flex flex-col gap-6 px-0 md:px-4  bg-zinc-50 min-h-screen'>
                {
                    showcases && showcases?.showcases?.length > 0 ?
                        <CarouselEl showcase={showcases ? showcases.showcases : []} />
                        :
                        <Image src='/a.jpg' preview={false} className='w-[100%}  ' style={{
                        }} />
                }
                <h2 className='px-8  text-lg md:text-2xl px-1 md:text-3xl font-bold text-[#910a52] '>
                    {capitalizeFirstLetter(t(`${categoryName}`).toLowerCase())}
                </h2>

                <Slider
                    {...settings} ref={sliderRef}
                    className="!hidden md:!block p-4 slick-slider !block [&_.slick-track]:flex [&_.slick-track]:items-center md:[&_.slick-track]:-mx-[2px]"
                >
                    {filteredBrands.map((brand) => (
                        <div key={brand._id} className="md:mx-[2px]">
                            <Tooltip
                                color="#3d3100"
                                title={t(brand?.brandName)}
                                trigger={['hover', 'click']}
                            >
                                <Link
                                    to={`/brand/${brand?._id.toLowerCase().replace(/\s+/g, '')}?brandName=${brand.brandName}`}
                                    className="flex justify-center font-semibold capitalize text-[#3d3100]"
                                >
                                    <div className="w-[65px] h-[65px] flex justify-around items-center border border-3xl border-[#C68E17] rounded-full  hover:border-green-500 hover:shadow-xl ">
                                        <Image src={brand?.image} width={45} preview={false} />
                                        {/* <span className="md:hidden !text-sx !px-2 text-nowrap bg-[#C68E17] text-white p-1 rounded">{br?.brandName}</span> */}
                                    </div>
                                </Link>
                            </Tooltip>
                        </div>
                    ))}
                </Slider>
                <div className="px-8 -mt-4 w-full sm:w-[80%] md:w-[60%] lg:w-[45%] px-5" dir={rtl ? "rtl" : "ltr"}>

                    <Select
                        placeholder={t("Select Brand")}
                        className="block md:hidden shadow-lg justify-center  mt-0 items-center rounded-xl bg-white border border-[#c9a964] hover:border-[#a57c00] transition-all duration-300
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
                            padding: "0x",
                            boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                        }}
                        options={brandOptions}
                        onChange={handleChange}
                        optionLabelProp="label"
                        variant="borderless"
                        direction={rtl ? "rtl" : "ltr"}
                    />
                </div>


                <div className="grid grid-cols-2 px-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-3">
                    {products && products.map((item, index) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className="bg-white  shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                        >
                            <Link to={token ? `/product-details?productId=${item._id}` : `/login`}

                                //by clicking this we go to specific product after login
                                onClick={() => {
                                    if (!token) {
                                        sessionStorage.setItem("redirectProductId", item._id);
                                    }
                                }}
                            >
                                {/* Image Section */}
                                <div className=" flex items-center justify-center">
                                    <img
                                        alt={t(item?.productName)}
                                        src={item?.images[0]}
                                        className="max-h-full max-w-full object-contain"
                                    />
                                </div>

                                {/* Details Section */}
                                <div className="px-1 md:px-4 py-1 md:py-3 bg-white flex flex-col justify-between gap-2">
                                    <div className="flex justify-between items-center">
                                        <h2 className='text-[#C68E17] font-bold text-sm md:text-base'>
                                            {exchangeSlice?.currency} {((+item?.finalPrice) * (exchangeSlice?.rate)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </h2>
                                        {
                                            item.discountPercent > 0 &&
                                            <del className='!text-[#3d3100] text-[12px] md:text-sm'>
                                                {exchangeSlice?.currency} {(+item?.realPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </del>
                                        }
                                        {
                                            item?.discountPercent > 0 &&
                                            <span className='hidden md:block text-rose-600 text-[10px] md:text-sm md:font-medium'>


                                                {item?.discountPercent}%
                                                {capitalizeFirstLetter(t('off'))}

                                            </span>
                                        }

                                    </div>

                                    <h3 className="!text-[#3d3100] font-semibold text-base truncate text-[10px] md:text-sm">
                                        {capitalizeFirstLetter(t(item?.productName).trim())}
                                    </h3>

                                    <p className="hidden md:block !text-[#3d3100] text-[10px] md:text-sm line-clamp-2">
                                        {capitalizeFirstLetter(t(item?.desc?.toLowerCase().slice(0, 80)))}
                                    </p>

                                    <div className="mt-2 ">

                                        <Rate allowHalf value={item.averageRating} disabled className="text-[12px] md:text-sm" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
                <div className="flex items-center justify-center my-3">
                    <Pagination
                        current={pagination.current}
                        pageSize={pagination.pageSize}
                        total={pagination.total}
                        onChange={handlePageChange}
                    />
                </div>
            </div>
        </HomeLayout>
    );
};

export default Cat;
