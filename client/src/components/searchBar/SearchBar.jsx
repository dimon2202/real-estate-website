import { useState } from "react";
import { Link } from "react-router-dom";

const types = ["buy", "rent"];

function SearchBar() {
  const [query, setQuery] = useState({
    type: "buy",
    city: "",
    minPrice: "",
    maxPrice: "",
  });

  const switchType = (val) => {
    setQuery((prev) => ({ ...prev, type: val }));
  };

  const handleChange = (e) => {
    setQuery((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="flex flex-col gap-4 bg-white">
      {/* Type Selector */}
      <div className="flex h-12 text-lg bg-gradient-to-r from-purple-600 to-pink-600 border-gray-200 border border-gray-200 rounded-xl overflow-hidden">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => switchType(type)}
            className={`flex-1 px-6 font-medium text-center transition-colors ${
              query.type === type
                ? "text-white"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {type === "buy" ? "Купити" : "Орендувати"}
          </button>
        ))}
      </div>

      {/* Search Form */}
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <input
              type="text"
              name="city"
              placeholder="Місто"
              onChange={handleChange}
              className="w-full h-12 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none"
            />
          </div>
          <input
            type="number"
            name="minPrice"
            min={0}
            max={10000000}
            placeholder="Мін. ціна"
            onChange={handleChange}
            className="h-12 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none"
          />
          <input
            type="number"
            name="maxPrice"
            min={0}
            max={10000000}
            placeholder="Макс. ціна"
            onChange={handleChange}
            className="h-12 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none"
          />
        </div>
        <div className="">
          <Link
            to={`/list?type=${query.type}&city=${query.city}&minPrice=${query.minPrice}&maxPrice=${query.maxPrice}`}
            className="flex items-center justify-center"
          >
            <button className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg px-6 rounded-xl font-medium transition-all transform hover:scale-[1.02] shadow-md">
              <span className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Знайти нерухомість
              </span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
