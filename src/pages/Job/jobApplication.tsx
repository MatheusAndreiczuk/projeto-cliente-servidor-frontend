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
import { ConfirmApplicationModal } from "../../components/ConfirmApplicationModal";

function JobApplication() {
    const navigate = useNavigate();
    const { decodedToken, token } = useAuth();
    const role = decodedToken?.role;
    const { id } = useParams();
    const [job, setJob] = useState<GetJobSchema>({} as GetJobSchema);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [formData, setFormData] = useState<JobApplicationSchema | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<JobApplicationSchema>({
        resolver: zodResolver(jobApplicationSchema)
    });

    async function handleFormSubmit(data: JobApplicationSchema) {
        setFormData(data);
        setShowConfirmModal(true);
    }

    async function handleConfirmApplication() {
        if (!formData) return;
        
        setIsSubmitting(true);
        try {
            const response = await api.post(`/jobs/${id}`, formData, {
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
            setShowConfirmModal(false);
        }
    }

    async function fetchJob(jobId: string) {
        try {
            const response = await api.get(`/jobs/${jobId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const jobData = response.data.items;
            const mappedJob = { ...jobData, id: Number(jobData.job_id) };
            setJob(mappedJob);
        } catch (error) {
            console.error("Erro ao buscar vaga:", error);
        }
    }

    useEffect(() => {
        if (id && token) {
            fetchJob(id);
        }
    }, [id, token]);


    return (
        <>
            <Navbar role={role} />
            <div className="mt-6 md:mt-8 flex justify-center px-4">
                <div className="w-full md:w-5/6 max-w-7xl sm:p-4 md:p-6 sm:rounded-lg sm:shadow-xl sm:bg-gray-50 mb-6">
                    <form onSubmit={handleSubmit(handleFormSubmit)}>
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

                            <div className='flex flex-col sm:flex-row gap-3 w-full'>
                                <span className='flex-1 sm:flex-3'>
                                    <Input className="w-full" label='Email' type="text" placeholder='Digite seu email (opcional)' {...register('email')} />
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

                        <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-5 mt-4">
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
                                Continuar
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            <ConfirmApplicationModal
                job={job}
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleConfirmApplication}
                isSubmitting={isSubmitting}
            />
        </>
    )
}

export default JobApplication;