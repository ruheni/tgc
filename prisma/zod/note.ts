import * as z from "zod"
import * as imports from "../null"

export const NoteModel = z.object({
  author: z.string().trim().min(1, { message: 'Is required.' }),
  body: z.string().trim().min(1, { message: 'Is required.' }),
})
