import { createUserSchema } from '../../schemas/userSchema.js'
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../../services/axios.js';
import { useEditingProfileStore } from '../../store/editing.js';
import { parseJwt } from '../../utils/parseJwt.js';
import { CompanySchema, companySchema, validStates } from '../../schemas/companySchema.js';
import { useEffect, useState } from 'react';
import { Input } from '../../components/Input.js';
import Select from 'react-select';
import { Button } from '../../components/Button.js';
import React from "react";
import { useAuth } from '../../context/AuthContext.js';

type userSchema = z.infer<typeof createUserSchema>

interface SaveUserDataProps extends userSchema {
    refetchUserData: () => Promise<void>;
}

export function EditUserData({ refetchUserData, ...userData }: SaveUserDataProps) {
    const falseEditingProfile = useEditingProfileStore((state) => state.falseEditingProfile);
    const [isCompany, setIsCompany] = useState(false);
    const { decodedToken, token } = useAuth();

    useEffect(() => {
        setIsCompany(decodedToken?.role === 'company');
    }, [decodedToken]);

    const currentSchema = isCompany ? companySchema : createUserSchema;

    const { register, handleSubmit, formState: { errors }, control } = useForm<userSchema | CompanySchema>({
        resolver: zodResolver(currentSchema),
        defaultValues: userData
    });

    async function editUserData(data: userSchema | CompanySchema) {
        try {
            const userData = JSON.stringify(data);
            const userId = decodedToken?.sub;
            const getRoute = isCompany ? 'companies' : 'users';

            console.log('Token atual:', token);
            console.log('User ID decodificado:', userId);
            console.log('Enviando dados para API:', userData);

            await api.patch(`/${getRoute}/${userId}`, userData, {
                headers: { 'Authorization': `Bearer ${token}` }
            })

            console.log('Dados salvos com sucesso');

            await refetchUserData();

            console.log('Dados recarregados, voltando para visualização');

            falseEditingProfile();
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
        }
    }

    return (
        <form onSubmit={handleSubmit(editUserData)}>
            <fieldset className="px-6 py-3 border rounded-md border-black">
                <legend className='px-2 text-xl'>{isCompany ? 'Editar Dados da Empresa' : 'Editar Dados Pessoais'}</legend>
                <div className="flex flex-col gap-2">
                    {!isCompany && (
                        <>
                            <span>
                                <Input label='Name' required type="text" placeholder='Digite a razão social da empresa' {...register('name')} />
                                {errors.name && <span className='text-red-600'>{(errors.name as any)?.message}</span>}
                            </span>

                            <span>
                                <Input label='Password' required type="password" placeholder='Digite a senha' {...register('password')} />
                                {errors.password && <span className='text-red-600'>{(errors.password as any)?.message}</span>}
                            </span>

                            <span>
                                <Input label='Email' type="email" placeholder='Digite o email' {...register('email')} />
                                {errors.email && <span className='text-red-600'>{(errors.email as any)?.message}</span>}
                            </span>

                            <span>
                                <Input label='Phone' type="text" placeholder='Digite o telefone' {...register('phone')} />
                                {errors.phone && <span className='text-red-600'>{(errors.phone as any)?.message}</span>}
                            </span>

                            <span>
                                <Input label='Education' istextarea type="text" placeholder='Digite a formação' {...register('education')} />
                                {(errors as any).education && <span className='text-red-600'>{((errors as any).education as any)?.message}</span>}
                            </span>

                            <span>
                                <Input label='Experience' istextarea type="text" placeholder='Digite a experiência' {...register('experience')} />
                                {(errors as any).experience && <span className='text-red-600'>{((errors as any).experience as any)?.message}</span>}
                            </span>
                        </>
                    )}

                    {isCompany && (
                        <>
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

                            <div className='flex flex-row gap-3 w-full mb-2'>
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
                </div>
            </fieldset>
            <div className="flex flex-row justify-end gap-5">
                  <Button type="submit" color="blue"> Salvar alterações </Button>
                <Button type='button' onClick={() => falseEditingProfile()} color="red">
                    Cancelar
                </Button>
            </div>
        </form>
    )
}