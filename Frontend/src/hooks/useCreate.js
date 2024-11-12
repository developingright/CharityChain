import {useState} from 'react';
import toast from 'react-hot-toast';

const useCreate = () =>{
    const [loading,setLoading] = useState(false);
    const createCampaign = async ({title,description,public_key,target}) =>{
        setLoading(true);
        try{
            const res = await fetch("/api/campaign/create",{
                method:"POST",
                headers: { "Content-Type":"application/json"},
                body:JSON.stringify({title,description,public_key,target})
            })
            const data = await res.json();
            if(data.error){
                throw new Error(data.error);
            }
            toast.success("Created campaign");
        }catch(error){
            toast.error(error.message);
        }finally{
            setLoading(false);
        }
    }
    return {loading,createCampaign};
}

export default useCreate;
