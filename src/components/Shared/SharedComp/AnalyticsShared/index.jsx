import { Card, Button } from "antd";
import {
    AudioOutlined,
    CaretDownFilled,
    CaretUpFilled,
    CommentOutlined,
    EnvironmentOutlined,
    GiftOutlined,
    HeartFilled,
    LikeOutlined,
    MessageOutlined,
    MoreOutlined,
    RiseOutlined,
    UsergroupAddOutlined,
    WifiOutlined
} from "@ant-design/icons";
import ReactApexChart from "react-apexcharts";

const followers = {
    series: [{
        name: 'Sales',
        data: [4, 3, 10, 9, 29, 19, 22, 9, 12, 7, 19, 5, 13, 9, 17, 2, 7, 5]
    }],
    options: {
        chart: {
            height: 350,
            type: 'line',
            toolbar: false,
        },
        forecastDataPoints: {
            count: 7
        },
        stroke: {
            width: 5,
            curve: 'smooth'
        },
        xaxis: {
            type: 'datetime',
            categories: ['1/11/2000', '2/11/2000', '3/11/2000', '4/11/2000', '5/11/2000', '6/11/2000', '7/11/2000', '8/11/2000', '9/11/2000', '10/11/2000', '11/11/2000', '12/11/2000', '1/11/2001', '2/11/2001', '3/11/2001', '4/11/2001', '5/11/2001', '6/11/2001'],
            tickAmount: 10,
            labels: {
                formatter: function (value, timestamp, opts) {
                    return opts.dateFormatter(new Date(timestamp), 'dd MMM')
                }
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                gradientToColors: ['#FDD835'],
                shadeIntensity: 1,
                type: 'horizontal',
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100, 100, 100]
            },
        }
    },
}

const AnalyticsShared = () => {
    return (
        <div>
            <div className="grid md:grid-cols-4 my-4 gap-4">
                <Card className="shadow">
                    <div className="flex flex-col justify-center items-center gap-y-3">
                        <Button
                            icon={<UsergroupAddOutlined />}
                            size="large"
                            shape="circle"
                            type="text"
                            className="bg-blue-100 text-blue-600"
                        />
                        <div className="text-center">
                            <h1 className="text-5xl font-semibold text-zinc-700">
                                30.2K
                            </h1>
                            <p className="mt-2 text-sm text-zinc-400">
                                Followers
                            </p>
                        </div>
                        <Button
                            icon={<CaretDownFilled />}
                            type="text"
                            style={{ borderRadius: 20 }}
                            className="bg-blue-100 text-blue-600"
                        >
                            12.6%
                        </Button>
                    </div>
                </Card>
                <Card className="shadow">
                    <div className="flex flex-col justify-center items-center gap-y-3">
                        <Button
                            icon={<LikeOutlined />}
                            size="large"
                            shape="circle"
                            type="text"
                            className="bg-green-100 text-green-600"
                        />
                        <div className="text-center">
                            <h1 className="text-5xl font-semibold text-zinc-700">
                                30.2K
                            </h1>
                            <p className="mt-2 text-sm text-zinc-400">
                                Impressions
                            </p>
                        </div>
                        <Button
                            icon={<CaretUpFilled />}
                            type="text"
                            style={{ borderRadius: 20 }}
                            className="bg-green-100 text-green-600"
                        >
                            12.6%
                        </Button>
                    </div>
                </Card>
                <Card className="shadow">
                    <div className="flex flex-col justify-center items-center gap-y-3">
                        <Button
                            icon={<WifiOutlined />}
                            size="large"
                            shape="circle"
                            type="text"
                            className="bg-rose-100 text-rose-600"
                        />
                        <div className="text-center">
                            <h1 className="text-5xl font-semibold text-zinc-700">
                                1.2K
                            </h1>
                            <p className="mt-2 text-sm text-zinc-400">
                                Connect
                            </p>
                        </div>
                        <Button
                            icon={<CaretUpFilled />}
                            type="text"
                            style={{ borderRadius: 20 }}
                            className="bg-rose-100 text-rose-600"
                        >
                            12.6%
                        </Button>
                    </div>
                </Card>
                <Card className="shadow">
                    <div className="flex flex-col justify-center items-center gap-y-3">
                        <Button
                            icon={<MessageOutlined />}
                            size="large"
                            shape="circle"
                            type="text"
                            className="bg-orange-100 text-orange-600"
                        />
                        <div className="text-center">
                            <h1 className="text-5xl font-semibold text-zinc-700">
                                18.2K
                            </h1>
                            <p className="mt-2 text-sm text-zinc-400">
                                Rate Reviews
                            </p>
                        </div>
                        <Button
                            icon={<CaretUpFilled />}
                            type="text"
                            style={{ borderRadius: 20 }}
                            className="bg-orange-100 text-orange-600"
                        >
                            12.6%
                        </Button>
                    </div>
                </Card>
            </div>
            <div className="flex flex-col">
                <h1 className="text-3xl my-6 font-bold">
                    Most <span className="text-blue-400">Recent Media</span>
                </h1>
                <div className="grid md:grid-cols-4 gap-4">
                    <div className="shadow-lg rounded-lg">
                        <img src="/sq-1.jpg" className="rounded-t" alt="/sq-1.jpg" />
                        <div className="flex text-semibold text-zinc-400 justify-between p-4">
                            <div className="flex gap-x-3">
                                <div className="flex gap-x-2">
                                    <HeartFilled />
                                    <h3>2.3k</h3>
                                </div>
                                <div className="flex gap-x-2">
                                    <CommentOutlined />
                                    <h3>900</h3>
                                </div>
                            </div>
                            <div>
                                <h3>
                                    23 Days ago
                                </h3>
                            </div>
                        </div>
                    </div>
                    <div className="shadow-lg rounded-lg">
                        <img src="/sq-2.jpg" className="rounded-t" alt="/sq-1.jpg" />
                        <div className="flex text-semibold text-zinc-400 justify-between p-4">
                            <div className="flex gap-x-3">
                                <div className="flex gap-x-2">
                                    <HeartFilled />
                                    <h3>2.3k</h3>
                                </div>
                                <div className="flex gap-x-2">
                                    <CommentOutlined />
                                    <h3>900</h3>
                                </div>
                            </div>
                            <div>
                                <h3>
                                    23 Days ago
                                </h3>
                            </div>
                        </div>
                    </div>
                    <div className="shadow-lg rounded-lg">
                        <img src="/sq-3.jpg" className="rounded-t" alt="/sq-1.jpg" />
                        <div className="flex text-semibold text-zinc-400 justify-between p-4">
                            <div className="flex gap-x-3">
                                <div className="flex gap-x-2">
                                    <HeartFilled />
                                    <h3>2.3k</h3>
                                </div>
                                <div className="flex gap-x-2">
                                    <CommentOutlined />
                                    <h3>900</h3>
                                </div>
                            </div>
                            <div>
                                <h3>
                                    23 Days ago
                                </h3>
                            </div>
                        </div>
                    </div>
                    <div className="shadow-lg rounded-lg">
                        <img src="/sq-4.jpg" className="rounded-t" alt="/sq-1.jpg" />
                        <div className="flex text-semibold text-zinc-400 justify-between p-4">
                            <div className="flex gap-x-3">
                                <div className="flex gap-x-2">
                                    <HeartFilled />
                                    <h3>2.3k</h3>
                                </div>
                                <div className="flex gap-x-2">
                                    <CommentOutlined />
                                    <h3>900</h3>
                                </div>
                            </div>
                            <div>
                                <h3>
                                    23 Days ago
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-5">
                <Card
                    title={
                        <h1 className="text-3xl text-zinc-600 font-semibold">Follower Growth</h1>
                    }
                    extra={
                        <Button
                            icon={<MoreOutlined />}
                            shape="circle"
                            size="large"
                            type="text"
                        />
                    }
                >
                    <div className="flex gap-4">
                        <div className="w-5/12 flex flex-col gap-y-3 justify-center items-center">
                            <h2 className="text-5xl text-blue-400 font-bold">
                                4,800
                            </h2>
                            <p className="text-sm font-semibold text-zinc-400">
                                Gained Followers (last 360 days)
                            </p>
                            <div className="flex items-center mt-5 gap-x-3">
                                <Button
                                    icon={<RiseOutlined />}
                                    shape="circle"
                                    size="small"
                                    type="primary"
                                    className="bg-orange-500"
                                />
                                <p className="font-semibold text-sm">
                                    You have a <span className="text-orange-500">20% Growth </span>
                                    compare to last year
                                </p>
                            </div>
                            <div className="flex items-center mt-2 gap-x-3">
                                <Button
                                    icon={<RiseOutlined />}
                                    shape="circle"
                                    size="small"
                                    type="primary"
                                    className="bg-blue-500"
                                />
                                <p className="font-semibold text-sm">
                                    You have reached <span className="text-blue-500">10% </span>
                                    of your followers goal
                                </p>
                            </div>
                        </div>
                        <div className="w-7/12">
                            <ReactApexChart
                                options={followers.options}
                                series={followers.series}
                                type="line"
                                height={350}
                            />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
export default AnalyticsShared;