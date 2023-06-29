import * as z from 'zod'
// NoteModel validation
export const NoteModel = z.object({
  author: z.string().trim().min(1, { message: 'Is required.' }),
  body: z.string().trim().min(1, { message: 'Is required.' }),
})
