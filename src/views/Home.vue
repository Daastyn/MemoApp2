<template>
  <div class="home">
    <h1>Text Notes</h1>
    <div class="controls">
      <label for="notes-per-line">Notes per line:</label>
      <input type="number" id="notes-per-line" v-model.number="notesPerLine" min="1" />
    </div>
    <div class="notes-grid" :style="{ gridTemplateColumns: `repeat(${notesPerLine}, 1fr)` }">
      <Note
        v-for="(note, index) in notes"
        :key="index"
        :content="note.content"
        @update-content="updateContent(index, $event)"
        @delete-note="deleteNote(index)"
      />
      <div class="note add-note" @click="addNote">+</div>
    </div>
  </div>
</template>


<script>
import Note from '../components/Note.vue'

export default {
  name: 'Home',
  components: {
    Note
  },
  data() {
    return {
      notes: [{ content: 'New note' }],
      notesPerLine: 3 // Default value, can be changed by the user
    }
  },
  methods: {
    addNote() {
      this.notes.push({ content: 'New Note' })
    },
    updateContent(index, newContent) {
      this.$set(this.notes, index, { content: newContent })
    },
    deleteNote(index) {
      this.notes.splice(index, 1)
    }
  }
}
</script>


<style scoped>
.home {
  padding: 20px;
}

.controls {
  margin-bottom: 10px;
}

.notes-grid {
  display: grid;
  gap: 10px;
}

.note {
  background-color: yellow;
  padding: 20px;
  border: 1px solid #ccc;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-note {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #eee;
  font-size: 24px;
  cursor: pointer;
}
</style>
