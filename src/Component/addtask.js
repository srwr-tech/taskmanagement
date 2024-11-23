import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Add jwt-decode to decode the JWT token
import search_normal from './img/icons/search-normal.svg';
import favorite from './img/icons/note-favorite-outline.svg';
import myfavorite from './img/icons/note-favorite.svg';

import layer from './img/icons/layer.svg';
import profile_image from './img/icons/profile-circle.svg';
import UserMenu from './UserMenu';
import { useNavigate, useParams } from 'react-router-dom';

const Addtask = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { taskId } = useParams(); // Extract taskId from URL
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    taskName: '',
    username: '',
    priority: '',
    date:'',
    discription:''
    
  });

  const [userData, setUserData] = useState(null); // Store user data (objectId)
  const [filteredTasks, setFilteredTasks] = useState([]); // Store filtered results
  const [isSearching, setIsSearching] = useState(false); // Loading state for search
  const [noMatchesFound, setNoMatchesFound] = useState(false); // Track if no matches found

  useEffect(() => {
    // Retrieve the JWT token from localStorage
    const token = localStorage.getItem('authToken');

    if (!token) {

      return;
    }

    try {
      // Decode the JWT token to get the user data
      const decodedToken = jwtDecode(token);
      const { _id } = decodedToken.user; // Extract objectId from token
      setUserData(_id); // Store the objectId in userData
    } catch (error) {
      console.error('Error decoding token:', error);
    }
    if (taskId) {
      
      fetchTaskDetails(taskId);
    }
    else {
      setIsLoading(false); // If there's no taskId, set loading as false immediately
    }

  

    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/auth/getTask`);
        setFilteredTasks(response.data); // Store all tasks in state for initial display
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    

    fetchTasks();
  }, [taskId]); // Empty dependency array ensures this runs only once when the component mounts
  const fetchTaskDetails = async (taskId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/auth/getUpdatedData/${taskId}`);
      const task = response.data;
     
      setFormData({
        taskName: task[0].TaskName,
        username: task[0].UserName,
        discription: task[0].discription,
        priority: task[0].taskpriority,
        date: task[0].date,
      });
      setIsLoading(false); // Set loading to false once the data is fetched

    } catch (error) {
      console.error('Error fetching task details:', error);
      setIsLoading(false); // Set loading to false even if there's an error fetching the data

    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // You can display a loading spinner or message here
  }


 

  // Handle input change for task and username fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Update the corresponding field in the state
    }));

    if (name === 'username' && value.trim() !== '') {
      searchUsers(value); // Trigger search when username is changed
    } else {
      setFilteredTasks([]); // Clear suggestions if username input is cleared
      setNoMatchesFound(false); // Reset noMatchesFound flag
    }
  };

  // Search for users based on username input
  const searchUsers = async (username) => {
    setIsSearching(true); // Set loading state while searching
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/auth/getTask`); // Fetch all tasks from the backend
    
      const filtered = response.data.filter((task) =>
        task.username.toLowerCase().includes(username.toLowerCase()) // Filter by username
      );
      if (filtered.length === 0) {
        setNoMatchesFound(true); // No matching tasks found
      } else {
        setNoMatchesFound(false); // Matching tasks found
      }
      setFilteredTasks(filtered); // Store the filtered tasks
    } catch (error) {
      console.error('Error searching users:', error);
    }
    setIsSearching(false); // Reset loading state
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!userData) {
      alert('User not authenticated');
      return;
    }

    // Create the payload from form data and include the objectId from the token
    const taskData = {
      TaskName: formData.taskName,
      UserName: formData.username,
      discription:formData.discription,
      taskpriority: formData.priority,
      date:formData.date,
      status: 'pending',
      userId: userData, // Use objectId from decoded token as userId
      selectedUserId:formData.selectedUserId
    };

    // Send the form data to the backend API using axios
    try {
      if (taskId) {
        // Update existing task (PUT request)
        const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/auth/updateTask/${taskId}`, taskData);
        if (response.status === 200) {
          alert('Task updated successfully');
          navigate('/dashboard'); // Redirect after successful update
        } else {
          alert('Something went wrong');
        }
      } else {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/auth/AddTask`, taskData);

      // Log the full response for debugging
      if (response.status === 200) {
        alert('Task added successfully');
        setFormData({ taskName: '', username: '', priority: '', date:'',discription:'' });
      } else {
        alert('Something went wrong');
        }  }
    } catch (error) {
      console.error('Request failed:', error);
      alert('Something went wrong while adding the task');
    }
  };
  function toHomePage (){
    navigate('/dashboard')
  };
  // Handle selecting a user from the suggestion list
  const handleSelectUser = (task) => {
    setFormData((prevData) => ({
      ...prevData,
      username: task.username, // Update the username field with the selected task's username
      selectedUserId: task._id, // Update the username field with the selected task's username
    }));
   
  };

  return (
    <>
      <section id="Dashboard" className="flex">
        <div id="Content" className="flex flex-col bg-taskia-background-grey rounded-l-[60px] w-full h-screen overflow-y-scroll p-[50px] gap-[30px]">
          <div className="dashboard-nav bg-white flex justify-between items-center w-full p-4 rounded-[18px]">
            <div className="flex justify-center">
            <img style={{height:"30px" ,cursor:"pointer"}} src="https://www.apcomedicare.com/_next/image?url=%2Fimages%2Flogo.png&w=1920&q=75" onClick={toHomePage} alt=""  />
            </div>
            <div className="flex gap-[30px] items-center">
              <div className="flex gap-3 items-center">
                <UserMenu />
              </div>
              <div className="flex h-12 border-x border-[0.5px] border-taskia-background-grey" />
            </div>
          </div>
          <div className="flex flex-col gap-[30px]">
            <form id="taskForm" className="group/form flex w-fit shrink-0 gap-[30px]" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-5 p-5 bg-white rounded-[30px] w-[500px] shrink-0 h-fit">
                <div className="group/taskname">
                  <div className="peer flex items-center p-[12px_16px] h-12 rounded-full border border-taskia-background-grey mt-[6px] focus-within:ring-2 focus-within:ring-taskia-purple">
                    <div className="mr-[10px] w-6 h-6 flex items-center justify-center shrink-0">
                      <img src={favorite} className="h-full" alt="icon" />
                    </div>
                    <input
                      id="taskName"
                      type="text"
                      className="font-semibold placeholder:text-taskia-grey placeholder:font-normal focus:outline-none w-full"
                      placeholder="Type task name"
                      name="taskName"
                      value={formData.taskName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="group/taskname">
                  <div className="peer flex items-center p-[12px_16px] h-12 rounded-full border border-taskia-background-grey mt-[6px] focus-within:ring-2 focus-within:ring-taskia-purple">
                    <div className="mr-[10px] w-6 h-6 flex items-center justify-center shrink-0">
                      <img src={myfavorite} className="h-full" alt="icon" />
                    </div>
                    <input
                      id="discription"
                      type="text"
                      className="font-semibold placeholder:text-taskia-grey placeholder:font-normal focus:outline-none w-full"
                      placeholder="Type task discription"
                      name="discription"
                      value={formData.discription}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center p-[12px_16px] rounded-full border border-taskia-background-grey mt-[6px] focus-within:ring-2 focus-within:ring-taskia-purple">
                    <div className="mr-[10px] w-6 h-6 flex items-center justify-center">
                      <img src={profile_image} alt="icon" />
                    </div>
                    <input
                      type="text"
                      className="font-semibold placeholder:text-taskia-grey placeholder:font-normal focus:outline-none w-full"
                      placeholder="Search username to assigned Task to user"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Display filtered results */}
                  {formData.username && filteredTasks.length > 0 && !noMatchesFound && (
                    <ul className="task-suggestions" style={{ width: 'auto', minWidth: '100%' }}>
                      {filteredTasks.map((task, index) => (
                        <li
                          key={index}
                          onClick={() => handleSelectUser(task)} // Handle selection
                          style={{ cursor: 'pointer' }}
                        >
                          {task.username}
                        </li>
                      ))}
                    </ul>
                  )}
                  {noMatchesFound && <p>No matches found</p>}
                </div>

                <div className="group/priority">
                  <div className="peer flex items-center p-[12px_16px] h-12 rounded-full border border-taskia-background-grey mt-[6px] focus-within:ring-2 focus-within:ring-taskia-purple">
                    <div className="mr-[10px] w-6 h-6 flex items-center justify-center shrink-0">
                      <img src={layer} className="h-full" alt="icon" />
                    </div>

                    <input
                      id="date"
                      type="date"
                      className="font-semibold placeholder:text-taskia-grey placeholder:font-normal focus:outline-none w-full"
                      placeholder="Select date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                    
                    <select
                    id="priority"
                    className="font-semibold placeholder:text-taskia-grey placeholder:font-normal focus:outline-none w-full"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled>Select Priority</option>  {/* Disabled placeholder option */}
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                  </div>
                </div>
                <button
                type="submit"
                className="flex gap-[10px] justify-center items-center text-white p-[12px_16px] h-12 font-semibold bg-gradient-to-b from-[#977FFF] to-[#6F4FFF] rounded-full w-full border border-taskia-background-grey"
              >
              {taskId ? 'Update Task' : 'Create Task'}
              </button>
              
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Addtask;
