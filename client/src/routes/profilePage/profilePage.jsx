"use client"

import Chat from "../../components/chat/Chat"
import List from "../../components/list/List"
import apiRequest from "../../lib/apiRequest"
import { Await, Link, useLoaderData, useNavigate, useSearchParams } from "react-router-dom"
import { Suspense, useContext } from "react"
import { AuthContext } from "../../context/AuthContext"

function ProfilePage() {
  const data = useLoaderData()
  const { updateUser, currentUser } = useContext(AuthContext)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const chatId = searchParams.get("chatId")

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout")
      updateUser(null)
      navigate("/")
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Ліва колонка - Профіль та списки */}
      <div className="flex-1 space-y-6 h-full pr-2 overflow-auto">
        {/* Блок профілю */}
        <div className="">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Особистий кабінет</h1>
            <div className="flex gap-2">
              <Link
                to="/profile/update"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-colors"
              >
                Редагувати профіль
              </Link>
              <button
                onClick={handleLogout}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Вийти
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-purple-100">
              <img
                src={currentUser.avatar || "/noavatar.jpg"}
                alt={currentUser.username}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <div className="text-lg font-semibold text-gray-800">
                <span className="text-gray-500">Ім'я: </span>
                {currentUser.username}
              </div>
              <div className="text-lg font-semibold text-gray-800">
                <span className="text-gray-500">Email: </span>
                {currentUser.email}
              </div>
            </div>
          </div>
        </div>

        {/* Мої оголошення */}
        <div className="bg-white">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Мої оголошення</h2>
            <Link
              to="/add"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-colors"
            >
              Додати оголошення
            </Link>
          </div>
          <Suspense
            fallback={
              <div className="flex justify-center py-8">
                <p className="text-gray-500">Завантаження...</p>
              </div>
            }
          >
            <Await
              resolve={data.postResponse}
              errorElement={<div className="text-red-500 p-4">Помилка завантаження оголошень</div>}
            >
              {(postResponse) => <List posts={postResponse.data.userPosts} />}
            </Await>
          </Suspense>
        </div>

        {/* Збережені оголошення */}
        <div className="bg-white">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Збережені оголошення</h2>
          <Suspense
            fallback={
              <div className="flex justify-center py-8">
                <p className="text-gray-500">Завантаження...</p>
              </div>
            }
          >
            <Await
              resolve={data.postResponse}
              errorElement={<div className="text-red-500 p-4">Помилка завантаження збережених оголошень</div>}
            >
              {(postResponse) => <List posts={postResponse.data.savedPosts} />}
            </Await>
          </Suspense>
        </div>
      </div>

      {/* Права колонка - Чати */}
      <div className="lg:w-96 h-full">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Повідомлення</h2>
        <Suspense
          fallback={
            <div className="flex justify-center py-8">
              <p className="text-gray-500">Завантаження чатів...</p>
            </div>
          }
        >
          <Await
            resolve={data.chatResponse}
            errorElement={<div className="text-red-500 p-4">Помилка завантаження чатів</div>}
          >
            {(chatResponse) => <Chat chats={chatResponse.data} initialChatId={chatId} />}
          </Await>
        </Suspense>
      </div>
    </div>
  )
}

export default ProfilePage
