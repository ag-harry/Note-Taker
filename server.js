// Import dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs

// Create an express app
const app = express();
const PORT = process.env.PORT || 3001;

// Set up express app to handle data parsing and static files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// HTML routes
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));

// API routes
app.get('./api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) throw err;
        return res.json(JSON.parse(data));
    });
});

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = uuidv4(); // Assign a unique ID to the note
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) throw err;
        const allNotes = JSON.parse(data);
        allNotes.push(newNote);
        fs.writeFile(path.join(__dirname,('./db/db.json', JSON.stringify(allNotes, null, 2), (err) => {
            if (err) throw err;
            res.json(newNote);
        })));
    });
});

app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) throw err;
        let allNotes = JSON.parse(data);
        allNotes = allNotes.filter(note => note.id !== noteId);
        fs.writeFile(path.join(__dirname,'./db/db.json', JSON.stringify(allNotes, null, 2), (err) => {
            if (err) throw err;
            res.json({ ok: true });
        }));
    });
});

// Start the server
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
