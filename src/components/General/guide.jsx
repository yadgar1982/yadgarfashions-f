import React from 'react';
import { Image } from 'antd';
import HomeLayout from '../Shared/HomeLayout';

import { useTranslation } from 'react-i18next';

const Guide = () => {
  const { t } = useTranslation('guides');
  return (

    <HomeLayout>
      <div className="w-full  flex flex-col items-center justify-center md:p-0 p-4">
        <div className="w-[100%]">
          <Image
            preview={false}
            src="/terms.png"  // Make sure this path is correct
            className="w-full"
            alt="terms"
          />
        </div>
        <div className='md:w-[60%]'>
          <h1 className='text-[#D4AF37] text-lg md:text-5xl font-bold mt-7'>
            {(t("Yadgar Fashions Guide"))}</h1>
          <h2 className='text-[#3d3100] md:text-2xl font-bold mt-7'>{(t("Welcome to Yadgar Fashions!"))}</h2>
          <p className='text-justify text-lg'>{(t('This guide will walk you through everything you need to know — from choosing your design to receiving your outfit at your doorstep.'))}
          </p>
          <h2 className='text-[#3d3100] md:text-2xl font-bold mt-7'>{(t("How to Order"))}</h2>
          <p className='text-justify text-lg'>{(t('Create Your Account – For your data security and a smoother shopping experience, please register if you’re a new customer, or log in if you already have an account.'))}
          </p>
          <p className='text-justify text-lg'>{(t('Browse Collections – Explore our  traditional Afghan outfit cagegories.'))}
          </p>
          <p className='text-justify text-lg'>{(t('hoose Your Style – Select the design, fabric, color, and embroidery you love.'))}
          </p>
          <p className='text-justify text-lg'>{(t('Customize Your Fit – Provide your measurements for a perfect, made-to-measure outfit.'))}
          </p>
          <p className='text-justify text-lg'>{(t('Confirm & Pay Securely – Complete your order with safe online checkout.'))}
          </p>

          <h2 className='text-[#3d3100] md:text-2xl font-bold mt-7'>{(t("Customization"))}</h2>
          <p className='text-justify text-lg'>{(t('Your clothing is made just for you. You can:'))}
          </p>
          <p className='text-justify text-lg'>{(t('Select Design type (Hazaragi,Maxi,Punjabi,Hijab, etc'))}
          </p>
          <p className='text-justify text-lg'>{(t('Pick your favorite color combinations'))}
          </p>
          <p className='text-justify text-lg'>{(t('Choose embroidery style and detailing'))}
          </p>
          <p className='text-justify text-lg'>{(t('Request special tailoring adjustments in the measurment page'))}
          </p>
          <p className='text-justify text-lg'>{(t('Our artisans in Afghanistan carefully handcraft each piece to reflect both tradition and your personal style.'))}
          </p>

          <h2 className='text-[#3d3100] md:text-2xl font-bold mt-7'>{(t("Sizing & Measurements"))}</h2>
          <p className='text-justify text-lg'>{(t('To ensure a perfect fit, we provide an easy measurement guide on each product page. You’ll only need a measuring tape and a few minutes. Common measurements include:'))}
          </p>
          <p className='text-justify text-lg'>{(t('Chest / Bust'))}</p>
          <p className='text-justify text-lg'>{(t('Waist & Hips'))}</p>
          <p className='text-justify text-lg'>{(t('leeve length & Shoulder width'))}</p>
          <p className='text-justify text-lg'>{(t('Full outfit length'))}
          </p>
          <p className='text-justify text-lg'>{(t('If you need help, our support team is always available to guide you step by step.'))}
          </p>

          <h2 className='text-[#3d3100] md:text-2xl font-bold mt-7'>{(t("Quality & Trust"))}</h2>
          <p className='text-justify text-lg'>{(t('Every garment goes through thorough quality checks before shipping.'))}</p>
          <p className='text-justify text-lg'>{(t('Handmade by skilled Afghan artisans with years of experience.'))}</p>
          <p className='text-justify text-lg'>{(t('All orders are securely shipped worldwide via trusted logistics partners, with tracking information provided for every shipment.'))}</p>

          <h2 className='text-[#3d3100] md:text-2xl font-bold mt-7'>{(t("Delivery & Shipping"))}</h2>
          <p className='text-justify text-lg'>{(t('Standard delivery times vary between 2–4 weeks, depending on customization.'))}
          </p>
          <p className='text-justify text-lg'>{(t('We’ll keep you updated with order progress and tracking details.'))}
          </p>
          <h2 className='text-[#3d3100] md:text-2xl font-bold mt-7'>{(t("Customer Support"))}</h2>
          <p className='text-justify text-lg'>{(t('We value your trust. If you have questions about designs, sizes, or shipping, our team is here to help through:'))}
          </p>
          <p className='text-justify text-lg'>{(t('Email'))}
          </p>
          <p className='text-justify text-lg'>{(t('WhatsApp'))}
          </p>
          <p className='text-justify text-lg'>{(t('Social media'))}
          </p>
          <p className='text-justify text-xl  text-[#C68E17] text-bold'>{(t('At Yadgar Fashions, you’re not just buying clothes — You’re wearing your heritage with pride.'))}
          </p>


        </div>
      </div>
    </HomeLayout>
  );
};

export default Guide;