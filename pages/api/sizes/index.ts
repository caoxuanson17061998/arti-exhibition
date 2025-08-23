import {
  createSize,
  deleteSize,
  getSizeById,
  getSizes,
  updateSize,
} from "@utils/actions/size-actions";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    if (req.query.id) {
      const result = await getSizeById(req.query.id as string);
      if (result.success) {
        return res.status(200).json(result.data);
      }
      return res.status(400).json({error: result.error});
    }

    const result = await getSizes();
    if (result.success) {
      return res.status(200).json(result.data);
    }
    return res.status(400).json({error: result.error});
  }

  if (req.method === "POST") {
    const formData = new FormData();
    formData.append("name", req.body.name);
    if (req.body.description) {
      formData.append("description", req.body.description);
    }

    const result = await createSize(formData);
    if (result.success) {
      return res.status(201).json(result.data);
    }
    return res.status(400).json({error: result.error});
  }

  if (req.method === "PUT") {
    if (!req.query.id) {
      return res.status(400).json({error: "Size ID is required"});
    }

    const result = await updateSize(req.query.id as string, {
      name: req.body.name,
      description: req.body.description,
    });

    if (result.success) {
      return res.status(200).json(result.data);
    }
    return res.status(400).json({error: result.error});
  }

  if (req.method === "DELETE") {
    if (!req.query.id) {
      return res.status(400).json({error: "Size ID is required"});
    }

    const result = await deleteSize(req.query.id as string);
    if (result.success) {
      return res.status(200).json({message: "Size deleted successfully"});
    }
    return res.status(400).json({error: result.error});
  }

  return res.status(405).json({error: "Method not allowed"});
}
