import React, { useEffect, useState } from "react"
import { api } from "../../services/axios.js"
import { EditUserData } from "./editProfile.js"
import { useEditingProfileStore } from '../../store/editing.js'
import { parseJwt } from "../../utils/parseJwt.js"
import { AlertDialog } from "../../components/AlertDialog.js"
import { useNavigate } from "react-router-dom"
import { Navbar } from '../../components/Navbar.js'
import { CompanySchema } from "../../schemas/companySchema.js"
import { CreateUserSchema } from "../../schemas/userSchema.js"
import { Button } from "../../components/Button.js"
import { useAuth } from "../../context/AuthContext.js"

// interface User {
//     username: string,
//     name: string,
//     password: string,
//     phone?: string,
//     email?: string,
//     experience?: string,
//     education?: string
// }

function Profile() {
    const navigate = useNavigate()
    const { token, decodedToken } = useAuth();
    const userId = decodedToken?.sub;
    const role = decodedToken?.role;
    const getRoute = role === "company" ? "/companies/" : "/users/"
    let [userData, setUserData] = useState<CreateUserSchema | null>(null)
    let [companyData, setCompanyData] = useState<CompanySchema | null>(null)
    let [isCompany, setIsCompany] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const editingProfile = useEditingProfileStore((state) => state.editingProfile);
    const trueEditingProfile = useEditingProfileStore((state) => state.trueEditingProfile);

    const handleOpenDialog = () => {
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    const handleConfirmDelete = async () => {
        setIsLoading(true);
        try {
            await api.delete(`/${getRoute}/${userId}`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            )
            localStorage.removeItem('token');
            navigate('/')
        } catch (error) {
            console.error('Erro ao excluir perfil:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const fetchUserData = async () => {
        const response = await api.get(`${getRoute}${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        if (role === "company") {
            setCompanyData(response.data)
            setIsCompany(true)
        } else {
            setUserData(response.data)
            setIsCompany(false)
        }
    }

    useEffect(() => {
        fetchUserData()
    }, []);

    return (
        <>
            <Navbar />
            <div className="flex items-center mt-10 flex-col min-h-screen">
                <div className="w-lg p-8 rounded-md bg-gray-50 shadow-xl">
                    {!editingProfile ? (
                        <>
                            <fieldset className="p-7 border rounded-md border-black">
                                <legend className="px-3 text-lg">
                                    {isCompany ? 'Dados da Empresa' : `Olá, ${userData?.name}`}
                                </legend>
                                <div className="flex flex-col gap-5">
                                    {!isCompany ? (
                                        <><p>Username: {userData?.username}</p>
                                            <p>Name: {userData?.name}</p>
                                            <p>Email: {userData?.email || 'Não informado'}</p>
                                            <p>Phone: {userData?.phone || 'Não informado'}</p>
                                            <p>Education: {userData?.education || 'Não informado'}</p>
                                            <p>Experience: {userData?.experience || 'Não informado'}</p></>

                                    ) : (
                                        <>
                                            <p>Nome da empresa: {companyData?.name}</p>
                                            <p>Ramo de atuação: {companyData?.business}</p>
                                            <p>Username: {companyData?.username}</p>
                                            <p>Email: {companyData?.email}</p>
                                            <p>Telefone: {companyData?.phone}</p>
                                            <p>Endereço: {companyData?.street}, {companyData?.number} - {companyData?.city} - {companyData?.state}</p>
                                        </>
                                    )}
                                </div>
                            </fieldset>
                            <div className="flex flex-row gap-5 justify-end">
                                <Button onClick={trueEditingProfile} color="blue"> Editar perfil </Button>

                                <Button onClick={handleOpenDialog} color="red"> Excluir perfil </Button>

                                <AlertDialog
                                    open={isDialogOpen}
                                    onClose={handleCloseDialog}
                                    onConfirm={handleConfirmDelete}
                                    title="Confirmação de Exclusão de Perfil"
                                    description="Tem certeza que deseja excluir seu perfil? Esta ação não pode ser desfeita."

                                    confirmText="Excluir definitivamente"
                                    confirmColor="error"
                                    isLoading={isLoading}
                                />
                            </div>
                        </>

                    ) : (
                        (isCompany ? companyData : userData) && (
                            <EditUserData {...(isCompany ? companyData : userData)!} refetchUserData={fetchUserData} />
                        )
                    )}

                </div>
            </div>
        </>
    )
}

export default Profile