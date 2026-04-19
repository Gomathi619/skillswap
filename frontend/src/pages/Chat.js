import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

function Chat() {
  const { match_id, other_user } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Join room and socket
    socket.emit('join', user.id);
    socket.emit('join_room', match_id);

    // Fetch chat history
    fetchHistory();

    // Listen for new messages
    socket.on('receive_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/chat/history/${match_id}`,
        { headers: { authorization: token } }
      );
      setMessages(res.data.messages);
    } catch (err) {
      console.error('Failed to fetch history');
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    socket.emit('send_message', {
      match_id,
      sender_id: user.id,
      sender_name: user.name,
      message: newMessage
    });

    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>
          ← Back
        </button>
        <h2 style={styles.headerTitle}>💬 Chat with {other_user}</h2>
      </div>

      {/* Messages */}
      <div style={styles.messagesContainer}>
        {messages.length === 0 ? (
          <p style={styles.noMessages}>
            No messages yet! Say hello! 👋
          </p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              style={{
                ...styles.messageBubble,
                alignSelf: msg.sender_id === user.id ? 'flex-end' : 'flex-start',
                backgroundColor: msg.sender_id === user.id ? '#4f46e5' : 'white',
                color: msg.sender_id === user.id ? 'white' : '#333'
              }}
            >
              <p style={styles.senderName}>
                {msg.sender_id === user.id ? 'You' : msg.sender_name}
              </p>
              <p style={styles.messageText}>{msg.message}</p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={styles.inputContainer}>
        <input
          style={styles.input}
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button style={styles.sendBtn} onClick={sendMessage}>
          Send 🚀
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#f0f4f8'
  },
  header: {
    backgroundColor: '#4f46e5',
    padding: '15px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  backBtn: {
    backgroundColor: 'transparent',
    border: '1px solid white',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  headerTitle: {
    color: 'white',
    margin: 0
  },
  messagesContainer: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  noMessages: {
    textAlign: 'center',
    color: '#888',
    marginTop: '50px'
  },
  messageBubble: {
    maxWidth: '60%',
    padding: '12px 16px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  senderName: {
    fontSize: '12px',
    fontWeight: 'bold',
    margin: '0 0 4px 0',
    opacity: 0.8
  },
  messageText: {
    margin: 0,
    fontSize: '15px'
  },
  inputContainer: {
    padding: '15px',
    backgroundColor: 'white',
    display: 'flex',
    gap: '10px',
    boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
  },
  input: {
    flex: 1,
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px'
  },
  sendBtn: {
    padding: '12px 24px',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px'
  }
};

export default Chat;