import React, { useEffect } from 'react';

export default function MessageList({ messages, username, firstUnseenRef, messagesEndRef, darkMode }) {
  useEffect(() => {
    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    const firstUnseen = messages.findIndex(msg => msg.senderUsername !== username && !msg.seen);
    if (firstUnseen !== -1 && firstUnseenRef.current) {
      firstUnseenRef.current.scrollIntoView({ behavior: 'smooth' });
    } else {
      scrollToBottom();
    }
  }, [messages, username]);

  return (
    <div className={`messages ${darkMode ? 'dark' : 'light'}`}>
      {messages.length === 0 ? (
        <p className="no-messages">No messages yet. Start chatting!</p>
      ) : (
        messages.map((msg, idx) => {
          const isUnseen = msg.senderUsername !== username && !msg.seen;
          const messageClass = `message ${msg.senderUsername === username ? 'sent' : 'received'}`;
          return (
            <div
              key={idx}
              className={messageClass}
              ref={isUnseen && !firstUnseenRef.current ? firstUnseenRef : null}
            >
              {msg.type === 'image' ? (
                <img
                  src={msg.content}
                  alt="sent"
                  onClick={() => window.open(msg.content)}
                  style={{ cursor: 'pointer', maxWidth: '200px', borderRadius: '8px' }}
                />
              ) : (
                <span>{msg.content}</span>
              )}
              <div className="timestamp">{new Date(msg.timestamp).toLocaleString()}</div>
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
