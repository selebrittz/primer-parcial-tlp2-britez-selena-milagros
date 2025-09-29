import { DataTypes } from "sequelize";
import { AssetModel } from "../sequelize/asset.model.js";
import { CategoryModel } from "../sequelize/category.model.js";

export const AssetCategoryModel = sequelize.define(
  "AssetCategory", {
  id: {
     type: DataTypes.INTEGER,
      autoIncrement: true,
       primaryKey: true },
});

// TODO: completar relaciones muchos a muchos entre Asset y Category mediante AssetCategory.
// * N:M Asset ↔ Category through AssetCategory
// * 'categories' (Asset) y 'assets' (Category)

AssetModel.belongsToMany(CategoryModel, { through: AssetCategory,
  foreignKey: "category_id",
  as: "categories",
  onDelete: "CASCADE",
});

CategoryModel.belongsToMany(AssetModel, {through: AssetCategory,
  foreignKey: "asset_id",
  as: "assets",
  onDelete: "CASCADE",
});