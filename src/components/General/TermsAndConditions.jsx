import React from 'react';
import { Image } from 'antd';
import HomeLayout from '../Shared/HomeLayout';
import { useTranslation } from 'react-i18next';
const TermsAndConditions = () => {
  const { t } = useTranslation('terms');

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
          <h1 className='text-[#D4AF37] text-lg md:text-5xl font-bold mt-7'>{(t('Site Disclaimer'))}</h1>
          <h2 className='text-[#910a52] md:text-2xl font-bold mt-7'>{(t('Conditions of Use'))}</h2>
          <p className='text-justify text-lg'>{(t('Please read the following carefully. By shopping at Yadgar Fashions (www.yadgarfashions.com), you agree to be bound by the terms and conditions set forth below. Yadgar Fashions reserves the right to modify this agreement at any time, with such modifications becoming effective immediately upon posting on the site.'))}</p>
          <h2 className='text-[#910a52] md:text-2xl font-bold mt-7'>{(t('Electronic Communications'))}</h2>
          <p className='text-justify text-lg'>{(t('Please read the following carefully. By shopping at Yadgar Fashions, When you visit www.yadgarfashions.com or communicate with us via email, you consent to receive communications electronically. We will communicate with you through email or by posting notices on our website. You agree that all electronic communications satisfy any legal requirement that such communications be in writing.'))}</p>
          <h2 className='text-[#910a52] md:text-2xl font-bold mt-7'>{(t('Copyright'))}</h2>
          <p className='text-justify text-lg'>{(t('All content on www.yadgarfashions.com, including text, graphics, logos, images, digital downloads, data compilations, and software, is the property of Yadgar Fashions or its content providers and is protected under applicable US and international copyright laws. The compilation of all content is the exclusive property of Yadgar Fashions and is similarly protected.'))}</p>
          <h2 className='text-[#910a52] md:text-2xl font-bold mt-7'>{(t('Permissions and Site Access'))}</h2>
          <p className='text-justify text-lg'>{(t('Yadgar Fashions grants you a limited, non-exclusive permission to access and use this website solely for personal, non-commercial purposes. You may not download (except for page caching), modify, reproduce, or use any content from the site without explicit prior written consent. This permission does not authorize commercial use, resale, data mining, or any unauthorized data collection methods. Any unauthorized use will result in immediate termination of your permission to access the site.You may link to our homepage provided that the link is not misleading or harmful to our brand image, and you do not use any Yadgar Fashions logos or trademarks without prior written authorization.'))}</p>
          <h2 className='text-[#910a52] md:text-2xl font-bold mt-7'>{(t('Permission to Purchase'))}</h2>
          <p className='text-justify text-lg'>{(t('Yadgar Fashions sells products to individuals aged 18 or older. If you are under 18, purchases must be made with the involvement of a parent or guardian. We reserve the right to refuse service, cancel orders, or remove content at our sole discretion.'))}</p>
          <h2 className='text-[#910a52] md:text-2xl font-bold mt-7'>{(t('Risk of Loss'))}</h2>
          <p className='text-justify text-lg'>{(t('All purchases are shipped (FOB Origin) Responsibility for any loss or damage transfers to the buyer upon delivery of the goods to the shipping carrier. Therefore, once the goods have been handed over to the carrier, the buyer assumes full responsibility for the safety of the items.After the product is handed over to the shipping company, the tracking number will be provided to the customer so they can monitor the shipment until delivery. Additionally, tracking information will be regularly updated on our website.'))}</p>
          <h2 className='text-[#910a52] md:text-2xl font-bold mt-7'>{(t('Product Distributions'))}</h2>
          <p className='text-justify text-lg'>{(t('We strive to provide accurate product descriptions. However, slight variations in color or design may occur due to digital imaging. Typically, colors displayed on digital devices can differ from the actual product by 10-15%. If a product does not match its description, your sole remedy is to return it in unused condition. Please note that customized orders are non-returnable if made according to the customers specifications.'))}</p>
          <h2 className='text-[#910a52] md:text-2xl font-bold mt-7'>{(t('Return and Exchanges'))}</h2>
          <p className='text-justify text-lg'>{(t('We gladly accept returns if you are unsatisfied with your purchase and can provide reasonable proof. Please notify us in writing, including the reason for the return or exchange, within 24 hours of receiving the item. Please note that returns are not accepted for used items or items showing signs of wear such as stains, odors, damage, or alterations. We may require photographic evidence to verify the condition of the item before processing the return. All return shipping and customs fees are the responsibility of the customer, unless the return is due to an error on our part. In such cases, we will reimburse the shipping costs and either exchange the product or provide store credit. For returns or exchanges, please contact us at: Yadgar.fashions@gmail.com. Custom-stitched items, sale items, and jewelry are final sale and cannot be returned or exchanged.'))}
          </p>
        </div>
      </div>
    </HomeLayout>
  );
};

export default TermsAndConditions;