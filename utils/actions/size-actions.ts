import prisma from "../db";

// CREATE size
export async function createSize(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    if (!name) {
      throw new Error("Size name is required");
    }

    const existing = await prisma.size.findUnique({where: {name}});
    if (existing) {
      return {success: false, error: "Size name already exists"};
    }

    const size = await prisma.size.create({
      data: {name, description: description || ""},
    });

    return {success: true, data: size};
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create size",
    };
  }
}

// GET all sizes
export async function getSizes() {
  try {
    const sizes = await prisma.size.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return {success: true, data: sizes};
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch sizes",
    };
  }
}

// GET size by ID
export async function getSizeById(id: string) {
  try {
    const size = await prisma.size.findUnique({
      where: {id},
    });

    if (!size) {
      return {success: false, error: "Size not found"};
    }

    return {success: true, data: size};
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch size",
    };
  }
}

// UPDATE size
export async function updateSize(
  id: string,
  data: {name: string; description?: string},
) {
  try {
    const existing = await prisma.size.findFirst({
      where: {
        name: data.name,
        NOT: {id},
      },
    });

    if (existing) {
      return {success: false, error: "Size name already exists"};
    }

    const updated = await prisma.size.update({
      where: {id},
      data: {
        name: data.name,
        description: data.description || "",
      },
    });

    return {success: true, data: updated};
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update size",
    };
  }
}

// DELETE size
export async function deleteSize(id: string) {
  try {
    await prisma.size.delete({
      where: {id},
    });

    return {success: true};
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete size",
    };
  }
}
