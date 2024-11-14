//Register.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "./registerApi";
import { CustomError } from "../model/CustomError";
import  {Navbar}  from "./navbar";


export function Register() {
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
  
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;
      const data = new FormData(form);
  
      const username = data.get("username") as string;
      const password = data.get("password") as string;
      const email = data.get("email") as string;
  
      // Vérification de la longueur de l'identifiant et du mot de passe
      if (username.length < 4) {
        setError("L'identifiant doit contenir au moins 4 caractères.");
        return;
      }
      if (password.length < 6) {
        setError("Le mot de passe doit contenir au moins 6 caractères.");
        return;
      }
  
      setIsSubmitting(true);
      registerUser(
        { username, password, email },
        () => {
          form.reset();
          setIsSubmitting(false);
          setError(null);
          navigate("/connexion");
        },
        (registerError: CustomError) => { 
          setIsSubmitting(false);
          setError(registerError?.message || "Une erreur s'est produite lors de l'inscription.");
        }
      );
    }; 


    return (
        <div className="flex flex-col items-center">

              <Navbar/>

            <form onSubmit={handleSubmit} className="w-full max-w-sm mt-4">
                {/* Form fields */}
                <div className="md:flex md:items-center mb-6">
                    <div className="md:w-1/3">
                        <label htmlFor="username" className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                            Username
                        </label>
                    </div>
                    <div className="md:w-2/3">
                        <input
                            name="username"
                            placeholder="Username"
                            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                            type="text"
                            required
                        />
                    </div>
                </div>
                
                <div className="md:flex md:items-center mb-6">
                    <div className="md:w-1/3">
                        <label htmlFor="email" className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                            Email
                        </label>
                    </div>
                    <div className="md:w-2/3">
                        <input
                            name="email"
                            placeholder="Email"
                            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                            type="email"
                            required
                        />
                    </div>
                </div>
                <div className="md:flex md:items-center mb-6">
                    <div className="md:w-1/3">
                        <label htmlFor="password" className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                            Password
                        </label>
                    </div>
                    <div className="md:w-2/3">
                        <input
                            name="password"
                            placeholder="Password"
                            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                            type="password"
                            required
                        />
                    </div>
                </div>
                
                <div className="md:flex md:items-center">
                    <div className="md:w-1/3"></div>
                    <div className="md:w-2/3">
                        <button
                            type="submit"
                            className="shadow bg-indigo-500 hover:bg-indigo-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                        >Inscrire
                        </button>
                    </div>
                </div>
                
                
            </form>

            {error && <div className="mt-2 text-red-500">{error}</div>}
        </div>
    );
}
