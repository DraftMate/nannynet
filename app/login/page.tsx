'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
export default function LoginPage() {
    const [email, setEmail] = React.useState('')
    const [pass, setPassWord] = React.useState('')


    return (
        <div>
            <h4>Login Page</h4>
            <div>
                <Input className="my-2" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input className="my-2" type="password" placeholder="Enter your password" value={pass} onChange={(e) => setPassWord(e.target.value)} />
            </div>
            <Button onClick={() => console.log(email, pass)}>Login</Button>
        </div>
    )
}