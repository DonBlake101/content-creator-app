import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png.png';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <img 
                src={logo} 
                alt="Creator Connect Logo" 
                className="w-12 h-12 cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => navigate('/')}
                style={{ mixBlendMode: 'multiply' }}
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 