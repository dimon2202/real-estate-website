import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useNavigate } from "react-router-dom";

function NewPostPage() {
  const [value, setValue] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    try {
      const res = await apiRequest.post("/posts", {
        postData: {
          title: inputs.title,
          price: parseInt(inputs.price),
          address: inputs.address,
          city: inputs.city,
          bedroom: parseInt(inputs.bedroom),
          bathroom: parseInt(inputs.bathroom),
          size: parseInt(inputs.size),
          type: inputs.type,
          repair: inputs.repair,
          floor: parseInt(inputs.floor),
          totalFloors: parseInt(inputs.totalFloors),
          yearBuilt: parseInt(inputs.yearBuilt),
          property: inputs.property,
          latitude: coordinates.lat || inputs.latitude,
          longitude: coordinates.lng || inputs.longitude,
          images: images,
        },
        postDetail: {
          desc: value,
          utilities: inputs.utilities,
          pet: inputs.pet,
          income: inputs.income,
          school: parseInt(inputs.school),
          bus: parseInt(inputs.bus),
          restaurant: parseInt(inputs.restaurant),
        },
      });
      navigate("/" + res.data.id);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Помилка при додаванні");
    }
  };

  const handleAddressChange = (e) => {
    // Тут буде логіка геокодування адреси
    // Приклад: виклик API геокодування та встановлення координат
    // setCoordinates({ lat: ..., lng: ... });
  };

  return (
    <div className="flex min-h-screen mb-4">
      {/* Ліва частина - Форма */}
      <div className="w-full lg:w-1/2 pr-0 lg:pr-4">
        <div className="bg-white h-full overflow-y-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Додати нову нерухомість
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="px-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Основна інформація */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Заголовок
                </label>
                <input
                  name="title"
                  type="text"
                  required
                  className="w-full h-12 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ціна
                </label>
                <input
                  name="price"
                  type="number"
                  required
                  className="w-full h-12 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Тип
                </label>
                <select
                  name="type"
                  className="w-full h-12 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="rent">Оренда</option>
                  <option value="buy">Продаж</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Нерухомість
                </label>
                <select
                  name="property"
                  className="w-full h-12 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="apartment">Квартира</option>
                  <option value="house">Будинок</option>
                  <option value="room">Кімната</option>
                  <option value="land">Земля</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ремонт
                </label>
                <select
                  name="repair"
                  className="w-full h-12 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="cosmetic">Косметичний</option>
                  <option value="capital">Капітальний</option>
                  <option value="none">Без ремонту</option>
                  <option value="reconstruction">Реконструкція</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Поверх
                </label>
                <input
                  name="floor"
                  type="number"
                  className="w-full h-12 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Поверховість
                </label>
                <input
                  name="totalFloors"
                  type="number"
                  className="w-full h-12 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Рік будівництва
                </label>
                <input
                  name="yearBuilt"
                  type="number"
                  className="w-full h-12 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Кількість кімнат
                </label>
                <input
                  name="bedroom"
                  type="number"
                  min={1}
                  className="w-full h-12 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Кількість ванних
                </label>
                <input
                  name="bathroom"
                  type="number"
                  min={1}
                  className="w-full h-12 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Площа (м²)
                </label>
                <input
                  name="size"
                  type="number"
                  min={0}
                  className="w-full h-12 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Адреса */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Адреса
                </label>
                <input
                  name="address"
                  type="text"
                  required
                  onChange={handleAddressChange}
                  className="w-full h-12 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="latitude"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Широта
                </label>
                <input
                  id="latitude"
                  name="latitude"
                  type="text"
                  className="w-full h-12 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="item">
                <label
                  htmlFor="longitude"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Довгота
                </label>
                <input
                  id="longitude"
                  name="longitude"
                  type="text"
                  className="w-full h-12 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Місто
                </label>
                <input
                  name="city"
                  type="text"
                  required
                  className="w-full h-12 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Додаткові поля */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Комунальні послуги
                </label>
                <select
                  name="utilities"
                  className="w-full h-12 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="owner">Власник</option>
                  <option value="tenant">Орендар</option>
                  <option value="shared">Спільно</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Тварини
                </label>
                <select
                  name="pet"
                  className="w-full h-12 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="allowed">Дозволено</option>
                  <option value="not-allowed">Заборонено</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Дохід
                </label>
                <input
                  name="income"
                  type="text"
                  className="w-full h-12 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="flex col-span-2 gap-4">
                <div className="item">
                  <label
                    htmlFor="school"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Відстань до школи
                  </label>
                  <input
                    min={0}
                    id="school"
                    name="school"
                    type="number"
                    className="w-full h-12 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="item">
                  <label
                    htmlFor="bus"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Відстань до зупинки
                  </label>
                  <input
                    min={0}
                    id="bus"
                    name="bus"
                    type="number"
                    className="w-full h-12 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="item">
                  <label
                    htmlFor="restaurant"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Відстань до супермаркету
                  </label>
                  <input
                    min={0}
                    id="restaurant"
                    name="restaurant"
                    type="number"
                    className="w-full h-12 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Опис */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Опис
                </label>
                <ReactQuill
                  theme="snow"
                  value={value}
                  onChange={setValue}
                  className="rounded-xl border-gray-300 focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Кнопка відправки */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg px-6 rounded-xl font-medium transition-all transform shadow-md"
              >
                Додати нерухомість
              </button>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Права частина - Фото та карта */}
      <div className="hidden lg:flex lg:w-1/2 pl-4 flex-col space-y-4">
        {/* Блок з фото */}
        <div className="bg-white flex-1">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Фотографії
          </h2>

          {images.length > 0 ? (
            <div className="grid grid-cols-3 gap-2 mb-4 max-h-90 overflow-y-auto">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={image}
                    alt={`Фото ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-90 bg-gray-100 rounded-lg mb-4">
              <p className="text-gray-500">Немає доданих фото</p>
            </div>
          )}

          <UploadWidget
            uwConfig={{
              multiple: true,
              cloudName: "dchiumkjz",
              uploadPreset: "z5ytvsf9",
              folder: "posts",
              maxImageFileSize: 2000000,
            }}
            setState={setImages}
          >
            <button
              type="button"
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 rounded-xl font-medium transition-all transform hover:scale-[1.02] shadow-md mt-4"
            >
              Додати фото
            </button>
          </UploadWidget>
        </div>

        {/* Блок з картою */}
        <div className="bg-white flex-1">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Розташування
          </h2>
          <div className="h-full bg-gray-100 rounded-lg flex items-center justify-center">
            {/* Тут буде компонент карти */}
            <p className="text-gray-500">Карта буде відображатися тут</p>
            {/* Приклад: <Map coordinates={coordinates} className="h-full w-full" /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewPostPage;
