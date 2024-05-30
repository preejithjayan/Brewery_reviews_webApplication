import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../redux/auth"

export default function Header() {
    const profile = useSelector(state => state.auth.profile)
    const dispatch = useDispatch()
    return (
        <div className="w-full bg-blue-600 flex flex-row p-4 items-center">
            <div className="flex-1 text-white font-bold text-xl">Breweries</div>
            <div className="text-white cursor-pointer">Hi {profile.name}</div>
            <button className="ml-6 text-blue-100" onClick={() => dispatch(logout())}>Logout</button>
        </div>
    )
}