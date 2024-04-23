import React, { useState } from 'react';

interface Note {
  id: number;
  title: string;
  content: string;
}

interface NoteFormProps {
  noteToEdit: Note | null | undefined;
  onSubmit: (note: Note) => void; // adjust this based on your needs
}

interface NoteTableProps {
  notes: Note[];
  onDelete: (id: number) => void;
  onEdit: (note: Note) => void;
}

interface NoteItemProps {
  note: Note;
  onDelete: (id: number) => void;
  onEdit: (note: Note) => void;
}

let idCounter = 1;

const NoteForm: React.FC<NoteFormProps> = ({ onSubmit, noteToEdit }) => {
  const [title, setTitle] = useState(noteToEdit?.title || '');
  const [content, setContent] = useState(noteToEdit?.content || '');

  const handleSubmit = () => {
    onSubmit({
      id: noteToEdit?.id || idCounter++,
      title,
      content,
    });
    setTitle('');
    setContent('');
  };

  return (
    <div>
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Note Title"
        data-testid="form-input"
      />
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Note Content"
        data-testid="form-textarea"
      />
      <button
        onClick={handleSubmit}
        disabled={!title || !content}
        data-testid="form-submit-button"
      >
        {noteToEdit ? 'Update' : 'Add Note'}
      </button>
    </div>
  );
};

const NoteItem: React.FC<NoteItemProps> = ({ note, onDelete, onEdit }) => (
  <div>
    <h2>{note.title}</h2>
    <p>{note.content}</p>
    <button onClick={() => onEdit(note)}>Edit</button>
    <button onClick={() => onDelete(note.id)}>Delete</button>
  </div>
);

const NoteTable: React.FC<NoteTableProps> = ({ notes, onDelete, onEdit }) => (
  <div data-testid="notes-list">
    {notes.map(note => (
      <NoteItem key={note.id} note={note} onDelete={onDelete} onEdit={onEdit} />
    ))}
  </div>
);

const NoteManager = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteToEdit, setNoteToEdit] = useState<Note | null | undefined>(null); // Updated to accept undefined

  const handleAddOrUpdateNote = (note: Note) => {
    if (noteToEdit) {
      // Update existing note
      setNotes(notes.map(n => (n.id === note.id ? note : n)));
      setNoteToEdit(undefined); // Updated to set to undefined instead of null
    } else {
      // Add new note
      setNotes([...notes, note]);
    }
  };

  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const handleEditNote = (note: Note) => {
    setNoteToEdit(note);
  };

  return (
    <div>
      <NoteForm onSubmit={handleAddOrUpdateNote} noteToEdit={noteToEdit} />
      <NoteTable notes={notes} onDelete={handleDeleteNote} onEdit={handleEditNote} />
    </div>
  );
};

export default NoteManager;
