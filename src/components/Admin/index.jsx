import { 
    AudioOutlined, 
    CommentOutlined, 
    CopyOutlined, 
    DesktopOutlined, 
    EnvironmentOutlined, 
    EyeOutlined, 
    GiftOutlined,
    MoreOutlined,
    UsergroupAddOutlined 
} from "@ant-design/icons";
import Layout from "../Shared/Layout";
import { Button, Card, Select } from "antd";
import ReactApexChart from "react-apexcharts";

const productChart = {
    series: [
        {
            data: [
                {
                    x: '2022',
                    y: [3000, 6000]
                },
                {
                    x: '2009',
                    y: [3200, 4100]
                },
                {
                    x: '2010',
                    y: [2950, 7800]
                },
                {
                    x: '2011',
                    y: [3000, 4600]
                },
                {
                    x: '2012',
                    y: [3500, 4100]
                },
                {
                    x: '2013',
                    y: [4500, 6500]
                },
                {
                    x: '2014',
                    y: [4100, 5600]
                },
                {
                    x: '2015',
                    y: [1000, 7100]
                },
                {
                    x: '2016',
                    y: [8000, 1253]
                },
                {
                    x: '2017',
                    y: [2200, 6200]
                }
            ]
        }
    ],
    options: {
        chart: {
            height: 350,
            type: 'rangeBar',
            zoom: {
                enabled: false
            },
            toolbar: false
        },
        plotOptions: {
            bar: {
                isDumbbell: true,
                columnWidth: 3,
                dumbbellColors: [['#008FFB', '#00E396']]
            }
        },
        legend: {
            show: true,
            showForSingleSeries: true,
            position: 'top',
            horizontalAlign: 'left',
            customLegendItems: ['Product A', 'Product B']
        },
        fill: {
            type: 'gradient',
            gradient: {
                type: 'vertical',
                gradientToColors: ['#00E396'],
                inverseColors: true,
                stops: [0, 100]
            }
        },
        grid: {
            xaxis: {
                lines: {
                    show: true
                }
            },
            yaxis: {
                lines: {
                    show: false
                }
            }
        },
        xaxis: {
            tickPlacement: 'on'
        },
        yaxis: {
            min: 2500,
            max: 5000,
            tickAmount: 5,
            labels: {
                formatter: function (value) {
                    return value.toFixed(0);
                }
            }
        }
    },
}

const statistics = {
    series: [70],
    options: {
        chart: {
            height: 350,
            type: 'radialBar',
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            radialBar: {
                startAngle: -135,
                endAngle: 225,
                hollow: {
                    margin: 0,
                    size: '70%',
                    background: '#fff',
                    image: undefined,
                    imageOffsetX: 0,
                    imageOffsetY: 0,
                    position: 'front',
                    dropShadow: {
                        enabled: true,
                        top: 3,
                        left: 0,
                        blur: 4,
                        opacity: 0.24
                    }
                },
                track: {
                    background: '#fff',
                    strokeWidth: '67%',
                    margin: 0, // margin is in pixels
                    dropShadow: {
                        enabled: true,
                        top: -3,
                        left: 0,
                        blur: 4,
                        opacity: 0.35
                    }
                },

                dataLabels: {
                    show: true,
                    name: {
                        offsetY: -10,
                        show: true,
                        color: '#888',
                        fontSize: '17px'
                    },
                    value: {
                        formatter: function (val) {
                            return parseInt(val);
                        },
                        color: '#111',
                        fontSize: '36px',
                        show: true,
                    }
                }
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                type: 'horizontal',
                shadeIntensity: 0.5,
                gradientToColors: ['#ABE5A1'],
                inverseColors: true,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100]
            }
        },
        stroke: {
            lineCap: 'round'
        },
        labels: ['Percent'],
    },
}

const followers = {
    series: [{
        name: "Desktops",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
    }],
    options: {
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      title: {
        text: 'Followers',
        align: 'left'
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      }
    },
}

const Admin = () => {
    return (
        <Layout>
            <div>
                <div className="flex justify-between">
                    <h1 className="text-xl font-semibold text-zinc-500">
                        Overview
                    </h1>
                    <Select
                        showSearch
                        placeholder="Select Duration"
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={[
                            {
                                value: 'this month',
                                label: 'This month',
                            },
                            {
                                value: 'last month',
                                label: 'Last month',
                            },
                            {
                                value: 'six month',
                                label: 'Six month',
                            },
                        ]}
                    />
                </div>
                <div className="grid md:grid-cols-4 my-4 gap-4">
                    <Card className="shadow">
                        <div className="flex items-center gap-x-3">
                            <Button
                                icon={<UsergroupAddOutlined />}
                                size="large"
                                shape="circle"
                                type="text"
                                className="bg-rose-100 text-rose-600"
                            />
                            <div>
                                <h1 className="text-5xl font-semibold text-zinc-700">
                                    10,523
                                </h1>
                                <p className="mt-2 text-sm text-zinc-400">
                                    New Members
                                </p>
                            </div>
                        </div>
                    </Card>
                    <Card className="shadow">
                        <div className="flex items-center gap-x-3">
                            <Button
                                icon={<EnvironmentOutlined />}
                                size="large"
                                shape="circle"
                                type="text"
                                className="bg-green-100 text-green-600"
                            />
                            <div>
                                <h1 className="text-5xl font-semibold text-zinc-700">
                                    30,523
                                </h1>
                                <p className="mt-2 text-sm text-zinc-400">
                                    Places added
                                </p>
                            </div>
                        </div>
                    </Card>
                    <Card className="shadow">
                        <div className="flex items-center gap-x-3">
                            <Button
                                icon={<AudioOutlined />}
                                size="large"
                                shape="circle"
                                type="text"
                                className="bg-orange-100 text-orange-600"
                            />
                            <div>
                                <h1 className="text-5xl font-semibold text-zinc-700">
                                    45,523
                                </h1>
                                <p className="mt-2 text-sm text-zinc-400">
                                    Support Members
                                </p>
                            </div>
                        </div>
                    </Card>
                    <Card className="shadow">
                        <div className="flex items-center gap-x-3">
                            <Button
                                icon={<GiftOutlined />}
                                size="large"
                                shape="circle"
                                type="text"
                                className="bg-blue-100 text-blue-600"
                            />
                            <div>
                                <h1 className="text-5xl font-semibold text-zinc-700">
                                    20,523
                                </h1>
                                <p className="mt-2 text-sm text-zinc-400">
                                    Tags Used
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
                <Card>
                    <ReactApexChart
                        options={productChart.options}
                        series={productChart.series}
                        type="rangeBar"
                        height={350}
                    />
                </Card>
                <div className="grid my-4 md:grid-cols-3 gap-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <Card className="shadow">
                            <div className="flex items-center flex-col">
                                <Button
                                    icon={<DesktopOutlined />}
                                    size="large"
                                    type="text"
                                    shape="circle"
                                />
                                <h1 className="font-bold text-zinc-700 text-2xl">
                                    48
                                </h1>
                                <p className="text-sm text-zinc-400">New Post</p>
                            </div>
                        </Card>
                        <Card className="shadow">
                            <div className="flex items-center flex-col">
                                <Button
                                    icon={<CopyOutlined />}
                                    size="large"
                                    type="text"
                                    shape="circle"
                                />
                                <h1 className="font-bold text-zinc-700 text-2xl">
                                    216
                                </h1>
                                <p className="text-sm text-zinc-400">
                                    Attached File
                                </p>
                            </div>
                        </Card>
                        <Card className="shadow">
                            <div className="flex items-center flex-col">
                                <Button
                                    icon={<CommentOutlined />}
                                    size="large"
                                    type="text"
                                    shape="circle"
                                />
                                <h1 className="font-bold text-zinc-700 text-2xl">
                                    521
                                </h1>
                                <p className="text-sm text-zinc-400">
                                    Comments
                                </p>
                            </div>
                        </Card>
                        <Card className="shadow">
                            <div className="flex items-center flex-col">
                                <Button
                                    icon={<EyeOutlined />}
                                    size="large"
                                    type="text"
                                    shape="circle"
                                />
                                <h1 className="font-bold text-zinc-700 text-2xl">
                                    1600
                                </h1>
                                <p className="text-sm text-zinc-400">
                                    Total Views
                                </p>
                            </div>
                        </Card>
                    </div>
                    <Card
                        title="STATISTICS"
                        extra={
                            <Button
                                shape="circle"
                                type="text"
                                icon={<MoreOutlined />}
                            />
                        }
                    >
                        <ReactApexChart 
                        options={statistics.options} 
                        series={statistics.series} 
                        type="radialBar" height={250} 
                        />
                    </Card>
                    <Card>
                         <ReactApexChart 
                         options={followers.options} 
                         series={followers.series} 
                         type="line" 
                         height={250} 
                         />
                    </Card>
                </div>
            </div>
        </Layout>
    )
}
export default Admin;