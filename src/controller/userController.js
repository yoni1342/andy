const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createUser = async (req, res) => {
  try {
    const { name, email, age, motherTongue } = req.body;
    const newUser = await prisma.user.create({
      data: { name, email, age, motherTongue },
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.userId) },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, age, motherTongue } = req.body;
    const user = await prisma.user.update({
      where: { id: parseInt(req.params.userId) },
      data: { name, email, age, motherTongue },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await prisma.user.delete({
      where: { id: parseInt(req.params.userId) },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
