const newNoteBtn = document.getElementById("newNoteBtn");
const saveNoteBtn = document.getElementById("saveNoteBtn");
const searchInput = document.getElementById("searchInput");
const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");
const notesList = document.getElementById("notesList");
const exportBtn = document.getElementById("exportBtn");

let notes = JSON.parse(localStorage.getItem("recallNotes") || "[]");
let editingId = null;

function saveToStorage() {
    localStorage.setItem("recallNotes", JSON.stringify(notes));
}

function displayNotes(notesToDisplay = notes) {
    notesList.replaceChildren();

    if (notesToDisplay.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No notes found. Create your first note!";
        notesList.appendChild(message);
        return;
    }

    notesToDisplay.forEach(function(note) {
        const noteCard = document.createElement("div");
        const title = document.createElement("h3");
        const content = document.createElement("p");
        const editBtn = document.createElement("button");
        const deleteBtn = document.createElement("button");

        noteCard.className = "note-card";
        title.textContent = note.title;
        content.textContent = note.content.slice(0, 100);
        editBtn.textContent = "Edit";
        deleteBtn.textContent = "Delete";

        noteCard.append(title, content, editBtn, deleteBtn);

        editBtn.addEventListener("click", function() {
            noteTitle.value = note.title;
            noteContent.value = note.content;
            editingId = note.id;
            noteTitle.focus();
        });

        deleteBtn.addEventListener("click", function() {
            notes = notes.filter(function(item) {
                return item.id !== note.id;
            });

            if (editingId === note.id) {
                editingId = null;
                noteTitle.value = "";
                noteContent.value = "";
            }

            saveToStorage();
            displayNotes();
        });

        notesList.appendChild(noteCard);
    });
}

newNoteBtn.addEventListener("click", function() {
    noteTitle.value = "";
    noteContent.value = "";
    editingId = null;
    noteTitle.focus();
});

saveNoteBtn.addEventListener("click", function() {
    const title = noteTitle.value.trim();
    const content = noteContent.value.trim();

    if (title === "" || content === "") {
        alert("Please enter both title and content.");
        return;
    }

    if (editingId !== null) {
        notes = notes.map(function(note) {
            if (note.id === editingId) {
                return {
                    ...note,
                    title: title,
                    content: content,
                    updatedAt: new Date().toISOString()
                };
            }

            return note;
        });
    } else {
        const newNote = {
            id: Date.now(),
            title: title,
            content: content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        notes.push(newNote);
    }

    saveToStorage();
    displayNotes();

    noteTitle.value = "";
    noteContent.value = "";
    editingId = null;
});

searchInput.addEventListener("input", function() {
    const searchText = searchInput.value.trim().toLowerCase();

    const filteredNotes = notes.filter(function(note) {
        return (
            note.title.toLowerCase().includes(searchText) ||
            note.content.toLowerCase().includes(searchText)
        );
    });

    displayNotes(filteredNotes);
});

exportBtn.addEventListener("click", function() {
    const data = JSON.stringify(notes, null, 2);
    const file = new Blob([data], {
        type: "application/json"
    });

    const url = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = url;
    link.download = "recall-notes.json";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
});

displayNotes();