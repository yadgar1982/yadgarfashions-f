import React, { useState } from 'react';
import 'animate.css';
import MyFooter from '../Footer/Footer';
import {
    BellOutlined,
    LoginOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    ProfileOutlined,
    ShoppingCartOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Avatar, Select, Badge, Button, Drawer, Dropdown, Image, Layout, theme } from 'antd';
import { Link } from 'react-router-dom';
const { Header, Content } = Layout;
import { fetchData, http } from '../../../../module/http';
import useSWR from 'swr';
import Cookies from "universal-cookie";
import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import LanguageSwitcher from '../LanguageSwitcher';
import i18n from 'i18next';
// const slugify = str => str.toLowerCase().replace(/\s+/g, '-');
import { useTranslation } from 'react-i18next';
import { resetExchange, setExchange } from '../../../../redux/slices/exchange.slice';
import { fetchBranding } from '../../../../redux/features/branding/brandingSlice';
import { fetchCurrencies } from '../../../../redux/features/currency/currencySlice';
import { fetchBrands } from '../../../../redux/features/brand/brandSlice';
import { fetchAdds } from '../../../../redux/features/adds/addsSlice';
import { fetchShowcases } from '../../../../redux/features/showcase/showcaseSlice';
import { fetchCategories } from '../../../../redux/features/category/categorySlice';
import { fetchDealers } from '../../../../redux/features/dealer/dealerSlice';

const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const cookies = new Cookies();

const HomeLayout = ({ children }) => {
    const { t } = useTranslation('home');

    // react redux
    const dispatch = useDispatch();
    const exchangeSlice = useSelector(res => res.exchangeSlice);

    useEffect(() => {
        document.documentElement.dir = ['ps', 'fa'].includes(i18n.language) ? 'rtl' : 'ltr';
    }, [i18n.language]);


    // get token from cookies
    const token = cookies.get("authToken");
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));


    // entities
    const entities = [
        { name: "branding", fetcher: fetchBranding },
        { name: "currency", fetcher: fetchCurrencies },
        { name: "brand", fetcher: fetchBrands },
        { name: "adds", fetcher: fetchAdds },
        { name: "showcase", fetcher: fetchShowcases },
        { name: "category", fetcher: fetchCategories },
        { name: "dealer", fetcher: fetchDealers },
    ];

    const useMasterDataLoader = () => {
        const dispatch = useDispatch();
        entities.forEach(({ name, fetcher }) => {
            const status = useSelector((state) => state[name]?.status);
            useEffect(() => {
                if (status === "idle") {
                    dispatch(fetcher());
                }
            }, [status, dispatch, fetcher]);
        });
    };

    useMasterDataLoader();

    // state collections
    const [collapsed, setCollapsed] = useState(false);
    const [drawer, setDrawer] = useState(false);
    const [loader, setLoader] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState(exchangeSlice?.currencyCode);
    // theme setting
    const {
        token: { colorBgContainer, borderRadiusLG, footerBg = "red" },
    } = theme.useToken();

    // fetch data from redux
    const branding = useSelector(res => res.branding.branding);
    const currencies = useSelector(res => res.currency.currencies);
    const categories = useSelector(res => res.category.categories);

    // fetch categories
    const fields = ['categoryName']; // choose the fields you want
    const query = fields.join(',');

    const fetchWithToken = (url) => fetchData(url, token); // pass token

    // fetch cart data from api
    const { data: carts, error: cartError } = useSWR(
        token && `/api/cart/count?userId=${userInfo?.userId}`,
        token && fetchWithToken,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            refreshInterval: 1200000,
        }
    );


    // fetch  exchange rate
    const fetchExchangeRate = async (currencyCode, currency = exchangeSlice.currency) => {
        try {
            setLoader(true);
            const httpReq = http();
            const { data } = await httpReq.post(`/api/exchange/rate/${currencyCode}`);
            const { rate } = data;

            dispatch(setExchange({
                currencyCode: currencyCode,
                rate: rate,
                currency
            }));
        } catch (error) {
            console.log("Error fetchings exchange rate", error)
        } finally {
            setLoader(false);
        }
    }



    const handleChange = (value) => {
        const currency = currencies.find(item => item?.currencyCode?.toLowerCase() === value);
        fetchExchangeRate(currency?.currencyCode, currency?.currency);
        setSelectedCurrency(value);
    };

    // dropdown menu
    const items = token ?
        [
            {
                key: 'My Orders',
                label: (
                    <Link to='/profile' className='flex items-center gap-x-2'>
                        <ProfileOutlined />
                        {(t('My Orders'.trim()))}

                    </Link>
                )
            },
            {
                key: 'fullname',
                label: (
                    <Link className='flex items-center gap-x-2'>
                        <UserOutlined />
                        {userInfo?.fullname}
                    </Link>
                )
            },
            {
                key: 'logout',
                label: (
                    <Link to="/logout"
                        className='flex items-center gap-x-2'>
                        <LoginOutlined />
                        {capitalizeFirstLetter(t('logout').trim())}
                    </Link>
                )
            }
        ]
        :
        [
            {
                key: 'register',
                label: (
                    <Link to='/register' className='flex items-center gap-x-2'>
                        <UserOutlined />
                        {capitalizeFirstLetter(t('register').trim())}
                    </Link>
                )
            },
            {
                key: 'login',
                label: (
                    <Link to='/login' className='flex items-center gap-x-2'>
                        <LoginOutlined />
                        {capitalizeFirstLetter(t('login').trim())}
                    </Link>
                )
            }
        ]

    return (
        <Layout>
            <Header
                style={{
                    padding: 0,
                    background: colorBgContainer,
                    position: 'sticky',
                    top: 0,
                    zIndex: 100
                }}
            >
                <div className='w-full !bg-[#C68E17] h-10 text-white flex items-center justify-center hidden lg:flex '>
                    <span className='capitalize text-lg animate__animated animate__zoomIn'>
                        {capitalizeFirstLetter(t('Our product base prices are in USD. Minor differences may occur in other currencies due to varying exchange rates').trim())}
                    </span>
                </div>
                <div className='flex !text-white md:text-zinc-500 shadow justify-between md:bg-white bg-[#C68E17] items-center !h-14 '>
                    <div className=' gap-6 items-center hidden lg:flex'>
                        <Image
                            src={branding && branding?.logo}
                            width={100} height={50}
                            className=' !mx-3 !p-1'
                            preview={false}
                        />
                        <h2 className='font-bold text-2xl text-[#3d3100] pt-2 ' style={{ fontFamily: "times", }}>
                            {t()}
                        </h2>
                        <Link
                            className='font-semibold capitalize text-[#3d3100]'
                            to="/"
                        >
                            {capitalizeFirstLetter(t('home').trim())}
                        </Link>

                        {
                            categories && categories?.categories.map((cat, index) => {
                                if (cat.categoryName.toLowerCase() != 'home') {
                                    return <Link
                                        key={index}
                                        to={`/cat/${cat?._id.toLowerCase().replace(/\s+/g, '')}?categoryName=${cat.categoryName}`}
                                        className="font-semibold capitalize text-[#3d3100]"
                                    >
                                        {t(cat.categoryName.trim().toLowerCase().replace(/\s+/g, ''))}
                                    </Link>
                                }
                            })
                        }
                        {token && (
                            <Link to="/profile/delivered" className="flex items-center gap-x-2 text-[#3d3100] font-semibold">
                                {t('My Orders History')}
                            </Link>
                        )}
                        <LanguageSwitcher className="!border-none !text-[#3d3100]" />
                    </div>
                    <div className=''>

                        <div className='flex gap-x-3 items-center mx-4'>

                            {
                                token &&
                                <Badge className='md:hidden flex' count={carts && carts?.carts}>
                                    <Link to="/cart">
                                        <Button
                                            icon={<ShoppingCartOutlined />}
                                            type='text'
                                            shape='circle'
                                            className='bg-white !border border-[#3d3100] text-[#3d3100]'
                                        />
                                    </Link>
                                </Badge>
                            }

                            <Select
                                className="w-[130px] text-sm  !border-none !shadow-none [&_.ant-select-selector]:!bg-transparent [&_.ant-select-selector]:!border-none [&_.ant-select-selector]:!shadow-none md:!text-[#3d3100] !text-white !font-semibold !bg-transparent"
                                value={selectedCurrency?.toLowerCase()}
                                onChange={handleChange}
                            >
                                {
                                    currencies && currencies.map((item, index) => (
                                        <Select.Option
                                            key={index}
                                            className="uppercase !bg-transparent flex !gap-1 !text-[#3d3100] !font-semibold"
                                            value={item?.currencyCode?.toLowerCase()}
                                        >
                                            <div style={{ display: "flex", alignItems: "center" }} className='gap-1'>
                                                <img
                                                    src={item.flag}
                                                    alt={item.currency}
                                                    style={{ width: 30, marginRight: 8 }}
                                                />
                                                <span className='!text-[#3d3100] !font-semibold'>{item.currencyCode?.toUpperCase()}</span>
                                            </div>
                                        </Select.Option>
                                    ))
                                }
                            </Select>

                            {
                                token &&
                                <Badge className='hidden md:flex' count={carts && carts?.carts}>
                                    <Link to="/cart">
                                        <Button
                                            icon={<ShoppingCartOutlined />}
                                            type='text'
                                            shape='circle'
                                            className='bg-white !border border-[#3d3100] text-[#3d3100]'
                                        />
                                    </Link>
                                </Badge>
                            }

                            <Button
                                icon={<BellOutlined />}
                                type='text'
                                shape='circle'
                                className='hidden md:flex bg-white !border border-[#3d3100] text-[#3d3100]'
                            />
                            <Dropdown
                                menu={{ items }}
                                arrow
                                placement='bottomRight'
                                className='hidden md:block'
                            >
                                <Avatar className='bg-white !border border-[#3d3100] text-[#3d3100]'>
                                    <UserOutlined />
                                </Avatar>
                            </Dropdown>
                        </div>
                    </div>
                    <div className='lg:hidden flex items-center justify-center'>
                        <LanguageSwitcher className="!border-none !text-[#3d3100]" />
                        <Button
                            onClick={() => setDrawer(true)}
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 80,
                                color: "white"
                            }}
                        />
                    </div>
                </div>


            </Header>
            <Content
                className='!p-0 md:!p-4 !m-0 md:!mt-8'
                style={{
                    //margin: '0px 0px',
                    //padding: 24,
                    minHeight: 280,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                }}
            >
                {children}

            </Content>

            <Drawer
                className="[&_.ant-drawer-header]:bg-[#C68E17] [&_.ant-drawer-body]:bg-gray [&_.ant-drawer-header]:!h-[56px]"
                open={drawer}
                onClose={() => setDrawer(false)}
                width={220}
                extra={
                    <div className='flex gap-x-3 items-center mx-4 '>
                        <Badge count={carts && carts?.carts}>
                            <Link to="/cart">
                                <Button
                                    icon={<ShoppingCartOutlined />}
                                    type='text'
                                    shape='circle'
                                    className='bg-white !border border-[#3d3100] text-[#3d3100]'
                                />
                            </Link>
                        </Badge>
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
                                <UserOutlined />
                            </Avatar>
                        </Dropdown>
                    </div>
                }
            >
                <div className='flex'>
                    <Link

                        className='font-semibold capitalize !text-[#3d3100] !font-semibold !border !border-dashed rounded p-1 hover:bg-orange-200 !border-[#f1ca5c] !px-2 !w-full '
                        to="/"
                    >
                        {capitalizeFirstLetter(t('home').trim())}
                    </Link>
                </div>

                <div className='flex flex-col gap-2 mt-2'>
                    {
                        categories && categories?.categories.map((cat, index) => {
                            if (cat.categoryName.toLowerCase() != 'home') {
                                return <Link
                                    key={index}
                                    to={`/cat/${cat?._id.toLowerCase().replace(/\s+/g, '')}?categoryName=${cat.categoryName}`}
                                    className="font-semibold capitalize !text-[#3d3100] !font-semibold !border !border-dashed !border-[#f1ca5c] rounded p-1 hover:bg-orange-200 px-2 "
                                >
                                    {t(cat.categoryName.trim().toLowerCase().replace(/\s+/g, ''))}
                                </Link>
                            }
                        })
                    }
                    {/* <LanguageSwitcher /> */}
                </div>

            </Drawer>
            <MyFooter />

        </Layout>
    );
};
export default HomeLayout;