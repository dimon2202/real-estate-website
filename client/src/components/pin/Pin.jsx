import { Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";

const customIcon = new L.Icon({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function Pin({ item }) {
  return (
    <Marker position={[item.latitude, item.longitude]} icon={customIcon}>
      <Popup className="rounded-lg shadow-md border-none min-w-[200px]">
        <div className="flex gap-3 p-2">
          {/* Зображення */}
          <div className="w-16 h-16 flex-shrink-0">
            <img
              src={item.images[0]}
              alt={item.title}
              className="w-full h-full object-cover rounded"
            />
          </div>

          {/* Текстовий блок */}
          <div className="flex flex-col justify-center">
            {/* Назва */}
            <Link
              to={`/${item.id}`}
              className="text-sm font-medium text-gray-900 hover:text-purple-600 line-clamp-1"
            >
              {item.title}
            </Link>

            {/* Характеристики */}
            <div className="text-xs text-gray-500 mt-1">
              <span>{item.bedroom} кім.</span>
              {item.size && <span> · {item.size} м²</span>}
            </div>

            {/* Ціна */}
            <div className="text-sm font-bold text-pink-600 mt-1">
              {new Intl.NumberFormat("uk-UA", {
                style: "currency",
                currency: "UAH",
                maximumFractionDigits: 0,
              }).format(item.price)}
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default Pin;
