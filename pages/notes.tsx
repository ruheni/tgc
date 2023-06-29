import { useState, useEffect, useRef } from "react";
import { NextPage } from "next";
import Container from '@mui/material/Container';
import { NoteForm } from "../components/NoteForm";
import { NoteList } from "../components/NoteList";

const Notes: NextPage = () => {
  return (
    <Container maxWidth="sm" sx={{ paddingTop: "25px" }}>
      <NoteForm />
      <NoteList />
    </Container>
  );
};

export default Notes;
