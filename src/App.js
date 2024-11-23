import './App.css';
import Registration from './Component/Registration_Login/registration';
import Login from './Component/Registration_Login/login';
import NotFound from './Component/Notfound'; // 404 page when route is undefined
// import ProtectedRoute from './Component/ProtectedRoute'; // Protected route for authentication
import Dashboard from './Component/Dashboard'; // Dashboard component (capitalized)
import { BrowserRouter , Routes, Route } from 'react-router-dom';
import Addtask from './Component/addtask'
import Edittask from './Component/addtask'
import TaskDetails from './Component/taskDetails'
import Home from './Component/userHome';
import './css/style.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <div className="main">
          <Routes>
            {/* Home route displaying SignUp form */}
            <Route path="/" element={< Login />} />

            {/* Route for SignIn */}
            <Route path="/signup" element={<Registration />} />

            {/* Protected Route for Dashboard */}
            <Route
              path="/dashboard" element={ <Dashboard />     }
            />
            <Route
              path="/home" element={ <Home />     }
            />
            <Route
              path="/taskDetails/:id" element={ <TaskDetails />     }
            />
            <Route
              path="/addtask" element={ <Addtask />     }
            />
            <Route
              path="/edittask/:taskId" element={ <Edittask />     }
            />

            {/* Catch-all route for undefined paths */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
