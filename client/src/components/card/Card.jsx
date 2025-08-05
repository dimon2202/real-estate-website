import { Link } from "react-router-dom";
import { useNavigate, useLoaderData } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";

const repairTranslations = {
  cosmetic: "Косметичний",
  capital: "Капітальний",
  none: "Без ремонту",
  reconstruction: "Реконструкція",
};

function Card({ item }) {
  // const post = useLoaderData();
  // const [saved, setSaved] = useState(post.isSaved);
  // const { currentUser } = useContext(AuthContext);
  // const navigate = useNavigate();

  // const handleSave = async () => {
  //   if (!currentUser) {
  //     navigate("/login");
  //   }
  //   setSaved((prev) => !prev);
  //   try {
  //     await apiRequest.post("/users/save", { postId: post.id });
  //   } catch (err) {
  //     console.log(err);
  //     setSaved((prev) => !prev);
  //   }
  // };

  return (
    <div className="flex flex-col md:flex-row gap-3 bg-white rounded-xl overflow-hidden transition-shadow">
      {/* Фото з іконкою "Сподобалось" */}
      <div className="relative md:w-1/3 h-48 md:h-auto">
        <Link to={`/${item.id}`} className="block h-full">
          <img
            src={item.images[0]}
            alt={item.title}
            className="w-full h-full max-h-50 object-cover"
          />
        </Link>

        {/* <button
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
          onClick={handleSave}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${saved ? "text-red-500 fill-red-500" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button> */}
      </div>

      {/* Інформація про нерухомість */}
      <div className="flex-1 p-0 md:px-2">
        <div className="mb-2">
          <p className="text-2xl font-bold text-purple-800">{item.price.toLocaleString("uk-UA")} грн</p>
          <Link to={`/${item.id}`}>
            <h2 className="text-lg font-bold text-gray-800 transition-colors">
              {item.title}
            </h2>
          </Link>
          <div className="flex items-center text-gray-600 mt-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm">{item.address}</span>
          </div>
        </div>

        {/* Характеристики нерухомості */}
        <div className="grid grid-cols-2 gap-1">
          {/* Кімнати */}
          <div className="flex items-center gap-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.3335 9.99935C18.3335 9.08268 17.5835 8.33268 16.6668 8.33268V5.83268C16.6668 4.91602 15.9168 4.16602 15.0001 4.16602H5.00014C4.08348 4.16602 3.33348 4.91602 3.33348 5.83268V8.33268C2.41681 8.33268 1.66681 9.08268 1.66681 9.99935V14.166H2.77514L3.33348 15.8327H4.16681L4.72514 14.166H15.2835L15.8335 15.8327H16.6668L17.2251 14.166H18.3335V9.99935ZM15.0001 8.33268H10.8335V5.83268H15.0001V8.33268ZM5.00014 5.83268H9.16681V8.33268H5.00014V5.83268ZM3.33348 9.99935H16.6668V12.4993H3.33348V9.99935Z"
                fill="currentColor"
              />
            </svg>
            <div>
              <div className="font-medium">{item.bedroom} кімнат</div>
            </div>
          </div>

          {/* Ванних кімнат */}
          <div className="flex items-center gap-2">
            <svg
              width="20px"
              height="20px"
              viewBox="0 0 24.00 24.00"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
            >
              <path
                stroke="#000000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12h1m16 0v0a1 1 0 0 0 1-1V7c0-1-.6-3-3-3s-3 2-3 3m5 5v2c0 1.138-.583 3.248-2.745 3.841M20 12H4m0 0v2c0 1.138.583 3.248 2.745 3.841M6 20l.745-2.159m0 0c.37.102.787.159 1.255.159h8a4.71 4.71 0 0 0 1.255-.159M18 20l-.745-2.159M15 7h-2m2 0h2"
              />
            </svg>
            <div>
              <div className="font-medium">{item.bathroom} ванних кімнат</div>
            </div>
          </div>

          {/* Площа */}
          <div className="flex items-center gap-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.50012 4.16667V7.5H4.16679V4.16667H7.50012V2.5H4.16679C3.25012 2.5 2.50012 3.25 2.50012 4.16667ZM4.16679 12.5H2.50012V15.8333C2.50012 16.75 3.25012 17.5 4.16679 17.5H7.50012V15.8333H4.16679V12.5ZM15.8335 15.8333H12.5001V17.5H15.8335C16.7501 17.5 17.5001 16.75 17.5001 15.8333V12.5H15.8335V15.8333ZM15.8335 2.5H12.5001V4.16667H15.8335V7.5H17.5001V4.16667C17.5001 3.25 16.7501 2.5 15.8335 2.5Z"
                fill="currentColor"
              />
            </svg>
            <div>
              <div className="font-medium">{item.size} м²</div>
            </div>
          </div>

          {/* Поверх */}
          <div className="flex items-center gap-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.8335 4.16667V15.8333H4.16679V4.16667H15.8335ZM15.8335 2.5H4.16679C3.25012 2.5 2.50012 3.25 2.50012 4.16667V15.8333C2.50012 16.75 3.25012 17.5 4.16679 17.5H15.8335C16.7501 17.5 17.5001 16.75 17.5001 15.8333V4.16667C17.5001 3.25 16.7501 2.5 15.8335 2.5ZM15.0001 5H11.3168V7.775H9.16679V10.55H7.01679V13.3333H5.00012V15H8.68346V12.225H10.8335V9.45H12.9835V6.66667H15.0001V5Z"
                fill="currentColor"
              />
            </svg>
            <div>
              <div className="font-medium">
                {item.floor} поверх з {item.totalFloors}
              </div>
            </div>
          </div>

          {/* Ремонт */}
          <div className="flex items-center gap-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.5365 5.15L17.6365 4.45C17.5365 4.35 17.3365 4.25 17.1365 4.25H16.5365V3.85C16.5365 3.65 16.4365 3.45 16.3365 3.35L15.4365 2.45C15.3365 2.35 15.1365 2.25 14.9365 2.25H2.93648C2.73648 2.25 2.53648 2.35 2.43648 2.45L1.53648 3.35C1.33648 3.45 1.23648 3.65 1.23648 3.85V6.15C1.23648 6.35 1.33648 6.55 1.43648 6.65L2.33648 7.55C2.53648 7.85 2.73648 7.95 2.93648 7.95H14.8365C15.0365 7.95 15.2365 7.85 15.3365 7.75L16.2365 6.85C16.3365 6.75 16.4365 6.55 16.4365 6.35V5.75H16.8365L17.2365 6.05V8.65L16.7365 9.15H10.7365C10.5365 9.15 10.3365 9.25 10.2365 9.35L9.23648 10.35C9.13648 10.45 9.03648 10.65 9.03648 10.85V11.05H8.93648C8.53648 11.05 8.13648 11.35 8.13648 11.85V16.95C8.13648 17.35 8.43648 17.75 8.93648 17.75H10.7365C11.1365 17.75 11.5365 17.45 11.5365 16.95V11.85C11.5365 11.45 11.2365 11.05 10.7365 11.05L11.0365 10.75H17.1365C17.3365 10.75 17.5365 10.65 17.6365 10.55L18.5365 9.65C18.6365 9.55 18.7365 9.35 18.7365 9.15V5.75C18.8365 5.55 18.6365 5.25 18.5365 5.15ZM15.0365 5.95L14.5365 6.45H3.23648L2.83648 5.95V4.15L3.33648 3.65H14.6365L15.0365 4.15V5.95ZM9.93648 16.25H9.63648V12.65H9.93648V16.25Z"
                fill="currentColor"
              />
            </svg>
            <div>
              <div className="font-medium capitalize">
                {repairTranslations[item.repair]}
              </div>
            </div>
          </div>

          {/* Рік будівництва */}
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M15.8335 2.49967h-.8334V.833008h-1.6666V2.49967H6.66679V.833008H5.00012V2.49967h-.83333c-.91667 0-1.66667.75-1.66667 1.66667V15.833c0 .9167.75 1.6667 1.66667 1.6667H15.8335c.9166 0 1.6666-.75 1.6666-1.6667V4.16634c0-.91667-.75-1.66667-1.6666-1.66667Zm0 13.33333H4.16679V7.49967H15.8335V15.833ZM4.16679 5.83301V4.16634H15.8335v1.66667H4.16679Zm4.63333 8.71669 4.94168-4.94169-.8833-.88334L8.80012 12.783l-1.75833-1.7583-.88333.8833 2.64166 2.6417Z" />
            </svg>
            <div>
              <div className="font-medium">
                {item.yearBuilt} рік будівництва
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
