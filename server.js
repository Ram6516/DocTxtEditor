const express = require("express")
const http = require("http")
const socketIo = require("socket.io")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const cors = require("cors")

const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

app.use(cors())
app.use(express.json())

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/collaborative-docs", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// User Schema
const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    color: String,
  },
  { timestamps: true },
)

const User = mongoose.model("User", UserSchema)

// Document Schema
const DocumentSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
)

const Document = mongoose.model("Document", DocumentSchema)

// Socket.IO middleware for authentication
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token
    if (!token) {
      return next(new Error("Authentication error"))
    }

    const decoded = jwt.verify(token, "your-secret-key")
    const user = await User.findById(decoded.userId)

    if (!user) {
      return next(new Error("User not found"))
    }

    socket.userId = user._id.toString()
    socket.user = user
    next()
  } catch (error) {
    next(new Error("Authentication error"))
  }
})

const activeUsers = new Map()
const documentUsers = new Map()

io.on("connection", (socket) => {
  console.log("User connected:", socket.user.name)

  activeUsers.set(socket.userId, {
    socketId: socket.id,
    user: socket.user,
  })

  socket.on("join-document", (documentId) => {
    socket.join(documentId)

    if (!documentUsers.has(documentId)) {
      documentUsers.set(documentId, new Set())
    }

    documentUsers.get(documentId).add(socket.userId)

    const usersInDocument = Array.from(documentUsers.get(documentId))
      .map((userId) => activeUsers.get(userId)?.user)
      .filter(Boolean)

    socket.emit("user-joined", usersInDocument)
    socket.to(documentId).emit("user-joined", usersInDocument)
  })

  socket.on("document-change", (data) => {
    socket.to(data.documentId).emit("document-updated", {
      content: data.content,
      title: data.title,
      userId: data.userId,
    })
  })

  socket.on("cursor-position", (data) => {
    socket.to(data.documentId).emit("cursor-position", {
      position: data.position,
      userId: data.userId,
      user: socket.user,
    })
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.user.name)

    activeUsers.delete(socket.userId)

    for (const [documentId, users] of documentUsers.entries()) {
      if (users.has(socket.userId)) {
        users.delete(socket.userId)

        const remainingUsers = Array.from(users)
          .map((userId) => activeUsers.get(userId)?.user)
          .filter(Boolean)

        socket.to(documentId).emit("user-left", remainingUsers)

        if (users.size === 0) {
          documentUsers.delete(documentId)
        }
      }
    }
  })
})

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`)
})
