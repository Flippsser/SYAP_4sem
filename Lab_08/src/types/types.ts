import { z } from "zod";
import { RegistrationSchema } from "../schemas/schemas";
import { ProductSchema } from "../schemas/productSchema";

export type IFormData = z.infer<typeof RegistrationSchema>;
export type IFormErrors = Partial<Record<keyof IFormData, string>>;

export interface IFormState {
  currentStep: 1 | 2 | 3;
  formData: IFormData;
  errors: IFormErrors;
  isSubmitting: boolean;
}

export type TFormAction =
  | { type: "UPDATE_FIELD"; field: keyof IFormData; value: string | boolean }
  | { type: "SET_ERROR"; field: keyof IFormData; error: string }
  | { type: "SET_ERRORS"; errors: IFormErrors }
  | { type: "CLEAR_STEP_ERRORS"; step: 1 | 2 | 3 }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_SUCCESS" };

export interface IUser {
  id: number;
  email: string;
  username: string;
  city: string;
  occupation: string;
}

export interface IAuthState {
  user: IUser | null;
  isAuthenticated: boolean;
}

export type TAuthAction =
  | { type: 'LOGIN'; payload: IUser }
  | { type: 'LOGOUT' };

export type IProduct = z.infer<typeof ProductSchema>;