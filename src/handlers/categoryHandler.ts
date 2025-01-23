import Category, { ICategory } from "../model/categoryModel";
import { Logger } from "../library/Logger";
import { Request, Response } from "express";

const getAllCategory = async (req: Request, res: Response) => {
  try {
    const categoryLists = await Category.find();
    return res.status(200).json(categoryLists);
  } catch (error) {
    Logger.error((error as Error).message);
    return res.status(500).json({ details: (error as Error).message });
  }
};

const getCategoryById = async (req: Request, res: Response) => {
  const id: string = req.params.id;
  try {
    const category: ICategory | null = await Category.findById(id);

    if (!category) {
      return res
        .status(404)
        .json({ message: "Category with the given ID not found" });
    }

    return res.status(200).json(category);
  } catch (error) {
    Logger.error((error as Error).message);
    return res.status(500).json({
      message: "An error occured while fetching the category with the given ID",
      details: (error as Error).message,
    });
  }
};

const createCategory = async (req: Request, res: Response) => {
  const { name, icon, color } = req.body;

  try {
    const category = new Category({
      name,
      icon,
      color,
    });

    if (!name && !color) {
      Logger.error("Name and color are required");
      return res.status(404).json("Name and color are required f");
    }

    const createdCategory = await category.save();
    return res.status(201).json(createdCategory);
  } catch (error) {
    Logger.error((error as Error).message);
    return res.status(500).json({
      details: (error as Error).message,
      message: "category can not be created",
    });
  }
};

const updateCategory = async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const { name, color, icon } = req.body;
  try {
    const category: ICategory | null = await Category.findByIdAndUpdate(
      id,
      { name, icon, color },
      { new: true }
    );

    if (!category) {
      return res.status(400).json("Category not found");
    }

    if ((!name && !color) || !icon) {
      Logger.error("name, color and icon are required");
      return res.status(400).send("name, color and icon are required");
    }

    Logger.info("Category successfully updated");
    return res.status(200).json(category);
  } catch (error) {
    Logger.error((error as Error).message);
    return res.status(500).json({
      errMessage: "An error occured while updating category with the given ID",
      details: (error as Error).message,
    });
  }
};

const deleteCategory = async (req: Request, res: Response) => {
  const id: string = req.params.id;
  try {
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(400).json(" Category with the given Id not found");
    }
    Logger.info("Category successfully deleted");
    return res.json("Succefully deleted");
  } catch (error) {
    Logger.error("Delection error", (error as Error).message);
    return res.status(500).json({
      details: (error as Error).message,
      errMessage: "An error occured while deleting category with the given ID",
    });
  }
};

export {
  getAllCategory,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
