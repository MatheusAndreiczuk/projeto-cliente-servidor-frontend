import { z } from 'zod';

export const createUserSchema = z.object({
    name: z 
    .string()
    .min(4, "Nome deve ter no mínimo 4 caracteres")
    .max(150, "Nome deve ter no máximo 150 caracteres")
    .toUpperCase(),
    username: z
    .string()
    .min(3, "Nome de usuário deve ter no mínimo 3 caracteres")
    .max(255, "Nome de usuário deve ter no máximo 20 caracteres"),
    email: z
    .email("Email inválido")
    .or(z.literal(''))
    .nullish(),
    password: z
    .string()
    .min(3, "Senha deve ter no mínimo 3 caracteres")
    .max(20, "Senha deve ter no máximo 20 caracteres"),
    phone: z
    .string()
    .min(10, "Telefone deve ter no mínimo 10 dígitos")
    .max(14, "Telefone deve ter no máximo 14 dígitos")
    .or(z.literal(''))
    .nullish(),
    experience: z
    .string()
    .min(10, "Experiência deve ter no mínimo 10 caracteres")
    .max(600, "Experiência deve ter no máximo 600 caracteres")
    .or(z.literal(''))
    .nullish(),
    education: z
    .string()
    .min(10, "Educação deve ter no mínimo 10 caracteres")
    .max(600, "Educação deve ter no máximo 600 caracteres")
    .or(z.literal(''))
    .nullish()
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;