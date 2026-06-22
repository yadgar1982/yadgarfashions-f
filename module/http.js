import s3 from "./aws";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { message } from "antd";
import axios from "axios";
import jsPDF from "jspdf";
import useSWR, { mutate } from "swr";
import { autoTable } from "jspdf-autotable";
import { toast } from "react-toastify";
axios.defaults.baseURL = import.meta.env.VITE_ENDPOINT

export const http = (isToken = null) => {
  axios.defaults.baseURL = import.meta.env.VITE_ENDPOINT;
  if (isToken) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${isToken}`;
  }
  return axios;
}

export const uploadOnS3 = async (Key, file) => {
  try {
    const params = {
      Bucket: import.meta.env.VITE_AWS_BUCKET, 
      Key,
      Body: file,
      ACL: 'public-read',
      ContentType: file.type,
    };
    await s3.send(new PutObjectCommand(params));
    const fileUrl = `https://${params.Bucket}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${params.Key}`;
    return {
      success: true,
      url: fileUrl
    }
  }
  catch (error) {
    return {
      success: false,
      error: error
    };
  }
}

export const uploadFilesToS3 = async (key, files) => {
  const uploadedFileUrls = [];
  let uploadError = "";
  for (const file of files) {
    const params = {
      Bucket: import.meta.env.VITE_AWS_BUCKET,
      Key: `${key}/${file.name}`,
      Body: file.originFileObj,
      ACL: 'public-read',
      ContentType: file.type,  // Specify the content type
    };
    try {
      await s3.send(new PutObjectCommand(params));
      const fileUrl = `https://${params.Bucket}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${params.Key}`;
      uploadedFileUrls.push(fileUrl);
    } catch (error) {
      uploadError = error;
    }
  }
  if (uploadFilesToS3.length > 0) {
    return {
      success: true,
      urls: uploadedFileUrls
    };
  } else {
    return {
      success: false,
      error: uploadError
    };
  }
}

// upload files
export const uploadFileOnS3 = async (file,path,token,message) => {
    try{
      if(file.size > 500000)
        return toast.warning(`Please upload less than 500 KB ${message}`);
      const formData = new FormData();
      formData.append("file",file);
      formData.append("path",path);
      const httpReq = http(token);
      const promise = httpReq.post("/api/s3/upload",formData);
      toast.promise(promise,{
          pending : `Uploading ${message}`,
          success : `${message} uploaded`,
          error : "error"
      });
      const {data} = await promise;
      return data;
    }catch(err){
      console.log(err);
      toast.error(err?.response?.data?.message);
    }
}

// fetcher
export const fetchData = async (api, token = null) => {
  try {
    const httpReq = http(token);
    const { data } = await httpReq.get(api);
    return data;
  } catch (err) {
    return null;
  }
}

// calculate total discount and d charge and tax etc
export const calculateCartTotals = (cartItems) => {
  return cartItems.reduce((totals, item) => {
    totals.totalQty += Number(item.productQty);
    totals.totalDiscount += ((Number(item.productRealPrice) * Number(item.productDiscountPercent)) / 100) * Number(item.productQty);
    totals.totalDelivery += Number(item.deliveryCost);
    totals.totalSaleTax = Number(item.saleTax);
    totals.totalOtherTax = Number(item.otherTax);
    totals.totalPrice += Number(item.productFinalPrice) * Number(item.productQty);
    return totals;
  }, { totalQty: 0, totalDiscount: 0, totalDelivery: 0, totalPrice: 0,totalSaleTax:0,totalOtherTax:0 });
}

// formate date
export const formatDate = (d) => {
  const date = new Date(d);
  let dd = date.getDate();
  let mm = date.getMonth() + 1;
  let yy = date.getFullYear();
  // let tt = date.toLocaleTimeString();
  dd = dd < 10 ? "0" + dd : dd;
  mm = mm < 10 ? "0" + mm : mm;
  return `${dd}-${mm}-${yy}`;
}

// handle profile 
export const handleImage = (path, api, id, images = null, index = null,token=null) => {
  let input = document.createElement("input");
  input.type = "file";
  input.click();
  input.onchange = async () => {
    const file = input.files[0];
    let key = `${path}/${file.name}`;
    input.remove();
    let res = await uploadFileOnS3(file,path,token,"Product Image");
    if (res.success) {
      if (index || index == 0) {
        try {
          images[index] = res.url;
          const httpReq=http(token);
          await httpReq.put(`/${api}/${id}`, { images });
          message.success("Image updated successfully !");
          mutate(`/${api}`);
        } catch (err) {
          toast.error("Unable to update image !")
        }
      } else {
        try {
          const httpReq=http(token);
          await httpReq.put(`/${api}/${id}`, { image: res.url });
          toast.success("Image updated successfully !");
          mutate(`/${api}`);
        } catch (err) {
          toast.error("Unable to update image")
        }
      }
    } else {
      toast.error("First create Image then update  !")
    }
  }
}

export const onDataDelete = async (api, id) => {

  try {
    await axios.delete(`/${api}/${id}`);
    message.success("Data deleted successfully !");
    mutate(`/${api}`);
  } catch (error) {
    message.error("Unable to delete data !")
  }
}

// Function to shuffle and reindex data
export const scrambleData = (dataArray) => {
  // Shuffle array using Fisher-Yates algorithm
  for (let i = dataArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [dataArray[i], dataArray[j]] = [dataArray[j], dataArray[i]];
  }

  // Reassign indices
  return dataArray.map((item, index) => ({
    ...item,
    index: index + 1 // New index starts from 1
  }));
};

// trim data coding
export const trimData = (obj) => {
  let finalObj = {};
  for (let key in obj) {
    key == "iconName" ?
      finalObj[key] = obj[key]?.trim()
      :
      finalObj[key] = obj[key]?.trim().toLowerCase()
  }
  return finalObj;
}

// control estimated date
export const getDateAfterDays = (days = 0, daysType = null) => {
  let finalDays = daysType == "weaks" ? Number(days) * 7 : Number(days)
  const today = new Date();
  today.setDate(today.getDate() + finalDays);
  const options = { month: 'short', year: 'numeric', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options);
  return formattedDate;
};

//get status message
export const getStatusMessage = (statusText) => {
  const now = new Date();

  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = now.toLocaleDateString('en-US', options);

  return `Product ${statusText} on ${formattedDate}`;
};


// generate PDF
/* export const generatePDF = async (supplier, order) => {
  const doc = new jsPDF();

  // Convert image to base64 first
  //const base64Image = await toDataURL(order.productImage);

  // ========== Header: Company Info ==========
  doc.setFontSize(18);
  doc.setFont(undefined, "bold");
  doc.text("Yadgar Fashions", 14, 20);

  doc.setFontSize(11);
  doc.setFont(undefined, "normal");
  doc.text("123 Fashion Street, Karachi, Pakistan", 14, 26);
  doc.text("Phone: +92-300-1234567 | Email: info@yadgarfashions.com", 14, 32);

  // ========== Header: Order Number ==========
  doc.setFontSize(13);
  doc.text(`Order #: ${order.orderId}`, 200, 20, { align: "right" });

  // ========== Supplier Info ==========
  doc.setFontSize(13);
  doc.setFont(undefined, "bold");
  doc.text("Supplier Information", 14, 45);

  doc.setFontSize(11);
  doc.setFont(undefined, "normal");
  doc.text(`Supplier Name: ${supplier.fullname}`, 14, 52);
  doc.text("Address: 123 Fashion Street, Karachi, Pakistan", 14, 58);
  doc.text(`Phone: ${supplier.mobile} | Email: ${supplier.email}`, 14, 64);

  // ========== Section: Product & Supplier Details ==========
  doc.setFontSize(14);
  doc.setFont(undefined, "bold");
  doc.text("Product & Order Details", 14, 75);

  autoTable(doc, {
    startY: 80,
    body: [
      ["Product Name", order.productName],
      ["Color", order.selectedColor],
      ["Image", `${order.productImage}`], // we’ll draw image manually
      ["Description", "2-piece suit made with imported fabric, slim fit design."],
      ["Highlights", "Hand-stitched lapel, satin inner lining, custom buttons"],
      ["Date Order Received", formatDate(order.createdAt)],
      ["Completion Date", " "],
    ],
    theme: "grid",
    styles: { halign: "left", cellPadding: 3, minCellHeight: 15 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 60 },
      1: { cellWidth: 120 },
    },
    didDrawCell: function (data) {
      const row = data.row.index;
      const col = data.column.index;

      // 🎨 Handle Color Cell
      if (row === 1 && col === 1) {
        const color = order.selectedColor;
        const { x, y, height } = data.cell;
        doc.setFillColor(color); // supports color names or hex
        doc.rect(x + 2, y + 2, 20, height - 4, "F"); // draw small color box
      }

      // 🖼️ Handle Image Cell
      if (row === 2 && col === 1) {
        const img = new Image();
        img.src = order.productImage;

        img.onload = function () {
          const { x, y } = data.cell;
          const imgWidth = 40;
          const imgHeight = 30;
          doc.addImage(img, "JPEG", x + 2, y + 2, imgWidth, imgHeight);
          doc.save(`${order.orderId}.pdf`); // Save again after image loads
        };

        // prevent saving before image loads
        doc.__skipSave = true;
      }
    },
  });


  // ========== Section: Size Chart ==========
  doc.setFontSize(14);
  doc.setFont(undefined, "bold");
  doc.text("Size Chart", 14, doc.lastAutoTable.finalY + 10);

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 15,
    head: [["Size", "Shoulder", "Chest", "Waist", "Sleeve Length", "Length"]],
    body: [["Medium", '18"', '40"', '34"', '25"', '29"']],
    theme: "striped",
    styles: { halign: "center", fontSize: 10 },
  });

  // ========== Section: Acknowledgment ==========
  const ackY = doc.lastAutoTable.finalY + 15;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.setDrawColor(40, 167, 69); // green border
  doc.rect(14, ackY, 182, 32, "S"); // outer rectangle
  doc.line(14, ackY, 14, ackY + 32); // left border highlight

  doc.setFont(undefined, "bold");
  doc.text("Supplier Confirmation:", 16, ackY + 7);

  doc.setFont(undefined, "normal");
  doc.setFontSize(11);
  const ackText =
    "I, the undersigned tailor/supplier, confirm that I have received the above order and will ensure the completion " +
    "of the garment as per the specifications and by the mentioned date.";
  doc.text(doc.splitTextToSize(ackText, 175), 16, ackY + 14);

  doc.text("Signature: ________", 16, ackY + 28);
  doc.text("Name: __________", 80, ackY + 28);
  doc.text("Date: __________", 140, ackY + 28);

  // ========== Footer ==========
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(
    "Thank you for choosing Yadgar Fashions. We value craftsmanship and timely delivery.",
    105,
    285,
    { align: "center" }
  );

  // ========== Save PDF ==========
  doc.save(`${order.orderId}.pdf`);
};


export const handlePrint = (supplier, order) => {
  const printContent = `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Supplier Order Sheet</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 40px;
      color: #333;
    }

    .header {
      display: flex;
      justify-content: space-between;
      border-bottom: 2px solid #444;
      padding-bottom: 10px;
    }

    .company-info {
      max-width: 70%;
    }

    .company-info h2 {
      margin: 0;
      font-size: 24px;
      color: #444;
    }

    .order-number {
      text-align: right;
      font-weight: bold;
      font-size: 16px;
      margin-top: 5px;
    }

    .section {
      margin-top: 30px;
    }

    .section h3 {
      margin-bottom: 10px;
      border-bottom: 1px solid #ccc;
      padding-bottom: 5px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }

    th, td {
      padding: 10px;
      border: 1px solid #aaa;
      text-align: left;
    }

    .color-box {
      display: inline-block;
      width: 30px;
      height: 20px;
      vertical-align: middle;
      margin-left: 10px;
      border: 1px solid #ccc;
    }

    .image-preview {
      max-height: 100px;
      margin-top: 5px;
    }

    .acknowledgment {
      margin-top: 40px;
      border-left: 4px solid #28a745;
      background-color: #f8f8f8;
      padding: 15px;
    }

    .footer {
      margin-top: 60px;
      text-align: center;
      font-size: 12px;
      color: #777;
    }
  </style>
</head>
<body>

  <div class="header">
    <div class="company-info">
      <h2>Yadgar Fashions</h2>
      <p>123 Fashion Street, Karachi, Pakistan</p>
      <p>Phone: +92-300-1234567 | Email: info@yadgarfashions.com</p>
    </div>
    <div class="order-number">
      Order #: <strong id="orderId">${order.orderId}</strong>
    </div>
  </div>

  <div class="section">
    <h3>Supplier Information</h3>
    <p><strong>Supplier Name:</strong> <span id="supplierName">${supplier.fullname}</span></p>
    <p><strong>Address:</strong> 123 Fashion Street, Karachi, Pakistan</p>
    <p><strong>Phone:</strong> <span id="supplierPhone">${supplier.mobile}</span> |
       <strong>Email:</strong> <span id="supplierEmail">${supplier.email}</span></p>
  </div>

  <div class="section">
    <h3>Product & Order Details</h3>
    <table>
      <tr>
        <th>Product Name</th>
        <td id="productName">${order.productName}</td>
      </tr>
      <tr>
        <th>Color</th>
        <td>
          <span id="selectedColorName">Charcoal ${order.selectedColor}</span>
          <span class="color-box" id="colorBox" style="background-color: ${order.selectedColor};"></span>
        </td>
      </tr>
      <tr>
        <th>Image</th>
        <td>
          <img widtd="50px" id="productImage" class="image-preview" src="${order.productImage}" alt="Product Image" />
        </td>
      </tr>
      <tr>
        <th>Description</th>
        <td>2-piece suit made with imported fabric, slim fit design.</td>
      </tr>
      <tr>
        <th>Highlights</th>
        <td>Hand-stitched lapel, satin inner lining, custom buttons</td>
      </tr>
      <tr>
        <th>Date Order Received</th>
        <td id="orderReceived">${formatDate(order.createdAt)}</td>
      </tr>
      <tr>
        <th>Completion Date</th>
        <td id="completionDate"> </td>
      </tr>
    </table>
  </div>

  <div class="section">
    <h3>Size Chart</h3>
    <table>
      <tr>
        <th>Size</th>
        <th>Shoulder</th>
        <th>Chest</th>
        <th>Waist</th>
        <th>Sleeve Length</th>
        <th>Length</th>
      </tr>
      <tr>
        <td>Medium</td>
        <td>18"</td>
        <td>40"</td>
        <td>34"</td>
        <td>25"</td>
        <td>29"</td>
      </tr>
    </table>
  </div>

  <div class="acknowledgment">
    <strong>Supplier Confirmation:</strong><br>
    I, the undersigned tailor/supplier, confirm that I have received the above order and will ensure the completion of the garment as per the specifications and by the mentioned date.
    <br><br>
    Signature: ________<br>
    Name: __________<br>
    Date: __________
  </div>

  <div class="footer">
    Thank you for choosing Yadgar Fashions. We value craftsmanship and timely delivery.
  </div>
</body>
</html>

    `
  const printWindow = window.open('', '_blank');
  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.print();
}
 */

