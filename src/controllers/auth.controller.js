import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/mongoose/user.model.js";



export const register = async (req, res) => {
const { username, email, password, role, profile } = req.body;

  if (!username || !email || !password || !profile || !profile.employee_number) {
    return res.status(400).json({ msg: "Faltan datos obligatorios" });
  }

  try {
    //hashear contraseña con salt
    const hashedPassword = await bcrypt.hash(password, 10);

    // crear usuario con profile embebido
    const newUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      role,
      profile,
    });

    return res.status(201).json({ msg: "Usuario registrado correctamente" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Faltan credenciales" });
  }

  try {
    // Buscar usuario por email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ msg: "Credenciales inválidas" });
    }

    // Comparar contraseña
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ msg: "Credenciales inválidas" });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Enviar token en cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60, // 1 hora
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({ msg: "Usuario logueado correctamente" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select("profile");
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    return res.status(200).json({ data: user.profile });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const logout = async (req,res) => {
  res.clearCookie("token")
  return res.json({msg: "logout exitoso" });
};