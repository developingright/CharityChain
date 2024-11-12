import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserIcon, LockIcon, Mail } from 'lucide-react';
// @ts-ignore
import useSignup from '../hooks/useSignup';
import Toaster  from 'react-hot-toast'
export default function Component() {
  const [formData, setFormData] = useState({
    fullName: '',
    email:'',
    organisation:'',
    position:'',
    password:'',
    confirmPassword:''
  });

  const {loading,signup} = useSignup();

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }


  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
      await signup(formData);
      console.log('Form submitted:', formData)
  }

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Create your account to get started</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <Input
                id="fullName"
                name="fullName"
                placeholder="John Doe"
                className="pl-10"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <Input
                id="email"
                name="email"
                placeholder="johndoe"
                className="pl-10"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

          </div>
          <div className="space-y-2">
            <Label htmlFor="organisation">Organisation</Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <Input
                id="organisation"
                name="organisation"
                placeholder="organisation"
                className="pl-10"
                value={formData.organisation}
                onChange={handleChange}
              />
            </div>

          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <Input
                id="position"
                name="position"
                placeholder="position"
                className="pl-10"
                value={formData.position}
                onChange={handleChange}
              />
            </div>

          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <Input
                id="password"
                name="password"
                type="password"
                className="pl-10"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
           
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="pl-10"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>Sign Up</Button>
        </CardFooter>
      </form>
    </Card>
    </>
  )
}