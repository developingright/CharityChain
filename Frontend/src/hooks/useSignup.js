import {useState} from 'react';
import toast from 'react-hot-toast';
import { useAuthContext } from '../context/AuthContext.tsx';

const useSignup = () =>{
    const [loading,setLoading] = useState(false);
    const {setAuthUser} = useAuthContext();
    console.log("here!");
    const signup = async ({fullName,email,organisation,position,password,confirmPassword}) =>{
        const success = handleInputErrors({fullName,email,organisation,position,password,confirmPassword});
        if(!success) return;
        setLoading(true);
        try{
            const res = await fetch("/api/auth/signup",{
                method:"POST",
                headers: { "Content-Type":"application/json"},
                body:JSON.stringify({fullName,email,organisation,position,password})
            })
            const data = await res.json();
            if(data.error){
                throw new Error(data.error);
            }
            localStorage.setItem('user',JSON.stringify(data));
            setAuthUser(data);
        }catch(error){
            toast.error(error.message);
        }finally{
            setLoading(false);
        }
    }
    return {loading,signup};
}

export default useSignup;

function handleInputErrors({fullName,email,organisation,position,password,confirmPassword}){
    if(!fullName || !email|| !password || !confirmPassword || !organisation ||!position){
        toast.error('Please fill in all fields');
        return false
    }

    if(password !== confirmPassword){
        toast.error('Passwords do not match');
        return false
    }

    if(password.length < 6 ){
        toast.error('Password should be atleast 6 characters');
    }
    return true
}