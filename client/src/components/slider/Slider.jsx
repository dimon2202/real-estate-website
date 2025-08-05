import { useState, useRef } from "react";

function Slider({ images }) {
  const [imageIndex, setImageIndex] = useState(0);
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -700, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 700, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full h-[66vh] overflow-hidden">
      {/* Стрілка вліво */}
      <button
        onClick={scrollLeft}
        className="absolute left-2 top-1/2 z-100 -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full shadow"
      >
        ←
      </button>

      {/* Стрілка вправо */}
      <button
        onClick={scrollRight}
        className="absolute right-2 top-1/2 z-100 -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full shadow"
      >
        →
      </button>

      {/* Слайдер */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto h-full space-x-[10px] px-0 scrollbar-hide scroll-smooth"
      >
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`photo-${idx}`}
            className="h-full flex-shrink-0 object-cover rounded-xl"
            style={{
              width: "auto",
              maxWidth: "100%",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default Slider;
