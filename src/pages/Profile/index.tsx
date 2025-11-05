import { useEffect, useState } from "react"
import { api } from "../../services/axios.js"
import { EditUserData } from "./editProfile.tsx"
import { useEditingProfileStore } from '../../store/editing.ts'
import { parseJwt } from "../../utils/parseJwt.js"
import { AlertDialog } from "../../components/AlertDialog.tsx"
import { useNavigate } from "react-router-dom"
import { Navbar } from '../../components/Navbar.tsx'
import { logout } from "../../utils/logout.ts"
import { CompanySchema } from "../../schemas/companySchema.ts"
import { CreateUserSchema } from "../../schemas/userSchema.ts"

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

        try{
            const token = localStorage.getItem('token');
            const decodedToken = parseJwt(token);
            const userId = decodedToken?.sub;
            
            await api.delete(`/users/${userId}`, 
                {
                    headers: {'Authorization': `Bearer ${token}`}
                }
            )
            await logout()
            navigate('/')
        } catch(error) {
            console.error('Erro ao excluir perfil:', error);
        } finally{
            setIsLoading(false);
        }
    }

    const fetchUserData = async () => {
        let token = localStorage.getItem('token');
        let decodedToken
        if (token) {
            decodedToken = parseJwt(token);
        }
        const userId = decodedToken.sub
        const role = decodedToken.role
        console.log(userId)
        const getRoute = role === "company" ? "/companies/" : "/users/"

        const response = await api.get(`${getRoute}${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        if(role === "company"){
            setCompanyData(response.data)
            setIsCompany(true)
        } else {
            setUserData(response.data)
            setIsCompany(false)
        }
        console.log(response)
    }

    useEffect(() => {
        fetchUserData()
    }, []);

    return (
        <>
            <Navbar />
            <div className="flex items-center mt-20 flex-col min-h-screen">
                <div className="w-lg p-10 rounded-md shadow-lg border border-gray-300">
                    {!editingProfile ? (
                        <>
                            <fieldset className="p-10 border rounded-md border-black">
                                <legend className="px-3 text-lg">
                                    {isCompany ? 'Dados da Empresa' : `Olá, ${userData?.name}`}
                                </legend>
                                <div className="flex flex-col gap-5">
                                { !isCompany ? (
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
                            <div className="flex flex-row gap-5 justify-end mt-5">
                                <button
                                    className="p-3 bg-blue-400 rounded-md font-semibold cursor-pointer"
                                    onClick={() => trueEditingProfile()}
                                >Editar perfil
                                </button>

                                <button 
                                    className="p-3 bg-red-400 rounded-md font-semibold cursor-pointer"
                                     onClick={handleOpenDialog}
                                >Excluir perfil</button>

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
                        userData && <EditUserData {...userData} refetchUserData={fetchUserData} />
                    )}

                </div>
            </div>
        </>
    )
}

export default Profile