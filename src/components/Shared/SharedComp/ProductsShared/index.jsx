import {
    Button, Card,
    Drawer, Form, Input,
    Select, Table,
    Image, Upload,
    Tag, Popconfirm
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { 
    fetchData, 
    formatDate, handleImage, http,
    uploadFileOnS3
} from "../../../../../module/http";
import useSwr, { mutate } from "swr";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const { Item } = Form;

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const ProductsShared = () => {

    // get token from cookie
    const token = cookies.get("authToken");

    const [pForm] = Form.useForm();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([]);
    const [realPrice, setRealPrice] = useState(0);
    const [brands, setBrands] = useState([]);
    const [products, setProducts] = useState([]);
    const [categoryId, setCategoryId] = useState(null);
    const [productName, setProductName] = useState(null);
    const [brandId, setBrandId] = useState(null);
    const [query, setQuery] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loaderIndex, setLoaderIndex] = useState(0);
    const [urlList, setUrlList] = useState([]);
    const [edit, setEdit] = useState(null);
    const [delLoading, setDelLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
        position: ['bottomCenter']
    });


    // color states
    const [inputValue, setInputValue] = useState("");
    const [colorList, setColorList] = useState([]);


    // color input functions

    const addColor = () => {
        const isHex = /^#([0-9A-F]{3}){1,2}$/i.test(inputValue);
        const isValidCSSColor = (color) => {
            const clr = new Option().style;
            clr.color = color;
            return clr.color !== "";
        };

        if (isHex || isValidCSSColor(inputValue)) {
            const newColors = [...colorList, inputValue];
            setColorList(newColors);
            setInputValue("");
            pForm.setFieldsValue({ clothColor: newColors });
        }
    };

    const removeColor = (removedColor) => {
        const newColors = colorList.filter(color => color !== removedColor);
        setColorList(newColors);
        pForm.setFieldsValue({ clothColor: newColors });
    };

    const handleTableChange = (pagination) => {
        fetchProducts(query, pagination.current, pagination.pageSize);
    }

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

    
    const uploadButton = (
        <button
            style={{
                border: 0,
                background: 'none',
            }}
            type="button"
        >
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </button>
    );

    // update product image
    const updateImage = async (obj, index, token) => {
        let path = `products/${obj.categoryId}/${obj.brandId}/${obj.productName}`;
        handleImage(path, "api/product/update", obj._id, obj.images, index, token);
    }

    // calculate final price

    const realPriceFunc = (e) => {
        setRealPrice(e.target.value);
    }

    const calculateFinalPrice = (e) => {
        let percent = Number(e.target.value);
        let totalPercent = (percent / 100) * Number(realPrice);
        let finalPrice = Number(realPrice) - totalPercent;
        pForm.setFieldValue("finalPrice", finalPrice);
    }

    // fetch categories
    const catFields = ['categoryName']; // choose the fields you want
    const catQuery = catFields.join(',');

    const fetchWithToken = (url) => fetchData(url); // pass token
    const { data: categories, error: categoryError } = useSwr(
        `/api/category/query?fields=${catQuery}`,
        fetchWithToken,
        {
            revalidateOnFocus: false,     // don't re-fetch when window gets focus
            revalidateOnReconnect: false, // don't re-fetch when reconnecting to internet
            refreshInterval: 0,           // no polling
            dedupingInterval: Infinity,   // never re-fetch automatically
            shouldRetryOnError: true     // avoid retry on error
        }
    );

    const suppField = ['supplierName']; // choose the fields you want
    const suppQuery = suppField.join(',');

    // fetch suppliers
    const { data: suppliers, error: suppliersError } = useSwr(
        `/api/supplier/query?fields=${suppQuery}`,
        fetchWithToken,
        {
            revalidateOnFocus: false,     // don't re-fetch when window gets focus
            revalidateOnReconnect: false, // don't re-fetch when reconnecting to internet
            refreshInterval: 0,           // no polling
            dedupingInterval: Infinity,   // never re-fetch automatically
            shouldRetryOnError: true     // avoid retry on error
        }
    );

    // fetch all categories related brand 
    const fetchBrand = async (categoryId) => {
        try {
            setLoading(true);
            const fields = ['brandName']; // choose the fields you want
            const query = fields.join(',');
            const httpReq = http(token);
            const response = await httpReq.get(`/api/brand/query/${categoryId}?fields=${query}`);
            const { brands } = response.data;
            setBrands(brands);
        } catch (error) {
            toast.error('Error fetching brand');
        } finally {
            setLoading(false);
        }
    };

    // fetch brand on class change
    const handleCategoryChange = (categoryId) => {
        setCategoryId(categoryId);
        fetchBrand(categoryId);
    }

    // fetch limited products by pagination
    const fetchProducts = async (query, page = 1, pageSize = 10) => {
        try {
            setLoading(true);
            const httpReq = http();
            const response = await httpReq.get(`/api/product/pagination?${query}&page=${page}&limit=${pageSize}`);
            const { data, total } = response.data;
            setProducts(data);
            setPagination(prev => ({
                ...prev,
                current: page,
                pageSize: pageSize,
                total: total
            }));
        } catch (error) {
            console.log("Error fetchings products", error)
        } finally {
            setLoading(false);
        }
    }

    // fetch supplier related products
    const handleSupplierChange = (supplierId) => {
        setQuery(`supplierId=${supplierId}`);
        fetchProducts(`supplierId=${supplierId}`, pagination.current, pagination.pageSize);
    }

    // fetch category & brand related products
    const handleBrandChange = (brandId) => {
        setQuery(`categoryId=${categoryId}&brandId=${brandId}`);
        fetchProducts(`categoryId=${categoryId}&brandId=${brandId}`, pagination.current, pagination.pageSize);
    }

    // upload images
    const handleUpload = async (file) => {
        let path = `products/${categoryId}/${brandId}/${productName}`;
        const res = await uploadFileOnS3(file,path,token,"Product Image");
        urlList.push(res.url);
    };

    // store product in database
    const onFinish = async (values) => {
        try {
            setLoading(true);
            values.images = urlList;
            const httpReq = http(token);
            await httpReq.post('/api/product/create', values);
            pForm.resetFields();
            setDrawerOpen(false);
            toast.success("Products added successfully !");
            setUrlList([]);
            setFileList([]);
        } catch (err) {
            toast.error(err?.response?.data?.message);
        } finally {
            setLoading(false);
        }
    }

    // Delete Product
    const deleteProduct = async (id, index) => {
        try {
            setDelLoading(true);
            setLoaderIndex(index);
            const httpReq = http(token);
            await httpReq.delete(`/api/product/delete/${id}`);
            // remove the deleted item from state
            const updatedList = [...products];
            updatedList.splice(index, 1);
            setProducts(updatedList);
            toast.success("Product deleted successfully");
        } catch (error) {
            toast.error("Failed to delete Product");
        } finally {
            setDelLoading(false);
        }
    };

    // edit product
    const onEditProduct = (obj, index) => {
        setLoaderIndex(index);
        setDrawerOpen(true);
        setEdit(obj);
        pForm.setFieldsValue(obj);
        //setFileList(obj.images);
    }

    //load the color array when editing
    useEffect(() => {
        if (edit) {
            const existingColors = edit.clothColor || [];
            setColorList(existingColors);
        }
    }, [edit]);

    // product update coding
    const onProductUpdate = async (values) => {
        try {
            setLoading(true);
            const httpReq = http(token);
            let images = edit.images.concat(urlList);
            values.images = images;
            const { data } = await httpReq.put(`/api/product/update/${edit?._id}`, values);
            // remove the deleted item from state
            const updatedList = [...products];
            updatedList.splice(loaderIndex, 1, data?.product);
            setProducts(updatedList);
            toast.success("Updated product Info !");
            setDrawerOpen(false);
            setEdit(null);
            setUrlList([]);
            setFileList([]);
            pForm.resetFields();
        } catch (err) {
            toast.error(err?.response?.data?.message);
        } finally {
            setLoading(false);
        }
    }

    // drawer close
    const onDrawerClose = () => {
        setColorList([]);
        setDrawerOpen(false);
        setEdit(null);
        pForm.resetFields();
        setFileList([]);
    }

    // table columns info
    const columns = [
        {
            title: 'Name',
            dataIndex: 'productName',
            key: "productName"
        },
        {
            title: 'QTY',
            dataIndex: 'qty',
            key: 'qty',
        },
        {
            title: 'Product Cost',
            dataIndex: 'productCost',
            key: 'productCost',
        },
        {
            title: 'Photos',
            dataIndex: 'photos',
            render: (_, obj) => (
                obj.images.map((item, index) => (
                    <Image 
                        style={{cursor:'pointer'}}
                        preview={false}
                        key={index}
                        src={item}
                        width={60}
                        height={40}
                        onClick={() => updateImage(obj, index, token)}
                    />
                ))
            )
        },
        {
            title: 'CreatedAt',
            dataIndex: 'createdAt',
            render: (_, obj) => formatDate(obj.createdAt)
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            fixed: "right",
            render: (_, obj, index) => (
                <div
                    className="flex items-center gap-2"
                >
                    <Button
                        type="text"
                        shape="circle"
                        className="!bg-indigo-500 !text-white"
                        icon={<EditOutlined />}
                        onClick={() => onEditProduct(obj, index)}
                    />
                    <Popconfirm
                        title="Do you wanna delete school?"
                        icon={<DeleteOutlined />}
                        onCancel={() => toast.info("Your brand is safe !")}
                        onConfirm={() => deleteProduct(obj?._id, index)}
                    >
                        <Button
                            loading={index === loaderIndex && delLoading}
                            type="text"
                            shape="circle"
                            className="!bg-rose-500 !text-white"
                            icon={<DeleteOutlined />}
                        />
                    </Popconfirm>
                </div>
            )
        },
    ];

    return (
        <div>
            <div className="grid">
                <Card
                    title={<h1 className="text-2xl font-semibold">
                        Products List
                    </h1>}
                    extra={
                        <div className="flex gap-4">
                            <Select
                                onChange={handleSupplierChange}
                                className="min-w-[200px]" placeholder="Select Supplier">
                                {
                                    suppliers && suppliers?.suppliers.map((item) => (
                                        <Select.Option
                                            key={item._id}
                                            value={item._id}
                                            className="capitalize"
                                        >{item.supplierName}</Select.Option>
                                    ))
                                }
                            </Select>
                            <Select
                                onChange={handleCategoryChange}
                                className="min-w-[200px]" placeholder="Select Category">
                                {
                                    categories && categories?.categories.map((item) => {
                                        if (item.categoryName.toLowerCase() !== "home")
                                            return <Select.Option
                                                key={item._id}
                                                value={item._id}
                                                className="capitalize"
                                            >{item.categoryName}</Select.Option>
                                    })
                                }
                            </Select>
                            <Select
                                onChange={handleBrandChange}
                                className="min-w-[200px]" placeholder="Select Brand">
                                {
                                    brands && brands?.map((item) => (
                                        <Select.Option
                                            key={item._id}
                                            value={item._id}
                                            className="capitalize"
                                        >{item.brandName}</Select.Option>
                                    ))
                                }
                            </Select>
                            <Button
                                onClick={() => setDrawerOpen(true)}
                                type="primary"
                                icon={<PlusOutlined />}
                                className="font-semibold">
                                Add new Product
                            </Button>
                        </div>
                    }
                    style={{ overflowX: 'auto' }}
                >
                    <Table
                        columns={columns}
                        dataSource={products}
                        rowKey="_id"
                        loading={loading}
                        pagination={pagination}
                        onChange={handleTableChange}
                        size="middle"
                        scroll={{ x: 'max-content' }}
                    />
                </Card>
            </div>
            <Drawer
                open={drawerOpen}
                width={820}
                onClose={onDrawerClose}
            >
                <Form
                    onFinish={edit ? onProductUpdate : onFinish}
                    layout="vertical"
                    form={pForm}
                >
                    <div className="grid md:grid-cols-3 gap-x-4">
                        <Item
                            label="Category"
                            name="categoryId"
                            rules={[{ required: true }]}
                        >
                            <Select
                                onChange={handleCategoryChange}
                                className="min-w-[200px]" placeholder="Select Category">
                                {
                                    categories && categories?.categories.map((item) => {
                                        if (item.categoryName.toLowerCase() !== "home")
                                            return <Select.Option
                                                key={item._id}
                                                value={item._id}
                                                className="capitalize"
                                            >{item.categoryName}</Select.Option>
                                    })
                                }
                            </Select>
                        </Item>
                        <Item
                            label="Brand"
                            name="brandId"
                            rules={[{ required: true }]}
                        >
                            <Select
                                onChange={(bId)=>setBrandId(bId)}
                                className="min-w-[200px]"
                                placeholder="Select Brand">
                                {
                                    brands && brands?.map((item) => (
                                        <Select.Option
                                            key={item._id}
                                            value={item._id}
                                            className="capitalize"
                                        >{item.brandName}</Select.Option>
                                    ))
                                }
                            </Select>
                        </Item>
                        <Item
                            label="Sizing Type"
                            name="sizingType"
                            rules={[{ required: true }]}
                        >
                            <Select
                                placeholder="Select sizing type"
                                options={[
                                    { label: 'Men Size', value: 'men-size' },
                                    { label: 'Women Size', value: 'women-size' },
                                    { label: 'Coat Size', value: 'coat-size' },
                                ]}
                            />
                        </Item>
                    </div>
                    <div className="grid md:grid-cols-2 gap-x-4">
                        <Item
                            label="Select Supplier"
                            name="supplierId"
                            rules={[{ required: true }]}
                        >
                            <Select
                                showSearch
                                placeholder="Select a Supplier">
                                {
                                    suppliers && suppliers?.suppliers.map((item, index) => (
                                        <Select.Option
                                            value={item?._id}
                                            key={item._id}
                                            className="capitalize"
                                        >{item?.supplierName}</Select.Option>
                                    ))
                                }
                            </Select>
                        </Item>
                        <Item
                            label="Product Name"
                            name="productName"
                            rules={[{ required: true }]}
                        >
                            <Input
                                placeholder="nokia 1100"
                                onChange={(e)=>setProductName(e.target.value)}
                            />
                        </Item>
                    </div>
                    <div className="grid md:grid-cols-5 gap-x-4">
                        <Item
                            label="Product Quantity"
                            name="qty"
                            rules={[{ required: true }]}
                        >
                            <Input
                                type="number"
                                placeholder="210"
                            />
                        </Item>
                        <Item
                            label="Product cost"
                            name="productCost"
                            rules={[{ required: true }]}
                        >
                            <Input
                                type="number"
                                placeholder="210"
                            />
                        </Item>
                        <Item
                            label="Product Real Price"
                            name="realPrice"
                            rules={[{ required: true }]}
                            onChange={realPriceFunc}
                        >
                            <Input
                                type="number"
                                placeholder="2000"
                            />
                        </Item>
                        <Item
                            label="Discount Percent"
                            name="discountPercent"
                            rules={[{ required: true }]}
                            onChange={calculateFinalPrice}
                        >
                            <Input
                                type="number"
                                placeholder="2000"
                            />
                        </Item>
                        <Item
                            label="Final Price"
                            name="finalPrice"
                            rules={[{ required: true }]}
                            disabled
                        >
                            <Input
                                type="number"
                                placeholder="2000"
                            />
                        </Item>
                    </div>
                    <div className="grid md:grid-cols-3 gap-x-4">
                        <Item
                            label="Normal Duration Days"
                            name="normalDurationDays"
                            rules={[{ required: true }]}
                        >
                            <Input
                                type="number"
                                placeholder="Days in number"
                            />
                        </Item>
                        <Item
                            label="Express Duration Days"
                            name="expressDurationDays"
                            rules={[{ required: true }]}
                        >
                            <Input
                                type="number"
                                placeholder="Days in number"
                            />
                        </Item>
                        <Item
                            label="Product Unit"
                            name="productUnit"
                            rules={[{ required: true }]}
                        >
                            <Input
                                type="number"
                                placeholder="eg. 1"
                            />
                        </Item>
                    </div>
                    <div className="grid md:grid-cols-2 gap-x-4">
                        <Item
                            label="Cloth Size"
                            name="clothSize"
                            rules={[{ required: true }]}
                        >
                            <Select
                                placeholder="Select days type"
                                mode="multiple"
                                options={[
                                    { label: "S", value: "S" },
                                    { label: "M", value: "M" },
                                    { label: "L", value: "L" },
                                    { label: "XL", value: "XL" },
                                    { label: "XXL", value: "XXL" },
                                    { label: "CUSTOM", value: "CUSTOM" },
                                    { label: "WAISTCOAT", value: "WAISTCOAT" },
                                ]}
                            />
                        </Item>
                        {/* color input */}
                        <Item
                            label="Cloth Color"
                            name="clothColor"
                            rules={[{ required: true, message: "Please add at least one color" }]}
                        >
                            <>
                                <Input
                                    placeholder="Enter color code (e.g. #ff0000)"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onPressEnter={addColor}
                                    style={{ width: "70%", marginRight: 8 }}
                                />
                                <Button type="primary" onClick={addColor}>
                                    Add
                                </Button>

                                <div style={{ marginTop: 12 }}>
                                    {colorList.map((color, index) => (
                                        <Tag
                                            key={index}
                                            color={color}
                                            closable
                                            onClose={() => removeColor(color)}
                                            style={{ marginBottom: 4 }}
                                        >
                                            {color}
                                        </Tag>
                                    ))}
                                </div>
                            </>
                        </Item>
                    </div>
                    <Item
                        label="Highlights"
                        name="highlights"
                    >
                        <Input.TextArea />
                    </Item>
                    <Item
                        label="Description"
                        name="desc"
                        rules={[{ required: true }]}
                    >
                        <Input.TextArea />
                    </Item>
                    <Upload
                        action={handleUpload}
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChange}
                        disabled={categoryId && brandId && productName ? false : !edit}
                    >
                        {fileList.length >= 6 ? null : uploadButton}
                    </Upload>
                    <Item className="mt-4">
                        {
                            edit ?
                                <Button htmlType="submit" className="font-semibold w-full bg-rose-500 text-white">
                                    Update Product
                                </Button>
                                :
                                <Button htmlType="submit" className="font-semibold w-full bg-blue-500 text-white">
                                    Submit
                                </Button>
                        }
                    </Item>
                </Form>
            </Drawer>
            {previewImage && (
                <Image
                    wrapperStyle={{
                        display: 'none',
                    }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                />
            )}
        </div>
    )
}
export default ProductsShared;