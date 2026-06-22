import { Card, Row, Col, Steps, theme, Typography, Button, Divider, List, Image, Table, Tooltip } from 'antd';
import { LogoutOutlined, EditOutlined, EyeOutlined, StarOutlined } from '@ant-design/icons';
import HomeLayout from '../../../Shared/HomeLayout';
import { fetchData, formatDate } from '../../../../../module/http';
const { Title, Text } = Typography;
import useSWR, { mutate } from "swr";
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DeliverdOrders = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  // states collection
  const [orderList, setOrdersList] = useState([]);

  const { data: userData, error: userError } = useSWR(
    `/api/user/id/${userInfo?.userId}`,
    fetchData,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 1200000,
    }
  );



  const { data: orders, error: ordErr } = useSWR(
    userInfo?.userId ? `/api/order/status?userId=${userInfo.userId}&status=delivered` : null,
    fetchData,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 1200000,
    }
  );


  //const total = orders?.reduce((sum, order) => sum + Number(order.totalPrice || 0), 0);


  const { token } = theme.useToken();


  const contentStyle = {
    //lineHeight: '260px',
    //textAlign: 'center',
    //color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    //borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
    padding: 16
  };

  const calculateCartTotals = (cartItems) => {
    return cartItems.reduce((totals, item) => {
      totals.totalQty += Number(item.productQty);
      totals.totalDiscount += ((Number(item.productRealPrice) * Number(item.productDiscountPercent)) / 100) * Number(item.productQty);
      totals.totalDelivery += 15 + ((Number(item.productQty - 1) * 15) * 100 / 100);
      totals.totalPrice += Number(item.productFinalPrice) * Number(item.productQty);
      return totals;
    }, { totalQty: 0, totalDiscount: 0, totalDelivery: 0, totalPrice: 0 });
  }

  const columns = [
    {
      title: "Image",
      dataIndex: "productImage",
      key: "productImage",
      render: (src) => <Image src={src} width={30} />
    },
    {
      title: "Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Price",
      dataIndex: "productFinalPrice",
      key: "productFinalPrice",
    },
    {
      title: "Quantity",
      dataIndex: "productQty",
      key: "productQty",
    },
    {
      title: "Color",
      dataIndex: "selectedColor",
      key: "selectedColor",
      render: (color) => (
        <div className="w-6 h-6 rounded-full border border-gray-300" style={{ backgroundColor: color }}></div>
      ),
    },
    {
      title: "Size",
      dataIndex: "selectedSize",
      key: "selectedSize",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Action",
      key: "action",
      render: (_, obj, index) => (
        <div className='flex gap-2 items-center'>
          <Tooltip
            title="Click here to Track your Order"
            overlayInnerStyle={{
              backgroundColor: "white",
              color: "#910a52",
              fontWeight: "bold",
              padding: "12px 12px",
              borderRadius: "3px",
              boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
            }}
          >
            <Button
              type='text'
              className='hover:!bg-[#f2dae6] hover:!border-[#910a52] hover:!text-[#910a52]'
              icon={<EyeOutlined />}
              onClick={() => {
                navigate("/ordered-status", { state: { order: obj } });
              }}
            />
          </Tooltip>
          <Tooltip
            title="Rate this product"
            overlayInnerStyle={{
              backgroundColor: "white",
              color: "#910a52",
              fontWeight: "bold",
              padding: "12px 12px",
              borderRadius: "3px",
              boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
            }}
          >
            {
              !obj.isRated &&
              <Button
                type='text'
                className='!bg-rose-500 !text-white hover:!bg-[#f2dae6] hover:!border-[#910a52] hover:!text-[#910a52]'
                icon={<StarOutlined />}
                onClick={() => {
                  navigate("/profile/product-rating", { state: { order: obj } });
                }}
              >Rate Now</Button>
            }
          </Tooltip>
        </div>
      )
    }
  ]


  return (
    <HomeLayout>
      <div className="max-w-4xl mx-auto mt-2 px-2">

        <Card
          bordered={false}
          className="mb-6 shadow-sm"
        >
          <Title level={4}>Delivered Orders</Title>
          <div>
            <List
              dataSource={orders?.orders}
              renderItem={(order) => {
                return (
                  <List.Item className="bg-white" style={{ border: 0 }}>
                    <div className="flex md:flex-col gap-4 items-start w-full">
                      <Card
                        title={
                          <div className='grid md:grid-cols-2 md:gap-3'>
                            <div className='py-3 flex flex-col gap-3'>
                              <div className='flex flex-col md:flex-row md:justify-between md:items-center'>
                                <span className="text-[12px] text-zinc-400">
                                  <span className="font-bold text-[12px] text-zinc-900">Order</span>  <span className='text-red-500'> # {order?.orderId}</span>
                                </span>
                              </div>
                              {/* <div className='flex flex-col md:flex-row md:justify-between md:items-center'>
                                <span className="text-[12px] text-zinc-400">
                                  <span className="font-bold text-[12px] text-zinc-900">
                                    Email &nbsp;
                                  </span>
                                  {order.customerEmail}
                                </span>
                              </div> */}
                              <div className='flex flex-col md:flex-row md:justify-between md:items-center'>

                                <span className="text-[12px] text-zinc-400">
                                  <span className="font-bold text-[12px] text-zinc-900">
                                    Deliver Date : &nbsp;
                                  </span>
                                  {formatDate(order.updatedAt)}
                                </span>
                              </div>
                            </div>
                            <div className='py-3 grid md:grid-cols-2 gap-2 md:gap-x-16'>
                              <div className='flex justify-between'>
                                <span className="font-bold text-[12px] text-zinc-900">
                                  Quantity : &nbsp;
                                </span>
                                <span className="text-[12px] text-zinc-400">
                                  {calculateCartTotals([order]).totalQty}
                                </span>
                              </div>
                              {/* <div className='flex justify-between'>
                                <span className="font-bold text-[12px] text-zinc-900">
                                  Price : &nbsp;
                                </span>
                                <span className="text-[12px] text-zinc-400">
                                  ${calculateCartTotals(order?.productList).totalPrice}
                                </span>
                              </div> */}
                              {/* <div className='flex justify-between'>
                                <span className="font-bold text-[12px] text-zinc-900">
                                  Discount : &nbsp;
                                </span>
                                <del className="text-[12px] text-zinc-400">
                                  ${calculateCartTotals(order?.productList).totalDiscount}
                                </del>
                              </div> */}
                              {/* <div className='flex justify-between'>
                                <span className="font-bold text-[12px] text-zinc-900">
                                  D-Charge : &nbsp;
                                </span>
                                <span className="text-[12px] text-zinc-400">
                                  ${calculateCartTotals(order?.productList).totalDelivery}
                                </span>
                              </div> */}
                              {/* <div className='flex justify-between'>
                                <span className="font-bold text-[12px] text-zinc-900">
                                  Taxes : &nbsp;
                                </span>
                                <span className="text-[12px] text-zinc-400">
                                  ${(calculateCartTotals(order?.productList).totalPrice*10)/100}
                                </span>
                              </div> */}
                              <div className='flex justify-between'>
                                <span className="font-bold text-[12px] text-zinc-900">
                                  Price : &nbsp;
                                </span>
                                <span className="text-[12px] text-zinc-400">

                                  ${
                                    (
                                      Number(order.productQty)
                                      *
                                      Number(order.productFinalPrice)
                                      + 15
                                    ).toFixed(2)
                                  }
                                </span>
                              </div>
                            </div>
                          </div>
                        }
                        style={{
                          width: '100%',
                          padding: 0,
                          overflowX: 'auto'
                        }}
                      >
                        <Table
                          columns={columns}
                          rowKey={order._id}
                          dataSource={[order]}
                          scroll={{ x: 'max-content' }}
                          pagination={false}
                          className='mb-3'
                        />
                        <div className="flex">
                          <b>Address : </b>
                          <span>&nbsp;{order?.customerAddress}</span>
                        </div>
                      </Card>
                    </div>
                  </List.Item>
                );
              }}
            />

          </div>
          {/* <Button type="link" href={`/orders/${order.id}`}>View</Button> */}
          {/* <Button type="link" href="/orders">View All Orders</Button> */}
        </Card>

        {/* <Card bordered={false} className="mb-6 shadow-sm">
          <Title level={4}>Shipping Address</Title>
          <Text level={4} className='text-zinc-500 '>{shippingAddress.address}</Text><br /><br />
          <Button icon={<EditOutlined />} >Edit Address</Button>
        </Card> */}

        <Divider />

        {/* <Button
        danger
        type="primary"
        icon={<LogoutOutlined />}
        onClick={handleLogout}
      >
        Logout
      </Button> */}
      </div>
    </HomeLayout>
  );
};

export default DeliverdOrders;
