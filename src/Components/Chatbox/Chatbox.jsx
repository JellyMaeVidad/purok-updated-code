import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../AuthContext';

const Chatbox = () => {
  const [chatCode, setChatCode] = useState('');
  const { getToken } = useAuth();
  const token = getToken();
  const handleChatCodeChange = (event) => {
    setChatCode(event.target.value);
  };

  const handleGenerateCode = () => {
    // Generate a random chat code (you can customize the logic here)
    const generatedCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setChatCode(generatedCode);
  };

  const handleCreateGroup = async () => {
    try {
        if (!chatCode) {
            console.error('Chat code is missing');
            return;
          }
      const token = getToken(); // Define your getToken function
      const response = await axios.post('http://localhost/purok/CreateChatroom.php', { chat_code: chatCode }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('is there a chatcode?', chatCode);

      console.log('Server Response:', response);
     
      if (response.data.success) {
        console.log('Chatroom created successfully');
        // Additional logic if needed after successful creation
      } else {
        console.error('Failed to create chatroom:', response.data.message);
      }
    } catch (error) {
      console.error('Error creating chatroom:', error);
    }
  };

  const handleJoinChatroom = () => {
    // Logic to join the chatroom using the entered chat code
    console.log('Joining chatroom with code:', chatCode);
  };

  return (
    <div className="recent-orders">
        <h1>Coming Soon!</h1>
      <h2>Chatbox</h2>
      <input className="btn"
        type="text"
        placeholder="Enter chat code"
        value={chatCode}
        onChange={handleChatCodeChange}
      />
      <button className='btn generate-code' onClick={handleGenerateCode}>Generate Code</button>
      <button className='btn create-group' onClick={handleCreateGroup}>Create Group</button>
      <button className='btn join-chatroom' onClick={handleJoinChatroom}>Join Chatroom</button>
    </div>
  );
};

export default Chatbox;
