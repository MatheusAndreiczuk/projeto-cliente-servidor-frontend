import { z } from 'zod';

export const companySchema = z.object({
    name:  z
    .string()
    .min(4, "Deve ter no mínimo 4 caracteres")
    .max(150, "Deve ter no máximo 150 caracteres"),
    business: z
    .string()
    .min(4, "Deve ter no mínimo 4 caracteres")
    .max(150, "Deve ter no máximo 150 caracteres"),
    username: z
    .string()
    .trim()
    .min(3, "Deve ter no mínimo 3 caracteres")
    .max(20, "Deve ter no máximo 20 caracteres"),
    password: z
    .string()
    .trim()
    .min(3, "Deve ter no mínimo 3 caracteres")
    .max(20, "Deve ter no máximo 20 caracteres"),
    street: z
    .string()
    .min(1, "Deve ter no mínimo 3 caracteres")
    .max(150, "Deve ter no máximo 150 caracteres"),
    number: z
    .string()
    .min(1, "Deve ter no mínimo 1 dígito")
    .max(8, "Deve ter no máximo 8 dígitos"),
    city: z
    .string()
    .min(4, "Deve ter no mínimo 4 caracteres")
    .max(150, "Deve ter no máximo 150 caracteres"),
    phone: z
    .string()
    .min(10, "Deve ter no mínimo 10 caracteres")
    .max(14, "Deve ter no máximo 14 caracteres"),
    email: z
    .email()
    .min(10, "Deve ter no mínimo 10 caracteres")
    .max(150, "Deve ter no máximo 150 caracteres"),
    state: z
    .string()
})

export type CompanySchema = z.infer<typeof companySchema>