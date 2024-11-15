import React, { useEffect, useState, useRef } from "react";

interface Message {
    message_id: number;
    sender_id: number;
    receiver_id: number;
    content: string;
    timestamp: string;
}

interface ChatProps {
    selectedUserId: number | null;
    loggedInUserId: number;
}

const ChatList: React.FC<ChatProps> = ({ selectedUserId, loggedInUserId }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to the latest message
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Fetch messages when the selected user changes
    useEffect(() => {
        console.log("chatlist.tsx selectedUserId", selectedUserId);
        if (!selectedUserId) return;

        const fetchMessages = async () => {
            setLoading(true);
            setError(null); // Reset error state
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("No authentication token found");

                // Make sure the endpoint includes the selectedUserId as a query parameter
                const response = await fetch(`/api/chat?selectedUserId=${selectedUserId}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });


                const fetchedMessages = await response.json();
                if (fetchedMessages.message) {
                    setMessages([]); 
                    setError(fetchedMessages.message);
                } else {
                    setMessages(fetchedMessages);  
                    scrollToBottom();

                }                


            } catch (error: any) {
                console.error('Error fetching messages:', error);
                setError(error.message || 'Error fetching messages');
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [selectedUserId, loggedInUserId]);

    
    // Handle sending a new message
    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedUserId) return;

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No authentication token found");

            const response = await fetch(`/api/message`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    sender_id: loggedInUserId,
                    receiver_id: selectedUserId,
                    content: newMessage,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to send message: ${response.statusText}`);
            }

            const newMsg = await response.json();
            setMessages((prevMessages) => [...prevMessages, newMsg]); // Add new message to the chat
            setNewMessage(""); // Clear the input
            scrollToBottom(); // Scroll to the latest message
        } catch (error: any) {
            console.error("Error sending message:", error);
            setError(error.message || "Error sending message");
        }
    };

    return (
        <div className="chat-container bg-white p-4 rounded-lg shadow-md flex flex-col h-full">
            {selectedUserId ? (
                <>
                    {loading && <p className="text-center text-gray-500">Loading messages...</p>}
                    {messages.length > 0 ? (
                        messages.map((message) => (
                            <div
                                key={message.message_id}
                                className={`p-2 my-1 rounded ${
                                    message.sender_id === loggedInUserId
                                        ? "text-right bg-blue-100"
                                        : "text-left bg-gray-100"
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
