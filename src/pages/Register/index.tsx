import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '../../services/axios.js'
import { useNavigate } from 'react-router-dom'
import { createUserSchema } from '../../schemas/userSchema.js'
import { CompanySchema, companySchema, validStates } from '../../schemas/companySchema.js'
import React, { useState } from 'react'
import { Input } from '../../components/Input.js'
import { Button } from '../../components/Button.js'
import Select from 'react-select'

type createUserSchema = z.infer<typeof createUserSchema>

function RegisterForm() {
    const navigate = useNavigate()
    const [role, setRole] = useState('user')

    const currentSchema = role == "company" ? companySchema : createUserSchema;

    const { register, handleSubmit, formState: { errors }, control } = useForm<createUserSchema | CompanySchema>({
        resolver: zodResolver(currentSchema)
    })

    async function handleCreateUser(data: createUserSchema) {
        if (role === "company") {
            const jsonResponse = JSON.stringify(data)
            await api.post('/companies', jsonResponse)
        } else {
            const jsonResponse = JSON.stringify(data)
            await api.post('/users', jsonResponse)
        }
        navigate('/')
    }

    return (
        <>
            <div className='w-lg mx-auto mt-10'>
                <form className='flex flex-col gap-2 mx-auto bg-gray-50 p-10 rounded-lg shadow-xl'
                    onSubmit={handleSubmit(handleCreateUser)}
                >
                    <h1 className='text-center font-bold text-3xl'>Cadastro</h1>
                    <div className='flex gap-8 justify-center py-2 items-center'>
                        <span className='flex gap-2 items-center'>
                            <input
                                type="radio"
                                name="company"
                                value="company"
                                checked={role === 'company'}
                                onChange={(e) => setRole(e.target.value)}
                            /><label className='font-medium text-lg'>Pessoa Jurídica</label>
                        </span>
                        <span className='flex gap-2 items-center'>
                            <input
                                type="radio"
                                name="user"
                                value="user"
                                checked={role === 'user'}
                                onChange={(e) => setRole(e.target.value)}
                            /><label className='font-medium text-lg'>Pessoa Física</label>
                        </span>
                    </div>
                    {role == "user" && (
                        <>
                            <span>
                                <Input label='Username' required type="text" placeholder='Digite seu username' {...register('username')} />
                                {errors.username && <p className='text-red-600'>{(errors.username as any)?.message}</p>}
                            </span>

                            <span>
                                <Input label='Name' required type="text" placeholder='Digite seu nome' {...register('name')} />
                                {errors.name && <span className='text-red-600'>{(errors.name as any)?.message}</span>}
                            </span>


                            <span>
                                <Input label='Password' required type="password" placeholder='Digite sua senha' {...register('password')} />
                                {errors.password && <span className='text-red-600'>{(errors.password as any)?.message}</span>}
                            </span>


                            <span>
                                <Input label='Email' type="text" placeholder='Digite seu email' {...register('email')} />
                                {errors.email && <span className='text-red-600'>{(errors.email as any)?.message}</span>}
                            </span>

                            <span>
                                <Input label='Phone' type="text" placeholder='Digite seu telefone' {...register('phone')} />
                                {errors.phone && <span className='text-red-600'>{(errors.phone as any)?.message}</span>}
                            </span>

                            <span>
                                <Input label='Experience' istextarea type="text" placeholder='Experiência profissional (opcional)' {...register('experience')} />
                                {(errors as any).experience && <span className='text-red-600'>{(errors as any).experience?.message}</span>}
                            </span>

                            <span>
                                <Input label='Education' istextarea type="text" placeholder='Educação / formação acadêmica (opcional)' {...register('education')} />
                                {(errors as any).education && <span className='text-red-600'>{(errors as any).education?.message}</span>}
                            </span>
                        </>
                    )}

                    {role == "company" && (
                        <>
                            <span>
                                <Input label='Username' required type="text" placeholder='Digite o username que será utilizado para login' {...register('username')} />
                                {errors.username && <p className='text-red-600'>{(errors.username as any)?.message}</p>}
                            </span>

                            <span>
                                <Input label='Name' required type="text" placeholder='Digite a razão social da empresa' {...register('name')} />
                                {errors.name && <span className='text-red-600'>{(errors.name as any)?.message}</span>}
                            </span>

                            <span>
                                <Input label='Password' required type="password" placeholder='Digite uma senha' {...register('password')} />
                                {errors.password && <span className='text-red-600'>{(errors.password as any)?.message}</span>}
                            </span>

                            <div className='flex flex-row gap-3 w-full'>
                                <span className='flex-2'>
                                    <Input className="w-full" label='Business' required type="text" placeholder='Digite o ramo da empresa' {...register('business')} />
                                    {(errors as any).business && <span className='text-red-600'>{((errors as any).business)?.message}</span>}
                                </span>
                                <span className='flex-1'>
                                    <Input className="w-full" label='Telefone' required type="text" placeholder='Ex.:42999887766' {...register('phone')} />
                                    {(errors as any).phone && <span className='text-red-600'>{((errors as any).phone)?.message}</span>}
                                </span>
                            </div>

                            <span>
                                <Input label='Email' required type="text" placeholder='Digite o email institucional / empresarial' {...register('email')} />
                                {(errors as any).email && <span className='text-red-600'>{((errors as any).email)?.message}</span>}
                            </span>

                            <div className='flex flex-row gap-3 w-full'>
                                <span className='flex-3'>
                                    <Input className="w-full" label='Cidade' required type="text" placeholder='Digite a cidade' {...register('city')} />
                                    {(errors as any).city && <span className='text-red-600'>{((errors as any).city)?.message}</span>}
                                </span>
                                <span className='flex-1 flex flex-col'>
                                    <label className='pl-1 mb-1 font-medium text-gray-700'><span className='text-red-600 pr-1'>*</span>Estado</label>
                                    <Controller
                                        name="state"
                                        control={control}
                                        render={({ field }) => (
                                            <Select<{ value: string; label: string }>
                                                options={validStates.map((state) => ({ value: state, label: state }))}
                                                placeholder="Estado"
                                                value={field.value ? { value: String(field.value), label: String(field.value) } : null}
                                                onChange={(option) => field.onChange(option ? option.value : null)}
                                                className="w-full"
                                                styles={{
                                                    control: (base) => ({ ...base, minHeight: 41, backgroundColor: '#F9FAFB', borderColor: '#E5E5E5', borderRadius: '0.375rem' }),
                                                }}
                                            />
                                        )}
                                    />
                                    {(errors as any).state && <span className='text-red-600'>{((errors as any).state)?.message}</span>}
                                </span>
                            </div>

                            <div className='flex flex-row gap-3 w-full'>
                                <span className='flex-3'>
                                    <Input className="w-full" label='Rua / avenida' required type="text" placeholder='Digite a rua / avenida' {...register('street')} />
                                    {(errors as any).street && <span className='text-red-600'>{((errors as any).street)?.message}</span>}
                                </span>
                                <span className='flex-1'>
                                    <Input className="w-full" label='Número' required type="text" placeholder='Número' {...register('number')} />
                                    {(errors as any).number && <span className='text-red-600'>{((errors as any).number)?.message}</span>}
                                </span>
                            </div>
                        </>
                    )}
                    <Button type="submit" color="blue"> Cadastrar </Button>
                </form>
            </div>
        </>
    )
}

export default RegisterForm