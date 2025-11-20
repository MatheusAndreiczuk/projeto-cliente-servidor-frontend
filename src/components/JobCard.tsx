import { useState } from "react"
import { GetJobSchema } from "../schemas/jobSchema"
import { AlertDialog } from "./AlertDialog"
import { Button } from "./Button"
import { MapPin, Briefcase, Banknote, Earth } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { api } from "../services/axios"
import { useAuth } from "../context/AuthContext"
import JobApplication from "../pages/Job/jobApplication"

type JobCardProps = GetJobSchema & {
    role?: string | null
    isView?: boolean
}

export function JobCard({ role, isView, ...props }: JobCardProps) {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

     const handleOpenDialog = () => {
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    const handleConfirmDelete = async () => {
            setIsLoading(true);
            try {
                await api.delete(`/jobs/${props.id}`,
                    {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }
                )
                navigate('/home')
            } catch (error) {
                console.error('Erro ao excluir vaga:', error);
            } finally {
                setIsLoading(false);
            }
        }

    return (
        <div className="border shadow-lg rounded-lg px-5 py-4">
            <div className="flex flex-col gap-5">
                <div>
                    <h1 className="text-lg font-semibold flex items-center gap-1"> <Briefcase className="inline pr-1" />{props.title}</h1>
                    <p className="text-gray-500 flex items-center gap-1 text-sm">{props.company}</p>
                </div>
                <div className="flex flex-row gap-5 items-center">
                    <p className="text-sm text-gray-500 items-center"><MapPin className="inline pr-1" />{props.city}/{props.state}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Earth className="inline pr-1" />{props.area}
                    </p>

                </div>
                {isView && (
                    <p className="text-sm text-gray-500">{props.description}</p>
                )}
                <div className="flex flex-row justify-between items-center mt-5 border-t pt-2">
                    <p className="text-sm text-gray-500">
                        <Banknote className="inline pr-1" />{props.salary ? `R$ ${props.salary.toFixed(2)}` : 'Salário não informado'}
                    </p>
                    {role == 'user' && isView ?
                        (
                            <Button size="sm" onClick={() => {navigate(`/jobs/application/${props.id}`)}}>Candidatar-se</Button>
                        ) : role == 'company' && isView ?
                            (
                                <span>
                                    <Button size="sm" onClick={() => { navigate(`/jobs/edit/${props.id}`) }}>Editar</Button>
                                    <Button size="sm" onClick={handleOpenDialog}>Excluir</Button>

                                    <AlertDialog
                                        open={isDialogOpen}
                                        onClose={handleCloseDialog}
                                        onConfirm={handleConfirmDelete}
                                        title="Confirmação de Exclusão de Vaga anunciada"
                                        description="Tem certeza que deseja excluir esta vaga? Esta ação não pode ser desfeita."

                                        confirmText="Excluir definitivamente"
                                        confirmColor="error"
                                        isLoading={isLoading}
                                    />
                                </span>
                            ) : (
                                <Button size="sm" onClick={() => { navigate(`/jobs/${props.id}`) }}>Detalhes</Button>
                            )
                    }
                </div>
            </div>
        </div>
    )
}
