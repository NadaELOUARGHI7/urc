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
    selectedUserId: number | null;
    loggedInUserId: number;
}

const ChatList: React.FC<ChatProps> = ({ selectedUserId, loggedInUserId }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [userNameReciever, setuserNameReciever] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
        console.log("chatlist.tsx selectedUserId", selectedUserId);
        if (!selectedUserId) return;

        const fetchMessagesAndUserName = async () => {

            
            setLoading(true);
            setError(null); 
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("No authentication token found");

                const response = await fetch(`/api/chat?selectedUserId=${selectedUserId}`, {
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
                    setuserNameReciever(null)
                } else {
                    setMessages(fetchedMessages.messages || []);
                    setuserNameReciever (fetchedMessages.userNameReciever) ;
                    

                }                


            } catch (error: any) {
                console.error('Error fetching messages:', error);
                setError(error.message || 'Error fetching messages');
            } finally {
                setLoading(false);
            }
        };
        fetchMessagesAndUserName();

       if (selectedUserId) {
            const interval = setInterval(() => {
                fetchMessagesAndUserName();
            }, 5000); 
    
            return () => clearInterval(interval); 
        }  
        }, [selectedUserId, loggedInUserId]);

    return (
        <div >
            {selectedUserId ? (
                <>
                  {/* Display the name of the person being texted */}
                  <h2 className="text-xl font-bold text-center mb-4">
                        {userNameReciever  || "Loading ..."}
                        </h2>  

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

export default ChatList;
