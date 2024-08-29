import React, { useState, useEffect } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Fab, TextField, Select,  MenuItem, IconButton, Typography, Autocomplete, Chip } from '@mui/material'
import { Add, Edit, Delete, ChevronLeft, ChevronRight, Today } from '@mui/icons-material'
import useGlobalContext from '../hooks/useGlobalContext'
import { useNavigate } from 'react-router-dom'
import EventNoteIcon from '@mui/icons-material/EventNote';

export default function CalendarApp() {

  const API_URL = "https://ca9526c0439b4117f870.free.beeceptor.com/api/calendar-backend-new/";

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedEvents, setSelectedEvents] = useState(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [eventSelectedForEdit, setSelectedEventForEdit] = useState(null)
  const [newEvent, setNewEvent] = useState({
    date: '',
    title: '',
    description: '',
    bgColor: '#3174ad',
    textColor: '#ffffff',
    fromTime: '',
    toTime: '',
    category: ''
  });

  const navigate = useNavigate();
  const { events, setEvents, categoriesList } = useGlobalContext();

  useEffect(() => {
    fetchEvents();
  }, []);

  // Fetch all events from the API
  const fetchEvents = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const today = new Date()
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() //find the last date of the current month.
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() //find the first day of the current month.

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }
  const handleDateClick = (day) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    setSelectedDate(clickedDate.toDateString())
    const eventsList = events.filter(e => new Date(e.date).toDateString() === clickedDate.toDateString())
    if (eventsList?.length > 0) {
      setSelectedEvents(eventsList)
      setIsEditMode(false)
    } else {
      setSelectedEvents(null)
    }
    setIsEventModalOpen(true)
  }

  const handleAddEvent = () => {
    setNewEvent({
      ...newEvent,
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()).toISOString().split('T')[0],
    })
    setIsAddEventModalOpen(true)
  }

  const handleSaveEvent = async () => {
    if (newEvent.title && newEvent.date) {
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...newEvent, id: Date.now() }),
        });
        if (response.ok) {
          const createdEvent = await response.json();
          setEvents([...events, createdEvent]);
          setIsAddEventModalOpen(false);
          setNewEvent({
            date: '',
            title: '',
            description: '',
            bgColor: '#3174ad',
            textColor: '#ffffff',
            fromTime: '',
            toTime: '',
            category: ""
          });
        } else {
          console.error('Failed to save event:', response.statusText);
        }
      } catch (error) {
        console.error('Error saving event:', error);
      }
    }
  };

  const handleEditEvent = (event) => {
    setIsEditMode(true)
    setSelectedEventForEdit(event)
  }

  const handleSaveEditedEvent = async (event) => {
    if (event.id) {
      try {
        const response = await fetch(`${API_URL}${event.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(event),
        });
        if (response.ok) {
          const updatedEvent = await response.json();
          const updatedEvents = events.map(e => (e.id === event.id ? updatedEvent : e));
          setEvents(updatedEvents);
          setIsEventModalOpen(false);
          setIsEditMode(false);
        } else {
          console.error('Failed to update event:', response.statusText);
        }
      } catch (error) {
        console.error('Error updating event:', error);
      }
    }
  };

  const handleDeleteEvent = async (event) => {
    if (event.id) {
      try {
        const response = await fetch(`${API_URL}${event.id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          const updatedEvents = events.filter(e => e.id !== event.id);
          setEvents(updatedEvents);
          setIsEventModalOpen(false);
        } else {
          console.error('Failed to delete event:', response.statusText);
        }
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const handleTodayClick = () => {
    setCurrentDate(new Date())
  }

//   useEffect(() => {
//     const handleWheel = (e) => {
//       if (e.deltaY < 0) {
//         handlePrevMonth()
//       } else {
//         handleNextMonth()
//       }
//     }

//     window.addEventListener('wheel', handleWheel)
//     return () => window.removeEventListener('wheel', handleWheel)
//   }, [currentDate])

  return (
    <div className="flex flex-col h-screen p-4 bg-gradient-to-br from-purple-100 to-indigo-100">

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-center mb-4 sm:mb-8">
        <h1 className="text-xl md:text-3xl text-indigo-800 font-bold">Calendar</h1>
        <div className="flex items-center">
          <IconButton onClick={handlePrevMonth} className="text-indigo-600" aria-label="Previous month">
            <ChevronLeft />
          </IconButton>
          <Select
            value={currentDate.getMonth()}
            onChange={(e) => setCurrentDate(new Date(currentDate.getFullYear(), Number(e.target.value), 1))}
            className="mr-2"
            size="small"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <MenuItem key={i} value={i}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </MenuItem>
            ))}
          </Select>
          <Select
            value={currentDate.getFullYear()}
            onChange={(e) => setCurrentDate(new Date(Number(e.target.value), currentDate.getMonth(), 1))}
            size="small"
          >
            {Array.from({ length: 10 }, (_, index) => (
              <MenuItem key={index} value={currentDate.getFullYear() - 5 + index}>
                {currentDate.getFullYear() - 5 + index}
              </MenuItem>
            ))}
          </Select>
          <IconButton onClick={handleNextMonth} className="text-indigo-600" aria-label="Next month">
            <ChevronRight />
          </IconButton>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-bold text-indigo-800">
            {day}
          </div>
        ))}
      </div>

      <div className="flex-grow grid grid-cols-7 gap-1">
        {Array.from({ length: 42 }, (_, i) => {
          const day = i - firstDayOfMonth + 1
          const isCurrentMonth = day > 0 && day <= daysInMonth
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
          const isToday = date.toDateString() === today.toDateString()
          const eventList = events.filter((e) => new Date(e.date).toDateString() === date.toDateString())

          return (
            <div
              key={i}
              className={`p-1 border rounded-lg ${
                isCurrentMonth ? 'bg-white hover:bg-indigo-100' : 'bg-gray-100'
              } ${isToday ? 'ring-2 ring-indigo-500 bg-indigo-100' : ''} ${eventList?.length > 0 ? 'cursor-pointer' : ''}`}
              onClick={() => isCurrentMonth && handleDateClick(day)}
            >
              {isCurrentMonth && (
                <>
                  <div className={`text-sm sm:text-xl ${isToday ? 'font-bold text-indigo-600' : eventList?.length > 0 ? 'font-semibold' : ''}`}>
                    {day}
                  </div>
                  {eventList?.length > 0 && eventList.map(event => (
                    <div
                      className="text-xs p-1 mt-1 rounded-sm mb-1"
                      style={{ backgroundColor: event.bgColor, color: event.textColor, textWrap: "nowrap" }}
                      key={event.id}
                    >
                      {event.title}
                    </div>
                  ))}
                </>
              )}
            </div>
          )
        })}
      </div>

      <div className="fixed bottom-4 right-4 flex flex-col space-y-2">
        <Fab color="primary" onClick={handleAddEvent} aria-label="Add event">
          <Add />
        </Fab>
        <Fab style={{background: "#FFC107"}} onClick={handleTodayClick} aria-label="Go to today">
          <Today />
        </Fab>
        <Fab color="secondary" onClick={() => {navigate("/events")}} className='text-red-600' aria-label="All events">
          <EventNoteIcon />
        </Fab>
      </div>

      <Dialog open={isEventModalOpen} onClose={() => {setIsEventModalOpen(false)}}>
        <DialogTitle>{isEditMode ? 'Edit Event' : 'Event Details'}</DialogTitle>
        <DialogContent className='min-w-[250px] sm:min-w-[500px]'>
          {selectedEvents?.length > 0 ? (
            <>
              {isEditMode ? 
                <div>
                  <TextField
                    label="Title"
                    value={eventSelectedForEdit.title}
                    onChange={(e) => setSelectedEventForEdit({ ...eventSelectedForEdit, title: e.target.value })}
                    fullWidth
                    margin="normal"
                    size="small"
                    disabled={!isEditMode}
                  />
                  <TextField
                    label="Description"
                    value={eventSelectedForEdit.description}
                    onChange={(e) => setSelectedEventForEdit({ ...eventSelectedForEdit, description: e.target.value })}
                    fullWidth
                    margin="normal"
                    multiline
                    size="small"
                    rows={3}
                    disabled={!isEditMode}
                  />
                  <Autocomplete
                    options={categoriesList}
                    getOptionLabel={(option) => option.name}
                    value={eventSelectedForEdit.category}
                    size="small"
                    margin="normal"
                    renderInput={(params) => <TextField {...params} label="Category" />}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onChange={(event, newValue) => {
                      setSelectedEventForEdit({ ...eventSelectedForEdit, category: newValue })
                    }}
                  />
                  <div className="flex flex-row gap-2">
                    <TextField
                      label="From"
                      type="time"
                      value={eventSelectedForEdit.fromTime}
                      onChange={(e) => setSelectedEventForEdit({ ...eventSelectedForEdit, fromTime: e.target.value })}
                      fullWidth
                      margin="normal"
                      size="small"
                      className='flex-1'
                      disabled={!isEditMode}
                    />
                    <TextField
                      label="To"
                      type="time"
                      value={eventSelectedForEdit.toTime}
                      onChange={(e) => setSelectedEventForEdit({ ...eventSelectedForEdit, toTime: e.target.value })}
                      fullWidth
                      margin="normal"
                      size="small"
                      className='flex-1'
                      disabled={!isEditMode}
                    />
                  </div>
                  <>
                    <TextField
                      label="Background Color"
                      type="color"
                      value={eventSelectedForEdit.bgColor}
                      onChange={(e) => setSelectedEventForEdit({ ...eventSelectedForEdit, bgColor: e.target.value })}
                      fullWidth
                      margin="normal"
                      size="small"
                    />
                    <TextField
                      label="Text Color"
                      type="color"
                      value={eventSelectedForEdit.textColor}
                      onChange={(e) => setSelectedEventForEdit({ ...eventSelectedForEdit, textColor: e.target.value })}
                      fullWidth
                      margin="normal"
                      size="small"
                    />
                  </>
                </div> 
                :
                <div>
                  <h1 className='text-lg' style={{marginBottom: "10px"}}>{selectedDate}</h1>
                  {selectedEvents?.map((event) => (
                    <div key={event.id} className="mb-2 flex flex-col rounded-lg shadow-lg border-2">
                      <div className="flex flex-row">
                      <div className='w-[15px] rounded-l-lg' style={{ backgroundColor: event.bgColor, color: event.textColor }}></div>
                      <div className='flex-grow flex flex-col gap-2 p-2'>
                        <h1 className="text-md font-bold">Title: {event.title}</h1>
                        <h1 className="text-sm" style={{wordWrap: "break-word"}}>Description: {event.description || "No description"}</h1>
                        <h1 className="text-sm">Category: {event?.category?.name || "Not selected"}</h1>
                        <div className='flex flex-row gap-2'> 
                          <p className="text-xs">From: {event.fromTime || "-"}</p> 
                          <p className="text-xs">To: {event.toTime || "-"}</p>
                        </div> 
                      </div>
                      <div className="flex flex-row gap-2 justify-end items-center p-2">
                          <IconButton onClick={() => handleEditEvent(event)} aria-label="Edit event" size="small">
                            <Edit />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteEvent(event)} aria-label="Delete event" size="small">
                            <Delete />
                          </IconButton>
                      </div>
                      </div>
                    </div>
                    ))
                  }
                </div>
              }
            </>
          ) : 
          (
            <>
              <h1 className='text-lg' style={{marginBottom: "10px"}}>{selectedDate}</h1>
              <Typography>No events on this date.</Typography>
            </>
          )
        }
        </DialogContent>
        <DialogActions>
          {isEditMode && eventSelectedForEdit && (
            <Button size="small" onClick={() => handleSaveEditedEvent(eventSelectedForEdit)} variant="outlined" color="primary" className='m-2'>
              Save
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Dialog open={isAddEventModalOpen} onClose={() => setIsAddEventModalOpen(false)}>
        <DialogTitle>Add Event</DialogTitle>
        <DialogContent>
          <TextField
            label="Date"
            type="date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            fullWidth
            size="small"
            margin="normal"
          />
          <TextField
            label="Title"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            fullWidth
            margin="normal"
            size="small"
            inputProps={{ maxLength: 20 }} 
          />
          <TextField
            label="Description"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            fullWidth
            margin="normal"
            multiline
            rows={3}
            size="small"
            inputProps={{ maxLength: 30 }}
          />
          <Autocomplete
            options={categoriesList}
            getOptionLabel={(option) => option.name}
            size="small"
            margin="normal"
            renderInput={(params) => <TextField {...params} label="Category" />}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(event, newValue) => {
              setNewEvent({ ...newEvent, category: newValue })
            }}
          />
          <div className="flex flex-row gap-2">
            <TextField
              label="From"
              type="time"
              value={newEvent.fromTime}
              onChange={(e) => setNewEvent({ ...newEvent, fromTime: e.target.value })}
              fullWidth
              margin="normal"
              size="small"
            />
            <TextField
              label="To"
              type="time"
              value={newEvent.toTime}
              onChange={(e) => setNewEvent({ ...newEvent, toTime: e.target.value })}
              fullWidth
              margin="normal"
              size="small"
            />
          </div>
          <div className="flex flex-row gap-2">
            <TextField
              label="Background Color"
              type="color"
              value={newEvent.bgColor}
              onChange={(e) => setNewEvent({ ...newEvent, bgColor: e.target.value })}
              fullWidth
              margin="normal"
              size="small"
            />
            <TextField
              label="Text Color"
              type="color"
              value={newEvent.textColor}
              onChange={(e) => setNewEvent({ ...newEvent, textColor: e.target.value })}
              fullWidth
              margin="normal"
              size="small"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveEvent} color="primary" size="small" variant="outlined">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}