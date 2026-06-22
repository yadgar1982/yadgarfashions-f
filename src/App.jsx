import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
  useLocation
} from "react-router-dom";
import { lazy, Suspense } from "react";
import Loader from "./components/Loader";
import { Provider } from "react-redux";
import store from "../redux/store";
import { ToastContainer } from 'react-toastify';
import Auth from "./auth";




const Logout = lazy(() => import("./components/Shared/Logout"));
const Home = lazy(() => import("./components/Home"));
const Forgot = lazy(() => import("./components/Home/Login/forgot"));
const Cat = lazy(() => import("./components/Home/Cat"));
const Br = lazy(() => import("./components/Home/Br"));
const Notfound = lazy(() => import("./components/Shared/Notfound"));
const Register = lazy(() => import("./components/Home/Register"));
const Login = lazy(() => import("./components/Home/Login"));
const ProductDetails = lazy(() => import("./components/Home/Product/ProductDetails"));
const Cart = lazy(() => import("./components/Home/Cart"));
const Checkout = lazy(() => import("./components/Home/Checkout"));
const Terms = lazy(() => import("./components/General/TermsAndConditions"));
const Policy = lazy(() => import("./components/General/policies"));
const Guide = lazy(() => import("./components/General/guide"));
const About = lazy(() => import("./components/General/about"));
const Blog = lazy(() => import("./components/General/blog"));
const ProfilePage = lazy(() => import("./components/Home/CustomerProfile"));
const OrderStatus = lazy(() => import("./components/Home/CustomerProfile/OrderStatus"));
const Delivered = lazy(() => import("./components/Home/CustomerProfile/Delivered"));
const ProductRating = lazy(() => import("./components/Home/CustomerProfile/ProductRating"));

/* Start Admin related import statement */
const Admin = lazy(() => import("./components/Admin"));
const AdminAnalytics = lazy(() => import("./components/Admin/Analytics"));
const AdminInventry = lazy(() => import("./components/Admin/Inventry"));
const AdminBranding = lazy(() => import("./components/Admin/Branding"));
const AdminSupplier = lazy(() => import("./components/Admin/Supplier"));
const AdminEmployee = lazy(() => import("./components/Admin/Employee"));
const AdminDealer = lazy(() => import("./components/Admin/Dealer"));
const AdminCategory = lazy(() => import("./components/Admin/Category"));
const AdminBrand = lazy(() => import("./components/Admin/Brand"));
const AdminAdds = lazy(() => import("./components/Admin/Adds"));
const AdminPayment = lazy(() => import("./components/Admin/Payment"))
const AdminProducts = lazy(() => import("./components/Admin/Products"));
const AdminTax = lazy(() => import("./components/Admin/Tax"));
const AdminDlvDuration = lazy(() => import("./components/Admin/DlvDuration"));
const AdminShowcase = lazy(() => import("./components/Admin/Showcase"));
const AdminCurrency = lazy(() => import("./components/Admin/Currency"));
const AdminOrderPacking = lazy(() => import("./components/Admin/OrderDetails/OrderPacking"));
const AdminOrderPending = lazy(() => import("./components/Admin/OrderDetails/OrderPending"));
const AdminOrderConfirm = lazy(() => import("./components/Admin/OrderDetails/OrderConfirm"));
const AdminOrderProduction = lazy(() => import("./components/Admin/OrderDetails/OrderProduction"));
const AdminOrderComplet = lazy(() => import("./components/Admin/OrderDetails/OrderComplete"));
const AdminOrderShipped = lazy(() => import("./components/Admin/OrderDetails/OrderShipped"));
const AdminOrderOnWay = lazy(() => import("./components/Admin/OrderDetails/OrderWay"));
const AdminOrderDelivered = lazy(() => import("./components/Admin/OrderDetails/OrderDelivered"));
const AdminOrderCancelled = lazy(() => import("./components/Admin/OrderDetails/OrderCancelled"));
/* End Admin related import statement */

/* Start Employee related import statement */
const Employee = lazy(() => import("./components/Employee"));
const EmployeeAnalytics = lazy(() => import("./components/Employee/Analytics"));
const EmployeeInventry = lazy(() => import("./components/Employee/Inventry"));
const EmployeeSupplier = lazy(() => import("./components/Employee/Supplier"));
const EmployeeDealer = lazy(() => import("./components/Employee/Dealer"));
const EmployeeProducts = lazy(() => import("./components/Employee/Products"));
const EmployeeShowcase = lazy(() => import("./components/Employee/Showcase"));
const EmployeeOrderPacking = lazy(() => import("./components/Employee/OrderDetails/OrderPacking"));
const EmployeeOrderPending = lazy(() => import("./components/Employee/OrderDetails/OrderPending"));
const EmployeeOrderConfirm = lazy(() => import("./components/Employee/OrderDetails/OrderConfirm"));
const EmployeeOrderProduction = lazy(() => import("./components/Employee/OrderDetails/OrderProduction"));
const EmployeeOrderComplet = lazy(() => import("./components/Employee/OrderDetails/OrderComplete"));
const EmployeeOrderShipped = lazy(() => import("./components/Employee/OrderDetails/OrderShipped"));
const EmployeeOrderOnWay = lazy(() => import("./components/Employee/OrderDetails/OrderWay"));
const EmployeeOrderDelivered = lazy(() => import("./components/Employee/OrderDetails/OrderDelivered"));
const EmployeeOrderCancelled = lazy(() => import("./components/Employee/OrderDetails/OrderCancelled"));
/* End Admin related import statement */

/* Start Dealer related import statement */
const Dealer = lazy(() => import("./components/Dealer"));
/* Start Dealer related import statement */

/* Start Supplier related import statement */
const Supplier = lazy(() => import("./components/Supplier"));
/* Start Supplier related import statement */


const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <ToastContainer />
        <Suspense fallback={<Loader />}>
          <Routes>
            {/*Start Homepage related routes OR open routes */}
            <Route path="/" element={<Home />} />
            <Route path="/cat/:categoryId" element={<Cat />} />
            <Route path="/brand/:brandId" element={<Br />} />
            <Route path="/home/terms" element={<Terms />} />
            <Route path="/home/policies" element={<Policy />} />
            <Route path="/home/about" element={<About />} />
            <Route path="/home/guide" element={<Guide />} />
            <Route path="/home/blog" element={<Blog />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot" element={<Forgot />} />
            {/*End Homepage related routes OR open routes */}

            {/*Start Users related routes OR Private routes */}
            <Route path="/cart" element={<Auth role="user" endpoint="/api/auth/verify-token" />}>
              <Route index element={<Cart />} />
            </Route>
            <Route path="/checkout" element={<Auth role="user" endpoint="/api/auth/verify-token" />}>
              <Route index element={<Checkout />} />
            </Route>
            <Route path="/product-details" element={<Auth role="user" endpoint="/api/auth/verify-token" />}>
              <Route index element={<ProductDetails />} />
            </Route>
            <Route path="/profile" element={<Auth role="user" endpoint="/api/auth/verify-token" />}>
              <Route index element={<ProfilePage />} />
            </Route>
            <Route path="/profile/delivered" element={<Auth role="user" endpoint="/api/auth/verify-token" />}>
              <Route index element={<Delivered />} />
            </Route>
            <Route path="/profile/product-rating" element={<Auth role="user" endpoint="/api/auth/verify-token" />}>
              <Route index element={<ProductRating />} />
            </Route>
            <Route path="/ordered-status" element={<Auth role="user" endpoint="/api/auth/verify-token" />}>
              <Route index element={<OrderStatus />} />
            </Route>
            {/*End Users related routes OR Private routes */}

            {/*Start Admin related routes OR Private routes */}
            <Route
              path="/admin"
              element={
                <Auth
                  endpoint="/api/auth/verify-token"
                  role="admin"
                />
              }
            >
              <Route index element={<Admin />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="inventry" element={<AdminInventry />} />
              <Route path="branding" element={<AdminBranding />} />
              <Route path="employee" element={<AdminEmployee />} />
              <Route path="supplier" element={<AdminSupplier />} />
              <Route path="dealer" element={<AdminDealer />} />
              <Route path="payments" element={<AdminPayment />} />
              <Route path="showcase" element={<AdminShowcase />} />
              <Route path="category" element={<AdminCategory />} />
              <Route path="currency" element={<AdminCurrency />} />
              <Route path="tax" element={<AdminTax />} />
              <Route path="brand" element={<AdminBrand />} />
              <Route path="adds" element={<AdminAdds />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="dlv-duration" element={<AdminDlvDuration />} />
              <Route path="order-pending" element={<AdminOrderPending />} />
              <Route path="order-confirmed" element={<AdminOrderConfirm />} />
              <Route path="order-production" element={<AdminOrderProduction />} />
              <Route path="order-complete" element={<AdminOrderComplet />} />
              <Route path="order-packing" element={<AdminOrderPacking />} />
              <Route path="order-shiped" element={<AdminOrderShipped />} />
              <Route path="order-way" element={<AdminOrderOnWay />} />
              <Route path="order-delivered" element={<AdminOrderDelivered />} />
              <Route path="order-cancelled" element={<AdminOrderCancelled />} />
            </Route>
            {/*Start End Admin related routes OR Private routes */}

            {/*Start Employee related routes OR Private routes */}
            <Route
              path="/employee"
              element={
                <Auth
                  endpoint="/api/auth/verify-token"
                  role="employee"
                />
              }
            >
              <Route index element={<Employee />} />
              <Route path="analytics" element={<EmployeeAnalytics />} />
              <Route path="inventry" element={<EmployeeInventry />} />
              <Route path="supplier" element={<EmployeeSupplier />} />
              <Route path="dealer" element={<EmployeeDealer />} />
              <Route path="showcase" element={<EmployeeShowcase />} />
              <Route path="products" element={<EmployeeProducts />} />
              <Route path="order-pending" element={<EmployeeOrderPending />} />
              <Route path="order-confirmed" element={<EmployeeOrderConfirm />} />
              <Route path="order-production" element={<EmployeeOrderProduction />} />
              <Route path="order-complete" element={<EmployeeOrderComplet />} />
              <Route path="order-packing" element={<EmployeeOrderPacking />} />
              <Route path="order-shiped" element={<EmployeeOrderShipped />} />
              <Route path="order-way" element={<EmployeeOrderOnWay />} />
              <Route path="order-delivered" element={<EmployeeOrderDelivered />} />
              <Route path="order-cancelled" element={<EmployeeOrderCancelled />} />
            </Route>
            {/*End Employee related routes OR Private routes */}

            {/*Start Dealer related routes OR Private routes */}
            <Route
              path="/dealer"
              element={
                <Auth
                  endpoint="/api/auth/verify-token"
                  role="dealer"
                />
              }
            >
              <Route index element={<Dealer />} />
            </Route>
            {/*End Dealer related routes OR Private routes */}

            {/*Start Supplier related routes OR Private routes */}
            <Route
              path="/supplier-history"
              element={
                <Auth
                  endpoint="/api/auth/verify-token"
                  role="supplier"
                />
              }
            >
              <Route index element={<Supplier />} />
            </Route>
            {/*End Supplier related routes OR Private routes */}

            <Route path="/*" element={<Notfound />} />
          </Routes>
        </Suspense>
      </Router>
    </Provider>
  )
}
export default App;