import { Navbar } from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/axios';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { User, Mail, Phone, GraduationCap, Briefcase } from 'lucide-react';

type Candidate = {
    user_id: number;
    name: string;
    email: string;
    phone: string;
    education: string;
    experience: string;
}

function Candidates() {
    const { token, decodedToken } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [feedbackForm, setFeedbackForm] = useState<{ userId: number | null, message: string }>({ 
        userId: null, 
        message: '' 
    });
    const [isSending, setIsSending] = useState(false);
    const role = decodedToken?.role;
    const companyId = decodedToken?.sub;

    async function fetchCandidates() {
        setIsLoading(true);
        try {
            const response = await api.get(`/companies/${companyId}/jobs/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCandidates(response.data?.items ?? []);
        } catch (error) {
            console.error("Erro ao buscar candidatos:", error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSendFeedback(userId: number) {
        if (!feedbackForm.message.trim()) {
            alert('Por favor, escreva uma mensagem de feedback.');
            return;
        }

        setIsSending(true);
        try {
            await api.post(`/jobs/${id}/feedback`, 
                {
                    user_id: userId,
                    message: feedbackForm.message
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            alert('Feedback enviado com sucesso!');
            setFeedbackForm({ userId: null, message: '' });
        } catch (error: any) {
            console.error('Erro ao enviar feedback:', error);
            const errorMessage = error.response?.data?.message || 'Erro ao enviar feedback. Tente novamente.';
            alert(errorMessage);
        } finally {
            setIsSending(false);
        }
    }

    useEffect(() => {
        if (role !== 'company') {
            navigate('/home');
            return;
        }
        if (companyId && token && id) {
            fetchCandidates();
        }
    }, [companyId, token, id, role]);

    return (
        <div className='h-screen overflow-hidden flex flex-col'>
            <div className='md:flex md:flex-col md:items-center md:pt-6'>
                <Navbar role={role} />
            </div>

            <div className='flex-1 flex items-start justify-center pt-6 md:pt-4 overflow-auto px-4'>
                <div className='w-full md:w-5/6 md:border md:rounded-md md:p-6 md:shadow-lg mb-10'>
                    <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6'>
                        <h1 className='text-lg md:text-2xl font-bold'>Candidatos da Vaga</h1>
                        <Button size='sm' onClick={() => navigate(`/jobs/${id}`)}>Voltar</Button>
                    </div>

                    {isLoading ? (
                        <div className='flex items-center justify-center h-64'>
                            <p className='text-lg text-gray-500'>Carregando candidatos...</p>
                        </div>
                    ) : candidates.length > 0 ? (
                        <div className='space-y-4 md:space-y-6'>
                            {candidates.map((candidate) => (
                                <div key={candidate.user_id} className='border rounded-lg p-4 md:p-5 shadow-md bg-white'>
                                    <div className='flex flex-col gap-3 md:gap-4'>
                                        <div className='flex items-center justify-between border-b pb-3'>
                                            <h2 className='text-lg md:text-xl font-semibold flex items-center gap-2'>
                                                <User className='w-5 h-5' />
                                                {candidate.name}
                                            </h2>
                                        </div>

                                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4'>
                                            <div className='flex items-center gap-2 text-gray-700 text-sm'>
                                                <Mail className='w-4 h-4 shrink-0' />
                                                <span className='truncate'>{candidate.email || 'Não informado'}</span>
                                            </div>
                                            <div className='flex items-center gap-2 text-gray-700 text-sm'>
                                                <Phone className='w-4 h-4 shrink-0' />
                                                <span className='truncate'>{candidate.phone || 'Não informado'}</span>
                                            </div>
                                        </div>

                                        <div className='space-y-3'>
                                            <div>
                                                <h3 className='text-sm md:text-base font-semibold flex items-center gap-2 mb-1'>
                                                    <GraduationCap className='w-4 h-4 shrink-0' />
                                                    Formação Acadêmica
                                                </h3>
                                                <p className='text-xs md:text-sm text-gray-600 whitespace-pre-line pl-6 wrap-break-words'>{candidate.education}</p>
                                            </div>

                                            <div>
                                                <h3 className='text-sm md:text-base font-semibold flex items-center gap-2 mb-1'>
                                                    <Briefcase className='w-4 h-4 shrink-0' />
                                                    Experiência Profissional
                                                </h3>
                                                <p className='text-xs md:text-sm text-gray-600 whitespace-pre-line pl-6 wrap-break-words'>{candidate.experience}</p>
                                            </div>
                                        </div>

                                        <div className='mt-4 pt-4 border-t'>
                                            {feedbackForm.userId === candidate.user_id ? (
                                                <div className='space-y-3'>
                                                    <Input
                                                        label='Mensagem de Feedback'
                                                        istextarea
                                                        rows={4}
                                                        placeholder='Escreva seu feedback para o candidato...'
                                                        value={feedbackForm.message}
                                                        onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                                                    />
                                                    <div className='flex flex-col sm:flex-row gap-2 justify-end'>
                                                        <Button 
                                                            color='red' 
                                                            size='sm'
                                                            onClick={() => setFeedbackForm({ userId: null, message: '' })}
                                                            disabled={isSending}
                                                        >
                                                            Cancelar
                                                        </Button>
                                                        <Button 
                                                            size='sm'
                                                            onClick={() => handleSendFeedback(candidate.user_id)}
                                                            disabled={isSending}
                                                        >
                                                            {isSending ? 'Enviando...' : 'Enviar Feedback'}
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <Button 
                                                    size='sm'
                                                    onClick={() => setFeedbackForm({ userId: candidate.user_id, message: '' })}
                                                >
                                                    Enviar Feedback
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='flex items-center justify-center h-64'>
                            <p className='text-lg text-gray-500 font-semibold'>Ainda não há candidatos para esta vaga</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Candidates;
