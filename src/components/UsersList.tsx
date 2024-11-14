import React, { useEffect, useState } from "react";

interface User {
    user_id: number;
    username: string;
    last_login: string;
}

const UsersList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true); // Add loading state

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("authToken");

                console.log("Token being sent:", token);  // Log token to verify it's present

                if (!token) throw new Error("No authentication token found");

                const response = await fetch("/api/users", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.status === 401) {
                    localStorage.removeItem("authToken");
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
                          <tr key={user.user_id} className="hover:bg-blue-50">
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
