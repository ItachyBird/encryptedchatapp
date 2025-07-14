// components/ChatContainer.js
import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';
import Sidebar from '../component/Sidebar';
import ChatHeader from '../component/ChatHeader';
import MessageList from '../component/MessageList';
import MessageInput from '../component/MessageInput';
import UploadPreview from '../component/UploadPreview';
import { useTheme } from '../ThemeContext'; // ✅ NEW IMPORT
import '../pagescss/Chat.css';
import '../componentcss/ChatHeader.css';
import '../componentcss/MessageInput.css';
import '../componentcss/MessageList.css';
import '../componentcss/Sidebar.css';

let stompClient = null;

export default function ChatContainer() {
  const username = localStorage.getItem('username');
  const { darkMode } = useTheme(); // ✅ GET darkMode from context

  const [receiver, setReceiver] = useState('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [friends, setFriends] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [searchUser, setSearchUser] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const connectedRef = useRef(false);
  const messagesEndRef = useRef(null);
  const firstUnseenRef = useRef(null);

  useEffect(() => {
    if (!username) return;
    const socket = new SockJS('http://localhost:8080/ws');
    stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        connectedRef.current = true;
        stompClient.subscribe(`/user/${username}/queue/messages`, (msg) => {
          const received = JSON.parse(msg.body);
          if (
            received.senderUsername === receiver ||
            received.receiverUsername === receiver
          ) {
            setMessages((prev) => [...prev, received]);
          }
        });
      },
      onDisconnect: () => {
        connectedRef.current = false;
      },
    });
    stompClient.activate();
    return () => {
      if (stompClient) stompClient.deactivate();
      connectedRef.current = false;
    };
  }, [username, receiver]);

  useEffect(() => {
    if (receiver && username) {
      axios
        .get(`http://localhost:8080/api/chat/${username}/${receiver}`)
        .then((res) => setMessages(res.data))
        .catch(console.error);
    } else {
      setMessages([]);
    }
  }, [receiver, username]);

  useEffect(() => {
    if (!username) return;

    axios
      .get(`http://localhost:8080/api/auth/friends?username=${username}`)
      .then((res) => setFriends(res.data))
      .catch(console.error);

    axios
      .get(`http://localhost:8080/api/auth/friend-requests?username=${username}`)
      .then((res) => setIncomingRequests(res.data))
      .catch(console.error);

    // Optionally load sent requests
    /*
    axios
      .get(`http://localhost:8080/api/auth/sent-requests?username=${username}`)
      .then((res) => setSentRequests(res.data))
      .catch(console.error);
    */
  }, [username]);

  const uploadFileToBackend = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post('http://localhost:8080/api/media/upload', formData);
      return res.data.url;
    } catch {
      alert('Upload failed');
      return null;
    }
  };

  const sendMessage = async () => {
    if (!connectedRef.current || !receiver) return;
    let msgObj = {
      senderUsername: username,
      receiverUsername: receiver,
      timestamp: new Date().toISOString(),
      seen: false,
    };
    if (file) {
      const url = await uploadFileToBackend(file);
      if (!url) return;
      msgObj.content = url;
      msgObj.type = 'image';
      setFile(null);
    } else if (message.trim()) {
      msgObj.content = message.trim();
      msgObj.type = 'text';
      setMessage('');
    } else return;

    stompClient.publish({
      destination: '/app/chat',
      body: JSON.stringify(msgObj),
    });
    setMessages((prev) => [...prev, msgObj]);
  };

  const addFriend = (friendUsername) => {
    if (!friendUsername || friendUsername === username) {
      alert("Invalid username");
      return;
    }
    axios.post('http://localhost:8080/api/auth/add-friend', {
      username: username,
      friendUsername: friendUsername,
    })
    .then(() => {
      setSentRequests((prev) => [...prev, friendUsername]);
      setSearchUser('');
    })
    .catch((error) => {
      console.error("Add friend error:", error.response?.data || error.message);
      alert(error.response?.data || "Failed to send friend request");
    });
  };

  const removeFriend = (friendUsername) => {
    axios.post('http://localhost:8080/api/auth/remove-friend', {
      username,
      friendUsername,
    })
    .then(() => {
      setFriends((prev) => prev.filter(f => f !== friendUsername));
      if (receiver === friendUsername) {
        setReceiver('');
        setMessages([]);
      }
    })
    .catch(console.error);
  };

  const acceptFriendRequest = (requester) => {
    axios.post('http://localhost:8080/api/auth/accept-friend-request', {
      username,
      friendUsername: requester,
    })
    .then(() => {
      setFriends(prev => [...prev, requester]);
      setIncomingRequests(prev => prev.filter(r => r !== requester));
    })
    .catch(console.error);
  };

  const rejectFriendRequest = (requester) => {
    axios.post('http://localhost:8080/api/auth/reject-friend-request', {
      username,
      friendUsername: requester,
    })
    .then(() => {
      setIncomingRequests(prev => prev.filter(r => r !== requester));
    })
    .catch(console.error);
  };

  const cancelSentRequest = (receiverUsername) => {
    axios.post('http://localhost:8080/api/auth/cancel-friend-request', {
      username,
      friendUsername: receiverUsername,
    })
    .then(() => {
      setSentRequests(prev => prev.filter(r => r !== receiverUsername));
    })
    .catch(console.error);
  };

  return (
    <div className="chat-container">
      <Sidebar
        username={username}
        friends={friends}
        receiver={receiver}
        setReceiver={setReceiver}
        searchUser={searchUser}
        setSearchUser={setSearchUser}
        addFriend={addFriend}
       
        incomingRequests={incomingRequests}
        acceptFriendRequest={acceptFriendRequest}
        rejectFriendRequest={rejectFriendRequest}
        sentRequests={sentRequests}
        cancelSentRequest={cancelSentRequest}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        darkMode={darkMode} 
      />
      <div className="chat-panel">
        <ChatHeader
          receiver={receiver}
          connected={connectedRef.current}
          setSidebarOpen={setSidebarOpen}
          sidebarOpen={sidebarOpen}
          darkMode={darkMode}
           removeFriend={removeFriend}
        />
        <MessageList
          messages={messages}
          username={username}
          firstUnseenRef={firstUnseenRef}
          messagesEndRef={messagesEndRef}
          darkMode={darkMode} 
        />
        {file && <UploadPreview file={file} setFile={setFile} />}
        <MessageInput
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
          file={file}
          setFile={setFile}
          darkMode={darkMode} 
        />
      </div>
    </div>
  );
}
