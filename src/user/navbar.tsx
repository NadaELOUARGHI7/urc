import React, { useState } from "react";
import { Session } from "../model/common";
import { CustomError } from "../model/CustomError";
import { useNavigate } from "react-router-dom"; 



export function Navbar() {
    const [session, setSession] = useState<Session | null>(null);
    const navigate = useNavigate(); 

const handleInscrireClick = () => {
    navigate("/inscription");
};
const handleLoginClick = () => {
    navigate("/connexion");
};

return(
<div className="w-full bg-indigo-600 p-4">
<div className="flex justify-center space-x-4">
    <button
        onClick={handleLoginClick} 
        className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
    >
        Connecter
    </button>
    <button
        onClick={handleInscrireClick} 
        className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
    >
        Inscrire
    </button>
</div>
</div>)

}