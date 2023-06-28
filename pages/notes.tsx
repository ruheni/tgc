import { NextPage } from "next";
import { Note } from '@prisma/client'
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import { NoteAPIResponse } from "./api/notes";
import { NoteModel } from "../zodnote"
import { zodResolver } from '@hookform/resolvers/zod';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';

const notesRoute = `/api/notes`;

function NoteBox(note: Note) {
  const queryClient = useQueryClient()

  const mutation = useMutation('notes', (note: Note) => {
    return axios.delete<NoteAPIResponse>(`${notesRoute}/${note.id}`);
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('notes')
    }
  });

  const clickHandler = () => {
    mutation.mutate(note);
  };

  return (
    <Card sx={{ marginBottom: '20px;' }}>
      <CardHeader
        action={
          <IconButton aria-label="settings" onClick={clickHandler}>
            <ClearIcon />
          </IconButton>
        }
        title={<Typography variant="subtitle1"><strong>Author:</strong> {note.author}</Typography>}
      />
      <CardContent>
        <Typography variant="body1">{note.body}</Typography>
      </CardContent >
    </Card >
  );
}

function NoteList() {
  const noteQuery = useQuery('notes', () => {
    return axios.get<NoteAPIResponse>(notesRoute);
  })
  if (noteQuery.isLoading) return <div>loading notes....</div>;
  if (noteQuery.isError) return <div>An error occured loading notes: {(noteQuery.error as Error).message}</div>;
  if (noteQuery.isSuccess) {
    if (!noteQuery.data.data.notes?.length) return <div>No Notes Found</div>;
    return (
      <>
        {noteQuery.data.data.notes.map((note: Note, index: number) => {
          return <NoteBox {...note} key={`${note.author}${index}`} />
        })}
      </>
    );
  }
  return null;
}

const Notes: NextPage = () => {
  const queryClient = useQueryClient()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Note>({
    resolver: zodResolver(NoteModel)
  });


  const mutation = useMutation('notes', (newNote: Note) => {
    return axios.post<NoteAPIResponse>(notesRoute, newNote);
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('notes')
    }
  });

  const submitHandler: SubmitHandler<Note> = (note) => {
    mutation.mutate(note);
    return;
  };

  return (
    <Container maxWidth="sm">
      <Box>
        <Typography variant="subtitle1">Create a new note</Typography>
        {mutation.isError ? (
          <div>An error occured: {(mutation.error as Error).message}</div>
        ) : null}
        <form onSubmit={handleSubmit(submitHandler)}>
          <Stack spacing={3}>
            <TextField
              error={errors.author ? true : false}
              helperText={errors.author?.message}
              {...register('author')}
              label="Author"
              variant="outlined" />
            <TextField
              error={errors.body ? true : false}
              helperText={errors.body?.message}
              {...register('body')}
              label="Content"
              multiline
              maxRows={4}
              disabled={mutation.isLoading}
            />
            <Button variant="contained" type="submit" color="success">Submit</Button>
          </Stack>
        </form>
      </Box>

      <Box sx={{ marginTop: "20px" }}>
        <Typography variant="subtitle2">Notes:</Typography>
        <NoteList />
      </Box>
    </Container>
  );
};

export default Notes;
