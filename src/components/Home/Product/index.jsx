import { Card, Rate, Pagination, Tooltip } from 'antd';
import Cookies from 'universal-cookie';
import { Link } from "react-router-dom";
import { motion } from 'framer-motion';
import useSwr from 'swr';
const cookies = new Cookies();
const { Meta } = Card;
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMemo } from 'react';

//translation imported
import { useTranslation } from 'react-i18next';
import { fetchData, http } from '../../../../module/http';
import { setExchange } from '../../../../redux/slices/exchange.slice';
const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
};


const Product = () => {

    // get token from cookies
    const token = cookies.get("authToken");
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    // react redux
    const exchangeSlice = useSelector(res => res.exchangeSlice);

    const { t } = useTranslation('product');
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
        position: ['bottomCenter']
    });

    // fetch limited products by pagination
    const fetchProducts = async (page = 1, pageSize = 10) => {
        try {
            setLoading(true);
            const httpReq = http();
            const response = await httpReq.get(`/api/product/pagination/rating?page=${page}&limit=${pageSize}`);
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
        fetchProducts(pagination.current, pagination.pageSize);
    }, [])


    const handlePageChange = (page, pageSize) => {
        setPagination(prev => ({
            ...prev,
            current: page,
            pageSize: pageSize
        }));
        fetchProducts(page, pageSize);
    }


    // shuffle the product on each refresh
    const shuffledProducts = useMemo(() => {
        if (!products) return [];
        const shuffled = [...products];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }, [products]);

    return (
        <div className='flex flex-col gap-3 px-0 md:px-3 py-2 min-h-screen'>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4">
                {shuffledProducts.map((item, index) => (
                    <Tooltip title={capitalizeFirstLetter(t('click here to buy'))} placement='top' color='#3d3100' key={item._id}>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.1, delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            className="bg-white shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                        >

                            <Link
                                to={token ? `/product-details?productId=${item._id}` : `/login`}
                                onClick={() => {
                                    if (!token) {
                                        sessionStorage.setItem("redirectProductId", item._id);
                                    }
                                }}
                            >

                                {/* Image Section */}
                                <div className="bg-gradient-to-br from-[#FAFAD2] to-blue-100 flex items-center justify-center">
                                    <img
                                        alt={t(item?.productName)}
                                        src={item?.images[0]}
                                        className="max-h-full max-w-full object-contain"
                                    />
                                </div>

                                {/* Details Section */}
                                <div className="px-1 md:px-4 py-1 md:py-3 bg-white flex flex-col justify-between gap-2">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-[#C68E17] font-bold text-sm md:text-base">
                                            {exchangeSlice?.currency}{" "}
                                            {((+item?.finalPrice) * (exchangeSlice?.rate)).toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                            })}
                                        </h2>
                                        {item.discountPercent > 0 && (
                                            <del className="!text-[#3d3100] text-[12px] md:text-sm">
                                                {exchangeSlice?.currency}{" "}
                                                {(+item?.realPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </del>
                                        )}
                                        {item?.discountPercent > 0 && (
                                            <span className="hidden md:block text-rose-600 text-[10px] md:text-sm md:font-medium">
                                                {item?.discountPercent}% {capitalizeFirstLetter(t("off"))}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="!text-[#3d3100] font-semibold text-base truncate text-[10px] md:text-sm">
                                        {capitalizeFirstLetter(t(item?.productName).trim())}
                                    </h3>

                                    <p className="hidden md:block !text-[#3d3100] text-[10px] md:text-sm line-clamp-2">
                                        {capitalizeFirstLetter(t(item?.desc?.toLowerCase().slice(0, 80)))}
                                    </p>

                                    <div className="mt-2">
                                        <Rate allowHalf value={item.averageRating} disabled className="text-[12px] md:text-sm" />
                                    </div>
                                </div>
                            </Link>

                        </motion.div>
                    </Tooltip>
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
    );
};

export default Product;
