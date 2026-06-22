import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "universal-cookie";
import { http } from "../../module/http";
import Loader from "../components/Loader";

const cookies = new Cookies;

const Auth = ({role,endpoint}) =>{
    const token = cookies.get("authToken");
    const [authorised,setAuthrised] = useState(false);
    const [loader,setLoader] = useState(true);
    const [userType,setUserType] = useState(null);

    useEffect(()=>{
        const verifyToken = async () =>{
            if(!token)
            {
                setAuthrised(false);
                setLoader(false);
                setUserType(null);
                return <Navigate to="/login" />
            }
            try{
                const httpReq = http(token);
                const {data} = await httpReq.post(endpoint,{token});
                const role = data?.user?.role;
                const {user} = data;
                localStorage.setItem("userInfo", JSON.stringify(user));
                setUserType(role);
                setAuthrised(true);
                setLoader(false);
            }catch(err){
                setUserType(null);
                setLoader(false);
                setAuthrised(false);
            }
        };
        verifyToken();
    },[endpoint,role]);

    if(loader) return <Loader />

    if(authorised && role === userType)
        return <Outlet />
    
    return <Navigate to="/login" />

}

export default Auth;