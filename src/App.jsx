import { useState, useEffect } from 'react'
import { Home, Calendar, CheckSquare, FileText, Settings, Plus, Edit, Trash2, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import LocalStorageService from './services/LocalStorageService.js'
import './App.css'

function App() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState('home')
  const [events, setEvents] = useState([])
  const [tasks, setTasks] = useState([])
  const [notes, setNotes] = useState([])
  const [userPreferences, setUserPreferences] = useState({})
  
  // États pour les modales et formulaires
  const [showEventForm, setShowEventForm] = useState(false)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [showNoteForm, setShowNoteForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  
  // États pour les formulaires avec date/heure améliorée
  const [eventForm, setEventForm] = useState({ 
    title: '', 
    date: '', 
    time: '', 
    type: 'reminder' 
  })
  const [taskForm, setTaskForm] = useState({ text: '' })
  const [noteForm, setNoteForm] = useState({ title: '', content: '' })

  useEffect(() => {
    // Initialiser les données par défaut
    LocalStorageService.initializeDefaultData()
    
    // Charger les données depuis le stockage local
    setEvents(LocalStorageService.getEvents())
    setTasks(LocalStorageService.getTasks())
    setNotes(LocalStorageService.getNotes())
    setUserPreferences(LocalStorageService.getUserPreferences())
    
    // Timer pour l'heure
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }

  const formatDateTime = (dateStr, timeStr) => {
    if (dateStr && timeStr) {
      const date = new Date(dateStr)
      return `${date.toLocaleDateString('fr-FR')} à ${timeStr}`
    }
    return timeStr || 'Heure non définie'
  }

  // Fonctions pour les événements avec date/heure améliorée
  const handleAddEvent = () => {
    if (eventForm.title && eventForm.date && eventForm.time) {
      const eventData = {
        ...eventForm,
        time: formatDateTime(eventForm.date, eventForm.time)
      }
      const newEvent = LocalStorageService.addEvent(eventData)
      if (newEvent) {
        setEvents(LocalStorageService.getEvents())
        setEventForm({ title: '', date: '', time: '', type: 'reminder' })
        setShowEventForm(false)
      }
    }
  }

  const handleEditEvent = (event) => {
    setEditingItem(event)
    // Extraire la date et l'heure du format stocké
    const eventTime = event.time
    let date = '', time = ''
    
    if (eventTime.includes(' à ')) {
      const parts = eventTime.split(' à ')
      if (parts.length === 2) {
        const datePart = parts[0]
        time = parts[1]
        // Convertir la date française en format ISO
        const dateMatch = datePart.match(/(\d{2})\/(\d{2})\/(\d{4})/)
        if (dateMatch) {
          date = `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`
        }
      }
    } else {
      time = eventTime
      date = new Date().toISOString().split('T')[0] // Date d'aujourd'hui par défaut
    }
    
    setEventForm({ 
      title: event.title, 
      date: date, 
      time: time, 
      type: event.type 
    })
    setShowEventForm(true)
  }

  const handleUpdateEvent = () => {
    if (editingItem && eventForm.title && eventForm.date && eventForm.time) {
      const eventData = {
        ...eventForm,
        time: formatDateTime(eventForm.date, eventForm.time)
      }
      LocalStorageService.updateEvent(editingItem.id, eventData)
      setEvents(LocalStorageService.getEvents())
      setEditingItem(null)
      setEventForm({ title: '', date: '', time: '', type: 'reminder' })
      setShowEventForm(false)
    }
  }

  const handleDeleteEvent = (id) => {
    LocalStorageService.deleteEvent(id)
    setEvents(LocalStorageService.getEvents())
  }

  // Fonctions pour les tâches
  const handleAddTask = () => {
    if (taskForm.text) {
      const newTask = LocalStorageService.addTask(taskForm)
      if (newTask) {
        setTasks(LocalStorageService.getTasks())
        setTaskForm({ text: '' })
        setShowTaskForm(false)
      }
    }
  }

  const handleEditTask = (task) => {
    setEditingItem(task)
    setTaskForm({ text: task.text })
    setShowTaskForm(true)
  }

  const handleUpdateTask = () => {
    if (editingItem && taskForm.text) {
      LocalStorageService.updateTask(editingItem.id, taskForm)
      setTasks(LocalStorageService.getTasks())
      setEditingItem(null)
      setTaskForm({ text: '' })
      setShowTaskForm(false)
    }
  }

  const handleDeleteTask = (id) => {
    LocalStorageService.deleteTask(id)
    setTasks(LocalStorageService.getTasks())
  }

  const toggleTask = (id) => {
    LocalStorageService.toggleTask(id)
    setTasks(LocalStorageService.getTasks())
  }

  // Fonctions pour les notes
  const handleAddNote = () => {
    if (noteForm.title && noteForm.content) {
      const newNote = LocalStorageService.addNote(noteForm)
      if (newNote) {
        setNotes(LocalStorageService.getNotes())
        setNoteForm({ title: '', content: '' })
        setShowNoteForm(false)
      }
    }
  }

  const handleEditNote = (note) => {
    setEditingItem(note)
    setNoteForm({ title: note.title, content: note.content })
    setShowNoteForm(true)
  }

  const handleUpdateNote = () => {
    if (editingItem && noteForm.title && noteForm.content) {
      LocalStorageService.updateNote(editingItem.id, noteForm)
      setNotes(LocalStorageService.getNotes())
      setEditingItem(null)
      setNoteForm({ title: '', content: '' })
      setShowNoteForm(false)
    }
  }

  const handleDeleteNote = (id) => {
    LocalStorageService.deleteNote(id)
    setNotes(LocalStorageService.getNotes())
  }

  // Fonction pour fermer les formulaires
  const closeAllForms = () => {
    setShowEventForm(false)
    setShowTaskForm(false)
    setShowNoteForm(false)
    setEditingItem(null)
    setEventForm({ title: '', date: '', time: '', type: 'reminder' })
    setTaskForm({ text: '' })
    setNoteForm({ title: '', content: '' })
  }

  // Rendu de l'écran d'accueil
  const renderHomeScreen = () => (
    <div className="flex-1 px-6 py-6 space-y-8">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Hello {userPreferences.userName || 'Friend'} 👋
        </h2>
        <p className="text-gray-600">Il est {formatTime(currentTime)}</p>
      </div>

      {/* Upcoming Events */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Prochains événements:</h3>
          </div>
          <Button 
            size="sm" 
            onClick={() => setActiveTab('events')}
            className="text-blue-500 hover:text-blue-700"
            variant="ghost"
          >
            Voir tout
          </Button>
        </div>
        <div className="space-y-3 ml-11">
          {events.slice(0, 2).map(event => (
            <p key={event.id} className="text-gray-700">{event.title} - {event.time}</p>
          ))}
          {events.length === 0 && (
            <p className="text-gray-500 italic">Aucun événement programmé</p>
          )}
        </div>
      </div>

      {/* Daily Tasks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Tâches du jour:</h3>
          </div>
          <Button 
            size="sm" 
            onClick={() => setActiveTab('tasks')}
            className="text-blue-500 hover:text-blue-700"
            variant="ghost"
          >
            Voir tout
          </Button>
        </div>
        <div className="space-y-3 ml-11">
          {tasks.slice(0, 3).map(task => (
            <div key={task.id} className="flex items-center space-x-3">
              <button
                onClick={() => toggleTask(task.id)}
                className={`w-5 h-5 border-2 rounded ${
                  task.completed 
                    ? 'bg-blue-500 border-blue-500' 
                    : 'border-gray-300'
                } flex items-center justify-center`}
              >
                {task.completed && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              <span className={`text-gray-700 ${task.completed ? 'line-through opacity-60' : ''}`}>
                {task.text}
              </span>
            </div>
          ))}
          {tasks.length === 0 && (
            <p className="text-gray-500 italic">Aucune tâche pour aujourd'hui</p>
          )}
        </div>
      </div>

      {/* Recent Notes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Dernières notes:</h3>
          </div>
          <Button 
            size="sm" 
            onClick={() => setActiveTab('notes')}
            className="text-blue-500 hover:text-blue-700"
            variant="ghost"
          >
            Voir tout
          </Button>
        </div>
        <div className="ml-11">
          {notes.slice(0, 1).map(note => (
            <p key={note.id} className="text-gray-700">{note.title}...</p>
          ))}
          {notes.length === 0 && (
            <p className="text-gray-500 italic">Aucune note récente</p>
          )}
        </div>
      </div>
    </div>
  )

  // Rendu de l'écran des événements
  const renderEventsScreen = () => (
    <div className="flex-1 px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Rappels</h2>
        <Button onClick={() => setShowEventForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter
        </Button>
      </div>
      
      <div className="space-y-4">
        {events.map(event => (
          <Card key={event.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="text-gray-600">{event.time}</p>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEditEvent(event)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDeleteEvent(event.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {events.length === 0 && (
          <p className="text-center text-gray-500 py-8">Aucun rappel programmé</p>
        )}
      </div>
    </div>
  )

  // Rendu de l'écran des tâches
  const renderTasksScreen = () => (
    <div className="flex-1 px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Tâches</h2>
        <Button onClick={() => setShowTaskForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter
        </Button>
      </div>
      
      <div className="space-y-4">
        {tasks.map(task => (
          <Card key={task.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-5 h-5 border-2 rounded ${
                      task.completed 
                        ? 'bg-blue-500 border-blue-500' 
                        : 'border-gray-300'
                    } flex items-center justify-center`}
                  >
                    {task.completed && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                  <span className={`${task.completed ? 'line-through opacity-60' : ''}`}>
                    {task.text}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEditTask(task)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDeleteTask(task.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {tasks.length === 0 && (
          <p className="text-center text-gray-500 py-8">Aucune tâche créée</p>
        )}
      </div>
    </div>
  )

  // Rendu de l'écran des notes
  const renderNotesScreen = () => (
    <div className="flex-1 px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Notes</h2>
        <Button onClick={() => setShowNoteForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter
        </Button>
      </div>
      
      <div className="space-y-4">
        {notes.map(note => (
          <Card key={note.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">{note.title}</h3>
                  <p className="text-gray-600 text-sm">{note.content.substring(0, 100)}...</p>
                </div>
                <div className="flex space-x-2 ml-4">
                  <Button size="sm" variant="outline" onClick={() => handleEditNote(note)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDeleteNote(note.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {notes.length === 0 && (
          <p className="text-center text-gray-500 py-8">Aucune note créée</p>
        )}
      </div>
    </div>
  )

  // Rendu de l'écran des paramètres
  const renderSettingsScreen = () => (
    <div className="flex-1 px-6 py-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Paramètres</h2>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations utilisateur</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nom d'utilisateur</label>
                <Input 
                  value={userPreferences.userName || ''} 
                  onChange={(e) => {
                    const newPrefs = { ...userPreferences, userName: e.target.value }
                    setUserPreferences(newPrefs)
                    LocalStorageService.saveUserPreferences(newPrefs)
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Données de l'application</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Toutes vos données sont stockées localement sur votre appareil et fonctionnent hors ligne.
              </p>
              <Button 
                variant="destructive" 
                onClick={() => {
                  if (confirm('Êtes-vous sûr de vouloir effacer toutes les données ?')) {
                    LocalStorageService.clearAllData()
                    setEvents([])
                    setTasks([])
                    setNotes([])
                    setUserPreferences({})
                  }
                }}
              >
                Effacer toutes les données
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>À propos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">MySmartLife - Version 2.0</p>
              <p className="text-sm text-gray-600">
                Assistant personnel intelligent qui fonctionne hors ligne.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900">MySmartLife</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'home' && renderHomeScreen()}
        {activeTab === 'events' && renderEventsScreen()}
        {activeTab === 'tasks' && renderTasksScreen()}
        {activeTab === 'notes' && renderNotesScreen()}
        {activeTab === 'settings' && renderSettingsScreen()}
      </main>

      {/* Modales pour les formulaires */}
      {showEventForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingItem ? 'Modifier le rappel' : 'Nouveau rappel'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Titre du rappel</label>
                <Input
                  value={eventForm.title}
                  onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                  placeholder="Titre du rappel"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <Input
                  type="date"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Heure</label>
                <Input
                  type="time"
                  value={eventForm.time}
                  onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <Button 
                onClick={editingItem ? handleUpdateEvent : handleAddEvent}
                className="flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingItem ? 'Modifier' : 'Ajouter'}
              </Button>
              <Button variant="outline" onClick={closeAllForms}>
                <X className="w-4 h-4 mr-2" />
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}

      {showTaskForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingItem ? 'Modifier la tâche' : 'Nouvelle tâche'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Description de la tâche</label>
                <Input
                  value={taskForm.text}
                  onChange={(e) => setTaskForm({...taskForm, text: e.target.value})}
                  placeholder="Description de la tâche"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <Button 
                onClick={editingItem ? handleUpdateTask : handleAddTask}
                className="flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingItem ? 'Modifier' : 'Ajouter'}
              </Button>
              <Button variant="outline" onClick={closeAllForms}>
                <X className="w-4 h-4 mr-2" />
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}

      {showNoteForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingItem ? 'Modifier la note' : 'Nouvelle note'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Titre de la note</label>
                <Input
                  value={noteForm.title}
                  onChange={(e) => setNoteForm({...noteForm, title: e.target.value})}
                  placeholder="Titre de la note"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Contenu</label>
                <Textarea
                  value={noteForm.content}
                  onChange={(e) => setNoteForm({...noteForm, content: e.target.value})}
                  placeholder="Contenu de la note"
                  rows={4}
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <Button 
                onClick={editingItem ? handleUpdateNote : handleAddNote}
                className="flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingItem ? 'Modifier' : 'Ajouter'}
              </Button>
              <Button variant="outline" onClick={closeAllForms}>
                <X className="w-4 h-4 mr-2" />
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex justify-around">
          <Button
            variant={activeTab === 'home' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('home')}
            className="flex flex-col items-center space-y-1"
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Accueil</span>
          </Button>
          <Button
            variant={activeTab === 'events' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('events')}
            className="flex flex-col items-center space-y-1"
          >
            <Calendar className="w-5 h-5" />
            <span className="text-xs">Rappels</span>
          </Button>
          <Button
            variant={activeTab === 'tasks' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('tasks')}
            className="flex flex-col items-center space-y-1"
          >
            <CheckSquare className="w-5 h-5" />
            <span className="text-xs">Tâches</span>
          </Button>
          <Button
            variant={activeTab === 'notes' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('notes')}
            className="flex flex-col items-center space-y-1"
          >
            <FileText className="w-5 h-5" />
            <span className="text-xs">Notes</span>
          </Button>
          <Button
            variant={activeTab === 'settings' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('settings')}
            className="flex flex-col items-center space-y-1"
          >
            <Settings className="w-5 h-5" />
            <span className="text-xs">Paramètres</span>
          </Button>
        </div>
      </nav>
    </div>
  )
}

export default App

