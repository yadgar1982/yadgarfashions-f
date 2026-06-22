import { Image } from "antd";
import { useRef } from "react";


//translation imported
import { useTranslation } from 'react-i18next';
const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
};


const Category = ({ category, title = null, isCat = false }) => {
    const { t } = useTranslation('category');

    const scrollContainerRef = useRef(null);
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    const handleMouseDown = (e) => {
        isDragging = true;
        startX = e.pageX - scrollContainerRef.current.offsetLeft;
        scrollLeft = scrollContainerRef.current.scrollLeft;
        scrollContainerRef.current.style.cursor = 'grabbing';
        scrollContainerRef.current.style.userSelect = 'none';
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 1.5; 
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUpOrLeave = () => {
        isDragging = false;
        scrollContainerRef.current.style.cursor = 'grab';
        scrollContainerRef.current.style.userSelect = '';
    };

    return (
        <div>
            <h2 className="capitalize font-semibold text-zinc-600 text-2xl">
                {title}
            </h2>
            <div
                ref={scrollContainerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
                className={`overflow-x-auto whitespace-nowrap 
                w-full scrollbar-hide`
                }
            >
                <div className="flex gap-3 my-3" style={{
                    width: `${isCat ?
                        category.length * 100 :
                        category.length * 100}px`,
                }}
                >
                    {
                        category && category.map((item, index) => (
                            <div key={index} className="w-[100px] flex flex-col items-center">
                                <Image
                                    src={item?.image}
                                    width={40}
                                    height={40}
                                    className="rounded-full"

                                />
                                <a className="capitalize font-semibold text-zinc-500">
                                    {isCat
                                        ? capitalizeFirstLetter(t(item?.category?.toLowerCase() || ''))
                                        : capitalizeFirstLetter(t(item?.brand?.toLowerCase() || ''))}
                                    {/* {isCat ? item?.category : item?.brand} */}
                                </a>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}
export default Category;