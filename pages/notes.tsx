import { useState } from "react";
import { NextPage } from "next";
import { Note } from '@prisma/client'
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation } from 'react-query';
import axios from 'axios';
import { NoteAPIResponse } from "./api/note";
import { NoteModel } from "../prisma/zod/note"
import { zodResolver } from '@hookform/resolvers/zod';
import TextField from '@mui/material/TextField';

const Notes: NextPage = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Note>({
    resolver: zodResolver(NoteModel)
  });

  const mutation = useMutation('notes', (newNote: Note) => {
    return axios.post<NoteAPIResponse>('/api/note', newNote);
  });

  const submitHandler: SubmitHandler<Note> = (note) => {
    mutation.mutate(note);
    return;
  };

  return (
    <div>
      {mutation.isError ? (
        <div>An error occured: {mutation.error.message}</div>
      ) : null}
      <form onSubmit={handleSubmit(submitHandler)}>
        <label htmlFor="author">Author</label>
        <TextField
          error={errors.author ? true : false}
          helperText={errors.author?.message}
          {...register('author')}
          label="Author"
          variant="outlined" />
        {errors.author?.message && <p>{errors.author?.message}</p>}
        <label htmlFor="body">Content:</label>
        <TextField
          error={errors.body ? true : false}
          helperText={errors.body?.message}
          {...register('body')}
          label="Content"
          multiline
          maxRows={4}
          disabled={mutation.isLoading}
        />
        {errors.body?.message && <p>{errors.body?.message}</p>}
        <input type="submit" />
      </form>
    </div>
  );
};

export default Notes;
