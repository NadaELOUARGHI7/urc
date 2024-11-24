//UsersList.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 


interface User {
    user_id: number;
    username: string;
    last_login: string;
}

interface UsersListProps {
    selectedUserId: number | null;
    setSelectedUserId: (userId: number) => void;
}

const UsersList: React.FC<UsersListProps> = ({ selectedUserId, setSelectedUserId }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token");

                console.log("users list Token being sent:", token);  // Log token to verify it's present

                if (!token) throw new Error("No authentication token found");

                const response = await fetch("/api/users", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.status === 401) {
                    localStorage.removeItem("token");
                    setError("Session expired. Please log in again.");
                    window.location.href = "/connexion"; 
                    return;
                } else if (!response.ok) {
                    throw new Error(`Failed to fetch users: ${response.statusText}`);
                }

                const data = await response.json();
                setUsers(data);
            } catch (error: any) {
                console.error("Error fetching users:", error);
                setError(`Error: ${error.message}`);
            }
        };

        fetchUsers();
    }, []);


    const handleUserClick = (userId: number) => {
        setSelectedUserId(userId);
        console.log("userId"+userId);
        console.log("selectedUserId"+selectedUserId);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-10">
            <h2 className="text-xl font-semibold text-center text-blue-700 mb-4">Utilisateurs</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {users.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <div className="space-y-4">
                    {users.map((user) => (
                        <div
                            key={user.user_id}
                            role="button"
                            tabIndex={0}
                            className={`p-4 border rounded-lg shadow hover:bg-blue-100 cursor-pointer ${
                                user.user_id === selectedUserId ? "bg-blue-100" : "bg-white"
                            }`}
                            onClick={() => handleUserClick(user.user_id)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    handleUserClick(user.user_id);
                                }
                            }}
                        >
                            <h3 className="text-lg font-semibold text-gray-700">{user.username}</h3>
                            <p className="text-sm text-gray-500">Last login: {user.last_login}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
      );
      
};

export default UsersList;

