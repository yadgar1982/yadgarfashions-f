import React from "react";
import "@fontsource/playfair-display";
import { Card, Rate, Pagination, Image, Tooltip } from 'antd';
import Cookies from 'universal-cookie';
import { Link } from "react-router-dom";
import { motion } from 'framer-motion';
import useSWR from "swr";
import HomeLayout from '../../Shared/HomeLayout';


import { useSelector } from "react-redux";
const cookies = new Cookies();
const { Meta } = Card;
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import CarouselEl from '../Carousel';
//translation imported
import { useTranslation } from 'react-i18next';
import { fetchData, http } from '../../../../module/http';
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';
import { FaArrowLeft } from 'react-icons/fa';
const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
};


const Br = () => {

    const exchangeSlice = useSelector(res => res.exchangeSlice);
    const token = cookies.get("authToken");
    const { t } = useTranslation('home');
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 6,
        total: 0,
        position: ['bottomCenter']
    });
    const { brandId } = useParams();
    const [searchParams] = useSearchParams();
    const brandName = searchParams.get("brandName");


    // fetch showcase data from api
    const { data: showcases, error: sError } = useSWR(
        `/api/showcase/category/${brandId}`,
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
            const response = await httpReq.get(`/api/product/brand/${brandId}?page=${page}&limit=${pageSize}`);
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
        if (brandId) {
            fetchProducts(pagination.current, pagination.pageSize, brandId);
        }
    }, [brandId]);

    const handlePageChange = (page, pageSize) => {
        setPagination(prev => ({
            ...prev,
            current: page,
            pageSize: pageSize
        }));
        fetchProducts(page, pageSize);
    }

    return (
        <HomeLayout>
            <div className='flex flex-col gap-4 px-1 md:px-4  bg-zinc-50 min-h-screen'>

                {
                    showcases && showcases?.showcases?.length > 0 ?
                        <CarouselEl showcase={showcases ? showcases.showcases : []} />
                        :
                        <Image src='/a.jpg' preview={false} className='w-[100%}  ' style={{

                        }} />
                }

                <div className="px-2">
                    <Tooltip title={t("Go to Home Page")} placement="top">
                        <button
                            type="button"
                            className="
      flex items-center justify-center
      w-[40px] h-[40px] md:w-[40px] md:h-[40px]
      rounded-full
      bg-gradient-to-r from-[#d4af37] to-[#c9a964]
      text-white
      shadow-lg
      hover:from-[#c9a964] hover:to-[#d4af37]
      hover:scale-110
      transition-all duration-300 ease-in-out
    "
                        >
                            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                                <ArrowLeftOutlined className="text-lg md:text-2xl drop-shadow-sm" />
                            </Link>
                        </button>
                    </Tooltip>

                </div>


                <h2 className="text-lg md:text-2xl font-bold  px-2"
                    style={{ fontFamily: "'Playfair Display', serif", color: "#3d3100" }}>
                    {capitalizeFirstLetter(t(`${brandName}`).toLowerCase())}
                </h2>


                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-3">
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
                                onClick={() => {
                                    if (!token) {
                                        sessionStorage.setItem("redirectProductId", item._id);
                                    }
                                }}

                            >
                                {/* Image Section */}
                                <div className="  flex items-center justify-center">
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

                                        <Rate allowHalf value={item.averageRating} disabled className="text-[12px] !text-[#3d3100] md:text-sm" />
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

export default Br;
