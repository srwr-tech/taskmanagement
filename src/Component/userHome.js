
import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Ensure axios is imported for API requests
import { jwtDecode } from 'jwt-decode';

import './TaskDashboard.css';
import search_normal from './img/icons/search-normal.svg';
import UserMenu from './UserMenu';

import ghost from './img/icons/ghost.svg';
import layer from './img/icons/layer.svg';
import dcube from './img/icons/3dcube.svg';

import favorite from './img/icons/note-favorite.svg';
import { Link, useNavigate } from 'react-router-dom';
import logout from './img/icons/forbidden-2.svg';

const Dashboard = () => {
  const navigate = useNavigate();
  
  const [tasks, setTasks] = useState([]); // All tasks fetched from the backend
  const [filteredTasks, setFilteredTasks] = useState([]); // Tasks after search filter
  const [searchTerm, setSearchTerm] = useState(''); // Search term input value
  const [noMatchesFound, setNoMatchesFound] = useState(false); // Track if no matches found

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove token from localStorage
    navigate('/'); // Navigate to login or home page
  };

  // Fetch tasks based on the logged-in user
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log('No token found');
      navigate('/');
      return;
    }
    let _id;
    try {
      const decodedToken = jwtDecode(token);
      console.log(decodedToken.user.group_id, " task date last ")
      _id = decodedToken.user._id;
    } catch (error) {
      console.error('Error decoding token:', error);
    }
    
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/auth/getUserTask/${_id}`);
        setTasks(response.data); // Store tasks data
        setFilteredTasks(response.data); // Initially, show all tasks
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, []); // Empty dependency ensures this runs once after component mounts

  // Handle search term change
  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearchTerm(value); // Update search term

    if (value.trim() !== '') {
      searchTasks(value); // Trigger search if there is text in the input
    } else {
      setFilteredTasks(tasks); // If search input is cleared, show all tasks
      setNoMatchesFound(false); // Reset no matches found state
    }
  };

  // Search tasks based on task name
  const searchTasks = (query) => {
    const filtered = tasks.filter((task) =>
      task.TaskName.toLowerCase().includes(query.toLowerCase()) // Filter tasks by task name
    );
    
    if (filtered.length === 0) {
      setNoMatchesFound(true); // If no matching tasks found
    } else {
      setNoMatchesFound(false); // Matching tasks found
    }
    setFilteredTasks(filtered); // Update filtered tasks
  };

  return (
    <div>

      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      
      <section id="Dashboard" className="flex">
        {/* Sidebar */}
        <div id="Sidebar" className="w-[280px] flex flex-col gap-[30px] p-[30px] shrink-0 h-screen overflow-y-scroll no-scrollbar">
          <div className="flex justify-center">
            <img style={{ maxWidth: "89%" }} src="https://www.apcomedicare.com/_next/image?url=%2Fimages%2Flogo.png&w=1920&q=75" alt="Logo" />
          </div>

          {/* General Menu */}
          <div className="general-menu flex flex-col gap-[18px]">
            <h3 className="font-semibold text-sm leading-[21px]">GENERAL</h3>
            <NavItem to={"/home"} icon={dcube} label="Overview" isActive />
            
          </div>

          <hr className="text-taskia-background-grey" />

          {/* Other Menu */}
          <div className="general-menu flex flex-col gap-[18px]">
            <h3 className="font-semibold text-sm leading-[21px]">OTHERS</h3>
            <div type="button" onClick={handleLogout}>
              <NavItem icon={logout} label="Logout" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div id="Content" className="flex flex-col bg-taskia-background-grey rounded-l-[60px] w-full h-screen overflow-y-scroll p-[50px] gap-[30px]">
          {/* Dashboard Navigation */}
          <div className="dashboard-nav bg-white flex justify-between items-center w-full p-4 rounded-[18px]">
            <SearchBar searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
            <div className="flex gap-3 items-center">
             
            </div>
            <UserMenu />
          </div>

          {/* Content Section */}
          <div className="flex flex-col gap-[30px]">
            {/* Task List */}
            <TaskList tasks={filteredTasks} noMatchesFound={noMatchesFound} />
          </div>
        </div>
      </section>
    </div>
  );
};

// Reusable Navigation Item Component
const NavItem = ({  icon, label, isActive }) => {
  const activeClass = isActive ? 'bg-taskia-light-orange drop-shadow-[0_10px_20px_rgba(255,216,141,0.50)]' : '';
  return (
    <a  className={`flex items-center gap-[10px] p-[12px_16px] h-12 rounded-full border border-taskia-background-grey ${activeClass}`}>
      <div className="w-6 h-6">
        <img src={icon} alt="icon" />
      </div>
      <p className="font-semibold">{label}</p>
    </a>
  );
};

// Search Bar Component
const SearchBar = ({ searchTerm, handleSearchChange }) => (
  <div className="dashboard-search flex items-center p-[12px_20px] rounded-full border border-taskia-background-grey w-[400px] h-12 focus-within:ring-2 focus-within:ring-taskia-purple">
    <input
      type="text"
      className="font-semibold placeholder:text-taskia-grey placeholder:font-normal focus:outline-none w-full"
      value={searchTerm}
      onChange={handleSearchChange}
      placeholder="Search by task name..."
    />
    <button className="ml-[10px] w-6 h-6 flex items-center justify-center">
      <img src={search_normal} alt="icon" />
    </button>
  </div>
);

// Task List Component (Dynamic)
// Task List Component (Dynamic)
const TaskList = ({ tasks, noMatchesFound }) => (
    <div className="flex flex-col gap-6" id="taskWrapper">
      {tasks.length === 0 ? (
        <div className="flex justify-center items-center w-full h-full p-6 bg-gray-100 text-center rounded-lg shadow-lg">
          <p className="text-xl font-semibold text-gray-500">No Task found for you</p>
        </div>
      ) : noMatchesFound ? (
        <div className="flex justify-center items-center w-full h-full p-6 bg-gray-100 text-center rounded-lg shadow-lg">
          <p className="text-xl font-semibold text-gray-500">No tasks found matching your search.</p>
        </div>
      ) : (
        tasks.map((task) => (
          <TaskCard key={task._id} task={task} />
        ))
      )}
    </div>
  );
  

// Task Card Component (Dynamic)
const TaskCard = ({ task }) => (
  <div className="flex justify-between bg-white p-5 w-full rounded-3xl">
    <div className="task-card flex flex-col gap-5">
      <div className="flex gap-3 items-center">
        <div className="w-[50px] h-[50px] flex shrink-0 items-center justify-center bg-[#BDEBFF] rounded-full">
          <img src={ghost} alt="icon" />
        </div>
        <div className="flex flex-col">
          <p className="font-bold text-lg leading-[27px]">Task Name : {task.TaskName}</p>
          <p className="text-sm leading-[21px] text-taskia-grey">Task Created Date: {new Date(task.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="flex gap-4 font-semibold text-sm leading-[21px]">
        <div className="flex gap-1 items-center">
          <div className="flex shrink-0 w-5 h-5">
            <img src={layer} alt="icon" />
          </div>
          <p>Priority Level : {task.taskpriority}</p>
        </div>
        <div className="flex gap-1 items-center">
          <div className="flex shrink-0 w-5 h-5">
            <svg width={20} height={21} viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.29163 2.16663V18.8333" stroke="currentColor" strokeWidth={2} strokeMiterlimit={10} strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4.29163 3.83337H13.625C15.875 3.83337 16.375 5.08337 14.7916 6.66671L13.7916 7.66671C13.125 8.33337 13.125 9.41671 13.7916 10L14.7916 11C16.375 12.5834 15.875 13.8334 13.625 13.8334H4.29163" stroke="currentColor" strokeWidth={2} strokeMiterlimit={10} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p>Task Deadline on: {task.date}</p>
        </div>
      </div>
    </div>
    
  </div>
);

export default Dashboard;
