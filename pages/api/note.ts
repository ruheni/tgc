// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, Note } from "@prisma/client"
import { NoteModel } from "../../prisma/zod/note";

const prisma = new PrismaClient();

type SingleResponse = {
  note: Note
};

type ListResponse = {
  notes: Note[]
};

type ErrorResponse = {
  message: string
}

export type NoteAPIResponse = SingleResponse | ListResponse | ErrorResponse;

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

      res.status(200).json({ note });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: `${err}` });
    }
  },

  'GET': async function (req, res) {
    const notes = await prisma.note.findMany()
    res.status(200).json({ notes })
  },

  'DELETE': async function (req, res) {
    res.status(200).json({ message: "post deleted" });
  }
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
