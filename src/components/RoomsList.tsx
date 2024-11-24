import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 

interface Room {
    room_id: number;
    name: string;
    created_on: string;
}
interface RoomsListProps {
    selectedRoomId: number | null;
    setSelectedRoomId: (roomId: number) => void;
}
const RoomsList: React.FC<RoomsListProps> = ({ selectedRoomId, setSelectedRoomId }) => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const token = localStorage.getItem("token");

                console.log("rooms list Token being sent:", token);  

                if (!token) throw new Error("No authentication token found");

                const response = await fetch("/api/rooms", {
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
                    throw new Error(`Failed to fetch rooms: ${response.statusText}`);
                }

                const data = await response.json();
                setRooms(data);
            } catch (error: any) {
                console.error("Error fetching rooms:", error);
                setError(`Error: ${error.message}`);
            }
        };

        fetchRooms();
    }, []);


    const handleRoomClick = (roomId: number) => {
        setSelectedRoomId(roomId);
        console.log("roomId"+roomId);
        console.log("selectedRoomId"+selectedRoomId);
    };

    return (
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-10">
          <h2 className="text-xl font-semibold text-center text-blue-700 mb-4">Sallons</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}
            {rooms.length === 0 ? (
                <p>No rooms found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                      </tr>
                    </thead>
                    <tbody>
                        {rooms.map((room) => (
                          <tr key={room.room_id} className="hover:bg-blue-50" onClick={() => handleRoomClick(room.room_id)} >
                                  <td className="py-2 px-4 border-b">{room.name}</td>
                              <td className="py-2 px-4 border-b">{room.created_on}</td>
                          </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default RoomsList;
