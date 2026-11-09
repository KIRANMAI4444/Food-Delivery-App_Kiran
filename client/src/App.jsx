import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import { useAuth } from './context/AuthContext';

function App() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Simple Navigation Bar */}
      <nav className="bg-white shadow-sm p-4 flex gap-4 items-center">
        <Link to="/" className="font-bold text-orange-500 text-xl">FoodApp</Link>
        <div className="ml-auto flex gap-4 items-center">
          <Link to="/" className="text-gray-700 hover:text-orange-500">Home</Link>
          {user ? (
            <>
              <span className="text-gray-800 font-medium">Hi, {user.name}</span>
              <button
                onClick = {logout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              > Logout
              </button>
            </>
            ):
            (
              <Link to="/login" className="text-gray-700 hover:text-orange-500">Login</Link>
            )
          }
          
        </div>
      </nav>

      {/* Page Content */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>

    </div>    
 );
}

export default App;
