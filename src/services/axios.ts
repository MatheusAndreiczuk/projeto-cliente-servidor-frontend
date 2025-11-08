import axios from 'axios'

import { useDataConnectionStore } from '../store/connectionData.ts';

export const api = axios.create({
    headers: {
        'Content-Type': 'application/json'
    },
})

// Interceptor para pegar IP e porta dinamicamente antes de cada requisição
api.interceptors.request.use((config) => {
    const { ip, port } = useDataConnectionStore.getState();
    config.baseURL = `http://${ip}:${port}`;
    console.log(`Fazendo requisição para: ${config.baseURL}${config.url}`);
    return config;
}, (error) => {
    return Promise.reject(error);
});

