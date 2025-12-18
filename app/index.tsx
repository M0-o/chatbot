import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";


interface Message {
    id: number,
    text: string,
    sender: string
}
export default function Index() {

    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        const lastMessage = messages.at(-1);
        if (!lastMessage || lastMessage.sender !== "user") return;

        const fetchReply = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ prompt: lastMessage.text })
                });
                const data = await res.json();
                setMessages((msgs) => [
                    ...msgs,
                    { id: lastMessage.id + 1, text: data.content || data.text || JSON.stringify(data).replace(/\\n/g, "\n").substring(1, JSON.stringify(data).length - 2), sender: "bot" }
                ]);
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };

        fetchReply();
    }, [messages]);

    return (
        <View style={styles.container}>
            <ScrollView style={styles.messagesContainer}>
                {messages.map((msg) => (
                    <MessageC key={msg.id} {...msg} />
                ))}
            </ScrollView>
            <TextInput
                style={styles.input}
                placeholder="Type a message..."
                placeholderTextColor="#888"
                onSubmitEditing={(e) => {
                    const text = e.nativeEvent.text;
                    if (text.trim()) {
                        setMessages((msgs) => [
                            ...msgs,
                            { id: msgs.length > 0 ? msgs[msgs.length - 1].id + 1 : 0, text, sender: "user" }
                        ]);
                    }
                    e.nativeEvent.text = '';
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    messagesContainer: {
        flex: 1,
        padding: 10,
    },
    input: {
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        padding: 15,
        fontSize: 16,
    },
});



function MessageC({ id, text, sender }: Message) {
    return (
        <Text style={{
            padding: 10,
            margin: 5,
            alignSelf: sender === "user" ? "flex-end" : "flex-start",
            backgroundColor: sender === "user" ? "#007AFF" : "#E5E5EA",
            color: sender === "user" ? "#FFFFFF" : "#000000",
            borderRadius: 10,
            maxWidth: "80%"
        }}>
            {text}
        </Text>
    )
}