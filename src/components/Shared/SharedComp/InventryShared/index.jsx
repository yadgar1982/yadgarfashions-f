import { Button, Card, Divider, Select, Table, Tag } from "antd";
import { CalendarFilled, CheckOutlined, CheckSquareFilled, ClockCircleOutlined, CloseCircleOutlined, EditOutlined, GiftOutlined, ReloadOutlined, TruckFilled, TruckOutlined } from "@ant-design/icons";
import ReactApexChart from "react-apexcharts";
import Cookies from "universal-cookie";
import { useEffect, useState } from "react";
import { http } from "../../../../../module/http";
import { IoAirplaneOutline } from "react-icons/io5";


const cookies = new Cookies();

const products = {
    series: [44, 55, 13, 33],
    options: {
        chart: {
            width: 380,
            type: 'donut',
        },
        dataLabels: {
            enabled: false
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    show: false
                }
            }
        }],
        legend: {
            position: 'right',
            offsetY: 0,
            height: 230,
            show: false,
        },
    },
}

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
    },
    {
        title: 'Revenue',
        dataIndex: 'revenue',
    },
    {
        title: 'Stock Status',
        dataIndex: 'stock',
    },
    {
        title: 'Action',
        dataIndex: 'action',
    },
];

const data = [
    {
        key: '1',
        name: (
            <div className="flex items-center font-semibold gap-x-2">
                <img width={60} className="rounded-full" src="/headphone-1.jpg" alt="headphone-1.jpg" />
                <p>Earphone</p>
            </div>
        ),
        revenue: '$100',
        stock: <Tag color="yellow">15 Available</Tag>,
        action: <Button icon={<EditOutlined />} type="text"
            size="small"
            shape="circle"
            className="text-blue-400"
        />
    },
    {
        key: '2',
        name: (
            <div className="flex items-center font-semibold gap-x-2">
                <img width={60} className="rounded-full" src="/headphone.jpg" alt="headphone-1.jpg" />
                <p>Earphone</p>
            </div>
        ),
        revenue: '$100',
        stock: <Tag color="red">16 Available</Tag>,
        action: <Button icon={<EditOutlined />} type="text"
            size="small"
            shape="circle"
            className="text-blue-400"
        />
    },
    {
        key: '3',
        name: (
            <div className="flex items-center font-semibold gap-x-2">
                <img width={60} className="rounded-full" src="/headphone.jpg" alt="headphone-1.jpg" />
                <p>Earphone</p>
            </div>
        ),
        revenue: '$100',
        stock: <Tag color="red">16 Available</Tag>,
        action: <Button icon={<EditOutlined />} type="text"
            size="small"
            shape="circle"
            className="text-blue-400"
        />
    },
];

const InventryShared = () => {
    // get token from cookies
    const token = cookies.get("authToken");
    // states collection
    const [orderStatus, setOrderStatus] = useState([]);
    const [loading, setLoading] = useState(false);

    // fetch all categorys
    const fetchOrderStatus = async () => {
        try {
            setLoading(true);
            const httpReq = http(token);
            const { data } = await httpReq.get(`/api/order/status-counts`);
            console.log(data);
            setOrderStatus(data);
        } catch (error) {
            console.error('Error fetching categorys:', error);
        } finally {
            setLoading(false);
        }
    };

    // calling fetchcategory function
    useEffect(() => {
        fetchOrderStatus();
    }, []);

    return (
        <div>
            <div>
                <div className="flex text-xl text-zinc-600 uppercase font-semibold my-4 justify-between">
                    <h2>Orders Sales Activity</h2>
                </div>
                <div className="grid md:grid-cols-6 gap-4">
                    <div className="shadow flex gap-y-4 flex-col items-center justify-center p-4">
                        <Button
                            icon={<ClockCircleOutlined />}
                            size="large"
                            shape="circle"
                            type="text"
                            className="bg-cyan-100 text-cyan-600"
                        />
                        <h3 className="text-3xl font-bold">
                            {orderStatus.pending || 0}
                        </h3>
                        <h3 className="text-xl text-zinc-400 font-semibold uppercase">
                            pending
                        </h3>
                    </div>
                    <div className="shadow flex gap-y-4 flex-col items-center justify-center p-4">
                        <Button
                            icon={<CheckOutlined />}
                            size="large"
                            shape="circle"
                            type="text"
                            className="bg-green-100 text-green-600"
                        />
                        <h3 className="text-3xl font-bold">
                            {orderStatus.confirmed || 0}
                        </h3>
                        <h3 className="text-xl text-zinc-400 font-semibold uppercase">
                            confirmed
                        </h3>
                    </div>
                    <div className="shadow flex gap-y-4 flex-col items-center justify-center p-4">
                        <Button
                            icon={<ReloadOutlined />}
                            size="large"
                            shape="circle"
                            type="text"
                            className="bg-amber-100 text-amber-600"
                        />
                        <h3 className="text-3xl font-bold">
                            {orderStatus.production || 0}
                        </h3>
                        <h3 className="text-xl text-zinc-400 font-semibold uppercase">
                            production
                        </h3>
                    </div>
                    <div className="shadow flex gap-y-4 flex-col items-center justify-center p-4">
                        <Button
                            icon={<CheckOutlined />}
                            size="large"
                            shape="circle"
                            type="text"
                            className="bg-lime-100 text-lime-600"
                        />
                        <h3 className="text-3xl font-bold">
                            {orderStatus.completed || 0}
                        </h3>
                        <h3 className="text-xl text-zinc-400 font-semibold uppercase">
                            completed
                        </h3>
                    </div>
                    <div className="shadow flex gap-y-4 flex-col items-center justify-center p-4">
                        <Button
                            icon={<GiftOutlined />}
                            size="large"
                            shape="circle"
                            type="text"
                            className="bg-violet-100 text-violet-600"
                        />
                        <h3 className="text-3xl font-bold">
                            {orderStatus.packed || 0}
                        </h3>
                        <h3 className="text-xl text-zinc-400 font-semibold uppercase">
                            packed
                        </h3>
                    </div>
                    <div className="shadow flex gap-y-4 flex-col items-center justify-center p-4">
                        <Button
                            icon={<TruckOutlined />}
                            size="large"
                            shape="circle"
                            type="text"
                            className="bg-rose-100 text-rose-600"
                        />
                        <h3 className="text-3xl font-bold">
                            {orderStatus.shipped || 0}
                        </h3>
                        <h3 className="text-xl text-zinc-400 font-semibold uppercase">
                            shipped 
                        </h3>
                    </div>
                    <div className="shadow flex gap-y-4 flex-col items-center justify-center p-4">
                        <Button
                            icon={<IoAirplaneOutline />}
                            size="large"
                            shape="circle"
                            type="text"
                            className="bg-blue-100 text-blue-600"
                        />
                        <h3 className="text-3xl font-bold">
                            {orderStatus.ontheway || 0}
                        </h3>
                        <h3 className="text-xl text-zinc-400 font-semibold uppercase">
                            on the way
                        </h3>
                    </div>
                    <div className="shadow flex gap-y-4 flex-col items-center justify-center p-4">
                        <Button
                            icon={<CheckOutlined />}
                            size="large"
                            shape="circle"
                            type="text"
                            className="bg-teal-100 text-teal-600"
                        />
                        <h3 className="text-3xl font-bold">
                            {orderStatus.delivered || 0}
                        </h3>
                        <h3 className="text-xl text-zinc-400 font-semibold uppercase">
                            delivered
                        </h3>
                    </div>
                    <div className="shadow flex gap-y-4 flex-col items-center justify-center p-4">
                        <Button
                            icon={<CloseCircleOutlined />}
                            size="large"
                            shape="circle"
                            type="text"
                            className="bg-fuchsia-100 text-fuchsia-600"
                        />
                        <h3 className="text-3xl font-bold">
                            {orderStatus.cancelled || 0}
                        </h3>
                        <h3 className="text-xl text-zinc-400 font-semibold uppercase">
                            cancelled
                        </h3>
                    </div>
                </div>
                {/* <div className="md:col-span-2 shadow p-4">
                    <div className="flex flex-col h-full justify-between">
                        <div className="shadow p-4 flex items-center justify-between">
                            <h2 className="uppercase font-semibold">
                                quantity to be recieved
                            </h2>
                            <p className="font-bold text-zinc-400">520</p>
                        </div>
                        <div className="shadow p-4 flex items-center justify-between">
                            <h2 className="uppercase font-semibold">
                                quantity to be recieved
                            </h2>
                            <p className="font-bold text-zinc-400">520</p>
                        </div>
                    </div>
                </div> */}
                <div className="grid mt-4 md:grid-cols-2 gap-4">
                    <div className="shadow p-4">
                        <div className="grid md:grid-cols-2">
                            <div className="flex flex-col justify-center gap-y-12">
                                <div className="flex justify-between">
                                    <h2 className="font-semibold text-red-500">
                                        Stockout Items
                                    </h2>
                                    <h3 className="font-semibold text-red-500">
                                        234
                                    </h3>
                                </div>
                                <div className="flex justify-between">
                                    <h2 className="font-semibold text-zinc-700">
                                        Low Stack Items
                                    </h2>
                                    <h3 className="font-semibold text-zinc-700">
                                        123
                                    </h3>
                                </div>
                                <div className="flex justify-between">
                                    <h2 className="font-semibold text-zinc-700">
                                        Available Items
                                    </h2>
                                    <h3 className="font-semibold text-zinc-700">
                                        3254
                                    </h3>
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <ReactApexChart
                                    options={products.options}
                                    series={products.series}
                                    type="donut" width={300}
                                />
                            </div>
                        </div>
                        <Divider />
                        <div className="flex justify-between items-center">
                            <h4 className="text-lg text-zinc-500 font-semibold">
                                Purchase Order
                            </h4>
                            <Select
                                showSearch
                                placeholder="Select a person"
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={[
                                    {
                                        value: 'this year',
                                        label: 'This Year',
                                    },
                                    {
                                        value: 'this month',
                                        label: 'This Month',
                                    },
                                    {
                                        value: 'last month',
                                        label: 'Last Month',
                                    },
                                ]}
                            />
                        </div>
                        <div className="py-4 px-12 flex justify-between my-4">
                            <div className="flex flex-col items-center">
                                <h2 className="text-lg text-gray-500 mb-2 font-semibold">
                                    Quantity Ordered
                                </h2>
                                <h2 className="text-lg text-blue-400 font-semibold">
                                    412
                                </h2>
                            </div>
                            <div className="flex flex-col items-center">
                                <h2 className="text-lg text-gray-500 mb-2 font-semibold">
                                    Total Cost
                                </h2>
                                <h2 className="text-lg text-blue-400 font-semibold">
                                    $25410
                                </h2>
                            </div>
                        </div>
                    </div>
                    <div className="shadow p-4">
                        <div className="flex justify-between items-center">
                            <h4 className="text-lg text-zinc-500 font-semibold">
                                Top selling products
                            </h4>
                            <Select
                                showSearch
                                placeholder="Select a person"
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={[
                                    {
                                        value: 'this year',
                                        label: 'This Year',
                                    },
                                    {
                                        value: 'this month',
                                        label: 'This Month',
                                    },
                                    {
                                        value: 'last month',
                                        label: 'Last Month',
                                    },
                                ]}
                            />
                        </div>
                        <Divider />
                        <Table
                            columns={columns}
                            dataSource={data}
                            size="middle"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default InventryShared;