'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import nannyNetClient from '@/lib/api-clients/nannynet/nannynet-client'
export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = React.useState('')
    const [pass, setPassWord] = React.useState('')
    const [message, setMessage] = React.useState('')

    async function login(email: string, password: string) {
        try {
            const response = await nannyNetClient.login(email, password)
            //Successful login
            if (response == true) {
                setMessage('Successfully logged in!')
                router.push('/')
            } else {
                setMessage('Incorrect email or password, please try again.')
            }
        } catch (e: any) {
            const err = e as Error
            console.log(err.stack)
            alert(err.message)
        }
    }



    return (
        <div>
            {message === '' ? (<p></p>) : (<p>{message}</p>)}
            <h4>Login Page</h4>
            <div>
                <Input className="my-2" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input className="my-2" type="password" placeholder="Enter your password" value={pass} onChange={(e) => setPassWord(e.target.value)} />
            </div>
            <Button onClick={() => login(email, pass)}>Login</Button>
        </div>
    )
}