// Service de stockage local pour la persistance des données hors ligne
class LocalStorageService {
  // Clés de stockage
  static KEYS = {
    EVENTS: 'mysmartlife_events',
    TASKS: 'mysmartlife_tasks',
    NOTES: 'mysmartlife_notes',
    USER_PREFERENCES: 'mysmartlife_preferences'
  }

  // Méthodes génériques pour le stockage
  static setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      return false
    }
  }

  static getItem(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error('Erreur lors de la récupération:', error)
      return defaultValue
    }
  }

  static removeItem(key) {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      return false
    }
  }

  // Méthodes spécifiques pour les événements
  static getEvents() {
    return this.getItem(this.KEYS.EVENTS, [])
  }

  static saveEvents(events) {
    return this.setItem(this.KEYS.EVENTS, events)
  }

  static addEvent(event) {
    const events = this.getEvents()
    const newEvent = {
      id: Date.now(),
      ...event,
      createdAt: new Date().toISOString()
    }
    events.push(newEvent)
    return this.saveEvents(events) ? newEvent : null
  }

  static updateEvent(id, updatedEvent) {
    const events = this.getEvents()
    const index = events.findIndex(event => event.id === id)
    if (index !== -1) {
      events[index] = { ...events[index], ...updatedEvent, updatedAt: new Date().toISOString() }
      return this.saveEvents(events) ? events[index] : null
    }
    return null
  }

  static deleteEvent(id) {
    const events = this.getEvents()
    const filteredEvents = events.filter(event => event.id !== id)
    return this.saveEvents(filteredEvents)
  }

  // Méthodes spécifiques pour les tâches
  static getTasks() {
    return this.getItem(this.KEYS.TASKS, [])
  }

  static saveTasks(tasks) {
    return this.setItem(this.KEYS.TASKS, tasks)
  }

  static addTask(task) {
    const tasks = this.getTasks()
    const newTask = {
      id: Date.now(),
      completed: false,
      ...task,
      createdAt: new Date().toISOString()
    }
    tasks.push(newTask)
    return this.saveTasks(tasks) ? newTask : null
  }

  static updateTask(id, updatedTask) {
    const tasks = this.getTasks()
    const index = tasks.findIndex(task => task.id === id)
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updatedTask, updatedAt: new Date().toISOString() }
      return this.saveTasks(tasks) ? tasks[index] : null
    }
    return null
  }

  static deleteTask(id) {
    const tasks = this.getTasks()
    const filteredTasks = tasks.filter(task => task.id !== id)
    return this.saveTasks(filteredTasks)
  }

  static toggleTask(id) {
    const tasks = this.getTasks()
    const index = tasks.findIndex(task => task.id === id)
    if (index !== -1) {
      tasks[index].completed = !tasks[index].completed
      tasks[index].updatedAt = new Date().toISOString()
      return this.saveTasks(tasks) ? tasks[index] : null
    }
    return null
  }

  // Méthodes spécifiques pour les notes
  static getNotes() {
    return this.getItem(this.KEYS.NOTES, [])
  }

  static saveNotes(notes) {
    return this.setItem(this.KEYS.NOTES, notes)
  }

  static addNote(note) {
    const notes = this.getNotes()
    const newNote = {
      id: Date.now(),
      ...note,
      createdAt: new Date().toISOString()
    }
    notes.push(newNote)
    return this.saveNotes(notes) ? newNote : null
  }

  static updateNote(id, updatedNote) {
    const notes = this.getNotes()
    const index = notes.findIndex(note => note.id === id)
    if (index !== -1) {
      notes[index] = { ...notes[index], ...updatedNote, updatedAt: new Date().toISOString() }
      return this.saveNotes(notes) ? notes[index] : null
    }
    return null
  }

  static deleteNote(id) {
    const notes = this.getNotes()
    const filteredNotes = notes.filter(note => note.id !== id)
    return this.saveNotes(filteredNotes)
  }

  // Méthodes pour les préférences utilisateur
  static getUserPreferences() {
    return this.getItem(this.KEYS.USER_PREFERENCES, {
      userName: 'Jimitry',
      theme: 'light',
      notifications: true
    })
  }

  static saveUserPreferences(preferences) {
    return this.setItem(this.KEYS.USER_PREFERENCES, preferences)
  }

  // Méthode pour initialiser les données par défaut
  static initializeDefaultData() {
    // Initialiser les événements par défaut si aucun n'existe
    if (this.getEvents().length === 0) {
      const defaultEvents = [
        {
          id: 1,
          title: "Cours d'anglais",
          time: "10h",
          type: "course",
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          title: "Rappel: boire de l'eau",
          time: "14h",
          type: "reminder",
          createdAt: new Date().toISOString()
        }
      ]
      this.saveEvents(defaultEvents)
    }

    // Initialiser les tâches par défaut si aucune n'existe
    if (this.getTasks().length === 0) {
      const defaultTasks = [
        {
          id: 1,
          text: "Réviser le projet React",
          completed: false,
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          text: "Payer la facture Internet",
          completed: true,
          createdAt: new Date().toISOString()
        }
      ]
      this.saveTasks(defaultTasks)
    }

    // Initialiser les notes par défaut si aucune n'existe
    if (this.getNotes().length === 0) {
      const defaultNotes = [
        {
          id: 1,
          title: "Idée pour une app de motivation",
          content: "Créer une application qui aide les utilisateurs à rester motivés dans leurs objectifs quotidiens...",
          createdAt: new Date().toISOString()
        }
      ]
      this.saveNotes(defaultNotes)
    }
  }

  // Méthode pour effacer toutes les données
  static clearAllData() {
    Object.values(this.KEYS).forEach(key => {
      this.removeItem(key)
    })
  }
}

export default LocalStorageService

