import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function AuthRoute({children}) {
    const { profile, init } = useSelector(state => state.auth)
    if(!init)
        return <div className="h-screen w-full flex flex-col items-center justify-center">Brewing...</div>
    if(!profile)
        return children
    return <Navigate to="/" />
}