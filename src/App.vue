<template>
  <div id="app">
    <h1 class="title">Note</h1>

    <div class="controls">
      <div class="search-container">
        <input type="text" v-model="searchQuery" placeholder="Cerca in base al titolo..." class="search-input" />
      </div>
      
      <button @click="toggleSortOrder" class="sort-btn">
        {{ sortOrder === 'asc' ? 'Meno recente' : 'Più recente' }}
      </button>

      <button @click="addNote" class="add-btn">Aggiungi una Nota</button>
      <button @click="addListNote" class="add-list-btn">Aggiungi una Nota con Elenchi</button>
    </div>

    <div class="settings">
      <label for="notesPerRow">Note per riga:</label>
      <input type="number" id="notesPerRow" v-model.number="notesPerRow" min="1" max="5" />
    </div>

    <div class="notes-container" :style="{ gridTemplateColumns: `repeat(${notesPerRow}, 1fr)` }">
      <NoteItem v-for="(note, index) in filteredNotes"
            :key="index"
            :note-id="'note-' + index"
            :title="note.title"
            :content="note.content"
            :createdAt="note.createdAt"
            :isListNote="note.isListNote"
            :index="index"
            @update-note="updateNote(index, $event)"
            @delete-note="deleteNote(index)"
            @drag-note="handleDragNote"
            class="note-item" />
    </div>
  </div>
</template>


<script>
import NoteItem from './components/Note.vue'

export default {
  name: 'App',
  components: {
    NoteItem
  },
  data() {
    return {
      notes: [
        { title: 'Titolo nota 1', content: 'Contenuto nota 1', createdAt: new Date(), isListNote: false },
        { title: 'Titolo nota 2', content: 'Contenuto nota 2', createdAt: new Date(), isListNote: false },
        { title: 'Titolo nota 3', content: 'Contenuto nota 3', createdAt: new Date(), isListNote: false }
      ],
      notesPerRow: 3,
      searchQuery: '',
      sortOrder: 'asc'
    }
  },
  methods: {
    addNote() {
      this.notes.push({ title: 'Nuova nota', content: 'Contenuto nuova nota', createdAt: new Date(), isListNote: false })
    },
    addListNote() {
      this.notes.push({ title: 'Nuova nota con elenco', content: 'Elemento 1\nElemento 2\nElemento 3\n', createdAt: new Date(), isListNote: true })
    },
    updateNote(index, updatedNote) {
      this.$set(this.notes, index, updatedNote)
    },
    deleteNote(index) {
      this.notes.splice(index, 1)
    },
    handleDragNote({ fromIndex, toIndex }) {
      const draggedNote = this.notes[fromIndex]
      this.notes.splice(fromIndex, 1)
      this.notes.splice(toIndex, 0, draggedNote)
    },
    toggleSortOrder() {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
    }
  },
  computed: {
    filteredNotes() {
      const filtered = this.notes.filter(note => 
        note.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
      return filtered.sort((a, b) => {
        if (this.sortOrder === 'asc') {
          return new Date(a.createdAt) - new Date(b.createdAt)
        } else {
          return new Date(b.createdAt) - new Date(a.createdAt)
        }
      })
    }
  }
}
</script>


<style scoped>
body {
  background-color: #2c2c2c;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  margin: 0;
  padding: 0;
}

#app {
  margin: 20px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-template-rows: auto auto 1fr;
  align-items: center;
  gap: 20px;
}

.title {
  font-size: 50px;
  color: #202124;
  grid-column: 1;
  justify-self: start;
  grid-row: 1;
}

.controls {
  display: flex;
  align-items: center;
  justify-content: center;
  grid-column: 2;
  grid-row: 1;
}

.settings {
  grid-column: 2;
  text-align: center;
  grid-row: 2;
}

.settings label {
  color: #202124;
  font-size: 18px;
}

.settings input {
  padding: 5px;
  font-size: 16px;
  margin-left: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #fff;
  color: #202124;
}

.search-input {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  max-width: 400px;
  background-color: #fff;
  color: #202124;
}

.sort-btn {
  background-color: #1a73e8;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-right: 10px;
  cursor: pointer;
  border-radius: 50px;
  font-size: 16px;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.sort-btn:hover {
  background-color: #1765cc;
  transform: translateY(-2px);
}

.sort-btn:active {
  background-color: #006a9b;
  transform: translateY(0);
}

.notes-container {
  display: grid;
  gap: 10px;
  grid-column: 1 / -1;
  grid-row: 3;
}

.note-item {
  transition: transform 0.3s ease;
}

.add-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 12px 24px;
  cursor: pointer;
  border-radius: 50px;
  font-size: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.add-btn:hover {
  background-color: #45a049;
  transform: translateY(-2px);
}

.add-btn:active {
  background-color: #3e8e41;
  transform: translateY(0);
}
.add-list-btn {
  background-color: #f57c00;
  color: white;
  border: none;
  padding: 12px 24px;
  cursor: pointer;
  border-radius: 50px;
  font-size: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.add-list-btn:hover {
  background-color: #e67e22;
  transform: translateY(-2px);
}

.add-list-btn:active {
  background-color: #d45e00;
  transform: translateY(0);
}
</style>