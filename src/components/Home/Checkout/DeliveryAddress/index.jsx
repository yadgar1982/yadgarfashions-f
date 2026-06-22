import { DeleteOutlined, EditOutlined, PlusOutlined, TruckOutlined } from "@ant-design/icons";
import { Button, Radio, Form, Input, message, Popconfirm, Select, Tooltip } from "antd";
import { trimData, http, fetchData } from "../../../../../module/http";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import { useDispatch, useSelector } from "react-redux";
import { nextStep } from "../../../../../redux/slices/steps.slice";
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next';
import Cookies from "universal-cookie";

const cookies = new Cookies();

const { Option } = Select;
const { Item } = Form;

// list of cities
const locationData = {
    usa: {
        Alabama: ["Birmingham", "Montgomery", "Mobile", "Huntsville", "Tuscaloosa"],
        Alaska: ["Anchorage", "Fairbanks", "Juneau", "Sitka", "Ketchikan"],
        Arizona: ["Phoenix", "Tucson", "Mesa", "Chandler", "Glendale"],
        Arkansas: ["Little Rock", "Fort Smith", "Fayetteville", "Springdale", "Jonesboro"],
        California: ["Los Angeles", "San Francisco", "San Diego", "Sacramento", "San Jose", "Fresno", "Oakland"],
        Colorado: ["Denver", "Colorado Springs", "Aurora", "Fort Collins", "Lakewood"],
        Connecticut: ["Bridgeport", "New Haven", "Stamford", "Hartford", "Waterbury"],
        Delaware: ["Wilmington", "Dover", "Newark", "Middletown", "Smyrna"],
        Florida: ["Miami", "Orlando", "Tampa", "Jacksonville", "St. Petersburg", "Hialeah"],
        Georgia: ["Atlanta", "Augusta", "Columbus", "Savannah", "Athens"],
        Hawaii: ["Honolulu", "Hilo", "Kailua", "Kapolei", "Kaneohe"],
        Idaho: ["Boise", "Meridian", "Nampa", "Idaho Falls", "Pocatello"],
        Illinois: ["Chicago", "Aurora", "Naperville", "Joliet", "Rockford"],
        Indiana: ["Indianapolis", "Fort Wayne", "Evansville", "South Bend", "Carmel"],
        Iowa: ["Des Moines", "Cedar Rapids", "Davenport", "Sioux City", "Iowa City"],
        Kansas: ["Wichita", "Overland Park", "Kansas City", "Olathe", "Topeka"],
        Kentucky: ["Louisville", "Lexington", "Bowling Green", "Owensboro", "Covington"],
        Louisiana: ["New Orleans", "Baton Rouge", "Shreveport", "Lafayette", "Lake Charles"],
        Maine: ["Portland", "Lewiston", "Bangor", "South Portland", "Auburn"],
        Maryland: ["Baltimore", "Columbia", "Germantown", "Silver Spring", "Frederick"],
        Massachusetts: ["Boston", "Worcester", "Springfield", "Cambridge", "Lowell"],
        Michigan: ["Detroit", "Grand Rapids", "Warren", "Sterling Heights", "Ann Arbor"],
        Minnesota: ["Minneapolis", "Saint Paul", "Rochester", "Duluth", "Bloomington"],
        Mississippi: ["Jackson", "Gulfport", "Southaven", "Biloxi", "Hattiesburg"],
        Missouri: ["Kansas City", "St. Louis", "Springfield", "Columbia", "Independence"],
        Montana: ["Billings", "Missoula", "Great Falls", "Bozeman", "Butte"],
        Nebraska: ["Omaha", "Lincoln", "Bellevue", "Grand Island", "Kearney"],
        Nevada: ["Las Vegas", "Henderson", "Reno", "North Las Vegas", "Sparks"],
        New_Hampshire: ["Manchester", "Nashua", "Concord", "Dover", "Rochester"],
        New_Jersey: ["Newark", "Jersey City", "Paterson", "Elizabeth", "Edison"],
        New_Mexico: ["Albuquerque", "Las Cruces", "Rio Rancho", "Santa Fe", "Roswell"],
        New_York: ["New York City", "Buffalo", "Rochester", "Yonkers", "Syracuse"],
        North_Carolina: ["Charlotte", "Raleigh", "Greensboro", "Durham", "Winston-Salem"],
        North_Dakota: ["Fargo", "Bismarck", "Grand Forks", "Minot", "West Fargo"],
        Ohio: ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron"],
        Oklahoma: ["Oklahoma City", "Tulsa", "Norman", "Broken Arrow", "Edmond"],
        Oregon: ["Portland", "Salem", "Eugene", "Gresham", "Hillsboro"],
        Pennsylvania: ["Philadelphia", "Pittsburgh", "Allentown", "Erie", "Reading"],
        Rhode_Island: ["Providence", "Cranston", "Warwick", "Pawtucket", "East Providence"],
        South_Carolina: ["Columbia", "Charleston", "North Charleston", "Mount Pleasant", "Greenville"],
        South_Dakota: ["Sioux Falls", "Rapid City", "Aberdeen", "Brookings", "Watertown"],
        Tennessee: ["Nashville", "Memphis", "Knoxville", "Chattanooga", "Clarksville"],
        Texas: ["Houston", "San Antonio", "Dallas", "Austin", "Fort Worth", "El Paso", "Arlington"],
        Utah: ["Salt Lake City", "West Valley City", "Provo", "West Jordan", "Orem"],
        Vermont: ["Burlington", "South Burlington", "Rutland", "Barre", "Montpelier"],
        Virginia: ["Virginia Beach", "Norfolk", "Chesapeake", "Richmond", "Arlington"],
        Washington: ["Seattle", "Spokane", "Tacoma", "Vancouver", "Bellevue"],
        West_Virginia: ["Charleston", "Huntington", "Morgantown", "Parkersburg", "Wheeling"],
        Wisconsin: ["Milwaukee", "Madison", "Green Bay", "Kenosha", "Racine"],
        Wyoming: ["Cheyenne", "Casper", "Laramie", "Gillette", "Rock Springs"],
        Washington_DC: ["Washington D.C."]
    },
    canada: {
        Alberta: ["Edmonton (capital)", "Calgary", "Red Deer", "Lethbridge", "Grande Prairie"],
        British_Columbia: ["Victoria (capital)", "Vancouver", "Surrey", "Burnaby", "Kelowna"],
        Manitoba: ["Winnipeg (capital & largest city)", "Brandon", "Thompson", "Dauphin"],
        New_Brunswick: ["Fredericton (capital)", "Moncton", "Saint John", "Miramichi"],
        Newfoundland_and_Labrador: ["St. John's (capital & largest city)", "Corner Brook", "Gander", "Happy Valley–Goose Bay"],
        Nova_Scotia: ["Halifax (capital & largest city)", "Sydney", "Lunenburg", "Baddeck"],
        Ontario: ["Toronto (capital & largest city)", "Ottawa", "Mississauga", "Brampton", "Hamilton"],
        Prince_Edward_Island: ["Charlottetown (capital & largest city)", "Summerside"],
        Quebec: ["Quebec City (capital)", "Montreal", "Laval", "Gatineau"],
        Saskatchewan: ["Regina (capital)", "Saskatoon", "Prince Albert", "Moose Jaw"],
        Northwest_Territories: ["Yellowknife (capital & largest city)", "Hay River", "Inuvik"],
        Nunavut: ["Iqaluit (capital & only city)"],
        Yukon: ["Whitehorse (capital & largest city)", "Dawson City"]
    },
    australia: {
        New_South_Wales: [
            "Sydney (capital)", "Newcastle",
            "Wollongong", "Central Coast",
            "Albury–Wodonga"
        ],
        Victoria: [
            "Melbourne (capital)",
            "Geelong",
            "Ballarat",
            "Bendigo",
            "Mildura"
        ],
        Queensland: [
            "Brisbane (capital)",
            "Gold Coast",
            "Townsville",
            "Sunshine Coast",
            "Cairns"
        ],
        Western_Australia: [
            "Perth (capital)",
            "Bunbury",
            "Geraldton",
            "Mandurah",
            "Kalgoorlie"
        ],
        South_Australia: [
            "Adelaide (capital)",
            "Mount Gambier",
            "Whyalla",
            "Gawler",
            "Port Augusta"
        ],
        Tasmania: [
            "Hobart (capital)",
            "Launceston",
            "Devonport",
            "Burnie",
            "Ulverstone"
        ],
        Northern_Territory: [
            "Darwin (capital)",
            "Alice Springs",
            "Katherine",
            "Tennant Creek",
            "Palmerston"
        ],
        Australian_Capital_Territory: [
            "Canberra (national capital)"
        ]
    },
    germany: {
        Baden_Württemberg: ["Stuttgart (capital)", "Mannheim", "Karlsruhe", "Freiburg", "Heidelberg"],
        Bavaria: ["Munich (capital)", "Nuremberg", "Augsburg", "Regensburg", "Würzburg"],
        Berlin: ["Berlin (capital & city-state)"],
        Brandenburg: ["Potsdam (capital)", "Cottbus", "Brandenburg an der Havel"],
        Bremen: ["Bremen (capital & city-state)", "Bremerhaven"],
        Hamburg: ["Hamburg (capital & city-state)"],
        Hesse: ["Wiesbaden (capital)", "Frankfurt", "Kassel", "Darmstadt"],
        Mecklenburg_Vorpommern: ["Schwerin (capital)", "Rostock", "Greifswald"],
        Lower_Saxony: ["Hanover (capital)", "Braunschweig", "Osnabrück", "Oldenburg"],
        North_Rhine_Westphalia: ["Düsseldorf (capital)", "Cologne", "Dortmund", "Essen", "Bonn"],
        Rhineland_Palatinate: ["Mainz (capital)", "Ludwigshafen", "Koblenz"],
        Saarland: ["Saarbrücken (capital)"],
        Saxony: ["Dresden (capital)", "Leipzig", "Chemnitz"],
        Saxony_Anhalt: ["Magdeburg (capital)", "Halle", "Dessau-Roßlau"],
        Schleswig_Holstein: ["Kiel (capital)", "Lübeck", "Flensburg"],
        Thuringia: ["Erfurt (capital)", "Jena", "Gera"]
    },
    india: {
        Maharashtra: ["Mumbai", "Pune", "Nagpur"],
        Delhi: ["New Delhi"],
        Karnataka: ["Bengaluru", "Mysuru"],
    },
    pakistan: {
        Punjab: ["Lahore", "Rawalpindi", "Faisalabad"],
        Sindh: ["Karachi", "Hyderabad"],
        "Khyber Pakhtunkhwa": ["Peshawar", "Abbottabad"],
    },
    afghanistan: {
        "Kabul Province": ["Kabul"],
        "Kandahar Province": ["Kandahar"],
        "Herat Province": ["Herat"],
    },
};

const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
};
const DeliveryAddress = () => {
    const { t } = useTranslation('checkout');

    // get token from cookies
    const token = cookies.get("authToken");

    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedState, setSelectedState] = useState("");

    const dispatch = useDispatch();




    // get userInfo from localstorage
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    const [addressForm] = Form.useForm();
    const [loader, setLoader] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [edit, setEdit] = useState(null);

    // fetch address data from api
    const { data: addresses, error: addError } = useSWR(
        `/api/address/user?userId=${userInfo?.userId}`,
        fetchData,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            refreshInterval: 1200000,
        }
    );

    const countries = useSelector(res => res.currency.currencies);

    const handleCountryChange = (country) => {
        setSelectedCountry(country);
        setSelectedState(""); // Reset state on country change
    };

    const handleStateChange = (state) => {
        setSelectedState(state);
    };

    if (!countries) return <spin tip="Loading countries..." />;

    // add new address
    const onFinish = async (values) => {

        try {
            setLoader(true);
            values.userId = userInfo?.userId;
            const httpReq = http(token);
            await httpReq.post("/api/address/create", values);
            mutate(`/api/address/user?userId=${userInfo?.userId}`);
            toast.success("Your address added successfully");
            addressForm.resetFields();
        } catch (error) {
            message.error("Unable to store address, Please try again latter !");
        } finally {
            setLoader(false);
        }
    }

    // remove address from database
    const onDeleteAddress = async (id) => {
        try {
            const httpReq = http(token);
            await httpReq.delete(`/api/address/delete/${id}`);
            toast.success("Address deleted successfully !");
            mutate(`/api/address/user?userId=${userInfo?.userId}`);
        } catch (err) {
            toast.error(err?.response?.data?.message);
        } finally {
            setLoader(false);
        }
    }

    // update address
    const onEditAddress = (obj) => {
        setEdit(obj);
        addressForm.setFieldsValue(obj);
    }

    const onUpdate = async (values) => {
        try {
            setLoader(true);
            const httpReq = http(token);
            await httpReq.put(`/api/address/update/${edit._id}`, values);
            mutate(`/api/address/user?userId=${userInfo?.userId}`);
            toast.success("Your address updated successfully !");
            addressForm.resetFields();
            setEdit(null);
        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally {
            setLoader(false);
        }
    }

    // proceeds wit add
    const proceedWithAdd = () => {
        if (selectedAddress) {
            localStorage.setItem(
                "customerAddress",
                JSON.stringify({
                    address: selectedAddress.split('\n')
                        .map(line => line.trim())
                        .filter(line => line.length > 0)
                        .join(' ')
                })
            )
            dispatch(nextStep(2));
        } else {
            message.warning("Please select address first !");
        }
    }


    return (
        <div className="grid md:grid-cols-3 gap-3">
            <div className="border p-2 md:p-4 flex flex-col gap-5">
                <h2
                    className="p-2 bg-[#C68E17] text-white font-semibold w-full mb-1"
                >
                    {t('CHOOSE ADDRESS')}
                </h2>
                <Radio.Group
                    onChange={(e) => setSelectedAddress(e.target.value)}
                    value={selectedAddress}
                    className="flex flex-col gap-8 w-full"
                    buttonStyle="solid"
                >
                    {
                        addresses && addresses?.addresses?.map((item, index) => (

                            <div key={index}>
                                <div className="mb-2 flex gap-2 justify-end">
                                    <Button
                                        shape="circle"
                                        type="text"
                                        className="!bg-green-500 !text-white"
                                        icon={<EditOutlined />}
                                        onClick={() => onEditAddress(item)}
                                    />
                                    <Popconfirm
                                        title="Do you wanna delete?"
                                        icon={<DeleteOutlined />}
                                        onCancel={() => toast.info("Your address is safe !")}
                                        onConfirm={() => onDeleteAddress(item._id)}
                                    >
                                        <Button
                                            shape="circle"
                                            type="text"
                                            className="!bg-red-500  !text-white"
                                            icon={<DeleteOutlined />}
                                        />
                                    </Popconfirm>
                                </div>
                                <Radio.Button key={index}
                                    className="shadow-lg  border-left-none !h-auto w-full text-[#C68E17] bg-yellow-50 hover:bg-yellow-300"
                                    value={`
                            ${item.streetAddress},
                            ${item.city},
                            ${item.state},
                            ${item.zipcode},
                            ${item.country.toUpperCase()},
                            ${item.fullname.toUpperCase()},
                            ${item.mobile},
                            `}
                                >
                                    {item.streetAddress},&nbsp;
                                    {item.city}, &nbsp;
                                    {item.state}, &nbsp;
                                    {item.zipcode}, &nbsp;
                                    {item.country.toUpperCase()}, &nbsp;
                                    <br />
                                    {item.fullname.toUpperCase()}, &nbsp;
                                    {item.mobile}, &nbsp;
                                </Radio.Button>
                            </div>
                        ))
                    }
                </Radio.Group>
                <Tooltip
                    title={t("Please select the address to proceed")}
                    color="#3d3100"

                >
                    <Button
                        icon={<PlusOutlined />}
                        style={{ borderRadius: 0 }}
                        className="bg-green-500 text-white font-semibold w-full !rounded-[5px] mt-1"
                        onClick={proceedWithAdd}
                    >
                        {t('PROCEED WITH THIS ADDRESS')}
                    </Button>
                </Tooltip>
            </div>
            <div className="p-2 md:p-4 border md:col-span-2">
                <Form
                    layout="vertical"
                    form={addressForm}
                    onFinish={edit ? onUpdate : onFinish}
                >
                    <div className="grid md:grid-cols-2 gap-x-3">
                        <Item
                            label={t("Fullname")}
                            rules={[{ required: true }]}
                            name="fullname"
                        >
                            <Input />
                        </Item>
                        <Item
                            label={t("Mobile No")}
                            rules={[{ required: true }]}
                            name="mobile"
                        >
                            <Input />
                        </Item>

                        <Item
                            label={t("Country")}
                            name="country"
                            rules={[{ required: true, message: "Please select a country" }]}
                        >
                            <Select placeholder="Select Country" onChange={handleCountryChange} >
                                {countries &&
                                    countries.map((item) => (
                                        <Option key={item.countryName} value={item.countryName}>

                                            {capitalizeFirstLetter(item.countryName)}
                                        </Option>
                                    ))}
                            </Select>
                        </Item>
                        {selectedCountry && locationData[selectedCountry] && (
                            <Item
                                label={t("State")}
                                name="state"
                                rules={[{ required: true, message: "Please select a state" }]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Select State" onChange={handleStateChange}>
                                    {Object.keys(locationData[selectedCountry]).map((state) => (
                                        <Option key={state} value={state}>
                                            {state}
                                        </Option>
                                    ))}
                                </Select>
                            </Item>
                        )}


                        {selectedCountry &&
                            selectedState &&
                            locationData[selectedCountry] &&
                            locationData[selectedCountry][selectedState] && (
                                <Item
                                    label={t("City")}
                                    name="city"
                                    rules={[{ required: true, message: "Please select a city" }]}
                                >
                                    <Select placeholder="Select City"
                                        showSearch>
                                        {locationData[selectedCountry][selectedState].map((city) => (
                                            <Option key={city} value={city}>
                                                {city}
                                            </Option>
                                        ))}
                                    </Select>
                                </Item>
                            )}
                        <Item
                            label={t("Zipcode / Pincode")}
                            rules={[{ required: true }]}
                            name="zipcode"
                        >
                            <Input />
                        </Item>
                    </div>
                    <Item
                        label={t("Home and Street Address")}
                        name="streetAddress"
                        rules={[{ required: true }]}
                    >
                        <Input.TextArea
                            placeholder="4356,Coaster Avenue" />
                    </Item>
                    <Item>
                        {
                            edit ?
                                <Button
                                    loading={loader}
                                    htmlType="submit"
                                    icon={<PlusOutlined />}
                                    style={{ borderRadius: 0 }}
                                    className="bg-pink-500 text-white font-semibold w-full mt-1"
                                >
                                    {t('Update your address')}
                                </Button>
                                :
                                <Button
                                    loading={loader}
                                    htmlType="submit"
                                    icon={<PlusOutlined />}
                                    style={{ borderRadius: 0 }}
                                    className="bg-blue-500 text-white font-semibold w-full mt-1"
                                >
                                    {t('Add your address')}
                                </Button>
                        }
                    </Item>
                </Form>
            </div>
        </div>
    )
}
export default DeliveryAddress;