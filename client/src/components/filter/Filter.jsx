import { useState } from "react";
import { useSearchParams } from "react-router-dom";

function Filter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState({
    type: searchParams.get("type") || "",
    city: searchParams.get("city") || "",
    property: searchParams.get("property") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    bedroom: searchParams.get("bedroom") || "",
  });

  const handleChange = (e) => {
    setQuery({
      ...query,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilter = () => {
    setSearchParams(query);
  };

  return (
    <div className="bg-white mb-5 px-1">
      {/* Перший ряд - Тип, Нерухомість та Локація */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
        {/* Тип */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Тип
          </label>
          <select
            name="type"
            id="type"
            onChange={handleChange}
            defaultValue={query.type}
            className="w-full h-10 px-2 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none"
          >
            <option value="">Будь-який</option>
            <option value="buy">Купити</option>
            <option value="rent">Орендувати</option>
          </select>
        </div>

        {/* Нерухомість */}
        <div>
          <label htmlFor="property" className="block text-sm font-medium text-gray-700 mb-1">
            Нерухомість
          </label>
          <select
            name="property"
            id="property"
            onChange={handleChange}
            defaultValue={query.property}
            className="w-full h-10 px-2 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Будь-яка</option>
            <option value="apartment">Квартира</option>
            <option value="house">Будинок</option>
            <option value="room">Кімната</option>
            <option value="land">Земля</option>
          </select>
        </div>

        {/* Локація */}
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            Локація
          </label>
          <input
            type="text"
            id="city"
            name="city"
            placeholder="Місто"
            onChange={handleChange}
            defaultValue={query.city}
            className="w-full h-10 px-2 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none"
          />
        </div>
      </div>

      {/* Другий ряд - Ціна та Кімнати */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Мін ціна */}
        <div>
          <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">
            Мін. ціна
          </label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            placeholder="Будь-яка"
            onChange={handleChange}
            defaultValue={query.minPrice}
            className="w-full h-10 px-2 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none"
          />
        </div>

        {/* Макс ціна */}
        <div>
          <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
            Макс. ціна
          </label>
          <input
            type="number"
            id="maxPrice"
            name="maxPrice"
            placeholder="Будь-яка"
            onChange={handleChange}
            defaultValue={query.maxPrice}
            className="w-full h-10 px-2 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none"
          />
        </div>

        {/* Кількість кімнат */}
        <div>
          <label htmlFor="bedroom" className="block text-sm font-medium text-gray-700 mb-1">
            Кімнат
          </label>
          <input
            type="number"
            id="bedroom"
            name="bedroom"
            placeholder="Будь-яка"
            onChange={handleChange}
            defaultValue={query.bedroom}
            className="w-full h-10 px-2 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none"
          />
        </div>

        {/* Кнопка пошуку */}
        <div className="flex items-end">
          <button
            onClick={handleFilter}
            className="w-full h-13 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 rounded-xl font-medium transition-all transform hover:scale-[1.02] shadow-md flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Пошук
          </button>
        </div>
      </div>
    </div>
  );
}

export default Filter;