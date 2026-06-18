import { IFormState, TFormAction, IFormData } from "../types/types";

export const initialState: IFormState = {
  currentStep: 1,
  formData: {
    email: "",
    password: "",
    username: "",
    city: "",
    occupation: "",
    agreeToTerms: false,
  },
  errors: {},
  isSubmitting: false,
};

export function registrationReducer(state: IFormState, action: TFormAction): IFormState {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        formData: { ...state.formData, [action.field]: action.value },
        errors: { ...state.errors, [action.field]: undefined },
      };

    case "SET_ERROR":
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.error },
      };

    case "SET_ERRORS":
      return {
        ...state,
        errors: { ...state.errors, ...action.errors },
      };

    case "CLEAR_STEP_ERRORS": {
      let fieldsToClear: (keyof IFormData)[] = [];
      
      if (action.step === 1) {
        fieldsToClear = ["email", "password"];
      } else if (action.step === 2) {
        fieldsToClear = ["username", "city"];
      } else if (action.step === 3) {
        fieldsToClear = ["occupation", "agreeToTerms"];
      }
      
      const newErrors = { ...state.errors };
      fieldsToClear.forEach((field) => {
        delete newErrors[field];
      });
      
      return {
        ...state,
        errors: newErrors,
      };
    }

    case "NEXT_STEP":
      return {
        ...state,
        currentStep: (state.currentStep + 1) as 1 | 2 | 3,
      };

    case "PREV_STEP":
      return {
        ...state,
        currentStep: (state.currentStep - 1) as 1 | 2 | 3,
      };

    case "SUBMIT_START":
      return { ...state, isSubmitting: true };

    case "SUBMIT_SUCCESS":
      return { ...state, isSubmitting: false };

    default:
      return state;
  }
}