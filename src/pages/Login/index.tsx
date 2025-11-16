import { useForm } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '../../services/axios.js'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../components/Button.js'
import { Input } from '../../components/Input.js'
import { useAuth } from '../../context/AuthContext.js'
import React from "react";

const loginSchema = z.object({
    username: z.
        string()
        .trim(),
    password: z.
        string(),
})

type loginSchema = z.infer<typeof loginSchema>

function Login (){
    const navigate = useNavigate()
    const { login } = useAuth()

    const { register, handleSubmit, formState: {errors} } = useForm<loginSchema>({
        resolver: zodResolver(loginSchema)
    })

    async function loginHook(data: loginSchema){
        await login(data);
        navigate('/home')
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="rounded-lg shadow-xl bg-gray-50 w-lg">
                <h1 className="text-center font-bold text-2xl mt-10">Login</h1>
                <form className="flex flex-col gap-5 p-10" onSubmit={handleSubmit(loginHook)}>
                    <Input required label='Username'
                        type="text" 
                        placeholder="Digite seu username" 
                        {...register('username')}
                    />
                    {errors.username && <span>{errors.username.message}</span>}
                    <Input required label='Password'
                        type="password"
                        placeholder="Digite sua senha"
                        {...register('password')}
                    />
                    {errors.password && <span>{errors.password.message}</span>}
                    <Button type="submit">Entrar</Button>
                </form>
                <Link to="/register" className="block text-center mb-10 text-blue-500 hover:underline cursor-pointer text-lg" >
                    Não possui conta? Registre-se
                </Link>
            </div>
        </div>
    )
}

export default Login