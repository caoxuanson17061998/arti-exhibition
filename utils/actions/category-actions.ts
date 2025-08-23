import prisma from "../db";

// CREATE category
export async function createCategory(formData: FormData) {
  try {
    const name = formData.get("name") as string;

    if (!name) {
      throw new Error("Category name is required");
    }

    const existing = await prisma.category.findUnique({where: {name}});
    if (existing) {
      return {success: false, error: "Category name already exists"};
    }

    const category = await prisma.category.create({
      data: {name},
    });

    return {success: true, data: category};
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create category",
    };
  }
}

// GET all categories
export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return {success: true, data: categories};
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch categories",
    };
  }
}

// GET category by ID
export async function getCategoryById(id: string) {
  try {
    const category = await prisma.category.findUnique({
      where: {id},
    });

    if (!category) {
      return {success: false, error: "Category not found"};
    }

    return {success: true, data: category};
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch category",
    };
  }
}

// UPDATE category
export async function updateCategory(id: string, data: {name: string}) {
  try {
    const existing = await prisma.category.findFirst({
      where: {
        name: data.name,
        NOT: {id},
      },
    });

    if (existing) {
      return {success: false, error: "Category name already exists"};
    }

    const updated = await prisma.category.update({
      where: {id},
      data: {
        name: data.name,
      },
    });

    return {success: true, data: updated};
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update category",
    };
  }
}

// DELETE category
export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({
      where: {id},
    });

    return {success: true};
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete category",
    };
  }
}
