import { NavLink } from "react-router-dom"
import { logout } from "../utils/logout.ts"

export function Navbar(){
    return (
        <>
            <nav className="w-5/6 mt-18 mx-auto bg-blue-400 position-fixed rounded-md shadow-lg flex items-center px-5 font-semibold">
                <h1 className="text-white text-center p-4 text-xl"> Seja bem vindo ao portal UTF Jobs, Matheus </h1>
                <ul className="flex flex-row gap-10 ml-auto text-white p-4">
                    <li><NavLink to="/home">Home</NavLink></li>
                    <li><NavLink to="#">Jobs</NavLink></li>
                    <li><NavLink to="#">My job applications</NavLink></li>
                    <li><NavLink to="/profile">Meu perfil</NavLink></li>
                    <li><NavLink to="/" onClick={async () => await logout()}>Sair</NavLink></li>
                </ul>
            </nav>
        </>
    )
}