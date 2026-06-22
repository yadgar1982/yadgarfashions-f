import React from 'react';
import { Carousel, Image } from 'antd';

const CarouselEl = ({ showcase }) => {
    return (
        <Carousel arrows infinite={true} autoplay autoplaySpeed={3000} className="w-[100%]">
            {
                showcase?.map((item, index) => (
                    <div key={index} className="overflow-hidden w-[60%] h-[270px] md:w-full md:h-auto mx-auto">
                        <img
                            src={item?.image}
                            alt=""
                            className="w-full h-full object-cover object-right"
                        />
                    </div>
                ))
            }
        </Carousel>


    )
}
export default CarouselEl;