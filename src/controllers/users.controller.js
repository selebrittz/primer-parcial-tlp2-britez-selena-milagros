import { UserModel } from "../models/mongoose/user.model.js";

   // TODO: devolver usuarios con profile y sus assets con sus categories (populate) (solo admin)
export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find()
      .populate("assets")
      .populate("category"); // asegurate que sea el nombre exacto del campo en tu esquema

    return res.status(200).json({ data: users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "No se pudo obtener los usuarios" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar el usuario
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    // Eliminación lógica
    user.deletedAt = new Date();
    await user.save();

    return res.status(204).json({ msg: "Usuario eliminado correctamente" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};