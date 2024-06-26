<template>
  <div
    :key="noteId"
    :draggable="!isEditing && !showModal  "
    @dragstart="dragStart"
    @dragover="dragOver"
    @drop="drop"
    @dragend="dragEnd"
    class="note-item"
    :class="{ dragging: isDragging }"
  >
    <div class="note-content" @click="handleNoteClick">
      <h3>{{ title }}</h3>
      <div v-if="isListNote" class="list-content" v-html="elenco()"></div>
      <div v-else>{{ content }}</div>
      <div class="note-timestamp">{{ formattedCreatedAt }}</div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close-btn" @click="closeModal">&times;</span>
        <input v-model="newTitle" class="edit-title" placeholder="Title" />
        <textarea v-model="newContent" rows="4" class="edit-textarea"></textarea>
        <div class="edit-actions">
          <button @click="saveEdit" class="save-btn">Salva</button>
          <button class="delete-btn" @click.stop="deleteNote">Elimina nota</button>
          <button @click="cancelEdit" class="cancel-btn">Indietro</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { format } from 'date-fns';

export default {
  name: 'NoteItem',
  props: {
    noteId: {
      type: [String,Number],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    createdAt: {
      type: [String, Number, Date],
      required: true
    },
    isListNote: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      isEditing: false,
      showModal: false,
      newTitle: this.title,
      newContent: this.content,
      isDragging: false,
      formattedCreatedAt: format(new Date(this.createdAt), 'dd/MM/yyyy HH:mm:ss')
    }
  },
  watch: {
    createdAt(newVal) {
      console.log('createdAt changed:', newVal);
    },
    isListNote(newVal) {
      console.log('isListNote changed:', newVal);
    }
  },
  methods: {
    created() {
      //console.log('initial createdAt:', this.createdAt);
      //console.log('initial isListNote:', this.isListNote);
    },

    elenco() {
      const lines = this.content.trim().split('\n');
      let html = '<ul>';
      lines.forEach(line => {
        html += `<li>${line}</li>`;
      });
      html += '</ul>';
      return html;
    },
    saveEdit() {
      if (this.showModal) {
        this.isEditing = false;
        this.showModal = false;
        console.log(this.isListNote)
        this.$emit('update-note', { id: this.noteId, title: this.newTitle, content: this.newContent, isListNote:this.isListNote,createdAt:this.createdAt });
        
      }
    },
    cancelEdit() {
      if (this.showModal) {
        this.newTitle = this.title;
        this.newContent = this.content;
        this.isEditing = false;
        this.showModal = false;
      }
    },
    deleteNote() {
      this.$emit('delete-note', this.noteId);
      this.isEditing = false;
      this.showModal = false;
    },
    handleNoteClick() {
      if (!this.isEditing) {
        this.newTitle = this.title;
        this.newContent = this.content;
        this.isEditing = true;
        this.showModal = true;
      }
    },
    closeModal() {
      this.cancelEdit();
    },
    dragStart(event) {
      if (!this.isEditing) {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', this.index.toString());
        this.isDragging = true;
      }
    },
    dragOver(event) {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    },
    drop(event) {
      event.preventDefault();
      const fromIndex = parseInt(event.dataTransfer.getData('text/plain'));
      const toIndex = this.index;
      this.$emit('drag-note', { fromIndex, toIndex });
      this.isDragging = false;
    },
    dragEnd() {
      this.isDragging = false;
    }
  }
}

</script>


<style scoped>
body {
  background-color: #f1f3f4;
  color: #202124;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.note-item {
  background-color: #fff9c4;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  position: relative;
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}
.note-item .note-content ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.note-item .note-content ul li {
  padding: 5px 0;
}
.list-content {
  margin-top: 10px;
}

.list-content ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.list-content ul li {
  padding: 5px 0;
}
.note-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.note-item.dragging {
  opacity: 0.6;
  transform: scale(1.05);
}

.note-content {
  position: relative;
}

.note-content h3 {
  margin: 0;
  font-size: 22px;
  font-weight: 500;
  color: #3c4043;
}

.note-content pre {
  margin: 10px 0 0;
  font-size: 16px;
  color: #5f6368;
  white-space: pre-wrap;
  word-wrap: break-word;
  height: auto;
}

.note-timestamp {
  position: absolute;
  bottom: -10px;
  right: 15px;
  font-size: 10px;
  color: #757575;
}

.edit-container {
  display: flex;
  flex-direction: column;
}

.edit-title {
  width: 100%;
  box-sizing: border-box;
  font-size: 18px;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.edit-textarea {
  width: 100%;
  box-sizing: border-box;
  font-size: 14px;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  resize: vertical;
  white-space: pre-wrap;
  word-wrap: break-word;
  height: auto;
}

textarea {
  width: 100%;
  box-sizing: border-box;
  font-size: 14px;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  resize: vertical;
}

.edit-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.save-btn,
.cancel-btn,
.delete-btn {
  background-color: #1a73e8;
  color: white;
  border: none;
  padding: 10px 15px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.save-btn:hover {
  background-color: #1765cc;
}

.cancel-btn {
  background-color: #d32f2f;
}

.cancel-btn:hover {
  background-color: #b71c1c;
}

.delete-btn {
  background-color: #d32f2f;
  position: absolute;
  top: 5px;
  right: 5px;
}

.delete-btn:hover {
  background-color: #b71c1c;
}

/* Modal Styles */
.modal {
  display: flex; /* Flexbox for centering */
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}

.modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  border-radius: 8px;
  width: 80%;
  max-width: 600px; /* Limit modal width */
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); /* Shadow for depth */
  position: relative;
}

.close-btn {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close-btn:hover,
.close-btn:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>
