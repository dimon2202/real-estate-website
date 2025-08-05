import { useContext } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import { AuthContext } from "../../context/AuthContext";

function HomePage() {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center text-center">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-gray-900">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Знайдіть свою ідеальну
            </span>
            <br />
            нерухомість вже сьогодні
          </h1>
          
          {/* Subheading */}
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-10">
            Найбільший вибір житла за найкращими цінами. Більше 2000+ об'єктів по всій Україні для купівлі чи оренди.
          </p>
          
          {/* Search Bar */}
          <div className="w-full max-w-4xl mb-8">
            <SearchBar />
          </div>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-purple-600">50+</h1>
              <h2 className="text-gray-600">Міст України</h2>
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-bold text-pink-600">24/7</h1>
              <h2 className="text-gray-600">Підтримка клієнтів</h2>
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-bold text-indigo-600">2000+</h1>
              <h2 className="text-gray-600">Активних оголошень</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;