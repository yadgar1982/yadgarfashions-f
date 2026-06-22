import React, { useEffect, useState } from 'react';
import Cookies from "universal-cookie";
const cookies = new Cookies();
import { Link, useNavigate } from 'react-router-dom';

import {
  AppstoreAddOutlined,
  AreaChartOutlined,
  BarChartOutlined,
  BellOutlined,
  BookOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  CheckSquareOutlined,
  ClockCircleOutlined,
  DashboardOutlined,
  DeploymentUnitOutlined,
  GiftOutlined,
  HeatMapOutlined,
  HomeOutlined,
  InboxOutlined,
  LogoutOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  NotificationOutlined,
  ProductOutlined,
  ReloadOutlined,
  RiseOutlined,
  SettingOutlined,
  TruckOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Avatar, Button, Dropdown, Layout, Menu, theme } from 'antd';
import { useLocation } from 'react-router-dom';
import { IoAirplaneOutline } from "react-icons/io5";
import { TbTruckDelivery } from "react-icons/tb";

const { Header, Sider, Content } = Layout;

const menus = [
  {
    key: '/employee',
    icon: <DashboardOutlined className='!text-2xl !text-[#910a52] font-bold' />,
    label: <Link to="/employee" className='!text-sm !text-[#910a52] font-bold'>Dashboard</Link>,
  },
  {
    key: 'products',
    icon: <ProductOutlined className='!text-2xl !text-[#910a52] font-bold' />,
    label: <span className='!text-sm !text-[#910a52] font-bold'>Products</span>,
    children: [
      {
        key: '/employee/products',
        icon: <GiftOutlined className='!text-xl !text-blue-500 font-bold' />,
        label: <Link to="/employee/products" className=' !text-zinc-500 font-semibold'>Products</Link>,
      },
      {
        key: '/employee/showcase',
        icon: <AppstoreAddOutlined className='!text-xl !text-blue-500 font-bold' />,
        label: <Link to="/employee/showcase" className=' !text-zinc-500 font-semibold'>Showcase</Link>,
      },
    ]
  },
  {
    key: '/employee/accounts',
    icon: <UserOutlined className='!text-2xl !text-[#910a52] font-bold' />,
    label: <span className='!text-sm !text-[#910a52] font-bold'>Accounts</span>,
    children: [
      {
        key: '/employee/supplier',
        icon: <HomeOutlined className='!text-xl !text-blue-500 font-bold' />,
        label: <Link to="/employee/supplier" className=' !text-zinc-500 font-semibold'>Supplier</Link>,
      },
      {
        key: '/employee/dealer',
        icon: <HomeOutlined className='!text-xl !text-blue-500 font-bold' />,
        label: <Link to="/employee/dealer" className=' !text-zinc-500 font-semibold'>Dealer</Link>,
      },


    ]
  },
  {
    key: '/employee/reports',
    icon: <BookOutlined className='!text-2xl !text-[#910a52] font-bold' />,
    label: <span className='!text-sm !text-[#910a52] font-bold'>Reports</span>,
    children: [
      {
        key: '/employee/analytics',
        icon: <BarChartOutlined className='!text-xl !text-blue-500 font-bold' />,
        label: <Link to="/employee/analytics" className=' !text-zinc-500 font-semibold'>Analytics</Link>,
      },
      {
        key: '/employee/inventry',
        icon: <RiseOutlined className='!text-xl !text-blue-500 font-bold' />,
        label: <Link to="/employee/inventry" className=' !text-zinc-500 font-semibold'>Inventory</Link>,
      },

    ]
  },
  {
    key: '/order/details',
    icon: <NotificationOutlined className='!text-2xl !text-[#910a52] font-bold' />,
    label: <span className='!text-sm !text-[#910a52] font-bold'>Order Details</span>,
    children: [
      {
        key: '/employee/order-pending',
        icon: <ClockCircleOutlined className='!text-xl !text-blue-500 font-bold' />,
        label: <Link to="/employee/order-pending" className=' !text-zinc-500 font-semibold'>Pending orders</Link>,
      },
      {
        key: '/employee/order-confirmed',
        icon: <CheckCircleOutlined className='!text-xl !text-blue-500 font-bold' />,
        label: <Link to="/employee/order-confirmed" className=' !text-zinc-500 font-semibold'>Confirmed</Link>,
      },
      {
        key: '/employee/order-production',
        icon: <ReloadOutlined className='!text-xl !text-blue-500 font-bold' />,
        label: <Link to="/employee/order-production" className=' !text-zinc-500 font-semibold'>In-Production</Link>,
      },
      {
        key: '/employee/order-complete',
        icon: <CheckOutlined className='!text-xl !text-blue-500 font-bold' />,
        label: <Link to="/employee/order-complete" className=' !text-zinc-500 font-semibold'> Completed</Link>,
      },
      {
        key: '/employee/order-packing',
        icon: <GiftOutlined className='!text-xl !text-blue-500 font-bold' />,
        label: <Link to="/employee/order-packing" className=' !text-zinc-500 font-semibold'>Packed</Link>,
      },
      {
        key: '/employee/order-shiped',
        icon: <TruckOutlined className='!text-xl !text-blue-500 font-bold' />,
        label: <Link to="/employee/order-shiped" className=' !text-zinc-500 font-semibold'>Shiped</Link>,
      },
      {
        key: '/employee/order-way',
        icon: <IoAirplaneOutline className='!text-xl !text-blue-500 font-bold' />,
        label: <Link to="/employee/order-way" className=' !text-zinc-500 font-semibold'>On the way</Link>,
      },
      {
        key: '/employee/order-delivered',
        icon: <TbTruckDelivery className='!text-xl !text-blue-500 font-bold' />,
        label: <Link to="/employee/order-delivered" className=' !text-zinc-500 font-semibold'>Delivered</Link>,
      },
      {
        key: '/employee/order-cancelled',
        icon: <TbTruckDelivery className='!text-xl !text-blue-500 font-bold' />,
        label: <Link to="/employee/order-cancelled" className=' !text-zinc-500 font-semibold'>Cancelled</Link>,
      }
    ]
  },

]

const EmployeeLayout = ({ children }) => {

  const items = [
    {
      key: '1',
      label: (
        <Link to='#' className='flex items-center gap-x-2'>
          <UserOutlined />
          Profile
        </Link>
      )
    },
    {
      key: '2',
      label: (
        <Link to='#' className='flex items-center gap-x-2'>
          <SettingOutlined />
          Settings
        </Link>
      )
    },
    {
      key: '3',
      label: (
        <Link
          to="/logout"
          className='flex border-none items-center p-0 gap-x-2'>
          <LogoutOutlined />
          logout
        </Link>
      )
    }
  ]

  // reading pathname
  const location = useLocation();
  const { pathname } = location;
  // state collections
  const [collapsed, setCollapsed] = useState(false);
  const [margin, setMargin] = useState(null);
  const [openKeys, setOpenKeys] = useState([]);

  useEffect(() => {
    const path = location.pathname;
    // If route starts with "/employee/order-", keep Order Details open
    if (path.startsWith("/employee/order-")) {
      setOpenKeys(['/order/details']);
    } else {
      setOpenKeys([]);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (collapsed) {
      setMargin(80)
    }
    else {
      setMargin(200)
    }
  }, [collapsed])

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Sider
        theme='light'
        trigger={null}
        collapsible
        collapsed={collapsed}
        className='min-h-screen'
        style={{
          overflow: 'auto',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1,
        }}
      >
        <div className="text-center my-4">
          {
            !collapsed ?
              <h1 className='font-bold text-3xl text-zinc-500'>E-commerce</h1>
              :
              <h1 className='font-bold text-3xl text-zinc-500'>E-C</h1>
          }
        </div>
        <Menu
          className='font-semibold mt-3'
          theme="light"
          mode="inline"
          selectedKeys={[pathname]}
          items={menus}
          openKeys={openKeys}
          onOpenChange={(keys) => setOpenKeys(keys)} // allow manual open/close
        />
      </Sider>
      <Layout
        style={{
          marginLeft: margin,
          transition: '0.3s'
        }}
      >
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            position: 'sticky',
            top: 0,
            zIndex: 1
          }}
          className='flex shadow justify-between items-center'
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <div className='flex gap-x-3 mx-4'>
            <Button
              icon={<MailOutlined />}
              type='text'
              shape='circle'
              className='bg-green-100 text-green-600'
            />
            <Button
              icon={<BellOutlined />}
              type='text'
              shape='circle'
              className='bg-rose-100 text-rose-600'
            />
            <Dropdown
              menu={{ items }}
              arrow
              placement='bottomRight'
            >
              <Avatar className='bg-gray-500 text-white font-bold'>
                A
              </Avatar>
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default EmployeeLayout;