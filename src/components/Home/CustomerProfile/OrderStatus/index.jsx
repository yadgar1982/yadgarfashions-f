import React from "react";
import { Steps, Image } from "antd";
import { useLocation } from "react-router-dom";
import HomeLayout from "../../../Shared/HomeLayout";
const steps = [
  { title: "Pending" },
  { title: "Confirmed" },
  { title: "Production" },
  { title: "Ready" },
  { title: "Packed" },
  { title: "Shipped" },
  { title: "On the Way" },
  { title: "Delivered" },
];

const statusToStepIndex = {
  pending: 0,
  confirmed: 1,
  production: 2,
  ready: 3,
  packed: 4,
  shipped: 5,
  ontheway: 6,
  delivered: 7,
};

const OrderStatus = () => {
  const location = useLocation();
  const order = location.state?.order;
  // ✅ Safeguard: show fallback if no order data
  if (!order) {
    return (
      <HomeLayout>
        <div className="text-red-500 text-center mt-10">
          <h2>No order data found. Please go back and select an order.</h2>
        </div>
      </HomeLayout>
    );
  }

  // Normalize status to match keys in statusToStepIndex
  const status = order.status.toLowerCase().replace(/\s+/g, "");
  const currentStep = statusToStepIndex[status] ?? 0;

  return (
    <HomeLayout>
      <div>
        <h1 className="mx-4 md:mx-0 text-[#910a52] text-xl font-semibold md:mb-9">
          Your order detail : 
        </h1>
        {
                order?.status === "ontheway"
                  ?
                  <div
                    className="mx-4 md:hidden text-[#910a52] text-sm md:text-2xl font-semibold mb-3 md:mb-9"
                    dangerouslySetInnerHTML={{
                      __html: order?.statusDetails[order?.statusDetails?.length - 1].description,
                    }}
                  ></div>
                  :

                  <h1 className="text-[#910a52] text-wrap text-sm md:text-xl font-semibold mb-9">
                    {
                      order?.statusDetails[order.statusDetails.length - 1]?.description
                    }
                  </h1>
              }
        <Steps size="small" className="p-4 md:p-0" current={currentStep} items={steps} />

        <div className="md:grid md:grid-cols-3 md:mt-4 border border-zinc-100 md:p-8 rounded-[5px]">
          <div className="flex justify-center rounded-[5px] m-3">
            <Image src={order?.productImage} width={500} preview={false} className="w-full h-full object-cover" />
          </div>
          <div className="border border-zinc-200 rounded-[5px] text-top p-4 m-3  md:col-span-2">
            <h3 className="font-semibold text-zinc-900 text-[24px] mb-5">Product Details</h3>

            <div className="font-semibold !text-zinc-900 flex md:text-[16px] gap-3">Name: <p className="text-zinc-500 text-[14px]">{order?.productName}</p></div>
            <div className="font-semibold !text-zinc-900 flex md:text-[16px] gap-3">Quantity: <p className="text-zinc-500 text-[14px]">{order?.productQty}</p></div>
            <div className="font-semibold !text-zinc-900 flex md:text-[16px] gap-3">Status: <p className="text-zinc-500 text-[14px]">{order?.status}</p></div>
            <div className="font-semibold !text-zinc-900 flex md:text-[16px] gap-3">Price: <span className="text-zinc-500 text-[14px]">$ {order?.productFinalPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
            <div className="font-semibold !text-zinc-900 flex md:text-[16px] gap-3">
              Order Date:{" "}<span className="text-zinc-500 text-[14px]">{order?.createdAt ? new Date(order?.createdAt)?.toLocaleDateString("en-US") : "N/A"}
              </span>
            </div>
            <div className="font-semibold text-zinc-900 flex md:text-[16px] gap-3">
              Color:
              <p className="text-zinc-500 text-[14px]">{order?.productColor}</p>
              <p
                className="w-5 h-5 rounded-full border"
                style={{ backgroundColor: order?.productColor }}
              ></p>
            </div>
            <div className="font-semibold text-zinc-900 flex text-wrap md:text-[16px] gap-3">
              Status Detail:
              {
                order?.status === "ontheway"
                  ?
                  <div
                    className="text-[#910a52] text-sm md:text-xl font-semibold mb-9"
                    dangerouslySetInnerHTML={{
                      __html: order?.statusDetails[order?.statusDetails?.length - 1].description,
                    }}
                  ></div>
                  :

                  <h1 className="text-[#910a52] text-wrap text-sm md:text-lg font-semibold mb-9">
                    {
                      order?.statusDetails[order.statusDetails.length - 1]?.description
                    }
                  </h1>
              }

            </div>

          </div>
        </div>
      </div>
    </HomeLayout>
  );
};

export default OrderStatus;