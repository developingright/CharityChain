import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LockIcon, MailIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import useLogin from '../hooks/useLogin';

const Login = () => {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const {loading,login} = useLogin();

  const handleSubmit = async (e :any) =>{
    e.preventDefault();
    await login(email,password);
  }

  return (
    <div className='h-screen w-full flex items-center justify-center'>
        <Card className="w-full max-w-md mx-auto text-center py-4">
        <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="username">username</Label>
                <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e)=> setEmail(e.target.value)}
                    className="pl-10"
                    required
                />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <Input
                    id="password"
                    type="password"
                    className="pl-10"
                    value={password}
                    onChange={(e)=> setPassword(e.target.value)}
                    required
                />
                </div>
            </div>
            </CardContent>
            <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>Log in</Button>
            </CardFooter>
        </form>
        <p className='text-gray-500 text-sm'>Don't have an account yet?<Link to='/signup' className='text-black'> Sign Up </Link> </p>
        </Card>
    </div>
  )
}

export default Login
