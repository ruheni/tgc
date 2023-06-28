// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Note } from "@prisma/client"
import { NoteModel } from "../../prisma/zod/note";
import { prisma } from "../../db";

export type NoteAPIResponse = {
  notes?: Note[]
  message?: string
};

const RESTHandlers: { [key: string]: (req: NextApiRequest, res: NextApiResponse<NoteAPIResponse>) => void } = {
  'POST': async function (req, res) {
    const isValidData = NoteModel.parse(req.body);
    if (!isValidData) {
      res.status(500).json({ message: isValidData });
      return;
    }

    try {
      const note = await prisma.note.create({
        data: req.body
      });

      res.status(200).json({ notes: [note] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: `${err}` });
    }
  },

  'GET': async function (_req, res) {
    try {
      const notes = await prisma.note.findMany({
        where: { deleted: false },
        orderBy: { created_at: "desc" }
      })
      res.status(200).json({ notes })
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: `${err}` });
    }
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method && RESTHandlers[req.method]) {
    return RESTHandlers[req.method](req, res)

  } else {
    res.status(500).json({ message: "Unsupported method for Note record" });
  }
}
