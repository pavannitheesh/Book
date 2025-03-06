import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";


export const Navbar = () => {
    const navigate=useNavigate();
      const Logout=()=>{
        localStorage.removeItem('userInfo');
        navigate('/login');
    
      }
    return ( 
        <div className='flex justify-between items-center'>
      <h1 className="text-2xl font-bold mb-4">Book Collection</h1>
      <Button onClick={Logout}>Log out</Button>
      
       </div>
    );
}