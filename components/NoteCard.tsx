import { useState, useRef, useEffect } from 'react';
import { Note } from '@prisma/client'
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { NoteAPIResponse } from "../pages//api/notes";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';

import Collapse from '@mui/material/Collapse';


import { notesRoute } from "../constants";

export const NoteCard = (note: Note) => {
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
