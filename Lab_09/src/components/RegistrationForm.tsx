import React, { useEffect, useReducer } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../contexts/AuthContext";
import { initialState, registrationReducer } from "../reducers/registrationReducer";
import { Step1Schema, Step2Schema, Step3Schema } from "../schemas/schemas";
import { IFormData, IUser } from "../types/types";

const styles = {
  container: {
    maxWidth: 500,
    margin: "50px auto",
    padding: 30,
    backgroundColor: "var(--card-bg)",
    borderRadius: 16,
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    fontSize: 28,
    fontWeight: 600,
    color: "var(--text-color)",
    marginBottom: 8,
    textAlign: "center" as const,
  },
  stepIndicator: {
    textAlign: "center" as const,
    color: "var(--text-color)",
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 30,
    letterSpacing: 1,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    display: "block",
    marginBottom: 8,
    fontWeight: 500,
    color: "var(--text-color)",
    fontSize: 14,
  },
  input: (hasError: boolean) => ({
    width: "100%",
    padding: "12px 16px",
    border: hasError ? "1px solid #e74c3c" : "1px solid var(--border-color)",
    borderRadius: 10,
    fontSize: 16,
    transition: "border-color 0.3s",
    outline: "none",
    boxSizing: "border-box" as const,
    backgroundColor: "var(--card-bg)",
    color: "var(--text-color)",
  }),
  select: (hasError: boolean) => ({
    width: "100%",
    padding: "12px 16px",
    border: hasError ? "1px solid #e74c3c" : "1px solid var(--border-color)",
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: "var(--card-bg)",
    color: "var(--text-color)",
    cursor: "pointer",
    outline: "none",
    boxSizing: "border-box" as const,
  }),
  error: {
    color: "#e74c3c",
    fontSize: 12,
    marginTop: 6,
  },
  checkboxGroup: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    cursor: "pointer",
  },
  checkboxLabel: {
    fontSize: 14,
    color: "var(--text-color)",
    cursor: "pointer",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 32,
    gap: 12,
  },
  button: {
    flex: 1,
    padding: "12px 24px",
    border: "none",
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  buttonPrev: {
    backgroundColor: "var(--border-color)",
    color: "var(--text-color)",
  },
  buttonNext: {
    backgroundColor: "#2c3e50",
    color: "white",
  },
  buttonSubmit: {
    backgroundColor: "#27ae60",
    color: "white",
  },
};

const RegistrationForm: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(registrationReducer, initialState);
  const { currentStep, formData, errors } = state;

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/catalog" });
    }
  }, [isAuthenticated, navigate]);

  const validateCurrentStep = (): boolean => {
    let schema;
    let dataToValidate;
    
    switch (currentStep) {
      case 1:
        schema = Step1Schema;
        dataToValidate = { email: formData.email, password: formData.password };
        break;
      case 2:
        schema = Step2Schema;
        dataToValidate = { username: formData.username, city: formData.city };
        break;
      case 3:
        schema = Step3Schema;
        dataToValidate = { occupation: formData.occupation, agreeToTerms: formData.agreeToTerms };
        break;
      default:
        return false;
    }

    const result = schema.safeParse(dataToValidate);
    
    if (!result.success) {
      const newErrors: any = {};
      result.error.issues.forEach((err) => {
        newErrors[err.path[0]] = err.message;
      });
      dispatch({ type: "SET_ERRORS", errors: newErrors });
      return false;
    }

    dispatch({ type: "CLEAR_STEP_ERRORS", step: currentStep });
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      dispatch({ type: "NEXT_STEP" });
    }
  };

  const handlePrev = () => {
    dispatch({ type: "PREV_STEP" });
  };

  const updateField = (field: keyof IFormData, value: string | boolean) => {
    dispatch({ type: "UPDATE_FIELD", field, value });
  };

  const handleSubmit = () => {
    if (validateCurrentStep()) {
      const user: IUser = {
        id: Date.now(),
        email: state.formData.email,
        username: state.formData.username,
        city: state.formData.city,
        occupation: state.formData.occupation,
      };
      login(user);
    }
  };

  const hasError = (field: keyof IFormData) => !!errors[field];
  const getErrorMessage = (field: keyof IFormData) => errors[field];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Регистрация</h1>
      <div style={styles.stepIndicator}>Шаг {currentStep} из 3</div>

      {currentStep === 1 && (
        <>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="example@mail.com"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              style={styles.input(hasError("email"))}
            />
            {hasError("email") && <div style={styles.error}>{getErrorMessage("email")}</div>}
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Пароль</label>
            <input
              type="password"
              placeholder="Минимум 8 символов"
              value={formData.password}
              onChange={(e) => updateField("password", e.target.value)}
              style={styles.input(hasError("password"))}
            />
            {hasError("password") && <div style={styles.error}>{getErrorMessage("password")}</div>}
          </div>
        </>
      )}

      {currentStep === 2 && (
        <>
          <div style={styles.formGroup}>
            <label style={styles.label}>Имя пользователя</label>
            <input
              type="text"
              placeholder="Как вас называть?"
              value={formData.username}
              onChange={(e) => updateField("username", e.target.value)}
              style={styles.input(hasError("username"))}
            />
            {hasError("username") && <div style={styles.error}>{getErrorMessage("username")}</div>}
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Город</label>
            <input
              type="text"
              placeholder="Где вы живёте?"
              value={formData.city}
              onChange={(e) => updateField("city", e.target.value)}
              style={styles.input(hasError("city"))}
            />
            {hasError("city") && <div style={styles.error}>{getErrorMessage("city")}</div>}
          </div>
        </>
      )}

      {currentStep === 3 && (
        <>
          <div style={styles.formGroup}>
            <label style={styles.label}>Профессия</label>
            <select
              value={formData.occupation}
              onChange={(e) => updateField("occupation", e.target.value)}
              style={styles.select(hasError("occupation"))}
            >
              <option value="">Выберите профессию</option>
              <option value="developer">Программист</option>
              <option value="designer">Дизайнер</option>
              <option value="manager">Менеджер</option>
            </select>
            {hasError("occupation") && <div style={styles.error}>{getErrorMessage("occupation")}</div>}
          </div>
          <div style={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={(e) => updateField("agreeToTerms", e.target.checked)}
              style={styles.checkbox}
            />
            <label htmlFor="agreeToTerms" style={styles.checkboxLabel}>
              Согласен с правилами
            </label>
          </div>
          {hasError("agreeToTerms") && <div style={styles.error}>{getErrorMessage("agreeToTerms")}</div>}
        </>
      )}

      <div style={styles.buttonGroup}>
        {currentStep > 1 && (
          <button onClick={handlePrev} style={{ ...styles.button, ...styles.buttonPrev }}>
            Назад
          </button>
        )}
        
        {currentStep < 3 && (
          <button onClick={handleNext} style={{ ...styles.button, ...styles.buttonNext }}>
            Далее
          </button>
        )}
        
        {currentStep === 3 && (
          <button onClick={handleSubmit} style={{ ...styles.button, ...styles.buttonSubmit }}>
            Зарегистрироваться
          </button>
        )}
      </div>
    </div>
  );
};

export default RegistrationForm;
