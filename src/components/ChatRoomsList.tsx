import React, { useEffect, useState, useRef } from "react";

interface Message {
    message_id: number;
    sender_id: number;
    receiver_id: number;
    content: string;
    timestamp: string;
}

interface ChatProps {
    selectedRoomId: number | null;
    loggedInUserId: number;
}

const ChatRoomsList: React.FC<ChatProps> = ({ selectedRoomId, loggedInUserId }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        console.log("chatroomlist.tsx selectedroomId", selectedRoomId);
        if (!selectedRoomId) return;

        const fetchMessages = async () => {

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
                } else {
                    scrollToBottom();
                    setMessages(fetchedMessages);  
                    console.log("hhh" , fetchedMessages);

                }                


            } catch (error: any) {
                console.error('Error fetching messages:', error);
                setError(error.message || 'Error fetching messages');
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();

       /* if (selectedRoomId) {
            const interval = setInterval(() => {
                fetchMessages();
            }, 5000); 
    
            return () => clearInterval(interval); // Cleanup interval on unmount
        } */  
       }, [selectedRoomId, loggedInUserId]);

    return (
        <div >
            {selectedRoomId ? (
                <>
                    {messages.length > 0 ? (
                        messages.map((message) => (
                            <div
                                key={message.message_id}
                                className={`p-2 my-1 rounded ${
                                    message.sender_id === loggedInUserId
                                    ? "text-right bg-blue-100 flex-wrap max-w-xs ml-auto"
                                    : "text-left bg-gray-100 flex-wrap max-w-xs mr-auto"
                                }`}
                            >
                                <p>{message.content}</p>
                                <small className="text-gray-500 text-xs">
                                    {new Date(message.timestamp).toLocaleString()}
                                </small>
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
