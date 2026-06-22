import React from 'react';
import { Image } from 'antd';
import HomeLayout from '../Shared/HomeLayout';
const Blog = () => {
  return (
    <HomeLayout>
      <div className="w-full  flex flex-col items-center justify-center md:p-0 p-4">
        <div className="w-full">
          <Image
            preview={false}
            src="/terms.png"  // Make sure this path is correct
            className="w-full"
            alt="terms"
          />
        </div>
        <div className='md:w-[60%]'>
          <h1 className='text-[#D4AF37] text-lg md:text-5xl font-bold mt-7'>Blog</h1>
          <h2 className='text-[#910a52] md:text-2xl font-bold mt-7'> </h2>
          <p className='text-justify text-lg'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus magni debitis, ratione voluptatem esse totam deleniti libero consectetur! Nam in ipsum aliquid, quis vero non maxime ipsam iste nobis dolorum.lorem Lorem, ipsum dolor sit amet consectetur adipisicing elit. Alias maxime tenetur illo explicabo voluptatibus nihil, deserunt accusantium earum ullam? Ipsa quis in reiciendis officia aliquam numquam quam et. Mollitia, pariatur.
          </p>


        </div>
      </div>
    </HomeLayout>
  );
};

export default Blog;