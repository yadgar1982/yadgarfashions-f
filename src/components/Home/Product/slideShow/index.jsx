import useSWR from "swr";
import { useState } from "react";
import Slider from "react-slick";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Card, Rate, Tooltip } from "antd";
import { fetchData } from "../../../../../module/http";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSelector } from "react-redux";
import { motion } from 'framer-motion';
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
import { useTranslation } from 'react-i18next';
const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const cookies = new Cookies();

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className="absolute right-[-20px] top-1/2 transform -translate-y-1/2 z-10 cursor-pointer"
      onClick={onClick}
    >
      <RightOutlined className="!text-xl !font-bold text-[#910A52]" />
    </div>
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className="absolute left-[-20px] top-1/2 transform -translate-y-1/2 z-10 cursor-pointer"
      onClick={onClick}
    >
      <LeftOutlined className="!text-xl !font-bold text-[#910A52]" />
    </div>
  );
};



const ProductSlide = ({ products }) => {

  // redux
  const exchangeSlice = useSelector(res => res.exchangeSlice);

  // read token from localstorage
  const token = cookies.get("authToken");
  const { t } = useTranslation('product');

  const settings = {
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="px-4">
      <h1 className=" text-sm md:text-2xl font-bold text-[#3d3100]">{(t('Similer Products'))}</h1>
      <Slider {...settings}>
        {products && products.map((item, index) => (
          <Tooltip title="Click here to buy" placement='top'
            color='#3d3100'
          >
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-sm p-1 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              <Link to={token ? `/product-details?productId=${item._id}` : `/login`
              }
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
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
          </Tooltip>
        ))}
      </Slider>
    </div>
  )
};

export default ProductSlide;