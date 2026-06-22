import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Modal, Space, Card } from 'antd';
import { WhatsAppOutlined, MailOutlined, PhoneOutlined, MessageOutlined, InstagramFilled, } from '@ant-design/icons';
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaCcPaypal, FaFacebookF, FaInstagram, FaWhatsapp, FaTiktok, FaCcDiscover, FaWhatsappSquare, FaFacebookSquare } from 'react-icons/fa';

//translation imported
import { useTranslation } from 'react-i18next';
const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default function Footer() {
  const { t } = useTranslation('footer');

  //contact chat
  const [open, setOpen] = useState(false);

  const ChatButton = ({ onClick }) => (
    <Button
      className="!bg-[#C68E17] !text-white !shadow-sm !shadow-[#F5F5F5]  text-2xl hover:!border-white"
      shape="circle"
      icon={<MessageOutlined />}
      size="large"
      onClick={onClick}
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        width: 50,
        height: 50,
        zIndex: 1000,
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      }}
    />
  );


  const ChatBox = () => (
    <Card
      style={{
        position: 'fixed',
        bottom: 80,
        right: 24,
        width: 64,
        zIndex: 1000,
        // boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        borderRadius: 12,
        backgroundColor: 'transparent',
        border: "transparent",
      }}

      size="small"
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button

          icon={<WhatsAppOutlined />}
          // type="primary"
          block
          href="https://wa.me/+12675121959"
          target="_blank"
          className="!bg-[#C68E17] !text-[#F5F5F5] hover:!bg-[#F5F5F5] hover:!text-[#3d3100] hover:!border-[#3d3100] rounded-full border-[#F5F5F5] shadow-sm shadow-[#F5F5F5] !h-[50px] !w-[50px]  text-lg">

        </Button>

        <Button
          icon={<MailOutlined />}
          block
          href="mailto:yadgar.fashions@gmail.com"
          className="!bg-[#C68E17] !text-[#F5F5F5] hover:!bg-[#F5F5F5] hover:!text-[#3d3100] hover:!border-[#3d3100] rounded-full border-[#F5F5F5] shadow-sm shadow-[#F5F5F5] !h-[50px] !w-[50px] text-lg"
        >

        </Button>

        <Button
          icon={<PhoneOutlined />}
          block
          href="tel:+12675121959"
          className="!bg-[#C68E17] !text-[#F5F5F5] hover:!bg-[#F5F5F5] hover:!text-[#3d3100] hover:!border-[#3d3100] rounded-full border-[#F5F5F5] shadow-sm shadow-[#F5F5F5] !h-[50px] !w-[50px]  text-lg"

        >

        </Button>
      </Space>
    </Card>
  );
  const toggleChatBox = () => {
    setOpen(prev => !prev);
  };

  //end of contact chat
  return (
    <div className="bg-[#3d3100] text-white py- px-7 md:px-16">
      <ChatButton onClick={toggleChatBox} />
      {open && <ChatBox />}


      <div spacing={4} className="flex flex-col items-center text-center !w-full">

        <div className="flex flex-col md:flex-row  justify-center grid grid-cols-2  md:grid-cols-6 md:justify-between  w-full">
          <div className="hidden md:block"></div>
          <div className="flex flex-col items-start justify-start gap-3 mt-5">
            <h2 variant="h6" className="pb-3  text-sm md:text-lg text-[#F5F5F5] hover:text-[#C68E17] ">{capitalizeFirstLetter(t('company'))}</h2>
            <Link to="/home/about"><h1 className=" text-[#F5F5F5] hover:text-[#C68E17] border-none text-[12px] md:!text-sm "
            >{capitalizeFirstLetter(t('about'))}</h1></Link>
            <Link to="/home/blog"><h1 className=" text-[#F5F5F5] hover:text-[#C68E17] border-none text-[12px] md:!text-sm "
            >{capitalizeFirstLetter(t('blog'))}</h1></Link>
            <h1 className="  text-[#F5F5F5] hover:text-[#C68E17] border-none text-[12px] md:!text-sm " >{capitalizeFirstLetter(t('partners'))}</h1>
          </div>

          <div className="flex flex-col md:items-start gap-3 mt-5 items-start">
            <h2 className="pb-3 text:xl md:text-lg gap-3 text-[#F5F5F5] hover:text-[#C68E17] ">{capitalizeFirstLetter(t('solutions'))}</h2>
            <h1 className=" text-[#F5F5F5] hover:text-[#C68E17] border-none  text-[12px] md:text-[12px] md:!text-sm" >{capitalizeFirstLetter(t('marketing'))}</h1>
            <h1 className=" text-[#F5F5F5] hover:text-[#C68E17] border-none text-[12px] md:!text-sm"
            >{capitalizeFirstLetter(t('analytics'))}</h1>
            <h1 className=" text-[#F5F5F5] hover:text-[#C68E17] border-none text-[12px] md:!text-sm  " >{capitalizeFirstLetter(t('commerce'))}</h1>
            <h1 className=" text-[#F5F5F5] hover:text-[#C68E17] border-none text-[12px] md:!text-sm  " >{capitalizeFirstLetter(t('insights'))}</h1>
            <h1 className=" text-[#F5F5F5] hover:text-[#C68E17] border-none text-[12px] md:!text-sm  " >{capitalizeFirstLetter(t('supports'))}</h1>
          </div>

          <div className="flex flex-col items-start md:mt-5  md: gap-3">
            <h2 className="pb-3  text-sm md:text-lg text-[#F5F5F5] hover:text-[#C68E17]  ">{capitalizeFirstLetter(t('legal'))}</h2>
            <Link to="/home/terms"><h1 className=" text-[#F5F5F5] hover:text-[#C68E17] border-none text-[12px] md:!text-sm "
            >{capitalizeFirstLetter(t('terms and conditions'.trim()))}</h1></Link>
            <Link to="/home/policies"><h1 className=" text-[#F5F5F5] hover:text-[#C68E17] border-none text-[12px] md:!text-sm "
            >{capitalizeFirstLetter(t('privacy policy'))}</h1></Link>

          </div>
          <div className="flex flex-col items-start gap-3 mt-5">
            <h2 className="pb-3  text-sm md:text-lg text-[#F5F5F5] hover:text-[#C68E17]  ">{capitalizeFirstLetter(t('documentations'))}</h2>
            <Link to="/home/guide"><h1 className=" text-[#F5F5F5] hover:text-[#C68E17] border-none text-[12px] md:!text-sm "
            >{capitalizeFirstLetter(t('guides'.trim()))}</h1></Link>


          </div>


        </div>

        <div xs={12} className=" flex flex-col justify-center w-[100%] md:w-[45%] gap-2">
          <div className="border col-span-2 border-dashed md:h-10 bg-zinc-50 m-3 justify-center items-center rounded p-2  flex flex-col mt-10 mr-4 ">

            <div className="flex gap-3 md:gap-8 justify-center ">
              <h1 className="font-bold text-sm md:text-lg text-[#333333]">{capitalizeFirstLetter(t('we accept:'.trim()))}</h1>
              <FaCcVisa color="#1A1F71" className="text-4xl w-[30px] md:w-[45px]" />
              <FaCcMastercard color="#EB001B" className="text-4xl w-[30px] md:w-[45px]" />
              <FaCcAmex color="#2E77BB" className="text-4xl w-[30px] md:w-[45px]" />
              {/*  <FaCcPaypal color="#003087" className="text-4xl w-[30px] md:w-[45px]" /> */}
              <FaCcDiscover color="#FF6000" className="text-4xl w-[30px] md:w-[45px]" />
            </div>

          </div>
          <h2 variant="body2" align="center" className="text-[#F5F5F5] hover:text-[#C68E17]">
            &copy; {(t('2025 Yadgar Fashions, LLC USA, All Rights Reserved.'))}
          </h2>

          <div className=" p-3 md:text-3xl text-lg flex justify-center items-center gap-5">
            <a href="https://www.facebook.com/YadgarFashions" target="_blank()">
              <FaFacebookSquare style={{ color: '#007cf7' }} /></a>
            <FaInstagram style={{ color: '#c60e83ff' }} className="!cursor-pointer" />
            <a href="https://wa.me/+1267512195"
              target="_blank()">

              <FaWhatsappSquare style={{ hover: '#C68E17' }} className="!text-green-400 !cursor-pointer" />
            </a>
            <FaTiktok style={{ color: '#F5F5F5' }} className="!cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
}
