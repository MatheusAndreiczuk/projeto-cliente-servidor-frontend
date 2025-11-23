import { NavLink } from "react-router-dom"
import { useAuth } from "../context/AuthContext.js"
import React, { useState } from "react";
import { Menu, X } from "lucide-react";

interface NavbarProps {
    role?: string | null
}

export function Navbar(Props: NavbarProps) {
    const { logout } = useAuth()
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    return (
        <>
            <nav className="w-full md:w-5/6 md:mt-12 mx-auto bg-blue-400 md:rounded-md shadow-lg px-3 md:px-5 font-semibold">
                <div className="flex items-center justify-between">
                    <h1 className="text-white text-center py-3 md:py-4 text-base md:text-xl flex-1 md:flex-initial"> 
                        UTF Jobs 
                    </h1>
                    
                    <ul className="hidden md:flex flex-row gap-6 lg:gap-10 text-white py-4 text-sm lg:text-base">
                        <li><NavLink to="/home">All Jobs</NavLink></li>
                        {Props.role === "user" && <li>
                            <NavLink to="/applications">Candidaturas</NavLink>
                        </li>}
                        {Props.role === "company" && <li>
                            <NavLink to="/announce">Announce</NavLink>
                        </li>}
                        <li><NavLink to="/profile">Profile</NavLink></li>
                        <li><NavLink to="/" onClick={async () => await logout()}>Logout</NavLink></li>
                    </ul>

                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden text-white p-2"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {isMenuOpen && (
                    <ul className="md:hidden flex flex-col gap-3 text-white pb-4 text-sm">
                        <li><NavLink to="/home" onClick={() => setIsMenuOpen(false)}>All Jobs</NavLink></li>
                        {Props.role === "user" && <li>
                            <NavLink to="/applications" onClick={() => setIsMenuOpen(false)}>Candidaturas</NavLink>
                        </li>}
                        {Props.role === "company" && <li>
                            <NavLink to="/announce" onClick={() => setIsMenuOpen(false)}>Anunciar</NavLink>
                        </li>}
                        <li><NavLink to="/profile" onClick={() => setIsMenuOpen(false)}>Profile</NavLink></li>
                        <li><NavLink to="/" onClick={async () => {
                            setIsMenuOpen(false);
                            await logout();
                        }}>Logout</NavLink></li>
                    </ul>
                )}
            </nav>
        </>
    )
}