import { Navbar } from '../../components/Navbar.js'
import { useAuth } from '../../context/AuthContext.js'
import { Input } from '../../components/Input.js'
import { Button } from '../../components/Button.js'
import { Search } from 'lucide-react'
import React, { useEffect, useState } from "react";
import { GetJobSchema } from '../../schemas/jobSchema.js'
import { JobCard } from '../../components/JobCard'
import { useForm } from 'react-hook-form'
import { api } from '../../services/axios.js'


type FilterData = {
    title: string | null,
    company: string | null,
    state: string | null,
    city: string | null,
    area: string | null,
    salary_range: { min: number | null, max: number | null } | null,
}

function mapJobsFromAPI(rawJobs: any[]): GetJobSchema[] {
    return rawJobs.map(job => ({
        ...job,
        id: Number(job.job_id)
    }));
}

function Home() {
    const { token, decodedToken } = useAuth();
    const [allJobs, setAllJobs] = useState<GetJobSchema[]>([]);
    const role = decodedToken?.role;
    const userID = decodedToken?.sub;

    const { register, handleSubmit, reset } = useForm<FilterData>({
        defaultValues: {
            title: null,
            company: null,
            state: null,
            city: null,
            area: null,
            salary_range: { min: 0, max: 20000 }
        }
    })

    async function fetchAllJobs() {
        try {
            const getRoute = role === "company" 
                ? `/companies/${userID}/jobs` 
                : '/jobs/search';
            
            const response = await api.post(getRoute, 
                { filters: [{}] },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )
            
            const jobs = mapJobsFromAPI(response.data?.items ?? response.data);
            setAllJobs(jobs);
        } catch (err) {
            console.error("Erro ao buscar vagas:", err);
        }
    }

    useEffect(() => {
        fetchAllJobs();
    }, [token])

    async function handleSearch(data: FilterData) {
        try {
            const endpoint = role === "company" 
                ? `/companies/${userID}/jobs` 
                : '/jobs/search';
            
            const filters: any = {};
            
            if (data.title) filters.title = data.title;
            if (data.company && role === 'user') filters.company = data.company;
            if (data.area) filters.area = data.area;
            if (data.state) filters.state = data.state;
            if (data.city) filters.city = data.city;
            
            if (data.salary_range?.min || data.salary_range?.max) {
                filters.salary_range = {
                    min: data.salary_range.min || null,
                    max: data.salary_range.max || null
                };
            }
            
            const response = await api.post(endpoint, 
                { filters: [filters] },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )
            
            const jobs = mapJobsFromAPI(response.data?.items ?? response.data);
            setAllJobs(jobs);
        } catch (error) {
            console.error("Erro ao buscar vagas filtradas:", error);
        }
    }

    async function handleClearFilters() {
        reset();
        await fetchAllJobs();
    }

    return (
        <div className='h-screen overflow-hidden flex flex-col'>
            <Navbar role={role}/>

            <div className='flex-1 flex items-start justify-center pt-10'>
                <div className='border rounded-md p-6 shadow-lg w-5/6 flex gap-6 h-[80vh]'>
                    <aside className='w-1/4 h-full sticky top-6 p-4 bg-white'>
                        <div className='h-full flex flex-col'>
                            <h2 className='font-semibold text-lg px-1 pb-4 border-b'>Filtros</h2>
                            
                            <form onSubmit={handleSubmit(handleSearch)} className='flex flex-col gap-3 flex-1 overflow-auto pt-4 px-1'>
                                <Input 
                                    placeholder='Digite a área de atuação' 
                                    label="Área de atuação" 
                                    {...register('area')} 
                                />
                                <Input 
                                    placeholder='Digite a localização' 
                                    label="Estado" 
                                    {...register('state')} 
                                />
                                <Input 
                                    placeholder='Digite a cidade' 
                                    label="Cidade" 
                                    {...register('city')} 
                                />
                                
                                <Input 
                                    placeholder='Salário mínimo' 
                                    type='number' 
                                    label="Salário mínimo" 
                                    {...register('salary_range.min', { valueAsNumber: true })} 
                                />
                                <Input 
                                    placeholder='Salário máximo' 
                                    type='number' 
                                    label="Salário máximo" 
                                    {...register('salary_range.max', { valueAsNumber: true })} 
                                />
                                <Button type="submit" color="blue">Aplicar filtros</Button>
                                <button 
                                    type="button" 
                                    onClick={handleClearFilters}
                                    className='text-red-600 cursor-pointer font-semibold hover:text-red-500 hover:font-bold'
                                >
                                    Limpar filtros
                                </button>
                            </form>
                        </div>
                    </aside>

                    <main className='flex-1 h-full overflow-auto'>
                        <div className='p-4'>
                            <form className="flex items-center gap-4 w-full" onSubmit={handleSubmit(handleSearch)}>
                                <div className="flex flex-1 items-center gap-3">
                                    <Input
                                        {...register('title')}
                                        type="search"
                                        placeholder="Pesquise pelo cargo"
                                        containerClassName="flex-1"
                                    />

                                    {role === 'user' && (
                                        <>
                                            <span className="text-sm font-semibold">E / OU</span>
                                            <Input
                                                type="search"
                                                placeholder="Pesquise pelo nome da empresa"
                                                containerClassName="flex-1"
                                                {...register('company')}
                                            />
                                        </>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    aria-label="Pesquisar"
                                    className="p-2 text-gray-600 rounded cursor-pointer hover:scale-120 shrink-0"
                                >
                                    <Search />
                                </button>
                            </form>

                            {allJobs.length > 0 ? (
                                <div className='grid grid-cols-3 gap-6 w-full mt-8'>
                                    {allJobs.map((job) => (
                                        <JobCard key={job.id} {...job} role={role} />
                                    ))}
                                </div>
                            ) : (
                                <div className='translate-y-1/2 flex justify-center items-center h-64'>
                                    <p className='text-lg text-gray-600 font-semibold'>Nenhuma vaga encontrada</p>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}

export default Home