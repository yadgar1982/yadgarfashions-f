import React from 'react';
import { Image } from 'antd';
import HomeLayout from '../Shared/HomeLayout';

import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation('about');
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
            {(t("Yadgar Fashions"))}</h1>
          <h2 className='text-[#910a52] md:text-2xl font-bold mt-7'>{(t("About Us"))}</h2>
          <p className='text-justify text-lg'>{(t('Yadgar Fashions is more than just a clothing online market — it’s a cultural bridge between Afghan heritage and the modern world. Founded by Zabeehullah Yadgar, our mission is to preserve and celebrate traditional Afghan clothing by making it accessible, customizable, and high-quality for Afghans living abroad.'))}
            {(t('We understand the challenge of finding garments that honor tradition while meeting personal style and sizing needs. That’s why every order is made to measure, with personalized fabrics, colors, and embroidery — handmade by skilled artisans in Afghanistan.'))}

          </p>
          <h2 className='text-[#910a52] md:text-2xl font-bold mt-7'>{(t("Mission"))}</h2>
          <p className='text-justify text-lg'>{(t('We offer customizable Afghan clothing with trusted service, precise sizing, and thorough quality checks before shipping. Our focus is on cultural connection, customer satisfaction, and reliable global Service.'))}
          </p>
          <h2 className='text-[#910a52] md:text-2xl font-bold mt-7'>{(t("Vision"))}</h2>
          <p className='text-justify text-lg'>{(t('To connect Afghans around the world with their culture through modern, customizable traditional clothing—built on quality, trust, and community.'))}
          </p>


        </div>
      </div>
    </HomeLayout>
  );
};

export default About;