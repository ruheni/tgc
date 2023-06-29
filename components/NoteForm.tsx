import { Note } from '@prisma/client'
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import axios, { AxiosResponse } from 'axios';
import { NoteModel } from "../zodnote"
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { NoteAPIResponse } from "../pages/api/notes";
import { notesRoute } from "../constants";

export const NoteForm = () => {
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
  );
}
