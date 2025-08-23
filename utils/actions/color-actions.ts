import prisma from "../db";

// CREATE color
export async function createColor(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const hexCode = formData.get("hexCode") as string;

    if (!name || !hexCode) {
      throw new Error("Color name and hex code are required.");
    }

    // Check for duplicate name
    const existingColor = await prisma.color.findUnique({where: {name}});
    if (existingColor) {
      return {
        success: false,
        error: "Color name already exists.",
      };
    }

    const color = await prisma.color.create({
      data: {
        name,
        hexCode,
      },
    });

    return {success: true, data: color};
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create color.",
    };
  }
}

// GET all colors
export async function getColors() {
  try {
    const colors = await prisma.color.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return {success: true, data: colors};
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch colors.",
    };
  }
}

// GET color by ID
export async function getColorById(id: string) {
  try {
    const color = await prisma.color.findUnique({
      where: {id},
    });

    if (!color) {
      return {success: false, error: "Color not found."};
    }

    return {success: true, data: color};
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch color.",
    };
  }
}

// UPDATE color
export async function updateColor(
  id: string,
  data: {name: string; hexCode: string},
) {
  try {
    // Check if name exists in another color
    const existingColor = await prisma.color.findFirst({
      where: {
        name: data.name,
        NOT: {id},
      },
    });

    if (existingColor) {
      return {
        success: false,
        error: "Color name already exists.",
      };
    }

    const updatedColor = await prisma.color.update({
      where: {id},
      data: {
        name: data.name,
        hexCode: data.hexCode,
      },
    });

    return {success: true, data: updatedColor};
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update color.",
    };
  }
}

// DELETE color
export async function deleteColor(id: string) {
  try {
    await prisma.color.delete({
      where: {id},
    });

    return {success: true};
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete color.",
    };
  }
}
