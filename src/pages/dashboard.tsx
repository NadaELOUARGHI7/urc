import React, { useState , useRef ,useEffect } from "react";
import UsersList from "../components/UsersList";
import RoomsList from "../components/RoomsList";
import ChatList from "../components/ChatList";
import ChatRoomsList from "../components/ChatRoomsList";
import { useNavigate  } from "react-router-dom"; 

interface Message {
    message_id: number;
    sender_id: number;
    receiver_id: number;
    content: string;
    timestamp: string;
}

const Dashboard: React.FC = () => {
    const [session, setSession] = useState<{ token?: string; username?: string ;id? : number } | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

    const [loggedInUserId, setLoggedInUserId] = useState<number>(0); // Replace with actual logged-in user ID
    const [newMessage, setNewMessage] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messageInputRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
        const userId = sessionStorage.getItem("user_id");
        if (userId) {
            setLoggedInUserId(Number(userId)); 
            console.log("Logged in user ID set to:", Number(userId));
        } else {
            console.warn("No user_id found in sessionStorage");
        }
        
    }, []);

    useEffect(() => {
        if (selectedRoomId) {
            setSelectedUserId(null); // Reset user selection when a room is selected
        }
    }, [selectedRoomId]);
    
    useEffect(() => {
        if (selectedUserId) {
            setSelectedRoomId(null); // Reset room selection when a user is selected
        }
    }, [selectedUserId]);
    

    const navigate = useNavigate(); 
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    
    const handleLogout = async () => {
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            sessionStorage.removeItem("user_id")
            setSession(null);

            console.log(sessionStorage.getItem('token'));
            console.log(sessionStorage.getItem('username'));

            navigate('/connexion');
        } catch (error) {// Function to handle message submission
            console.error('Logout error:', error);
        }
    };

    const handleSendMessage = async () => {
            console.log("Payload:", {
            sender_id: loggedInUserId,
            receiver_id: selectedUserId || null,
            room_id: selectedRoomId || null,
            content: newMessage,
        });

        if (!newMessage.trim()) {
            setError("Message cannot be empty.");
            return;
        }
        
         // Determine the API payload
         const payload = {
            sender_id: loggedInUserId,
            content: newMessage,
            ...(selectedUserId ? { receiver_id: selectedUserId } : {}),
            ...(selectedRoomId ? { room_id: selectedRoomId } : {}),
        };
        
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No authentication token found");
            
            const response = await fetch(`/api/message`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
                });
                if (!response.ok) {
            throw new Error(`Failed to send message: ${response.statusText}`);
        }

        const newMsg = await response.json();
        console.log("new msg : " + newMsg );
        setMessages((prevMessages) => [...prevMessages, newMsg]);
        setNewMessage("");
        messageInputRef.current?.focus();
        scrollToBottom();
        setError(null);          
        
    } catch (error: any) {
        console.error("Error sending message:", error);
        setError(error.message || "Error sending message");
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
                <UsersList 
                        selectedUserId={selectedUserId} 
                        setSelectedUserId={setSelectedUserId} 
                    />                    
                <RoomsList selectedRoomId={selectedRoomId} 
                        setSelectedRoomId={setSelectedRoomId} 
                    />                    
                </aside>

                {/* Chat Section */}
                <main className="flex-1 flex flex-col items-center p-4 bg-gray-50">
                    <div className="w-full max-w-2xl flex-1 overflow-y-auto bg-white p-4 rounded-lg shadow-md">
                        {/* Placeholder for Chat messages */}
                       < ChatList
                            selectedUserId={selectedUserId}
                            loggedInUserId={loggedInUserId}
                        />
                        < ChatRoomsList
                            selectedRoomId={selectedRoomId}
                            loggedInUserId={loggedInUserId}
                        />  

                
                        </div>

                    {/* Message Input */}
                    <div className="w-full max-w-2xl mt-4 flex items-center">
                        <input
                            type="text"
                            placeholder="Message"
                            className="flex-1 p-2 border rounded-l-lg focus:outline-none"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)} // Update message as user types
                        />
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
                            onClick={handleSendMessage}
                        >
                            ENVOYER
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;