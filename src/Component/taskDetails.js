import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import './TaskDashboard.css';

import dcube from './img/icons/3dcube.svg';

import note_favorite from './img/icons/note-favorite.svg';
import forbidden from './img/icons/forbidden-2.svg';
import search from './img/icons/search-normal.svg'
import photo from './img/photo.png'
import ghost from './img/icons/ghost.svg'
import { jwtDecode } from 'jwt-decode';

const AddDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const navigate=useNavigate();
  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('authToken'); 

    // Optionally, redirect user to the login page
    navigate('/'); // Or '/home' based on your app's routing
  };
  const [inputValue, setInputValue] = useState('');

  const preventInput = (event) => {
    setInputValue(''); // Clear input value
    alert('Input is not allowed here.'); // Show alert (optional)
  }

  const [userData, setUserData] = useState({
    objectId: null,
    groupId: null,
    username: null,
    email:null,
  });
  useEffect(() => {
    

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
      console.log("hbh", decodedToken)
      // Store the decoded data in the state
      setUserData({ objectId, groupId, username,email });

      // Log the decoded token data
      console.log('Decoded Token Data: ', decodedToken.user.email);
    } catch (error) {
      console.error('Error decoding token:', error);
    }
    // Fetch the task details using the id from the URL
    const fetchTask = async () => {

      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/auth/getSelectedTask/${id}`);
        console.log(response.data);
        setTask(response.data[0]); // Assuming the API returns an array and you need the first item
      } catch (error) {
        console.error('Error fetching task details:', error);
      }
    };

    if (id) {
      fetchTask(); // Only fetch if we have the id
    }

  }, [id]); // Dependency on 'id' ensures it fetches task data when the id changes

  if (!task) {
    return (
      <div>Loading...</div> // Or show a loading spinner
    );
  }
  
  // Destructure task data for easier access
  const { TaskName, UserName, taskpriority, status, createdAt,_id } = task;
  console.log(task, " task master")
  async function handleEdit(_id) {
    navigate(`/edittask/${_id}`);

    
  }
  async function handleDelete(_id) {
    // Show a confirmation dialog
    const isConfirmed = window.confirm("Are you sure you want to delete this task?");
  
    if (isConfirmed) {
      // If the user clicks "OK", proceed with deletion
      try {
        const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/auth/deleteSelectedTask/${_id}`);
        if (response.status === 200) {
          console.log("Task deleted successfully");
          alert("Task deleted successfully!"); // Show success message
          navigate("/dashboard"); // Redirect to dashboard or task list after successful deletion
        }
      } catch (err) {
        console.error("Error while deleting task: ", err);
        alert("Error while deleting task. Please try again."); // Show error message
      }
    } else {
      // If the user clicks "Cancel", just log the action and do nothing
      console.log("Delete action canceled");
    }
  }
  function toHomePage (){
    navigate('/dashboard')
  };
  async function handleStatusComplete(_id) {
    // Show a confirmation dialog
    const isConfirmed = window.confirm("Are you sure you want to chnage status of task is completed?");
  
    if (isConfirmed) {
      // If the user clicks "OK", proceed with deletion
      try {
        const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/auth/updateSelectedTask/${_id}`);
        if (response.status === 200) {
          console.log("Task Updated successfully");
          alert("Task updated successfully!"); // Show success message
          navigate("/dashboard"); // Redirect to dashboard or task list after successful deletion
        }
      } catch (err) {
        console.error("Error while deleting task: ", err);
        alert("Error while update task. Please try again."); // Show error message
      }
    } else {
      // If the user clicks "Cancel", just log the action and do nothing
      alert("update cancelled action canceled");
    }
  }
  

  return (
    <section id="Dashboard" className="flex">
      <div id="Sidebar" className="w-[280px] flex flex-col gap-[30px] p-[30px] shrink-0 h-screen overflow-y-scroll no-scrollbar">
        <div className="flex justify-center">
          <img  style={{maxWidth:"89%" ,cursor:"pointer"}} src="https://www.apcomedicare.com/_next/image?url=%2Fimages%2Flogo.png&w=1920&q=75" onClick={toHomePage} alt="Logo" />
        </div>
        <div className="general-menu flex flex-col gap-[18px]">
          <h3 className="font-semibold text-sm leading-[21px]">GENERAL</h3>
          <Link to={"/dashboard"} className="flex items-center gap-[10px] p-[12px_16px] h-12 rounded-full border border-taskia-background-grey">
            <div className="w-6 h-6">
              <img src={dcube} alt="icon" />
            </div>
            <p className="font-semibold">Overview</p>
          </Link>
          
          <Link to={"/dashboard"} className="flex items-center gap-[10px] p-[12px_16px] h-12 rounded-full bg-taskia-light-orange drop-shadow-[0_10px_20px_rgba(255,216,141,0.50)]">
            <div className="w-6 h-6">
              <img src={note_favorite} alt="icon" />
            </div>
            <p className="font-semibold">Manage Task</p>
          </Link>
          
        </div>
        <hr style={{marginBottom:"15px"}} className="text-taskia-background-grey" />
        <div className="general-menu flex flex-col gap-[18px]">
          
          <a  className="flex items-center gap-[10px] p-[12px_16px] h-12 rounded-full border border-taskia-background-grey">
            <div className="w-6 h-6">
              <img src={forbidden} alt="icon" />
            </div>
          <div className="general-menu flex flex-col gap-[18px]">

            <h3 style={{marginTop: "-41px"}} className="font-semibold text-sm leading-[21px]">OTHERS</h3>
        
            <p  className="font-semibold" onClick={handleLogout}>Logout</p>
          </div>
            </a>
        </div>
      </div>
      <div id="Content" className="flex flex-col bg-taskia-background-grey rounded-l-[60px] w-full h-screen overflow-y-scroll p-[50px] gap-[30px]">
        <div className="dashboard-nav bg-white flex justify-between items-center w-full p-4 rounded-[18px]">
          <div className="dashboard-search flex items-center p-[12px_20px] rounded-full border border-taskia-background-grey w-[400px] h-12 focus-within:ring-2 focus-within:ring-taskia-purple">
            <input
              type="text"
              className="font-semibold placeholder:text-taskia-grey placeholder:font-normal focus:outline-none w-full"
              placeholder="Search by report name..."
              name="name"
              value={inputValue}
              onChange={preventInput}
              required=""
            />
            <button className="ml-[10px] w-6 h-6 flex items-center justify-center">
              <img src={search} alt="icon" />
            </button>
          </div>
          <div className="flex gap-[30px] items-center">
           
            <div className="flex h-12 border-x border-[0.5px] border-taskia-background-grey" />
            <div className="flex gap-3 items-center">
              <div className="*:text-right flex flex-col">
                <p className="text-taskia-grey text-sm w-full">{userData.username}</p>
                <p className="font-bold">{userData.email}</p>
              </div>
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img src={photo} className="object-cover h-full w-full" alt="photo" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-[30px]">
          <div className="content-header flex justify-between items-center">
            <div>
              <h1 style={{textAlign:"left"}} className="font-extrabold text-[30px] leading-[45px]">Manage Task</h1>
              <p className="leading-[21px] text-sm">Set the goals to grow your company</p>
            </div>
            <div className="flex gap-3 items-center">
              <Link to="/Addtask" id="btnAddTaskHeader" className="flex gap-[10px] justify-center items-center text-white p-[12px_20px] h-12 font-semibold bg-gradient-to-b from-[#977FFF] to-[#6F4FFF] rounded-full w-full border border-taskia-background-grey">
                Add New Task
              </Link>
            </div>
          </div>

          {/* Task Card View */}
          <div className="flex flex-col gap-6" id="taskWrapper">
            <div className="flex justify-between bg-white p-5 w-full rounded-3xl">
              <div className="task-card flex flex-col gap-5">
                <div className="flex gap-3 items-center">
                  <div className="w-[50px] h-[50px] flex shrink-0 items-center justify-center bg-[#BDEBFF] rounded-full">
                    <img src={ghost} alt="icon" />
                  </div>
                  <div className="flex flex-col">
                    <p className="font-bold text-lg leading-[27px]">Task Name: {TaskName}</p>
                    <p style={{textAlign:"left"}} className="font-bold text-lg leading-[27px]">User: {UserName}</p>
                    <p style={{textAlign:"left"}} className="text-sm leading-[21px] text-taskia-grey">Created: {new Date(createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex gap-4 font-semibold text-sm leading-[21px]">
                  <div className="flex gap-1 items-center">
                    <p>Priority: {taskpriority}</p>
                  </div>
                  <div className="flex gap-1 items-center">
                    <p>Status: {status}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-row items-center gap-x-3">
                <a className="my-auto font-semibold text-taskia-red border border-taskia-red p-[12px_20px] h-12 rounded-full"  onClick={() => handleDelete(_id)}>Delete</a>
                <a className="my-auto font-semibold text-taskia-red border border-taskia-red p-[12px_20px] h-12 rounded-full" onClick={()=>handleEdit(_id)}>Edit</a>
                <a className="flex gap-[10px] justify-center items-center text-white p-[12px_20px] h-12 font-semibold bg-gradient-to-b from-[#977FFF] to-[#6F4FFF] rounded-full w-full border border-taskia-background-grey"  onClick={()=>handleStatusComplete(_id)}>Complete</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddDetails;
