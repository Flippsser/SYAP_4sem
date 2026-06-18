import { z } from "zod";

export const RegistrationSchema = z.object({
  email: z.string().email('Неверный формат email'),
  password: z.string().min(8, "Пароль должен содержать минимум 8 символов"),
  username: z.string().min(1, "Имя пользователя не может быть пустым"),
  city: z.string().min(1, "Город не может быть пустым"),
  occupation: z.string().min(1, "Выберите профессию"),
  agreeToTerms: z.boolean().refine(val => val === true, "Необходимо согласиться с правилами"),
});

export const Step1Schema = RegistrationSchema.pick({ email: true, password: true });
export const Step2Schema = RegistrationSchema.pick({ username: true, city: true });
export const Step3Schema = RegistrationSchema.pick({ occupation: true, agreeToTerms: true });
