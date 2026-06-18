import { z } from "zod";

export const ProductSchema = z.object({
  id: z.number(),
  title: z.string().min(3, "Название должно содержать минимум 3 символа"),
  price: z.number().positive("Цена должна быть больше 0"),
  description: z.string().optional(),
  category: z.string().optional(),
  thumbnail: z.string().optional()
});

export type Product = z.infer<typeof ProductSchema>;
export type ProductFormData = Omit<Product, 'id'>;

export const ProductFormSchema = ProductSchema.omit({ id: true });
