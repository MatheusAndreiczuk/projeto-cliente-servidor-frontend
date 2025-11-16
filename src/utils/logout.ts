import { api } from "../services/axios.js";

export async function logout(){
    await api.post('/logout', {}, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    localStorage.removeItem('token');
}
