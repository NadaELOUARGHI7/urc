import React, { useState } from "react";
import { loginUser } from "./loginApi";
import { Session } from "../model/common";
import { CustomError } from "../model/CustomError";
import { useNavigate } from "react-router-dom"; 
import  {Navbar}  from "./navbar";

export function Login() {
    const [error, setError] = useState<CustomError | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); 

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
                console.log ("user_id: from sessionstorage  "+sessionStorage.getItem('user_id'));
                localStorage.setItem("token", result.token); // Make sure the key matches what you're using in Dashboard
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
        <div className="h-screen flex flex-col bg-gray-100">
    {/* Top Menu */}
    <Navbar />

    {/* Login Form */}
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto mt-8 px-4 py-6 bg-white rounded-lg shadow-lg">
        <div className="mb-6">
            <label htmlFor="login" className="block text-gray-700 font-semibold mb-2">
                Login
            </label>
            <input
                name="login"
                placeholder="Login"
                className="w-full bg-gray-200 border-2 border-gray-300 rounded-lg py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                id="login"
                type="text"
                required
            />
        </div>

        <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
                Password
            </label>
            <input
                name="password"
                placeholder="Password"
                className="w-full bg-gray-200 border-2 border-gray-300 rounded-lg py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                id="password"
                type="password"
                required
            />
        </div>

        <div className="mb-6">
            <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white font-bold py-2 px-4 rounded-lg"
                disabled={loading}
            >
                {loading ? "Loading..." : "Connexion"}
            </button>
        </div>
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
