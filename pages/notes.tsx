import { useState, useEffect, useRef } from "react";
import { NextPage } from "next";
import { Note } from '@prisma/client'
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import axios, { AxiosResponse } from 'axios';
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
import CircularProgress from '@mui/material/CircularProgress';
import Collapse from '@mui/material/Collapse';

const notesRoute = `/api/notes`;

function NoteCard(note: Note) {
  const queryClient = useQueryClient()

  const mutation = useMutation('notes', (note: Note) => {
    return axios.delete<NoteAPIResponse>(`${notesRoute}/${note.id}`);
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('notes')
    }
  });

  const clickHandler = () => {
    if (mutation.isLoading) return;
    if (window.confirm('Are you sure you wish to delete this item?')) mutation.mutate(note);
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldCollapse, setShouldCollapse] = useState(false);

  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // check if the height of the text content exceeds the collapsed size
    if (textRef.current && textRef.current.offsetHeight > 40) {
      setShouldCollapse(true);
    }
  }, [note.body]);

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card sx={{ marginBottom: '20px;', opacity: mutation.isLoading ? "0.5" : "1" }}>
      <CardHeader
        action={
          <IconButton aria-label="settings" onClick={clickHandler}>
            <ClearIcon />
          </IconButton>
        }
        title={<Typography variant="subtitle1"><strong>Author:</strong> {note.author}</Typography>}
      />
      <CardContent>
        <Collapse in={isExpanded} collapsedSize={40}>
          <Typography variant="body1" ref={textRef} style={{ whiteSpace: 'pre-wrap' }}>{note.body}</Typography>
        </Collapse>
        {shouldCollapse && <Button color="primary" onClick={handleExpandClick}>
          {isExpanded ? 'Show Less' : 'Show More'}
        </Button>}
      </CardContent >
    </Card >
  );
}

function NoteList() {
  const noteQuery = useQuery('notes', () => {
    return axios.get<NoteAPIResponse>(notesRoute);
  })
  if (noteQuery.isLoading) return <div>loading notes.... <CircularProgress /></div>;
  if (noteQuery.isError) return <div>An error occured loading notes: {(noteQuery.error as Error).message}</div>;
  if (noteQuery.isSuccess) {
    if (!noteQuery.data.data.notes?.length) return <div>No Notes Found</div>;
    return (
      <>
        {noteQuery.data.data.notes.map((note: Note, index: number) => {
          return <NoteCard {...note} key={`${note.author}${index}`} />
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
    onSuccess: (response: AxiosResponse<NoteAPIResponse>) => {
      queryClient.setQueryData('notes', (existing: AxiosResponse<NoteAPIResponse> | undefined) => {
        if (typeof existing !== 'undefined') {
          response.data.notes = [...response.data.notes || [], ...existing.data.notes || []];
        }
        return response;
      });
    }
  });

  const submitHandler: SubmitHandler<Note> = (note) => {
    mutation.mutate(note);
    return;
  };

  return (
    <Container maxWidth="sm" sx={{ paddingTop: "25px" }}>
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
