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
    <header className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-6 flex justify-between items-center shadow-md">
            <h1 className="text-2xl font-bold">UBO Relay Chat</h1>
            <div className="flex space-x-4">
        <button
            className="bg-blue-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow" 
            onClick={handleLoginClick}
        >
            Connecter
        </button>
        <button
            className="bg-blue-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow" 
            onClick={handleInscrireClick}
        >
            Inscrire
        </button>
    </div>
</header>

)

}