import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../lib/notificationStore";

function Navbar() {
  const [open, setOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const fetch = useNotificationStore((state) => state.fetch);
  const number = useNotificationStore((state) => state.number);

  if (currentUser) fetch();

  return (
    <nav className="bg-white py-4 px-6 md:px-0 lg:px-0 flex items-center justify-between">
      {/* Ліва частина */}
      <div className="flex items-center gap-8">
        <a href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="logo" className="h-10" />
        </a>
        <a href="/about" className="hidden md:block text-gray-700 hover:text-purple-600 transition-colors">
          Про нас
        </a>
        <a href="/contact" className="hidden md:block text-gray-700 hover:text-purple-600 transition-colors">
          Контакти
        </a>
      </div>

      {/* Права частина */}
      <div className="flex items-center gap-6">
        {currentUser ? (
          <div className="flex items-center gap-4">
            <Link to="/profile" className="flex items-center gap-2 group">
              <div className="relative">
                <img 
                  src={currentUser.avatar || "/noavatar.jpg"} 
                  alt="user" 
                  className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-purple-500 transition-all"
                />
                {number > 0 && (
                  <div className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {number}
                  </div>
                )}
              </div>
              <span className="hidden md:inline text-gray-700 group-hover:text-purple-600 transition-colors">
                {currentUser.username}
              </span>
            </Link>
            <Link 
              to="/add"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-colors"
            >
              Додати оголошення
            </Link>
          </div>
        ) : (
          <>
            <Link 
              to="/login" 
              className="hidden md:block text-gray-700 hover:text-purple-600 transition-colors px-3 py-2"
            >
              Увійти
            </Link>
            <Link 
              to="/register" 
              className="hidden md:block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-md"
            >
              Зареєструватись
            </Link>
          </>
        )}

        {/* Мобільне меню */}
        <button 
          onClick={() => setOpen(!open)} 
          className="md:hidden text-gray-700 focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Випадаюче меню для мобільної версії */}
      {open && (
        <div className="md:hidden absolute top-16 right-0 bg-white shadow-lg rounded-lg py-2 px-4 z-50 w-48">
          <Link 
            to="/" 
            className="block py-2 text-gray-700 hover:text-purple-600 transition-colors"
            onClick={() => setOpen(false)}
          >
            Головна
          </Link>
          <Link 
            to="/about" 
            className="block py-2 text-gray-700 hover:text-purple-600 transition-colors"
            onClick={() => setOpen(false)}
          >
            Про нас
          </Link>
          <Link 
            to="/contact" 
            className="block py-2 text-gray-700 hover:text-purple-600 transition-colors"
            onClick={() => setOpen(false)}
          >
            Контакти
          </Link>
          {currentUser ? (
            <Link 
              to="/profile" 
              className="block py-2 text-gray-700 hover:text-purple-600 transition-colors"
              onClick={() => setOpen(false)}
            >
              Профіль
            </Link>
          ) : (
            <>
              <Link 
                to="/login" 
                className="block py-2 text-gray-700 hover:text-purple-600 transition-colors"
                onClick={() => setOpen(false)}
              >
                Увійти
              </Link>
              <Link 
                to="/register" 
                className="block py-2 text-purple-600 font-medium"
                onClick={() => setOpen(false)}
              >
                Зареєструватись
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;