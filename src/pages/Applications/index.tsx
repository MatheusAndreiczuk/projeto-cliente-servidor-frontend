import { Navbar } from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { GetJobSchema } from '../../schemas/jobSchema';
import { api } from '../../services/axios';
import { Briefcase, MapPin, Banknote, Earth, MessageSquare, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';

function mapJobsFromAPI(rawJobs: any[]): GetJobSchema[] {
    return rawJobs.map(job => ({
        ...job,
        id: Number(job.job_id)
    }));
}

function Applications() {
    const { token, decodedToken } = useAuth();
    const [applications, setApplications] = useState<GetJobSchema[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const role = decodedToken?.role;
    const userId = decodedToken?.sub;

    async function fetchApplications() {
        setIsLoading(true);
        try {
            const response = await api.get(`/users/${userId}/jobs`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const jobs = mapJobsFromAPI(response.data?.items ?? []);
            setApplications(jobs);
        } catch (error) {
            console.error("Erro ao buscar candidaturas:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (userId && token) {
            fetchApplications();
        }
    }, [userId, token]);

    return (
        <div className='h-screen overflow-hidden flex flex-col'>
            <Navbar role={role} />

            <div className='flex-1 flex items-start justify-center pt-6 md:pt-10 overflow-auto px-4'>
                <div className='sm:border sm:rounded-md p-2 sm:p-6 sm:shadow-lg w-full md:w-5/6 mb-10'>
                    <h1 className='text-2xl font-bold mb-6 sm:px-2 lg:px-5'>Minhas Candidaturas</h1>

                    {isLoading ? (
                        <div className='flex items-center justify-center h-64'>
                            <p className='text-lg text-gray-500'>Carregando...</p>
                        </div>
                    ) : applications.length > 0 ? (
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:px-2 lg:px-5'>
                            {applications.map((job) => (
                                <div key={job.id} className='border shadow-lg rounded-lg p-4 md:p-5 bg-white flex flex-col h-full'>
                                    <div className='flex flex-col gap-3 md:gap-4 flex-1'>
                                        <div className='flex flex-col gap-2'>
                                            <h2 className='text-lg md:text-xl font-semibold flex items-start gap-2'>
                                                <Briefcase className='w-5 h-5 shrink-0 mt-1' />
                                                <span className='wrap-break-words flex-1'>{job.title}</span>
                                            </h2>
                                            <p className='text-gray-500 text-sm flex items-center gap-2 pl-7'>
                                                <Building2 className='w-4 h-4 shrink-0' />
                                                <span className='wrap-break-words'>{job.company}</span>
                                            </p>
                                        </div>

                                        <div className='flex flex-col gap-2 text-xs md:text-sm text-gray-600 pl-7'>
                                            <span className='flex items-center gap-2'>
                                                <MapPin className='w-4 h-4 shrink-0' />
                                                <span className='wrap-break-words'>{job.city}/{job.state}</span>
                                            </span>
                                            <span className='flex items-center gap-2'>
                                                <Earth className='w-4 h-4 shrink-0' />
                                                <span className='wrap-break-words'>{job.area}</span>
                                            </span>
                                            <span className='flex items-center gap-2'>
                                                <Banknote className='w-4 h-4 shrink-0' />
                                                <span className='wrap-break-words'>{job.salary ? `R$ ${job.salary.toFixed(2)}` : 'Não informado'}</span>
                                            </span>
                                        </div>

                                        {job.feedback && (
                                            <div className='mt-2 pt-3 border-t border-gray-200 bg-blue-50 p-3 rounded'>
                                                <h3 className='font-semibold text-xs md:text-sm flex items-center gap-2 mb-2 text-blue-900'>
                                                    <MessageSquare className='w-4 h-4 shrink-0' />
                                                    Feedback da Empresa
                                                </h3>
                                                <p className='text-xs md:text-sm text-gray-700 whitespace-pre-line wrap-break-words'>{job.feedback}</p>
                                            </div>
                                        )}

                                        {!job.feedback && (
                                            <div className='mt-2 pt-3 border-t border-gray-200'>
                                                <p className='text-xs md:text-sm text-gray-500 italic'>Aguardando feedback</p>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className='mt-3 pt-3 border-t'>
                                        <Button size='sm' onClick={() => navigate(`/jobs/${job.id}`)} className='w-full'>
                                            Ver Detalhes
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='flex items-center justify-center h-64'>
                            <p className='text-lg text-gray-500 font-semibold'>Você ainda não se candidatou a nenhuma vaga</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Applications;
