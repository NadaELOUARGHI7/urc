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

    // Handle click on a user to select and fetch messages
    const handleUserClick = (userId: number) => {
        setSelectedUserId(userId);
        console.log("userId"+userId);
        console.log("selectedUserId"+selectedUserId);
        //navigate(`/chat/${userId}`);
    };


    return (
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-10">
          <h2 className="text-xl font-semibold text-center text-blue-700 mb-4">Utilisateurs</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}
            {users.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                      </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                          <tr key={user.user_id} className="hover:bg-blue-50"  onClick={() => handleUserClick(user.user_id)} >


                                  <td className="py-2 px-4 border-b">{user.username}</td>
                              <td className="py-2 px-4 border-b">{user.last_login}</td>
                          </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default UsersList;

