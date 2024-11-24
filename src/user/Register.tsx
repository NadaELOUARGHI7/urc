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
        <div className="h-screen flex flex-col bg-gradient-to-b from-gray-100 to-gray-300">
    <Navbar />
    <form onSubmit={handleSubmit} 
        className="w-full max-w-md mx-auto mt-10 px-6 py-8 bg-white rounded-lg shadow-lg"
        >        
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
                    Inscription
                </h2>
        {/* Form fields */}
        <div className="mb-6">
            <label htmlFor="username" 
                className="block text-gray-700 font-semibold mb-2"
              >
                Username
            </label>
            <input
                name="username"
                placeholder="Username"
                className="w-full bg-gray-100 border-2 border-gray-300 rounded-lg py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                required
            />
        </div>
        
        <div className="mb-6">
        <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">

                Email
            </label>
            <input
                name="email"
                placeholder="Email"
                className="w-full bg-gray-100 border-2 border-gray-300 rounded-lg py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="email"
                required
            />
        </div>

        <div className="mb-6">
            <label htmlFor="password" 
               className="block text-gray-700 font-semibold mb-2"
              >
                Password
            </label>
            <input
                name="password"
                placeholder="Password"
                className="w-full bg-gray-100 border-2 border-gray-300 rounded-lg py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="password"
                required
            />
        </div>

        {/* Submit Button */}
        <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white font-bold py-3 rounded-lg"
                >
                    Inscrire
                </button>
    </form>

    {error && <div className="mt-2 text-red-500 text-center">{error}</div>}
</div>

    );
}
