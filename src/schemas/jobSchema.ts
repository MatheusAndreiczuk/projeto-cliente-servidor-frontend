import z from 'zod';

export const getJobSchema = z.object({
    id: z.
        number(),
    title: z.
        string()
        .min(3, { message: 'O título deve ter pelo menos 3 caracteres.' })
        .max(150, { message: 'O título deve ter no máximo 150 caracteres.' }),
    area: z.
        string()
        .min(2, { message: 'A área deve ter pelo menos 2 caracteres.' })
        .max(100, { message: 'A área deve ter no máximo 100 caracteres.' }),
    description: z.
        string()
        .min(10, { message: 'A descrição deve ter pelo menos 10 caracteres.' })
        .max(4000, { message: 'A descrição deve ter no máximo 4000 caracteres.' }),
    company: z.
        string()
        .min(2, { message: 'O nome da empresa deve ter pelo menos 2 caracteres.' })
        .max(150, { message: 'O nome da empresa deve ter no máximo 150 caracteres.' }),
    city: z.
        string()
        .min(5, { message: 'A cidade deve ter pelo menos 5 caracteres.' })
        .max(100, { message: 'A cidade deve ter no máximo 100 caracteres.' }),
    state: z.
        string()
        .min(2, { message: 'O estado deve ter pelo menos 2 caracteres.' })
        .max(100, { message: 'O estado deve ter no máximo 100 caracteres.' }),
    salary: z.
        number()
        .optional()
        .nullable()
})

export const jobApplicationSchema = z.object({
    name: z.
        string()
        .min(3, { message: 'O nome do candidato deve ter pelo menos 3 caracteres.' })
        .max(150, { message: 'O nome do candidato deve ter no máximo 150 caracteres.' }),
    email: z
        .email("Email inválido")
        .or(z.literal(''))
        .nullish(),
    phone: z
        .string()
        .min(10, "Telefone deve ter no mínimo 10 dígitos")
        .max(14, "Telefone deve ter no máximo 14 dígitos")
        .or(z.literal(''))
        .nullish(),
    experience: z.
        string()
        .max(4000, { message: 'O currículo deve ter no máximo 4000 caracteres.' }),
    education: z.
        string()
        .max(4000, { message: 'O nível de educação deve ter no máximo 4000 caracteres.' }),
})

export const createJobSchema = getJobSchema.omit({ id: true, company: true });

export type GetJobSchema = z.infer<typeof getJobSchema>;
export type CreateJobSchema = z.infer<typeof createJobSchema>;
export type JobApplicationSchema = z.infer<typeof jobApplicationSchema>;