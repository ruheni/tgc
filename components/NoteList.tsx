import { Note } from '@prisma/client'
import { useQuery } from 'react-query'
import axios from 'axios'
import CircularProgress from '@mui/material/CircularProgress'
import { NoteAPIResponse } from '../pages/api/notes'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { NoteCard } from './NoteCard'
import { notesRoute } from '../constants'

export const NoteResults = () => {
  const noteQuery = useQuery('notes', () => {
    return axios.get<NoteAPIResponse>(notesRoute)
  })
  if (noteQuery.isLoading)
    return (
      <div>
        loading notes.... <CircularProgress />
      </div>
    )
  if (noteQuery.isError)
    return (
      <div>
        An error occured loading notes: {(noteQuery.error as Error).message}
      </div>
    )
  if (noteQuery.isSuccess) {
    if (!noteQuery.data.data.notes?.length) return <div>No Notes Found</div>
    return (
      <>
        {noteQuery.data.data.notes.map((note: Note) => {
          return <NoteCard {...note} key={note.id} />
        })}
      </>
    )
  }
  return null
}

export const NoteList = () => {
  return (
    <Box sx={{ marginTop: '20px' }}>
      <Typography variant="subtitle2">Notes:</Typography>
      <NoteResults />
    </Box>
  )
}
