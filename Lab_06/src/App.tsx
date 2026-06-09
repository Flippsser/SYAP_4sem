import { useReducer } from 'react'
import { z } from 'zod'
import './App.css'

const RegistrationSchema = z.object({
  email: z
    .string()
    .trim()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Некорректный email'),
  password: z.string().min(8, 'Минимум 8 символов'),
  username: z.string().trim().min(1, 'Введите имя'),
  city: z.string().trim().min(1, 'Введите город'),
  occupation: z.string().min(1, 'Выберите занятие'),
  termsAccepted: z.boolean().refine(Boolean, 'Подтвердите согласие'),
})

type IFormData = z.infer<typeof RegistrationSchema>
type TStep = 1 | 2 | 3
type TFormErrors = Partial<Record<keyof IFormData, string>>

interface IFormState {
  currentStep: TStep
  formData: IFormData
  errors: TFormErrors
  isSubmitting: boolean
}

type TFormAction =
  | { type: 'UPDATE_FIELD'; field: keyof IFormData; value: string | boolean }
  | { type: 'SET_ERROR'; field: keyof IFormData; message: string }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS' }

const initialState: IFormState = {
  currentStep: 1,
  formData: {
    email: '',
    password: '',
    username: '',
    city: '',
    occupation: '',
    termsAccepted: false,
  },
  errors: {},
  isSubmitting: false,
}

const stepSchemas: Record<TStep, z.ZodType> = {
  1: RegistrationSchema.pick({ email: true, password: true }),
  2: RegistrationSchema.pick({ username: true, city: true }),
  3: RegistrationSchema.pick({ occupation: true, termsAccepted: true }),
}

function registrationReducer(
  state: IFormState,
  action: TFormAction,
): IFormState {
  switch (action.type) {
    case 'UPDATE_FIELD': {
      const errors = { ...state.errors }
      delete errors[action.field]

      return {
        ...state,
        formData: { ...state.formData, [action.field]: action.value },
        errors,
      }
    }
    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.message }
      }
    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: state.currentStep < 3 ? ((state.currentStep + 1) as TStep) : 3
      }
    case 'PREV_STEP':
      return {
        ...state,
        currentStep: state.currentStep > 1 ? ((state.currentStep - 1) as TStep) : 1
      }
    case 'SUBMIT_START':
      return { ...state, isSubmitting: true }
    case 'SUBMIT_SUCCESS':
      return { ...state, isSubmitting: false }
    default:
      return state
  }
}

function RegistrationForm() {
  const [state, dispatch] = useReducer(registrationReducer, initialState)
  const { currentStep, formData, errors, isSubmitting } = state

  const updateField = (field: keyof IFormData, value: string | boolean) => {
    dispatch({ type: 'UPDATE_FIELD', field, value })
  }

  const validateStep = () => {
    const result = stepSchemas[currentStep].safeParse(formData)

    if (result.success) {
      return true
    }

    result.error.issues.forEach((issue) => {
      dispatch({
        type: 'SET_ERROR',
        field: issue.path[0] as keyof IFormData,
        message: issue.message,
      })
    })

    return false
  }

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!validateStep()) {
      return
    }

    if (currentStep < 3) {
      dispatch({ type: 'NEXT_STEP' })
      return
    }

    dispatch({ type: 'SUBMIT_START' })
    setTimeout(() => {
      console.log('Данные формы:', formData)
      dispatch({ type: 'SUBMIT_SUCCESS' })
    }, 2000)
  }

  const renderStep1 = () => (
    <>
      <label>
        Email
        <input
          type="email"
          value={formData.email}
          onChange={(event) => updateField('email', event.target.value)}
        />
        {errors.email && <span>{errors.email}</span>}
      </label>

      <label>
        Пароль
        <input
          type="password"
          value={formData.password}
          onChange={(event) => updateField('password', event.target.value)}
        />
        {errors.password && <span>{errors.password}</span>}
      </label>
    </>
  )

  const renderStep2 = () => (
    <>
      <label>
        Имя
        <input
          type="text"
          value={formData.username}
          onChange={(event) => updateField('username', event.target.value)}
        />
        {errors.username && <span>{errors.username}</span>}
      </label>

      <label>
        Город
        <input
          type="text"
          value={formData.city}
          onChange={(event) => updateField('city', event.target.value)}
        />
        {errors.city && <span>{errors.city}</span>}
      </label>
    </>
  )

  const renderStep3 = () => (
    <>
      <label>
        Занятие
        <select
          value={formData.occupation}
          onChange={(event) => updateField('occupation', event.target.value)}
        >
          <option value="">Выберите</option>
          <option value="student">Студент</option>
          <option value="developer">Разработчик</option>
          <option value="designer">Дизайнер</option>
          <option value="other">Другое</option>
        </select>
        {errors.occupation && <span>{errors.occupation}</span>}
      </label>

      <label className="checkbox">
        <input
          type="checkbox"
          checked={formData.termsAccepted}
          onChange={(event) => updateField('termsAccepted', event.target.checked)}
        />
        Согласен с правилами
      </label>
      {errors.termsAccepted && <span>{errors.termsAccepted}</span>}
    </>
  )

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <h2>
        Шаг {currentStep}:{' '}
        {currentStep == 1 && 'Аккаунт'}
        {currentStep == 2 && 'Профиль'}
        {currentStep == 3 && 'О себе'}
      </h2>

      {currentStep == 1 && renderStep1()}
      {currentStep == 2 && renderStep2()}
      {currentStep == 3 && renderStep3()}

      <div className="buttons">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={() => dispatch({ type: 'PREV_STEP' })}
            disabled={isSubmitting}
          >
            Назад
          </button>
        )}

        <button type="submit" disabled={isSubmitting}>
          {currentStep == 3
            ? isSubmitting
              ? 'Отправка...'
              : 'Зарегистрироваться'
            : 'Далее'}
        </button>
      </div>
    </form>
  )
}

export default function App() {
  return <RegistrationForm />
}
