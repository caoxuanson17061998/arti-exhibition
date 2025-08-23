import prisma from "../db";

// CREATE scent
export async function createScent(formData: FormData) {
  try {
    const name = formData.get("name") as string;

    if (!name) {
      throw new Error("Scent name is required");
    }

    const existing = await prisma.scent.findUnique({where: {name}});
    if (existing) {
      return {success: false, error: "Scent name already exists"};
    }

    const scent = await prisma.scent.create({
      data: {name},
    });

    return {success: true, data: scent};
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create scent",
    };
  }
}

// GET all scents
export async function getScents() {
  try {
    const scents = await prisma.scent.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return {success: true, data: scents};
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch scents",
    };
  }
}

// GET scent by ID
export async function getScentById(id: string) {
  try {
    const scent = await prisma.scent.findUnique({
      where: {id},
    });

    if (!scent) {
      return {success: false, error: "Scent not found"};
    }

    return {success: true, data: scent};
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch scent",
    };
  }
}

// UPDATE scent
export async function updateScent(id: string, data: {name: string}) {
  try {
    const existing = await prisma.scent.findFirst({
      where: {
        name: data.name,
        NOT: {id},
      },
    });

    if (existing) {
      return {success: false, error: "Scent name already exists"};
    }

    const updated = await prisma.scent.update({
      where: {id},
      data: {
        name: data.name,
      },
    });

    return {success: true, data: updated};
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update scent",
    };
  }
}

// DELETE scent
export async function deleteScent(id: string) {
  try {
    await prisma.scent.delete({
      where: {id},
    });

    return {success: true};
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete scent",
    };
  }
}
