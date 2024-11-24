import React, { useState } from "react";
import { loginUser } from "./loginApi";
import { Session } from "../model/common";
import { CustomError } from "../model/CustomError";
import { useNavigate } from "react-router-dom"; 
import  {Navbar}  from "./navbar";
import useBeamsClient from '../redux/useBeamsClient'; 

export function Login() {
    const [error, setError] = useState<CustomError | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); 
    const [userId, setUserId] = useState<number | null>(null); 
    useBeamsClient(userId || 0); 

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        setLoading(true);
        loginUser(
            {
                user_id: -1,
                username: data.get("login") as string,
                password: data.get("password") as string,
            },
            (result: Session) => {
                setSession(result);
                setError(null);
                form.reset();
                setLoading(false);

                const userIdFromStorage = parseInt(sessionStorage.getItem("user_id") || "0");
                console.log("from login comp " + userIdFromStorage);

                
                setUserId(userIdFromStorage); 
                localStorage.setItem("token", result.token);
                navigate('/dashboard');
            },
            (loginError: CustomError) => {
                setError(loginError);
                setSession(null);
                setLoading(false);
            }
        );

    };
   

    return (
        <div className="h-screen flex flex-col bg-gradient-to-b from-gray-100 to-gray-300">
    {/* Top Menu */}
    <Navbar />

    {/* Login Form */}
    <form onSubmit={handleSubmit} 
        className="w-full max-w-md mx-auto mt-10 px-6 py-8 bg-white rounded-lg shadow-lg"  >
         <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
                    Connexion
                </h2>
        <div className="mb-6">
            <label htmlFor="login" 
             className="block text-gray-700 font-semibold mb-2"
                        >
                Login
            </label>
            <input
                name="login"
                placeholder="Login"
                className="w-full bg-gray-100 border-2 border-gray-300 rounded-lg py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="login"
                type="text"
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
                id="password"
                type="password"
                required
            />
        </div>

        <button
                    type="submit"
                    className={`w-full py-3 rounded-lg text-white font-bold ${
                        loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-500"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Connexion"}
                </button>
    </form>

    {/* Session Info */}
    {session && session.token && (
        <span className="mt-4 text-gray-800 font-semibold">
            {session.username} : {session.token}
        </span>
    )}

    {/* Error Message */}
    {error && error.message && (
        <span className="mt-2 text-red-500">
            {error.message}
        </span>
    )}
</div>

    );
}
