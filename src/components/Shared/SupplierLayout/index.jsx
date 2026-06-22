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

const DealerLayout = ({ children }) => {
    // get user info from localstorage
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

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

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout>
            <Layout>
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
                    <h1 className='text-xl font-bold mx-3'>
                        {userInfo?.supplierName}
                    </h1>
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
                                S
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
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default DealerLayout;