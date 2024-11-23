import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

import photo from './img/profile.png';
import { useNavigate } from 'react-router-dom';

const UserMenu = () => {
  const [userData, setUserData] = useState({
    objectId: null,
    groupId: null,
    username: null,
    email:null,
  });
  const navigate=useNavigate();

  useEffect(() => {
    // Retrieve the JWT token from localStorage
    const token = localStorage.getItem('authToken');

    if (!token) {
      console.log('No token found in localStorage');
      navigate('/');
      // Optionally redirect to login if no token exists
      return;
    }

    try {
      // Decode the JWT token to get the user data
      const decodedToken = jwtDecode(token);

      const { username, objectId, groupId,email } = decodedToken.user;

      // Store the decoded data in the state
      setUserData({ objectId, groupId, username,email });

      // Log the decoded token data
      console.log('Decoded Token Data: ', decodedToken.user.email);
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }, []); // Empty dependency array means this runs only once when the component mounts

  return (
    <div className="flex gap-[30px] items-center">
      <div className="flex gap-3 items-center">
       
      </div>
      <div className="flex h-12 border-x border-[0.5px] border-taskia-background-grey" />
      <div className="flex gap-3 items-center">
        <div className="*:text-right flex flex-col">
          {/* Display the username */}
          <p className="text-taskia-grey text-sm w-full">{userData.username}</p>
          <p className="font-bold">{userData.email}</p>
        </div>
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <img src={photo} className="object-cover h-full w-full" alt="photo" />
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
