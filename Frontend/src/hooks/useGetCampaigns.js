import {useState} from 'react';
import toast from 'react-hot-toast';

const useGetCampaigns = () =>{
    const [loading,setLoading] = useState(false);
    const getCampaigns = async () =>{
        setLoading(true);
        try{
            const res = await fetch("/api/campaign/getCampaigns")
            const data = await res.json();
            if(data.error){
                throw new Error(data.error);
            }
            return data;
        }catch(error){
            toast.error(error.message);
        }finally{
            setLoading(false);
        }
    }
    return {loading,getCampaigns};
}

export default useGetCampaigns;
