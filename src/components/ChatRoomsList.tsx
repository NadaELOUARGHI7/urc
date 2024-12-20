import React, { useEffect, useState, useRef } from "react";

interface Message {
    message_id: number;
    sender_id: number;
    receiver_id: number;
    content: string;
    timestamp: string;
    username: string;
}

interface ChatProps {
    selectedRoomId: number | null;
    loggedInUserId: number;
}

const ChatRoomsList: React.FC<ChatProps> = ({ selectedRoomId, loggedInUserId }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [groupName, setGroupName] = useState<string | null>(null);

    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    
    useEffect(() => {

        if (!selectedRoomId) return;

        const fetchMessagesAndGroupName = async () => {

            setLoading(true);
            setError(null); // Reset error state
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("No authentication token found");

                const response = await fetch(`/api/chatroom?selectedRoomId=${selectedRoomId}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });


                if (!response.ok) {
                    const errorResponse = await response.json();
                    throw new Error(errorResponse.error || 'Failed to fetch messages');
                }
                
                const fetchedMessages = await response.json();
                if (fetchedMessages.message) {
                    setMessages([]); 
                    setError(fetchedMessages.message);
                    setGroupName(null);

                } else {
                    scrollToBottom();
                    setMessages(fetchedMessages.messages || []);
                    setGroupName(fetchedMessages.roomName) ;
                }                


            } catch (error: any) {
                console.error('Error fetching messages:', error);
                setError(error.message || 'Error fetching messages');
            } finally {
                setLoading(false);
            }
        };
        fetchMessagesAndGroupName();
        scrollToBottom(); 

        if (selectedRoomId) {
            const interval = setInterval(() => {
                fetchMessagesAndGroupName();
            }, 5000); 
    
            return () => clearInterval(interval); 
        } 
       }, [selectedRoomId, loggedInUserId]);

       

    return (
        <div >
            {selectedRoomId ? (
                
                <>
                  {/* Display the group chat name */}
                       <h2 className="text-xl font-bold text-center mb-4">
                        {groupName || "Loading ..."}
                        </h2>                    
                        
                        {messages.length > 0 ? (
                        messages.map((message) => (
                            <div
                                key={message.message_id}
                                className={`p-4 my-2 rounded-lg shadow-md ${
                                    message.sender_id === loggedInUserId
                                    ? "text-right bg-blue-100 flex-wrap max-w-xs ml-auto"
                                    : "text-left bg-gray-100 flex-wrap max-w-xs mr-auto"
                                }`}
                            >
                                <p className="break-words">{message.content}</p>
                                
                                {/* Affichage du nom de l'expéditeur (sauf si c'est l'utilisateur connecté) */}
                                <div className="ml-2 text-gray-500 text-xs text-right">
                                    {message.sender_id !== loggedInUserId && (
                                    <span className="block font-bold text-gray-700">
                                       {message.username || "Unknown Sender"}
                                    </span>
                                     )}
                                     <span>{new Date(message.timestamp).toLocaleString()}</span>
                                </div>
                                
                            </div>
                        ))
                    ) : (
                        !loading && (
                            <p className="text-center text-gray-500">
                                No messages yet. Start a conversation!
                            </p>
                        )
                    )}
                    <div ref={messagesEndRef} /> {/* For scrolling */}
                </>
            ) : (
                <p></p>
            )}

            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
};

export default ChatRoomsList;
