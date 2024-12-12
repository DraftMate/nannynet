'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import nannyNetClient from '@/lib/api-clients/nannynet/nannynet-client'
import { useRouter } from 'next/navigation'
export default function RegistrationPage() {
    const router = useRouter()
    const [firstName, setFirstName] = React.useState('')
    const [lastName, setLastName] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [pass, setPassWord] = React.useState('')
    const [yearsOfExperience, setYearsOfExperience] = React.useState('')
    const [message, setMessage] = React.useState('')


    async function registerNanny(firstName: string, lastName: string, email: string, password: string, yearsOfExperience: number) {
        try {
            await nannyNetClient.registerNanny(firstName, lastName, email, password, yearsOfExperience)
            setMessage('Successfully registered!')
            router.push('/login')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <h4>Registration Page</h4>
            <div>
                <Input className="my-2" placeholder="Enter your First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                <Input className="my-2" placeholder="Enter your Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                <Input className="my-2" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input className="my-2" type="password" placeholder="Enter your password" value={pass} onChange={(e) => setPassWord(e.target.value)} />
                <Input className="my-2" placeholder="Enter years of experience" value={yearsOfExperience} onChange={(e) => setYearsOfExperience(e.target.value)} />
            </div>
            <Button onClick={() => registerNanny(firstName, lastName, email, pass, parseInt(yearsOfExperience))}>Register!</Button>
            {message != '' ? (
                <div>
                    {message}
                </div>
            ) : (<div></div>)}

        </div>
    )
}