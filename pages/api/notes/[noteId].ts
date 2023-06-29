import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../db'
import { NoteAPIResponse } from '../notes'

const RESTHandlers: {
  [key: string]: (
    req: NextApiRequest,
    res: NextApiResponse<NoteAPIResponse>
  ) => void
} = {
  DELETE: async function (req, res) {
    const query = req.query
    let { noteId } = query
    let existing = null
    try {
      existing = await prisma.note.findFirst({
        where: { id: Number(noteId) },
      })
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: 'Failed to delete Note' })
    }

    if (!existing) {
      res.status(404).json({ message: 'Note not found' })
    } else {
      try {
        await prisma.note.update({
          where: { id: Number(noteId) },
          data: { deleted: true },
        })
      } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Failed to delete Note' })
      }
    }

    res.status(200).json({ message: 'post deleted' })
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method && RESTHandlers[req.method]) {
    return RESTHandlers[req.method](req, res)
  } else {
    res.status(500).json({ message: 'Unsupported method for Note record' })
  }
}
