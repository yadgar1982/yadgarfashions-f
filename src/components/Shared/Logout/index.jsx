import { useEffect } from "react"
import Loader from "../../Loader"
import { useNavigate } from "react-router-dom"
import Cookies from "universal-cookie";

const cookies = new Cookies();

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // remove authToken from cookies
        cookies.remove("authToken", { path: "/" });
        // remove all keys from localstorage
        localStorage.clear();
        sessionStorage.clear();
        // redirect to login homepage
        navigate("/", { replace: true });
    }, [navigate])
    return <Loader />
}

export default Logout;