import './App.css';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Navbar from './components/NavBar';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="font-roboto text-xl">
      <Navbar />
      <main className="h-screen pt-20 bg-black text-white">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/favorites' element={<Favorites />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
