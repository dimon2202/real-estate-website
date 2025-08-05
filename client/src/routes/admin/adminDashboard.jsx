"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import apiRequest from "../../lib/apiRequest"

function AdminDashboard() {
  const [data, setData] = useState({ users: [], posts: [] })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("sales")
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" })
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await apiRequest.get("/admin/data")
      setData(res.data)
    } catch (err) {
      console.error(err)
      if (err.response?.status === 401) {
        navigate("/admin")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await apiRequest.post("/admin/logout")
      navigate("/admin")
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeletePost = async (id) => {
    if (window.confirm("Ви впевнені, що хочете видалити цю нерухомість?")) {
      try {
        await apiRequest.delete(`/admin/posts/${id}`)
        setData((prev) => ({
          ...prev,
          posts: prev.posts.filter((post) => post.id !== id),
        }))
      } catch (err) {
        console.error(err)
        alert("Не вдалося видалити нерухомість")
      }
    }
  }

  const handleDeleteUser = async (id) => {
    if (window.confirm("Ви впевнені, що хочете видалити цього користувача? Це також видалить всю його нерухомість.")) {
      try {
        await apiRequest.delete(`/admin/users/${id}`)
        setData((prev) => ({
          users: prev.users.filter((user) => user.id !== id),
          posts: prev.posts.filter((post) => post.userId !== id),
        }))
      } catch (err) {
        console.error(err)
        alert("Не вдалося видалити користувача")
      }
    }
  }

  const handleSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  // Filter posts by type
  const salesPosts = data.posts.filter((post) => post.type === "buy")
  const rentalPosts = data.posts.filter((post) => post.type === "rent")

  const getCurrentPosts = () => {
    if (activeTab === "sales") return salesPosts
    if (activeTab === "rental") return rentalPosts
    return []
  }

  const sortedPosts = [...getCurrentPosts()].sort((a, b) => {
    if (!sortConfig.key) return 0

    let aValue = a[sortConfig.key]
    let bValue = b[sortConfig.key]

    if (sortConfig.key === "user.username") {
      aValue = a.user.username
      bValue = b.user.username
    }

    if (aValue < bValue) {
      return sortConfig.direction === "asc" ? -1 : 1
    }
    if (aValue > bValue) {
      return sortConfig.direction === "asc" ? 1 : -1
    }
    return 0
  })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("uk-UA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("uk-UA", {
      style: "currency",
      currency: "UAH",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getPropertyTypeLabel = (property) => {
    const labels = {
      apartment: "Квартира",
      house: "Будинок",
      room: "Кімната",
      land: "Земля",
    }
    return labels[property] || property
  }

  // Analytics calculations
  const getPropertiesByType = (posts) => {
    const counts = posts.reduce((acc, post) => {
      acc[post.property] = (acc[post.property] || 0) + 1
      return acc
    }, {})
    return Object.entries(counts).map(([key, value]) => ({
      label: getPropertyTypeLabel(key),
      value,
      percentage: posts.length > 0 ? ((value / posts.length) * 100).toFixed(1) : 0,
    }))
  }

  const getPropertiesByCity = (posts) => {
    const counts = posts.reduce((acc, post) => {
      acc[post.city] = (acc[post.city] || 0) + 1
      return acc
    }, {})
    return Object.entries(counts)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }

  const getPriceRanges = (posts) => {
    const ranges = [
      { label: "До 50,000", min: 0, max: 50000 },
      { label: "50,000-100,000", min: 50000, max: 100000 },
      { label: "100,000-200,000", min: 100000, max: 200000 },
      { label: "200,000-500,000", min: 200000, max: 500000 },
      { label: "Понад 500,000", min: 500000, max: Number.POSITIVE_INFINITY },
    ]

    return ranges.map((range) => ({
      ...range,
      count: posts.filter((post) => post.price >= range.min && post.price < range.max).length,
    }))
  }

  const getMonthlyStats = (posts) => {
    const monthlyData = posts.reduce((acc, post) => {
      const month = new Date(post.createdAt).toLocaleDateString("uk-UA", { month: "short" })
      acc[month] = (acc[month] || 0) + 1
      return acc
    }, {})
    return Object.entries(monthlyData).map(([month, count]) => ({ month, count }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Завантаження...</div>
      </div>
    )
  }

  const currentPosts = getCurrentPosts()
  const propertiesByType = getPropertiesByType(currentPosts)
  const propertiesByCity = getPropertiesByCity(currentPosts)
  const priceRanges = getPriceRanges(currentPosts)
  const monthlyStats = getMonthlyStats(currentPosts)
  const maxCityCount = Math.max(...propertiesByCity.map((item) => item.count), 1)
  const maxPriceCount = Math.max(...priceRanges.map((item) => item.count), 1)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Панель адміністратора</h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Вийти
            </button>
          </div>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">П</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Продаж</dt>
                    <dd className="text-lg font-medium text-gray-900">{salesPosts.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">О</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Оренда</dt>
                    <dd className="text-lg font-medium text-gray-900">{rentalPosts.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">К</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Користувачі</dt>
                    <dd className="text-lg font-medium text-gray-900">{data.users.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Analytics for current tab */}
        {activeTab !== "users" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {/* Properties by Type - Pie Chart */}
            <div className="bg-white overflow-hidden shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {activeTab === "sales" ? "Продаж" : "Оренда"} за типом
              </h3>
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                    {propertiesByType.map((item, index) => {
                      const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"]
                      const strokeDasharray = `${item.percentage} ${100 - item.percentage}`
                      const strokeDashoffset = propertiesByType
                        .slice(0, index)
                        .reduce((acc, prev) => acc - prev.percentage, 25)

                      return (
                        <circle
                          key={item.label}
                          cx="18"
                          cy="18"
                          r="15.915"
                          fill="transparent"
                          stroke={colors[index]}
                          strokeWidth="3"
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                        />
                      )
                    })}
                  </svg>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {propertiesByType.map((item, index) => {
                  const colors = ["bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-red-500"]
                  return (
                    <div key={item.label} className="flex items-center text-sm">
                      <div className={`w-3 h-3 rounded-full ${colors[index]} mr-2`}></div>
                      <span>
                        {item.label}: {item.value}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Properties by City - Bar Chart */}
            <div className="bg-white overflow-hidden shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Топ міста</h3>
              <div className="space-y-3">
                {propertiesByCity.map((item) => (
                  <div key={item.city} className="flex items-center">
                    <div className="w-20 text-sm text-gray-600 truncate">{item.city}</div>
                    <div className="flex-1 mx-3">
                      <div className="bg-gray-200 rounded-full h-4">
                        <div
                          className="bg-blue-500 h-4 rounded-full"
                          style={{ width: `${(item.count / maxCityCount) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-8 text-sm font-medium text-gray-900">{item.count}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Ranges */}
            <div className="bg-white overflow-hidden shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Ціновий діапазон</h3>
              <div className="space-y-3">
                {priceRanges.map((range) => (
                  <div key={range.label} className="flex items-center">
                    <div className="w-24 text-xs text-gray-600">{range.label}</div>
                    <div className="flex-1 mx-3">
                      <div className="bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-green-500 h-3 rounded-full"
                          style={{ width: `${(range.count / maxPriceCount) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-6 text-sm font-medium text-gray-900">{range.count}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Activity */}
            <div className="bg-white overflow-hidden shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Активність за місяцями</h3>
              <div className="flex items-end justify-between h-24 space-x-1">
                {monthlyStats.map((item) => {
                  const maxMonthly = Math.max(...monthlyStats.map((m) => m.count), 1)
                  const height = (item.count / maxMonthly) * 100
                  return (
                    <div key={item.month} className="flex flex-col items-center">
                      <div className="bg-purple-500 rounded-t w-6" style={{ height: `${height}%` }}></div>
                      <div className="text-xs text-gray-600 mt-1">{item.month}</div>
                      <div className="text-xs font-medium">{item.count}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab("sales")}
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === "sales"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Продаж ({salesPosts.length})
              </button>
              <button
                onClick={() => setActiveTab("rental")}
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === "rental"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Оренда ({rentalPosts.length})
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === "users"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Користувачі ({data.users.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {(activeTab === "sales" || activeTab === "rental") && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        onClick={() => handleSort("title")}
                        className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        Назва {sortConfig.key === "title" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </th>
                      <th
                        onClick={() => handleSort("price")}
                        className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        Ціна {sortConfig.key === "price" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </th>
                      <th
                        onClick={() => handleSort("city")}
                        className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        Місто {sortConfig.key === "city" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </th>
                      <th
                        onClick={() => handleSort("property")}
                        className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        Тип нерухомості {sortConfig.key === "property" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </th>
                      <th
                        onClick={() => handleSort("user.username")}
                        className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        Власник {sortConfig.key === "user.username" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </th>
                      <th
                        onClick={() => handleSort("createdAt")}
                        className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        Створено {sortConfig.key === "createdAt" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Дії
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="flex items-center">
                            {post.images[0] && (
                              <img
                                className="h-8 w-8 rounded object-cover mr-2"
                                src={post.images[0] || "/placeholder.svg"}
                                alt=""
                              />
                            )}
                            <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{post.title}</div>
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{formatPrice(post.price)}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{post.city}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                          {getPropertyTypeLabel(post.property)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{post.user.username}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(post.createdAt)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium space-x-2">
                          <Link to={`/${post.id}`} className="text-indigo-600 hover:text-indigo-900" target="_blank">
                            Переглянути
                          </Link>
                          <button onClick={() => handleDeletePost(post.id)} className="text-red-600 hover:text-red-900">
                            Видалити
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "users" && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Користувач
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Нерухомість
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Приєднався
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Дії
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {user.avatar ? (
                                <img
                                  className="h-10 w-10 rounded-full"
                                  src={user.avatar || "/placeholder.svg"}
                                  alt=""
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                  <span className="text-sm font-medium text-gray-700">
                                    {user.username.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user._count.posts}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900">
                            Видалити
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
