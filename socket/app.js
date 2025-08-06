import { Server } from "socket.io"

const io = new Server({
  cors: {
    origin: "https://real-estate-website-client-rob5.onrender.com",
  },
})

let onlineUser = []

const addUser = (userId, socketId) => {
  const userExists = onlineUser.find((user) => user.userId === userId)
  if (!userExists) {
    onlineUser.push({ userId, socketId })
  }
}

const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId)
}

const getUser = (userId) => {
  return onlineUser.find((user) => user.userId === userId)
}

io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  socket.on("newUser", (userId) => {
    addUser(userId, socket.id)
    console.log("Online users:", onlineUser.length)
  })

  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId)
    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", data)
    }
  })

  socket.on("disconnect", () => {
    removeUser(socket.id)
    console.log("User disconnected:", socket.id)
    console.log("Online users:", onlineUser.length)
  })
})

io.listen("4000", () => {
  console.log("Socket.io server running on port 4000")
})