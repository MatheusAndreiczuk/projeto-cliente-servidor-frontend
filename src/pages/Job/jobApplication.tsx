import { Navbar } from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import { JobApplicationSchema, jobApplicationSchema } from "../../schemas/jobSchema";
import { GetJobSchema } from "../../schemas/jobSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/axios";
import { useState, useEffect } from "react";

function JobApplication() {
    const navigate = useNavigate();
    const { decodedToken, token } = useAuth();
    const role = decodedToken?.role;
    const { id } = useParams();
    const [job, setJob] = useState<GetJobSchema>({} as GetJobSchema);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<JobApplicationSchema>({
        resolver: zodResolver(jobApplicationSchema)
    });

    async function handleCreateApplication(data: JobApplicationSchema) {
        setIsSubmitting(true);
        try {
            const response = await api.post(`/jobs/${id}`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Candidatura enviada com sucesso:', response.data);
            alert('Candidatura enviada com sucesso!');
            navigate(`/jobs/${job.id}`);
        } catch (error: any) {
            console.error('Erro ao enviar candidatura:', error);
            const errorMessage = error.response?.data?.message || 'Erro ao enviar candidatura. Tente novamente.';
            alert(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    }

    async function fetchJob(jobId: string) {
        try {
            const response = await api.get(`/jobs/${jobId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Resposta completa da API:', response.data);
            const jobData = response.data.items;
            console.log('jobData:', jobData);
            const mappedJob = { ...jobData, id: Number(jobData.job_id) };
            console.log('mappedJob:', mappedJob);
            setJob(mappedJob);
        } catch (error) {
            console.error("Erro ao buscar vaga no candidate-se:", error);
        }
    }

    useEffect(() => {
        console.log('useEffect executado, id:', id);
        if (id && token) {
            fetchJob(id);
        }
    }, [id, token]);


    return (
        <>
            <Navbar role={role} />
            <div className="mt-8 flex justify-center">
                <div className="w-7xl p-6 rounded-lg shadow-xl bg-gray-50 mb-6">
                    <form onSubmit={handleSubmit(handleCreateApplication)}>
                        <h1 className="text-2xl font-bold mb-4">Enviar Candidatura</h1>
                        <div className="flex flex-col gap-2">
                            <Input
                                label="Nome Completo"
                                type="text"
                                required
                                placeholder="Digite seu nome completo"
                                {...register('name')}
                            />
                            {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}

                            <div className='flex flex-row gap-3 w-full'>
                                <span className='flex-3'>
                                    <Input className="w-full" label='Email' type="text" placeholder='Digite seu melhor email (opcional)' {...register('email')} />
                                    {(errors as any).email && <span className='text-red-600'>{((errors as any).email)?.message}</span>}
                                </span>
                                <span className='flex-1'>
                                    <Input className="w-full" label='Telefone' type="text" placeholder='Ex.:42999887766' {...register('phone')} />
                                    {(errors as any).phone && <span className='text-red-600'>{((errors as any).phone)?.message}</span>}
                                </span>
                            </div>

                            <Input
                                label="Formação Acadêmica"
                                istextarea
                                rows={6}
                                required
                                placeholder="Descreva sua formação acadêmica (máximo 4000 caracteres)"
                                {...register('education')}
                            />
                            {errors.education && <p className="text-red-600 text-sm">{errors.education.message}</p>}

                            <Input
                                label="Experiência Profissional"
                                istextarea
                                rows={6}
                                required
                                placeholder="Descreva sua experiência profissional (máximo 4000 caracteres)"
                                {...register('experience')}
                            />
                            {errors.experience && <p className="text-red-600 text-sm">{errors.experience.message}</p>}
                        </div>

                        {job.title && (
                            <div className="mt-4 pt-4 border-t border-gray-300 flex">
                                <p className="font-semibold mb-2">Você está se candidatando para:</p>
                                <p><strong>Vaga:</strong> {job.title}</p>
                                <p><strong>Empresa:</strong> {job.company}</p>
                                <p><strong>Local:</strong> {job.city}/{job.state}</p>
                                <p><strong>Área:</strong> {job.area}</p>
                                <p className="text-sm text-gray-600 mt-2">Antes de prosseguir, fique ciente das suas atribuições e dos requisitos da vaga.</p>
                            </div>
                        )}

                        <div className="flex justify-end gap-5 mt-4">
                            <Button
                                type="button"
                                color="red"
                                onClick={() => { navigate(`/jobs/${job.id}`) }}
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Enviando...' : 'Enviar candidatura'}
                            </Button>
                        </div>
                    </form>
                </div >
            </div >
        </>
    )
}

export default JobApplication;