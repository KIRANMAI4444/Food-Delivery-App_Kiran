import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import { useAuth } from './context/AuthContext';
import Restaurants from './pages/Restaurants';

function App() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Simple Navigation Bar */}
      <nav className="bg-white shadow-sm p-4 flex gap-4 items-center">
        <Link to="/" className="font-bold text-orange-500 text-xl">FoodApp</Link>
        <div className="ml-auto flex gap-4 items-center">
          <Link to="/" className="text-gray-700 hover:text-orange-500">Home</Link>
          <Link to="/restaurants" className="text-gray-700 hover:text-orange-500">Restaurants</Link>
          {user ? (
            <>
              <span className="text-gray-800 font-medium">Hi, {user.name}</span>
              <button
                onClick = {logout}
                style={{ backgroundColor: '#ef4444', color: 'white', padding: '6px 12px', borderRadius: '4px', border: 'none', 
                  cursor: 'pointer',fontWeight: 'bold' }}
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
          <Route path="/restaurants" element={<Restaurants />} />
        </Routes>
      </main>

    </div>    
 );
}

export default App;
