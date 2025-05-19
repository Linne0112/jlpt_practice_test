import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
function PrivateRoute(){
    const isLogin = false;
    return(
        <>
            {isLogin?(<Outlet />):(<Navigate to="/login" />)}
        </>
    )
}
export default PrivateRoute;