import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';

function App() {
 return (
    <div className="min-h-screen bg-gray-50">

      {/* Simple Navigation Bar */}
      <nav className="bg-white shadow-sm p-4 flex gap-4">
        <Link to="/" className="font-bold text-orange-500 text-xl">FoodApp</Link>
        <div className="ml-auto flex gap-4">
          <Link to="/" className="text-gray-700 hover:text-orange-500">Home</Link>
          <Link to="/login" className="text-gray-700 hover:text-orange-500">Login</Link>
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
