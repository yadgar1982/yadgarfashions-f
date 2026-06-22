import { useLocation, useNavigate } from "react-router-dom";
import HomeLayout from "../../../Shared/HomeLayout";
import { Button, Card, Form, Image, Input, Rate } from "antd";
import { toast } from "react-toastify";
import { http } from "../../../../../module/http";
const ProductRating = () =>{
    // get userinfo
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const location = useLocation();
    const order = location.state?.order;
    const navigate = useNavigate();
    // form
    const [ratingForm] = Form.useForm();

    const onFinish = async (values) =>{
        try{
            values.productId = order.productId;
            values.orderId = order.orderId;
            values.fullname = userInfo.fullname;
            const httpReq = http();
            await httpReq.post("/api/rating/create",values);
            await httpReq.put(`/api/order/update/${order._id}`,{isRated:true});
            toast.success("Your rating added successfully !");
            ratingForm.resetFields();
            navigate("/profile/delivered");
        }catch(err){
            toast.error(err?.response?.data?.message);
        }
    }

    return (
        <HomeLayout>
            <div className="grid md:grid-cols-12">
                <div className="col-span-4"></div>
                <div 
                className="col-span-4 p-2"
                >
                    <Card 
                    title="Rate now"
                    extra={
                        <Image 
                        src={order?.productImage}
                        width={30}
                        />
                    }
                    >
                        <Form 
                        form={ratingForm}
                        layout="vertical"
                        onFinish={onFinish}
                        >
                            <Form.Item 
                            name="rating"
                            label="Rate this"
                            rules={[{required:true}]}
                            >
                                <Rate allowHalf count={5} />
                            </Form.Item>
                            <Form.Item 
                            name="comment"
                            label="Comment"
                            >
                                <Input.TextArea />
                            </Form.Item>
                            <Form.Item 
                            >
                                <Button 
                                type="text" 
                                htmlType="submit"
                                className="!bg-red-500 !text-white font-semibold"
                                >Submit</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>
                <div></div>
            </div>
        </HomeLayout>
    )
}
export default ProductRating;