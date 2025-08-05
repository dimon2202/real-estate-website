import prisma from "../lib/prisma.js"
import jwt from "jsonwebtoken"

export const adminLogin = async (req, res) => {
  const { username, password } = req.body

  try {
    // Check against environment variables
    const adminUsername = process.env.ADMIN_USERNAME
    const adminPassword = process.env.ADMIN_PASSWORD

    if (username !== adminUsername || password !== adminPassword) {
      return res.status(400).json({ message: "Неправильні дані адміністратора!" })
    }

    // Create admin token
    const token = jwt.sign({ id: "admin", role: "admin" }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" })

    res
      .cookie("adminToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
      .status(200)
      .json({ message: "Успішний вхід адміністратора" })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Помилка входу адміністратора!" })
  }
}

export const adminLogout = (req, res) => {
  res.clearCookie("adminToken").status(200).json({ message: "Успішний вихід адміністратора" })
}

export const getAdminData = async (req, res) => {
  try {
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            savedPosts: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Get all posts with user info
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            username: true,
            email: true,
          },
        },
        _count: {
          select: {
            savedPosts: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    res.status(200).json({ users, posts })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Помилка отримання даних адміністратора!" })
  }
}

export const deletePostAdmin = async (req, res) => {
  const id = req.params.id

  try {
    // First delete related saved posts
    await prisma.savedPost.deleteMany({
      where: { postId: id },
    })

    // Delete post details if they exist
    await prisma.postDetail.deleteMany({
      where: { postId: id },
    })

    // Then delete the post
    await prisma.post.delete({
      where: { id },
    })

    res.status(200).json({ message: "Нерухомість успішно видалена" })
  } catch (err) {
    console.log("Error deleting post:", err)
    res.status(500).json({ message: "Помилка видалення нерухомості", error: err.message })
  }
}

export const deleteUserAdmin = async (req, res) => {
  const id = req.params.id

  try {
    // Get all user's posts first
    const userPosts = await prisma.post.findMany({
      where: { userId: id },
      select: { id: true },
    })

    const postIds = userPosts.map((post) => post.id)

    // Delete user's saved posts
    await prisma.savedPost.deleteMany({
      where: { userId: id },
    })

    // Delete saved posts for user's properties
    await prisma.savedPost.deleteMany({
      where: { postId: { in: postIds } },
    })

    // Delete post details for user's posts
    await prisma.postDetail.deleteMany({
      where: { postId: { in: postIds } },
    })

    // Delete user's posts
    await prisma.post.deleteMany({
      where: { userId: id },
    })

    // Delete the user
    await prisma.user.delete({
      where: { id },
    })

    res.status(200).json({ message: "Користувач успішно видалений" })
  } catch (err) {
    console.log("Error deleting user:", err)
    res.status(500).json({ message: "Помилка видалення користувача", error: err.message })
  }
}
