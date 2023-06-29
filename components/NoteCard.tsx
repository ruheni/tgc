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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { notesRoute } from "../constants";

export const NoteCard = (note: Note) => {
  const queryClient = useQueryClient()
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldCollapse, setShouldCollapse] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  const mutation = useMutation('notes', (note: Note) => {
    return axios.delete<NoteAPIResponse>(`${notesRoute}/${note.id}`);
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('notes')
    }
  });

  useEffect(() => {
    // check if the height of the text content exceeds the collapsed size
    if (textRef.current && textRef.current.offsetHeight > 40) {
      setShouldCollapse(true);
    }
  }, [note.body, textRef.current]);

  const handleClickOpen = () => {
    if (mutation.isLoading) return;
    setOpenDialog(true);
  };

  const handleClose = (confirm: boolean) => {
    setOpenDialog(false);
    if (confirm) mutation.mutate(note);
  };

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card sx={{ marginBottom: '20px;', opacity: mutation.isLoading ? "0.5" : "1" }}>
      <CardHeader
        action={
          <IconButton aria-label="settings" onClick={handleClickOpen}>
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

      <Dialog
        open={openDialog}
        onClose={() => handleClose(false)}
      >
        <DialogTitle>
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you wish to delete this note?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <Button onClick={() => handleClose(true)} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Card >
  );
}
