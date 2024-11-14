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
            },
            (loginError: CustomError) => {
                setError(loginError);
                setSession(null);
                setLoading(false);
            }
        );
    };


    return (
        <div className="flex flex-col items-center">
            {/* Top Menu */}    

            <Navbar/>


            {/* Login Form */}
            <form onSubmit={handleSubmit} className="w-full max-w-sm mt-4">
                <div className="md:flex md:items-center mb-6">
                    <div className="md:w-1/3">
                        <label htmlFor="inline-full-name" className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                            Login
                        </label>
                    </div>
                    <div className="md:w-2/3">
                        <input
                            name="login"
                            placeholder="login"
                            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                            id="inline-full-name"
                            type="text"
                            required
                        />
                    </div>
                </div>
                <div className="md:flex md:items-center mb-6">
                    <div className="md:w-1/3">
                        <label htmlFor="inline-password" className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                            Password
                        </label>
                    </div>
                    <div className="md:w-2/3">
                        <input
                            name="password"
                            placeholder="password"
                            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                            id="inline-password"
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
                            className="shadow bg-indigo-600 hover:bg-indigo-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                            disabled={loading}
                        >
                            {loading ? "Loading..." : "Connexion"}
                        </button>
                    </div>
                </div>
            </form>

            {session && session.token && (
                <span className="mt-4 text-gray-800 font-semibold">
                    {session.username} : {session.token}
                </span>
            )}
            {error && error.message && (
                <span className="mt-2 text-red-500">
                    {error.message}
                </span>
            )}
        </div>
    );
}
