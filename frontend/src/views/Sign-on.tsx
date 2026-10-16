import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { email, z, ZodError } from 'zod'
import type { UserCreate } from '../type/User'
import { useAuth } from '../hooks/use-auth'


const signOnSchema = z.object({
    email: z.string().pipe(z.email("Email Invalido")),
    password: z.string().min(1, 'Password is required')
});





export default function SignOn(){

    const [formData, setFormData] = useState({

        email: "",
        password: ""

    });

    return (
        <div>
        
        </div>
    );


}