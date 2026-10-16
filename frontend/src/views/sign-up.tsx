import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { z, ZodError } from 'zod'
import type { UserCreate } from '../type/User'
import { useAuth } from '../hooks/use-auth'


const signUpSchema = z.object({
  email: z.string().pipe(z.email('E-mail Invalido!!!')),
  password: z
    .string()
    .min(8, 'A senha deve ter mais que 8 caracteres')
    .regex(/[A-Z]/, 'A senha deve conter pelo menos 1 letra maiscula')
    .regex(/[a-z]/, 'A senha deve conter pelo menos 1 letra minuscula')
    .regex(/[0-9]/, 'A senha deve conter pelo menos 1 numero'),
  name: z.string().min(1, 'Name is required'),
  
  dateNasc: z.string().transform((val) => new Date(val)),
})

export default function SignUp() {
  const navigate = useNavigate()
  const { cadastro } = useAuth() 

  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    dateNasc: '', 
  })
  
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
    name?: string
    dateNasc?: string
    submit?: string
  }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: typeof formData) => {
    try {
      setIsSubmitting(true)
      setErrors({})

      
      const validatedData = signUpSchema.parse(data) as UserCreate

    
      await cadastro(validatedData)
      
      navigate('/app')
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors: Record<string, string> = {}
        error.issues.forEach((err) => {
          if (err.path) {
            formattedErrors[err.path.toString()] = err.message
          }
        })
        setErrors(formattedErrors)
      } else {
        setErrors({ submit: 'Failed to create account. Please try again.' })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  return (
    <div>
      <h2>Sign Up</h2>
      
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit(formData)
        }}
      >
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your name"
          />
          {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
          {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
        </div>
        
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Create a password"
          />
          {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
        </div>

        <div>
          <label htmlFor="dateNasc">Date of Birth</label>
          <input
            id="dateNasc"
            name="dateNasc"
            type="date"
            value={formData.dateNasc}
            onChange={handleChange}
            required
          />
          {errors.dateNasc && <p style={{ color: 'red' }}>{errors.dateNasc}</p>}
        </div>
        
        {errors.submit && <p style={{ color: 'red' }}>{errors.submit}</p>}
        
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    </div>
  )
}
