import { Controller, useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/axios.js";
import { Input } from "../../components/Input.js";
import { Button } from "../../components/Button.js";
import { createJobSchema, CreateJobSchema, GetJobSchema } from "../../schemas/jobSchema.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../context/AuthContext.js";
import { Navbar } from "../../components/Navbar.js";
import { useEffect, useState } from "react";
import Select from 'react-select'
import { validStates } from "../../schemas/companySchema.js";

export default EditJobForm;

function EditJobForm() {
    const { token, decodedToken } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const role = decodedToken?.role;
    const [jobData, setJobData] = useState<GetJobSchema | null>(null);

    const { register, handleSubmit, formState: { errors }, control, reset } = useForm<CreateJobSchema>({
        resolver: zodResolver(createJobSchema),
    });

    async function fetchJob() {
            try {
                const response = await api.get(`/jobs/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const jobData = response.data.items;
                const mappedJob = { ...jobData, id: Number(jobData.job_id) };
                setJobData(mappedJob);
                reset({
                    title: mappedJob.title,
                    area: mappedJob.area,
                    salary: mappedJob.salary,
                    description: mappedJob.description,
                    city: mappedJob.city,
                    state: mappedJob.state,
                });
                console.log('Job carregado para edição:', mappedJob);
            } catch (error) {
                console.error('Erro ao buscar vaga:', error);
            }
        }

    useEffect(() => {
        
        if (id && token) {
            fetchJob();
        }
    }, [id, token, reset])

    async function handleEditJob(data: CreateJobSchema) {
        try {
            const response = await api.patch(`/jobs/${id}`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Vaga editada com sucesso:', response.data);
            navigate('/home');
        } catch (error) {
            console.error('Erro ao editar vaga:', error);
        }
    }

    return (
        <>
            <Navbar role={role} />
            <div className="mt-6 md:mt-10 flex justify-center px-4">
                <div className="w-full md:w-5/6 max-w-4xl sm:p-4 md:p-8 sm:rounded-lg sm:shadow-xl sm:bg-gray-50">
                    <form onSubmit={handleSubmit(handleEditJob)}>
                        <h1 className="text-2xl font-bold mb-4">Editar Vaga</h1>
                        <div className="flex flex-col gap-2">
                            <Input
                                label="Título da Vaga"
                                type="text"
                                required
                                placeholder="Digite o título da vaga"
                                {...register('title')}
                            />
                            {errors.title && <p className="text-red-600 text-sm">{errors.title.message}</p>}

                            <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-5">
                                <span className="flex-1 sm:flex-3 w-full">
                                    <Input
                                        label="Área de atuação"
                                        type="text"
                                        required
                                        placeholder="Digite a área de atuação"
                                        {...register('area')}
                                    />
                                    {errors.area && <p className="text-red-600 text-sm">{errors.area.message}</p>}
                                </span>
                                <span className="flex-1 w-full">
                                    <Input
                                        label="Salário"
                                        type="number"
                                        placeholder="Salário ofertado"
                                        {...register('salary', { 
                                            setValueAs: (v) => v === "" || v === null ? null : Number(v)
                                        })}
                                    />
                                    {errors.salary && <p className="text-red-600 text-sm">{errors.salary.message}</p>}
                                </span>
                            </div>

                            <div className="flex flex-col sm:flex-row w-full gap-3 sm:gap-5">
                                <span className="flex-1 sm:flex-3 w-full">
                                    <Input
                                        label="Localização"
                                        type="text"
                                        required
                                        placeholder="Digite a cidade em que o candidato será lotado"
                                        {...register('city')}
                                    />
                                    {errors.city && <p className="text-red-600 text-sm">{errors.city.message}</p>}
                                    {errors.city && <p className="text-red-600 text-sm">{errors.city.message}</p>}
                                </span>
                                <span className='flex-1 flex flex-col'>
                                    <label className='pl-1 mb-1 font-medium text-gray-700'><span className='text-red-600 pr-1'>*</span>Estado</label>
                                    <Controller
                                        name="state"
                                        control={control}
                                        render={({ field }) => (
                                            <Select<{ value: string; label: string }>
                                                options={validStates.map((state) => ({ value: state, label: state }))}
                                                placeholder="UF"
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

                            <Input
                                label="Descrição"
                                istextarea
                                rows={9}
                                required
                                placeholder="Descreva as responsabilidades e requisitos da vaga"
                                {...register('description')}
                            />
                            {errors.description && <p className="text-red-600 text-sm">{errors.description.message}</p>}
                        </div>
                        <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-5">
                            <Button type="button" color="red" onClick={() => { navigate(`/jobs/${id}`) }}>Cancelar</Button>
                            <Button type="submit">Salvar</Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
