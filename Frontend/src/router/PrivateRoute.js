import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Header from "../components/Header";

export default function PrivateRoute({children}) {
    const { profile, init } = useSelector(state => state.auth)
    if(!init)
        return <div className="h-screen w-full flex flex-col items-center justify-center">Brewing...</div>
    if(profile)
        return (
            <div className="w-full h-screen flex flex-col">
                <Header />
                <div className="flex-1 min-h-0">
                    {children}
                </div>
            </div>
        )
    return <Navigate to="/login" />
}