import React, { useState , useEffect } from "react";
import UsersList from "../components/UsersList";
import RoomsList from "../components/RoomsList";
import { useNavigate } from "react-router-dom"; 

const Dashboard: React.FC = () => {

    const [session, setSession] = useState<{ token?: string; username?: string } | null>(null);

    const navigate = useNavigate(); 


    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token ) {
            // If no token or username in localStorage, redirect to login
            navigate('/connexion');
        } else {
            // If token and username exist, set session
            setSession({ token});
        }
    }, [navigate]);



    const handleLogout = async () => {
        try {
            localStorage.removeItem('token');
            setSession(null);

            console.log(sessionStorage.getItem('token'));


            navigate('/connexion');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };
    return (
        <div className="h-screen flex flex-col bg-gray-100">
            {/* Header */}
            <header className="bg-blue-700 text-white p-4 flex justify-between items-center">
                <h1 className="text-xl font-semibold">UBO Relay Chat</h1>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={handleLogout}>
                    DÉCONNEXION
                </button>
            </header>
            
            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar with Users and Rooms */}
                <aside className="bg-white w-full md:w-1/4 p-4 shadow-lg overflow-auto">
                    <UsersList />
                    <RoomsList />
                </aside>

                {/* Chat Section */}
                <main className="flex-1 flex flex-col items-center p-4 bg-gray-50">
                    <div className="w-full max-w-2xl flex-1 overflow-y-auto bg-white p-4 rounded-lg shadow-md">
                        {/* Placeholder for Chat messages */}
                        <p className="text-center text-gray-400">Chat messages will appear here.</p>
                    </div>

                    {/* Message Input */}
                    <div className="w-full max-w-2xl mt-4 flex items-center">
                        <input
                            type="text"
                            placeholder="Message"
                            className="flex-1 p-2 border rounded-l-lg focus:outline-none"
                        />
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600">
                            ENVOYER
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;