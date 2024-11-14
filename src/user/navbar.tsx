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
<header className="bg-blue-700 text-white p-4 flex justify-between items-center">
    <h1 className="text-xl font-semibold">UBO Relay Chat</h1>
    <div className="flex space-x-4">
        <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded focus:outline-none"
            onClick={handleLoginClick}
        >
            Connecter
        </button>
        <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded focus:outline-none"
            onClick={handleInscrireClick}
        >
            Inscrire
        </button>
    </div>
</header>

)

}