import { Link } from 'react-router-dom';

const BrandNavbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-black">Content Creator</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/brand-dashboard" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-black">
                Dashboard
              </Link>
              <Link to="/find-creators" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-black">
                Find Creators
              </Link>
              <Link to="/campaigns" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-black">
                Campaigns
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <button className="flex items-center space-x-2 text-gray-900 hover:text-black">
              <img
                className="h-8 w-8 rounded-full"
                src="https://ui-avatars.com/api/?name=Brand&background=000000&color=fff"
                alt="Brand Profile"
              />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default BrandNavbar; 