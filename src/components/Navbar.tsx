import { NavLink } from "react-router-dom"
import { useAuth } from "../context/AuthContext.js"
import React from "react";

export function Navbar(){
    const { logout } = useAuth()
    return (
        <>
            <nav className="w-5/6 mt-12 mx-auto bg-blue-400 position-fixed rounded-md shadow-lg flex items-center px-5 font-semibold">
                <h1 className="text-white text-center p-4 text-xl"> Seja bem vindo ao portal UTF Jobs </h1>
                <ul className="flex flex-row gap-10 ml-auto text-white p-4">
                    <li><NavLink to="/home">Jobs</NavLink></li>
                    <li><NavLink to="/applications">Job applications</NavLink></li>
                    <li><NavLink to="/curriculum">My Curriculum</NavLink></li>
                    <li><NavLink to="/profile">Profile</NavLink></li>
                    <li><NavLink to="/" onClick={async () => await logout()}>Logout</NavLink></li>
                </ul>
            </nav>
        </>
    )
}