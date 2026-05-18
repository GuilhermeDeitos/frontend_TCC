import * as z from 'zod';

export const contactSchema = z.object({
  name: z.string()
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Apenas letras, espaços, hífens e apóstrofos'),
  email: z.string()
    .min(1, 'E-mail é obrigatório')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'E-mail deve ser válido (ex: seu@email.com)'),
  message: z.string()
    .min(10, 'Mensagem deve ter no mínimo 10 caracteres')
    .max(5000, 'Mensagem deve ter no máximo 5000 caracteres')
    .refine((val) => {
      const urlRegex = /http[s]?:\/\/(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+/g;
      const urls = val.match(urlRegex) || [];
      return urls.length <= 3;
    }, 'Mensagem deve conter no máximo 3 links'),
});

// Exportamos também a tipagem inferida para usar no formulário
export type ContactFormData = z.infer<typeof contactSchema>;