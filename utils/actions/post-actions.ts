import prisma from "../db";

// Post CRUD Operations

export async function createPost(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const content = formData.get("content") as string;
    const image = formData.get("image") as string;
    const authorId = formData.get("authorId") as string;
    const published = formData.get("published") === "true";

    if (!title || !authorId) {
      throw new Error("Title and author are required");
    }

    // Check if author exists
    const author = await prisma.user.findUnique({
      where: {id: authorId},
    });

    if (!author) {
      throw new Error("Author not found");
    }

    const post = await prisma.post.create({
      data: {
        title,
        description,
        content,
        image,
        authorId,
        published,
      },
      include: {
        author: true,
      },
    });

    return {success: true, data: post};
  } catch (error) {
    console.error("Error creating post:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create post",
    };
  }
}

export async function getPosts(published?: boolean) {
  try {
    const posts = await prisma.post.findMany({
      where: published !== undefined ? {published} : {},
      include: {
        author: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {success: true, data: posts};
  } catch (error) {
    console.error("Error fetching posts:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch posts",
    };
  }
}

export async function getPostById(id: string) {
  try {
    const post = await prisma.post.findUnique({
      where: {id},
      include: {
        author: true,
      },
    });

    if (!post) {
      return {success: false, error: "Post not found"};
    }

    return {success: true, data: post};
  } catch (error) {
    console.error("Error fetching post:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch post",
    };
  }
}

export async function updatePost(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const content = formData.get("content") as string;
    const image = formData.get("image") as string;
    const published = formData.get("published") === "true";

    const post = await prisma.post.update({
      where: {id},
      data: {
        ...(title && {title}),
        ...(description !== null && {description}),
        ...(content && {content}),
        ...(image !== null && {image}),
        published,
      },
      include: {
        author: true,
      },
    });

    return {success: true, data: post};
  } catch (error) {
    console.error("Error updating post:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update post",
    };
  }
}

export async function deletePost(id: string) {
  try {
    await prisma.post.delete({
      where: {id},
    });

    return {success: true};
  } catch (error) {
    console.error("Error deleting post:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete post",
    };
  }
}

export async function togglePostPublication(id: string) {
  try {
    const post = await prisma.post.findUnique({
      where: {id},
      select: {published: true},
    });

    if (!post) {
      return {success: false, error: "Post not found"};
    }

    const updatedPost = await prisma.post.update({
      where: {id},
      data: {
        published: !post.published,
      },
      include: {
        author: true,
      },
    });

    return {success: true, data: updatedPost};
  } catch (error) {
    console.error("Error toggling post publication:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to toggle post publication",
    };
  }
}
