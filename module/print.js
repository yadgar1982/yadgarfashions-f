import { formatDate } from "./http";

export const printNormalSize = (product, supplier, gender) => {
  const printContent = `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Yadgar Fashions Order Page</title>
  <style>
    @page {
      size: auto; /* Adapts to A4 or Letter */
      margin: 12mm;
    }

    body {
      font-family: Arial, sans-serif;
      font-size: 12px;
      background: #f2f2f2;
      margin: 0;
      padding: 0;
      color: #333;
    }

    .card {
      width: 100%;
      max-width: 780px;
      margin: 10px auto;
      padding: 5px;
      background: #fff;
      border: 1px solid #ccc;
      border-radius: 8px;
      box-sizing: border-box;
      page-break-inside: avoid;
    }

    header {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #444;
      padding-bottom: 6px;
      margin-bottom: 10px;
    }

    header img {
      height: 60px;
      margin-right: 15px;
    }

    .contact-info {
      font-size: 12px;
      line-height: 1.3;
    }

    .title {
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 8px;
      color: #910a52;
    }

    h2 {
      margin: 12px 0 6px;
      font-size: 14px;
      color: #2c3e50;
    }

    .form-line {
      margin-bottom: 4px;
    }

    .form-line strong {
      display: inline-block;
      width: 160px;
    }

    .dotted-line {
      border-bottom: 1px dotted #999;
      display: inline-block;
      width: 55%;
      height: 1em;
      vertical-align: bottom;
    }

    .product-section {
      display: flex;
      flex-wrap: nowrap;
      gap: 8px;
    }

    .product-details {
      flex: 1 1 60%;
      margin-top: 20px;
    }

    .product-image {
      flex: 1 1 35%;
      text-align: right;
    }

    .product-image img {
      max-width: 100%;
      max-height: 160px;
      border: 1px solid #ddd;
      padding: 4px;
      background-color: #fafafa;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 5px;
      font-size: 11.5px;
    }

    td {
      padding: 5px;
      border: 1px solid #ddd;
    }

    .signature {
      margin-top: 30px;
      font-size: 12px;
      line-height: 1.4;
    }

    .signature p {
      margin: 6px 0;
    }

    @media print {
      body {
        background: none;
      }

      .card {
        border: none;
        margin: 0;
        width: auto;
        box-shadow: none;
      }
    }
  </style>
</head>
<body>

<div class="card">
  

  <header>
    <img src="https://clothes-yadgar.s3.us-east-2.amazonaws.com/profile/6879c05330e4f60021f6d12c/logo.jpg" alt="Yadgar Fashions Logo" />
    <div class="contact-info" style="border-left: solid 1px rgb(29, 28, 28); padding-left: 10px;">
      4225, Princeton Avenue, Philadelphia, PA<br />
      Phone: 078676888<br />
      Email: yadgar.fashions@gmail.com
    </div>
  </header>
  <br>
<div class="title">Yadgar Fashions Order Confirmation - ${gender}</div>
<br>
  <h2>Supplier / Tailor Information</h2>
   <div class="product-section">
    <div class="product-details">
       <div class="form-line">
       <strong>Name:</strong> 
       ${supplier?.supplierName}
       </div>
      <div class="form-line">
      <strong>Address:</strong> 
      ${supplier?.supplierAddress}
      </div>
      <div class="form-line">
      <strong>Phone:</strong> 
      ${supplier?.supplierMobile}
      </div>
      <div class="form-line">
      <strong>Email:</strong> 
      ${supplier?.supplierEmail}
      </div>
    </div>
    <div class="product-details">
       <div class="form-line">
       <strong>Order No: ${product.orderId}</strong>
       </div>
    </div>
  </div>
  

  <h2>Product and Order Details</h2>
  <div class="product-section">
    <div class="product-details">
      <div class="form-line">
      <strong>Product Name:</strong> 
      <span class="">${product.productName}</span>
      </div>
      <div class="form-line">
      <strong>Product QTY:</strong> 
      <span class="">${product.productQty}</span>
      </div>
      <div class="form-line"style="display:flex;align-items: center;" >
      <strong>Color:</strong> 
      <span style="height: 20px;min-width:20px;background-color: ${
        product.productColor
      }; margin-right: 10px; border-radius: 50%; color:transparent">
      ---
      </span>
      ${product.productColor}
      </div>
      <div class="form-line">
      <strong>Order Size:</strong> 
      <span class="">${product.productSize}</span>
      </div>
      <div class="form-line">
      <strong>Product Description:</strong> 
      <span class="">${product?.productDesc}</span>
      </div>
      <div class="form-line">
      <strong>Product Description:</strong> 
      <span class="">${product?.productHighlights}</span>
      </div>
      <div class="form-line">
      <strong>Date of Order Received:</strong> 
      <span class="">${formatDate(product.updatedAt)}</span>
      </div>
      <div class="form-line">
      <strong>Date of Order Completed:</strong> 
      <span class="dotted-line"></span>
      </div>
    </div>
    <div class="product-image">
      <img src="${product.productImage}" alt="Product Image">
    </div>
  </div>

 
  <h2>Supplier Confirmation</h2>
  <div style="border: 1px solid #ddd;padding:10px">
    <p style="font-size: 10px;text-align: justify; font-weight: bold;">
    I, the undersigned tailor/supplier, confirm that I have received the above order and will
    ensure the completion of the garment as per the specifications and by the mentioned
    date.
  </p>
  <div style="font-size: 10px;text-align: right; font-weight: bold;">
    من امضا کننده (خیاط / عرضه کننده) تائیید می نمایم که سفارش فوق را دریافت کرده ام و  لباس را مطابق مشخصات داده شده و تاریخ تعیین شده تکمیل و آماده می نمایم</div>
  <div style="font-size: 10px;text-align: right; font-weight: bold;">
    زه، لاندې لاسليک کوونکی (خیاط / عرضه کوونکی)، دا تصدیق کوم چې پورته فرمایش مې ترلاسه کړی او ژمنه کوم چې جامه به د ورکړل شوو مشخصاتو او ټاکل شوې نېټې مطابق بشپړ کړم </div>
  </div>

    <div class="product-section">
      <div class="product-details">
        <h3>Supplier/Tailor Agent</h3> <br>
      <p><strong>Signature:</strong> <span class="dotted-line"></span></p>
      <p><strong>Name:</strong> <span class="dotted-line"></span></p>
      <p><strong>Date:</strong> <span class="dotted-line"></span></p>
      </div>
      <div class="product-details">
      <h3>Yadgar Fashions Agent</h3><br>
      <p><strong>Signature:</strong><span class="dotted-line"></span></p>
      <p><strong>Name:</strong> <span class="dotted-line"></span></p>
      <p><strong>Date:</strong> <span class="dotted-line"></span></p>
      </div>
  </div>
</div>

</body>
</html>

  `;
  const printWindow = window.open("", "_blank");
  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.print();
};

export const printCustomSize = (
  product,
  supplier,
  customSize,
  type,
  gender
) => {
  const printContent = `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Yadgar Fashions Order Page</title>
  <style>
    @page {
      size: auto; /* Adapts to A4 or Letter */
      margin: 12mm;
    }

    body {
      font-family: Arial, sans-serif;
      font-size: 12px;
      background: #f2f2f2;
      margin: 0;
      padding: 0;
      color: #333;
    }

    .card {
      width: 100%;
      max-width: 780px;
      margin: 10px auto;
      padding: 5px;
      background: #fff;
      border: 1px solid #ccc;
      border-radius: 8px;
      box-sizing: border-box;
      page-break-inside: avoid;
    }

    header {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #444;
      padding-bottom: 6px;
      margin-bottom: 10px;
    }

    header img {
      height: 60px;
      margin-right: 15px;
    }

    .contact-info {
      font-size: 12px;
      line-height: 1.3;
    }

    .title {
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 8px;
      color: #910a52;
    }

    h2 {
      margin: 12px 0 6px;
      font-size: 14px;
      color: #2c3e50;
    }

    .form-line {
      margin-bottom: 4px;
    }

    .form-line strong {
      display: inline-block;
      width: 160px;
    }

    .dotted-line {
      border-bottom: 1px dotted #999;
      display: inline-block;
      width: 55%;
      height: 1em;
      vertical-align: bottom;
    }

    .product-section {
      display: flex;
      flex-wrap: nowrap;
      gap: 8px;
    }

    .product-details {
      flex: 1 1 60%;
      margin-top: 20px;
    }

    .product-image {
      flex: 1 1 35%;
      text-align: right;
    }

    .product-image img {
      max-width: 100%;
      max-height: 160px;
      border: 1px solid #ddd;
      padding: 4px;
      background-color: #fafafa;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 5px;
      font-size: 11.5px;
    }

    td {
      padding: 5px;
      border: 1px solid #ddd;
    }

    .signature {
      margin-top: 30px;
      font-size: 12px;
      line-height: 1.4;
    }

    .signature p {
      margin: 6px 0;
    }

    @media print {
      body {
        background: none;
      }

      .card {
        border: none;
        margin: 0;
        width: auto;
        box-shadow: none;
      }
    }
  </style>
</head>
<body>

<div class="card">
  

  <header>
    <img src="https://clothes-yadgar.s3.us-east-2.amazonaws.com/profile/6879c05330e4f60021f6d12c/logo.jpg" alt="Yadgar Fashions Logo" />
    <div class="contact-info" style="border-left: solid 1px rgb(29, 28, 28); padding-left: 10px;">
      4225, Princeton Avenue, Philadelphia, PA<br />
      Phone: 078676888<br />
      Email: yadgar.fashions@gmail.com
    </div>
  </header>
  <br>
<div class="title">Yadgar Fashions Order Confirmation - Women / girls</div>
<br>
  <h2>Supplier / Tailor Information</h2>
   <div class="product-section">
    <div class="product-details">
       <div class="form-line">
       <strong>Name:</strong> 
       ${supplier?.supplierName}
       </div>
      <div class="form-line">
      <strong>Address:</strong>
      ${supplier.supplierAddress}
      </div>
      <div class="form-line">
      <strong>Phone:</strong> 
      ${supplier.supplierMobile}
      </div>
      <div class="form-line">
      <strong>Email:</strong>
      ${supplier.supplierEmail}
      </div>
    </div>
    <div class="product-details">
       <div class="form-line">
       <strong>Order No: ${product?.orderId} </strong>
       </div>
    </div>
  </div>
  

  <h2>Product and Order Details</h2>
  <div class="product-section">
    <div class="product-details">
      <div class="form-line">
      <strong>Product Name:</strong> 
      <span class="">
      ${product.productName}
      </span>
      </div>
      <div class="form-line">
      <strong>Product QTY:</strong> 
      <span class="">
      ${product.productQty}
      </span>
      </div>
      <div class="form-line">
      <strong>Product Description:</strong> 
      <span class="">
      ${product.productDesc}
      </span>
      </div>
      <div class="form-line">
      <strong>Product Highlights:</strong> 
      <span class="">
      ${product?.highlights || "Just For Code"}
      </span>
      </div>
      <div class="form-line" style="display:flex;align-items: center;" >
      <strong>Color:</strong> 
      <span style="height: 20px;min-width:20px;background-color: ${
        product.productColor
      }; margin-right: 10px; border-radius: 50%; color:transparent">---</span>
       </div>
      <div class="form-line">
      <strong>Order Size:</strong>
      <span class="">
      ${product.productSize}
      </span>
      </div>
      <div class="form-line">
      <strong>Date of Order Received:</strong> 
      <span class="">
      ${formatDate(product.updatedAt)}
      </span>
      </div>
      <div class="form-line">
      <strong>Date of Order Completed:</strong> 
      <span class="dotted-line"></span>
      </div>
    </div>
    <div class="product-image">
      <img src="${product.productImage}" alt="Product Image">
    </div>
  </div>

  <h2>Size Chart</h2>
  ${
    type === "women-size" &&
    `
    <table>
    <tr>
      <td>Back Neck Width / عمق یخن از پشت</td>
      <td>${customSize?.neckBackSize} "</td>
      <td>Front Neck Width / عمق یخن از جلو</td>
      <td>${customSize?.neckFrontSize} "</td>
    </tr>
    <tr>
      <td>Sleeve Length / درازی آستین</td>
      <td>${customSize?.sleeveLengthSize} "</td>
      <td>Arm / دور بازو:</td>
      <td>${customSize?.armSize} "</td>
    </tr>
    <tr>
      <td>Shoulder Width / عرض شانه </td>
      <td>${customSize?.solderWidthSize} "</td>
      <td>Bust / دور سینه</td>
      <td>${customSize?.bustSize} "</td>
    </tr>
    <tr>
      <td>Sleeve / دور آستین</td>
      <td>${customSize?.sleaveSize} "</td>
      <td>Arm Hole / دور بازو</td>
      <td>${customSize?.armHoleSize} "</td>
    </tr>
    <tr>
      <td>Waist / دور کمر</td>
      <td>${customSize?.waistSize} "</td>
      <td>Hips / دور باسن</td>
      <td>${customSize?.hipsSize} "</td>
    </tr>
    <tr>
      <td>Thighs / دور ران</td>
      <td>${customSize?.thighsSize} "</td>
      <td>Calf / دور ساق</td>
      <td>${customSize?.calfSize} "</td>
    </tr>
    <tr>
      <td>Shirt Full Length / درازی کامل پیراهن</td>
      <td>${customSize?.shirtLengthSize} "</td>
      <td>Pants Full Length / درازی کامل شلوار</td>
      <td>${customSize?.pantsLengthSize} "</td>
    </tr>
    <tr>
      <td>Extra Details / معلومات اضافی</td>
      <td colspan="3">${customSize.extraDetails || ""}</td>
    </tr>
  </table>
    `
  }
  ${
    type === "men-size" &&
    `
    <table>
    <tr>
      <td>Height / طول یا قد</td>
      <td>${customSize?.heightSize} "</td>
      <td>Shoulder Width / عرض شانه</td>
      <td>${customSize?.shoulderSize} "</td>
    </tr>
    <tr>
      <td>Sleeve Length / درازی آستین</td>
      <td>${customSize?.sleeveSize} "</td>
      <td>Collar / یخن </td>
      <td>${customSize?.collarSize} "</td>
      
    </tr>
    <tr>
      <td>Bust / دور سینه</td>
      <td>${customSize?.bustSize} "</td>
      <td>Arm Hole / دور بازو</td>
      <td>${customSize?.armholeSize} "</td>
    </tr>
    <tr>
      <td>Skirt / دامن</td>
      <td>${customSize?.skirtSize} "</td>
      <td>Pants / درازی شلوار یا تنبان</td>
      <td>${customSize?.pantsSize}"</td>
    </tr>
    <tr>
     <td>Hips / دور باسن</td>
      <td>${customSize?.hipsSize} "</td>
       <td>Waist /کمر</td>
       <td>${customSize?.waistSize} "</td>
      

    </tr>
    <tr>
    <td>Ancle/پاچه</td>
      <td>${customSize?.ancleSize} "</td>
    <td>Extra Details / معلومات اضافی</td>
     <td >${customSize.extraDetails || ""}</td>
       
    </tr>
  </table>
    `
  }
  ${
    type === "coat-size" &&
    `
    <table>
    <tr>
      <td>Height / طول یا قد</td>
      <td>${customSize?.heightSize} "</td>
      <td>Shoulder Width / عرض شانه</td>
      <td>${customSize?.shoulderSize} "</td>
    </tr>
    <tr>
      <td>Sleeve  / آستین</td>
      <td>${customSize?.sleeveSize} "</td>
       <td>Waist /کمر</td>
       <td>${customSize?.waistSize} "</td>
    </tr>
    <tr>
      
      <td>Arm Hole / دور بازو</td>
      <td>${customSize?.armholeSize} "</td>
      <td>Bust / دور سینه</td>
      <td>${customSize?.bustSize} "</td>
    </tr>
    <tr>
     <td>Hips / دور باسن</td>
      <td>${customSize?.hipsSize} "</td>
        <td> Other Details / معلومات اضافی</td>
     <td colspan="2">${customSize.extraDetails || ""}</td>
    </tr>
  </table>
    `
  }
  <h2>Supplier Confirmation</h2>
  <div style="border: 1px solid #ddd;padding:10px">
    <p style="font-size: 10px;text-align: justify; font-weight: bold;">
    I, the undersigned tailor/supplier, confirm that I have received the above order and will
    ensure the completion of the garment as per the specifications and by the mentioned
    date.
  </p>
  <div style="font-size: 10px;text-align: right; font-weight: bold;">
    من امضا کننده (خیاط / عرضه کننده) تائیید می نمایم که سفارش فوق را دریافت کرده ام و  لباس را مطابق مشخصات داده شده و تاریخ تعیین شده تکمیل و آماده می نمایم</div>
  <div style="font-size: 10px;text-align: right; font-weight: bold;">
    زه، لاندې لاسليک کوونکی (خیاط / عرضه کوونکی)، دا تصدیق کوم چې پورته فرمایش مې ترلاسه کړی او ژمنه کوم چې جامه به د ورکړل شوو مشخصاتو او ټاکل شوې نېټې مطابق بشپړ کړم </div>
  </div>

    <div class="product-section">
      <div class="product-details">
        <h3>Supplier/Tailor Agent</h3> <br>
      <p><strong>Signature:</strong> <span class="dotted-line"></span></p>
      <p><strong>Name:</strong> <span class="dotted-line"></span></p>
      <p><strong>Date:</strong> <span class="dotted-line"></span></p>
      </div>
      <div class="product-details">
      <h3>Yadgar Fashions Agent</h3><br>
      <p><strong>Signature:</strong><span class="dotted-line"></span></p>
      <p><strong>Name:</strong> <span class="dotted-line"></span></p>
      <p><strong>Date:</strong> <span class="dotted-line"></span></p>
      </div>
  </div>
</div>

</body>
</html>

  `;
  const printWindow = window.open("", "_blank");
  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.print();
};

let total = 0;
let qty = 0;
let finalTotal = 0;

export const printSupplierOrders = (orderList, supplier) => {
  const updatedOrderList = orderList?.sort((a, b) => {
    return a.orderId - b.orderId;
  });

  updatedOrderList?.map((item) => {
    total += Number(item.productCost);
    qty += Number(item.productQty);
    finalTotal += Number(item.productQty) * Number(item.productCost);
  });
  const printContent = `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Yadgar Fashions Order Page</title>
  <style>
    @page {
      size: auto; /* Adapts to A4 or Letter */
      margin: 12mm;
    }

    body {
      font-family: Arial, sans-serif;
      font-size: 12px;
      background: #f2f2f2;
      margin: 0;
      padding: 0;
      color: #333;
    }

    .card {
      width: 100%;
      max-width: 780px;
      margin: 10px auto;
      padding: 5px;
      background: #fff;
      border: 1px solid #ccc;
      border-radius: 8px;
      box-sizing: border-box;
      page-break-inside: avoid;
    }

    header {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #444;
      padding-bottom: 6px;
      margin-bottom: 10px;
    }

    header img {
      height: 60px;
      margin-right: 15px;
    }

    .contact-info {
      font-size: 12px;
      line-height: 1.3;
    }

    .title {
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 8px;
      color: #910a52;
    }

    h2 {
      margin: 12px 0 6px;
      font-size: 14px;
      color: #2c3e50;
    }

    .form-line {
      margin-bottom: 4px;
    }

    .form-line strong {
      display: inline-block;
      width: 160px;
    }

    .dotted-line {
      border-bottom: 1px dotted #999;
      display: inline-block;
      width: 55%;
      height: 1em;
      vertical-align: bottom;
    }

    .product-section {
      display: flex;
      flex-wrap: nowrap;
      gap: 8px;
    }

    .product-details {
      flex: 1 1 60%;
      margin-top: 20px;
    }

    .product-image {
      flex: 1 1 35%;
      text-align: right;
    }

    .product-image img {
      max-width: 100%;
      max-height: 160px;
      border: 1px solid #ddd;
      padding: 4px;
      background-color: #fafafa;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 5px;
      font-size: 11.5px;
    }

    td {
      padding: 5px;
      border: 1px solid #ddd;
    }

    .signature {
      margin-top: 30px;
      font-size: 12px;
      line-height: 1.4;
    }

    .signature p {
      margin: 6px 0;
    }

    @media print {
      body {
        background: none;
      }

      .card {
        border: none;
        margin: 0;
        width: auto;
        box-shadow: none;
      }
    }
  </style>
</head>
<body>

<div class="card">
  

  <header>
    <img src="https://clothes-yadgar.s3.us-east-2.amazonaws.com/profile/6879c05330e4f60021f6d12c/logo.jpg" alt="Yadgar Fashions Logo" />
    <div class="contact-info" style="border-left: solid 1px rgb(29, 28, 28); padding-left: 10px;">
      4225, Princeton Avenue, Philadelphia, PA<br />
      Phone: 078676888<br />
      Email: yadgar.fashions@gmail.com
    </div>
  </header>
  <br>
<div class="title">Yadgar Fashions Order List</div>

<br>
  <h2>
  Supplier / Tailor Information 
  ${formatDate(new Date())}
  </h2>
   <div class="product-section">
    <div class="product-details">
       <div class="form-line">
       <strong>Name:</strong> 
       ${supplier?.supplierName}
       </div>
      <div class="form-line">
      <strong>Address:</strong>
      ${supplier?.supplierAddress}
      </div>
      <div class="form-line">
      <strong>Phone:</strong> 
      ${supplier?.supplierMobile}
      </div>
      <div class="form-line">
      <strong>Email:</strong> 
      ${supplier?.supplierEmail}
      </div>
    </div>
    
  </div>
  

  

  <h2>Orders</h2>
  <table border="1" cellspacing="0" cellpadding="8" style=" width: 100%;">
  <thead>
    <tr style="background-color: #f2f2f2;">
      <th>Name</th>
      <th>Size</th>
      <th>Date</th>
      <th>Order No</th>
      <th>Desc</th>
      <th>Cost</th>
      <th>QTY</th>
      <th>Total</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    ${updatedOrderList?.map(
      (item) =>
        `
            <tr>
            <td>${item?.productName}</td>
            <td>${item?.productSize}</td>
            <td>${formatDate(item.updatedAt)}</td>
            <td>${item?.orderId}</td>
            <td>${item?.productDesc || " "}</td>
            <td>AFN ${item?.productCost}</td>
            <td>${item?.productQty}</td>
            <td>AFN ${item?.productQty * item?.productCost}</td>
            <td></td>
            </tr>
            `
    )}
    <tr>
    <td colspan="4"></td>
    <td>Sub Total</td>
    <td>AFN ${total}</td>
    <td>${qty}</td>
    <td>AFN ${finalTotal}</td>
    </tr>
    <tr>
  </tbody>
</table>
  <h2>Supplier Confirmation</h2>
  <div style="border: 1px solid #ddd;padding:10px">
    <p style="font-size: 10px;text-align: justify; font-weight: bold;">
    I hereby confirm that I have received all the orders listed below, along with their respective details
  </p>
  <div style="font-size: 10px;text-align: right; font-weight: bold;">
    من‌حیث تصدیق، دریافت تمام سفارش‌های فهرست‌ شده  شامل این لست را همراه با جزئیات مربوطه تأیید می‌کنم</div>
  <div style="font-size: 10px;text-align: right; font-weight: bold;">
    زه پدې سره تایید کوم چې لاندې په لست کې شامل ټول فرمایشونه له اړوند جزیاتو سره ترلاسه شوي دي</div>
  </div>

    <div class="product-section">
      <div class="product-details">
        <h3>Supplier/Tailor Agent</h3> <br>
      <p><strong>Signature:</strong> <span class="dotted-line"></span></p>
      <p><strong>Name:</strong> <span class="dotted-line"></span></p>
      <p><strong>Date:</strong> <span class="dotted-line"></span></p>
      </div>
      <div class="product-details">
      <h3>Yadgar Fashions Agent</h3><br>
      <p><strong>Signature:</strong><span class="dotted-line"></span></p>
      <p><strong>Name:</strong> <span class="dotted-line"></span></p>
      <p><strong>Date:</strong> <span class="dotted-line"></span></p>
      </div>
  </div>
</div>

</body>
</html>
  `;
  const printWindow = window.open("", "_blank");
  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.print();
};
