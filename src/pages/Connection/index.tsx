import { useForm } from "react-hook-form"
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { useDataConnectionStore } from "../../store/connectionData.ts";
import { Input } from "../../components/Input.tsx";
import { Button } from "../../components/Button.tsx";


interface ConnectionFormData {
    ip: string;
    port: number;
}



function Connection() {
    const navigate = useNavigate()

    const { register, handleSubmit } = useForm<ConnectionFormData>({
        defaultValues: {
            ip: localStorage.getItem('server-ip') || 'localhost',
            port: localStorage.getItem('server-port') ? Number(localStorage.getItem('server-port')) : 3000
        }
    })

    function connectServer(data: ConnectionFormData) {
        // Converte port para número se vier como string
        const port = typeof data.port === 'string' ? Number(data.port) : data.port;
        
        console.log('Conectando em:', data.ip, port);
        
        useDataConnectionStore.getState().setConnectionData(data.ip, port);
        navigate('/');
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="p-10 w-lg bg-gray-50 rounded-md shadow-lg">
                <h1 className="text-center text-xl">Conecte-se com o servidor</h1>
                <form className="mt-5" onSubmit={handleSubmit(connectServer)}>
                    <fieldset className="border border-gray-500 rounded-md p-7">
                        <div className="flex flex-col gap-5">
                            <Input
                                label="Endereço IP do servidor"
                                type="text"
                                required
                                placeholder="Ex: localhost ou 192.168.0.1"
                                {...register('ip', { required: true })}
                            />
                            <Input
                            label="Porta do servidor"
                                type="number"
                                required
                                placeholder="Ex: 3000" 
                                {...register('port', { required: true, valueAsNumber: true })} 
                            />
                        </div>
                    </fieldset>
                    <div className="flex justify-end">
                       <Button type="submit">Conectar</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Connection
