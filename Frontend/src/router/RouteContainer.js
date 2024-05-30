import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { logout, profile } from "../redux/auth";
import { useEffect } from "react";
import api from "../utils/api";

export default function RouteContainer () {
    const dispatch = useDispatch()
    const init = async() => {
        const token = localStorage.getItem("token")
        if(token) {
            api.defaults.headers.Authorization = "Bearer "+token;
            const res = await dispatch(profile())
            if(res.error) {
                localStorage.removeItem('token');
                api.defaults.headers.Authorization = "";
            }
        } else dispatch(logout());
    }
    useEffect(() => {
        init();
    }, [])
    return (
        <Outlet />
    )
}