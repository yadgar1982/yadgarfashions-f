import React from 'react';
import { Image } from 'antd';
import HomeLayout from '../Shared/HomeLayout';
import { useTranslation } from 'react-i18next';
const Policy = () => {
  const { t } = useTranslation('privacypolicy');
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
          <h1 className='text-[#D4AF37] text-lg md:text-5xl font-bold mt-7'>{(t('Privacy Policy'))}</h1>
          <h2 className='text-[#910a52] md:text-2xl font-bold mt-7'>{(t('Yadgar Fashions | Your Privacy Matters to Us'))}</h2>
          <p className='text-justify text-lg'>{(t('At Yadgar Fashions, we respect your privacy and are committed to protecting the personal information you share with us. As a business rooted in culture and community, we strive to make your shopping experience both secure and trustworthy. This policy outlines what information we collect when you use our website (www.yadgarfashions.com), how we use it, who we may share it with, and your rights as a customer.'))}
          </p>
          <h2 className='text-[#910a52] md:text-2xl font-bold mt-7'>{(t('Information We Collect'))}</h2>
          <p className='text-justify text-lg'>{(t('When you interact with our website, whether browsing or placing an order, we collect information in two ways:'))}<br />
            <h3 className='font-semibold mt-4'>{(t('a- Automatically Collected (Device Data)This includes:'))}</h3>
            •	{(t('Your IP address and browser type'))}<br />
            •	{(t('Pages you visit on our site'))}<br />
            •	{(t('Time and date of access'))}<br />
            •	{(t('What site or search engine referred you'))}<br />
            •	{(t('Technical data from cookies and analytics tools.'))}<br />
            <h3 className='font-semibold mt-4'>{(t('b- Information You Provide (Order Data)When placing an order or contacting us, we may collect:'))}</h3>
            •	{(t('Your name'))}<br />
            •	{(t('Shipping and billing addresses'))}<br />
            •	{(t('Phone number and email'))}<br />
            •	{(t('Payment details (processed securely by our providers)'))}<br />
            •	{(t('Measurement details (for custom orders only)'))}<br />
            {(t('We use this information only for business purposes, never for resale.'))}


          </p>
          <h2 className='text-[#910a52] md:text-2xl font-bold mt-7'>{(t('How We Use Your Information'))}</h2>
          <p className='text-justify text-lg'>
            <h3 className='font-semibold mt-4'>{(t('The data we collect helps us:'))}</h3>
            •	{(t('Fulfill and deliver your orders accurately'))}<br />
            •	{(t('Contact you about your order status or support uestions'))}<br />
            •	{(t('Screen for fraudulent or suspicious transactions'))}<br />
            •	{(t('Improve our website functionality and user experience'))}<br />
            •	{(t('Send updates, if you choose to subscribe to our emails.'))}<br />
          </p>
          <h2 className='text-[#910a52] md:text-2xl font-bold mt-7'>{(t('Sharing Your Information'))}</h2>
          <p className='text-justify text-lg'>
            <h3 className='font-semibold mt-4'>{(t('We may share limited information with trusted partners who help us operate, including:'))}</h3>
            • {(t('Payment gateways(e.g.,Stripe, PayPal).'))}<br />
            •	{(t('Shipping Services.'))}<br />
            •	{(t('Web analytics providers.'))}<br />
            • {(t('We do not sell your personal data. We may disclose information only when legally required (such as court orders or regulatory compliance)'))}.

          </p>
          <h2 className='text-[#910a52] md:text-2xl font-bold mt-7'>{(t('Advertising & Analytics'))}</h2>
          <p className='text-justify text-lg'>
            <h3 className='font-semibold mt-4'>{(t('If you allow cookies or subscribe to our emails:'))}</h3>
            •	{(t('You may see tailored ads related to our products on social platforms (e.g., Facebook, Instagram, Google).'))}<br />
            •	{(t('We may use tracking tools to see how users navigate our site, to improve design and speed.'))}<br />
            <h3 className='font-semibold mt-4'>{(t('You can adjust ad settings through your browser or platforms like:'))}</h3>
            •	{(t('Google Adds Settings.'))}<br />
            •	{(t('Facebook Ad Preferences.'))}<br />
          </p>
          <h2 className='text-[#910a52] md:text-2xl font-bold mt-7'>{(t('International Customers'))}</h2>
          <p className='text-justify text-lg'>
            <h3 className='font-semibold mt-4'>{(t('If you are ordering from outside the United States (especially the EU, UK,Germany, or Canada), please note:'))}</h3>
            •	{(t('Your data may be transferred to and processed in the United States or Afghanistan (where we manufacture clothing).'))}<br />
            •	{(t('We follow appropriate safeguards to protect your rights.'))}<br />
            <h3 className='font-semibold mt-4'>{(t('You have the right to:'))}</h3>
            •	{(t('Request access to your data'))}<br />
            •	{(t('Ask for corrections or deletion'))}<br />
            •	{(t('Withdraw consent for marketing communications'))}
          </p>
          <h2 className='text-[#910a52] md:text-2xl font-bold mt-7'>{(t('Updates to This Policy'))}</h2>
          <p className='text-justify text-lg'>
            {(t('Our privacy practices may change as our business grows. When we make changes, we’ll post the updated policy here with a revised “Last Updated” date.'))}
          </p>

        </div>
      </div>
    </HomeLayout>
  );
};

export default Policy;