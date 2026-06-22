import {configureStore} from "@reduxjs/toolkit";
import stepsSlice from "./slices/steps.slice";
import totalPriceSlice from "./slices/totalPrice.slice";
import orderDetailSlice from "./slices/orderDetail.slice";
import modalSlice from "./slices/modals.slice";
import exchangeSlice from "./slices/exchange.slice";
import dlvDurationSlice from "./slices/dlvDuration.slice";
import brandingRducer from "./features/branding/brandingSlice";
import currencyRducer from "./features/currency/currencySlice";
import brandReducer from "./features/brand/brandSlice";
import addsReducer from "./features/adds/addsSlice";
import showcaseReducer from "./features/showcase/showcaseSlice";
import categoryReducer from "./features/category/categorySlice";
import dealerReducer from "./features/dealer/dealerSlice";

const store = configureStore({
    devTools : true,
    reducer : {
        branding : brandingRducer,
        brand : brandReducer,
        currency : currencyRducer,
        showcase : showcaseReducer,
        category : categoryReducer,
        dealer : dealerReducer,
        adds : addsReducer,
        stepsSlice,
        totalPriceSlice,
        orderDetailSlice,
        modalSlice,
        exchangeSlice,
        dlvDurationSlice,
    }
});
export default store;