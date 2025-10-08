import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO, addMinutes, subMinutes } from 'date-fns';

const ContentCalendar = ({ onClose }) => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startTime: '',
    platform: 'youtube',
    type: 'video',
    notifyBefore: true
  });
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  const [notificationsAllowed, setNotificationsAllowed] = useState(false);
  const [view, setView] = useState('month'); // 'month' or 'week'

  const platforms = [
    { id: 'youtube', name: 'YouTube', icon: '🎥', color: '#FF0000' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', color: '#00F2EA' },
    { id: 'facebook', name: 'Facebook', icon: '👥', color: '#1877F2' },
    { id: 'snapchat', name: 'Snapchat', icon: '👻', color: '#FFFC00' }
  ];

  const eventTypes = [
    { id: 'video', name: 'Video', icon: '🎬' },
    { id: 'live', name: 'Live Stream', icon: '🔴' },
    { id: 'story', name: 'Story', icon: '📱' },
    { id: 'post', name: 'Post', icon: '📝' }
  ];

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Load events from localStorage on component mount
  useEffect(() => {
    const savedEvents = localStorage.getItem('calendarEvents');
    if (savedEvents) {
      try {
        // Parse dates back to Date objects
        const parsedEvents = JSON.parse(savedEvents).map(event => ({
          ...event,
          date: new Date(event.date)
        }));
        setEvents(parsedEvents);
        console.log('Loaded events:', parsedEvents);
      } catch (error) {
        console.error('Error loading events from localStorage:', error);
        // If there's an error with the stored events, clear them
        localStorage.removeItem('calendarEvents');
      }
    }
    
    // Check if notifications are allowed
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        setNotificationsAllowed(true);
      } else if (Notification.permission !== 'denied' && !localStorage.getItem('notificationPromptShown')) {
        setShowNotificationPrompt(true);
      }
    }
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('calendarEvents', JSON.stringify(events));
      console.log('Saved events:', events);
    } catch (error) {
      console.error('Error saving events to localStorage:', error);
    }
  }, [events]);

  // Set up notification timers for events
  useEffect(() => {
    if (!notificationsAllowed) return;
    
    // Clear any existing notification timers
    const timers = [];
    
    // Set up notification for each event
    events.forEach(event => {
      if (!event.notifyBefore) return;
      
      const eventTime = event.startTime ? parseISO(event.startTime) : null;
      if (!eventTime) return;
      
      const notificationTime = subMinutes(eventTime, 15);
      const now = new Date();
      
      if (notificationTime > now) {
        const timeUntilNotification = notificationTime.getTime() - now.getTime();
        
        const timerId = setTimeout(() => {
          sendNotification(event);
        }, timeUntilNotification);
        
        timers.push(timerId);
      }
    });
    
    // Cleanup function to clear all timers
    return () => {
      timers.forEach(id => clearTimeout(id));
    };
  }, [events, notificationsAllowed]);

  const sendNotification = (event) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    
    const platform = platforms.find(p => p.id === event.platform);
    const eventType = eventTypes.find(t => t.id === event.type);
    
    const notification = new Notification('Content Creator App - Event Reminder', {
      body: `${platform?.icon || ''} ${event.title} starting in 15 minutes!`,
      icon: '/favicon.ico'
    });
    
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) return;
    
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      setNotificationsAllowed(true);
      setShowNotificationPrompt(false);
      localStorage.setItem('notificationPromptShown', 'true');
    } else {
      setShowNotificationPrompt(false);
      localStorage.setItem('notificationPromptShown', 'true');
    }
  };

  const handleBack = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowEventForm(true);
    setNewEvent({
      ...newEvent,
      startTime: format(date, 'yyyy-MM-dd') + 'T09:00'
    });
  };

  const handleEventSubmit = (e) => {
    e.preventDefault();
    if (!newEvent.title) return;

    const eventToAdd = {
      ...newEvent,
      id: Date.now(),
      platformColor: platforms.find(p => p.id === newEvent.platform)?.color || '#8B5CF6',
      typeIcon: eventTypes.find(t => t.id === newEvent.type)?.icon || '📝'
    };

    console.log('Creating new event:', eventToAdd);

    // Save to state
    const updatedEvents = [...events, eventToAdd];
    setEvents(updatedEvents);
    
    // Set up notification if enabled
    if (eventToAdd.notifyBefore && notificationsAllowed && eventToAdd.startTime) {
      const eventTime = parseISO(eventToAdd.startTime);
      const notificationTime = subMinutes(eventTime, 15);
      const now = new Date();
      
      if (notificationTime > now) {
        const timeUntilNotification = notificationTime.getTime() - now.getTime();
        
        setTimeout(() => {
          sendNotification(eventToAdd);
        }, timeUntilNotification);
      }
    }

    setShowEventForm(false);
    setNewEvent({
      title: '',
      description: '',
      startTime: '',
      platform: 'youtube',
      type: 'video',
      notifyBefore: true
    });
  };

  const getEventsForDate = (date) => {
    if (!date || !events.length) return [];
    return events.filter(event => {
      if (!event.startTime) return false;
      const eventDate = new Date(event.startTime);
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      );
    });
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  // Add this function to get today at 09:00 in yyyy-MM-ddTHH:mm format
  const getTodayDefaultTime = () => {
    const now = new Date();
    return format(now, "yyyy-MM-dd'T'HH:mm");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Navigation Bar */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <button 
                  onClick={handleBack} 
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  aria-label="Go back"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <h1 className="ml-4 text-xl font-semibold text-gray-900">Content Calendar</h1>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    setShowEventForm(true);
                    setSelectedDate(null);
                    setNewEvent({
                      ...newEvent,
                      startTime: getTodayDefaultTime(),
                    });
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Event
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Header */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={prevMonth}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="text-2xl font-semibold text-gray-900">
                {format(currentDate, view === 'month' ? 'MMMM yyyy' : 'MMMM d, yyyy')}
              </h2>
              <button
                onClick={nextMonth}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <div className="ml-4 flex space-x-2">
                <button
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${view === 'month' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                  onClick={() => setView('month')}
                >
                  Month
                </button>
                <button
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${view === 'week' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                  onClick={() => setView('week')}
                >
                  Week
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {platforms.map(platform => (
                <div key={platform.id} className="flex items-center">
                  <span className="text-sm text-gray-600">{platform.icon}</span>
                  <span className="ml-1 text-sm text-gray-600">{platform.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar Grid */}
          {view === 'month' ? (
            <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
              {days.map(day => (
                <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
              {monthDays.map((day, dayIdx) => {
                const dayEvents = getEventsForDate(day);
                return (
                  <div
                    key={day.toString()}
                    onClick={() => handleDateClick(day)}
                    className={`min-h-[120px] bg-white p-2 cursor-pointer hover:bg-gray-50 relative ${
                      !isSameMonth(day, currentDate) ? 'text-gray-400' : ''
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-sm ${
                        isSameDay(day, new Date()) ? 'bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''
                      }`}>
                        {format(day, 'd')}
                      </span>
                      {dayEvents.length > 0 && (
                        <span className="text-xs bg-purple-100 text-purple-800 px-1.5 rounded-full">
                          {dayEvents.length}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1">
                      {(() => {
                        const maxEventsToShow = 3;
                        const eventsToShow = dayEvents.slice(0, maxEventsToShow);
                        const extraCount = dayEvents.length - maxEventsToShow;
                        return (
                          <>
                            {eventsToShow.map(event => {
                              const platform = platforms.find(p => p.id === event.platform);
                              const startTime = event.startTime ? new Date(event.startTime) : null;
                              const timeString = startTime ? format(startTime, 'h:mm a') : '';
                              return (
                                <div
                                  key={event.id}
                                  className="w-full rounded-md px-2 py-1 mb-1 cursor-pointer font-semibold text-xs flex items-center shadow"
                                  style={{
                                    backgroundColor: platform?.color || '#8B5CF6',
                                    color: '#fff',
                                    minHeight: '22px',
                                    maxHeight: '22px',
                                    boxShadow: '0 1px 4px rgba(0,0,0,0.10)'
                                  }}
                                  title={`${event.title} - ${timeString}`}
                                >
                                  <span className="mr-1 font-bold" style={{minWidth: '36px'}}>{timeString}</span>
                                  <span className="truncate font-bold" style={{lineHeight: '1.1'}}>{event.title}</span>
                                </div>
                              );
                            })}
                            {extraCount > 0 && (
                              <div className="text-xs text-blue-700 font-semibold cursor-pointer mt-1" style={{minHeight: '20px'}}>
                                +{extraCount} more
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Week View
            <div className="overflow-x-auto">
              <div className="grid grid-cols-8 min-w-[900px] bg-white rounded-xl shadow-lg border border-gray-200">
                {/* Time labels */}
                <div className="bg-gray-50 border-r border-gray-200 rounded-l-xl">
                  {Array.from({ length: 24 }).map((_, hour) => (
                    <div key={hour} className="h-16 flex items-start justify-end pr-3 pt-1 text-base text-gray-400 font-semibold">
                      {hour === 0 ? '' : format(new Date().setHours(hour, 0, 0, 0), 'h a')}
                    </div>
                  ))}
                </div>
                {/* Days columns */}
                {Array.from({ length: 7 }).map((_, dayIdx) => {
                  const weekStart = currentDate;
                  const day = new Date(weekStart);
                  day.setDate(weekStart.getDate() - weekStart.getDay() + dayIdx);
                  const dayEvents = getEventsForDate(day);
                  const isToday = isSameDay(day, new Date());
                  return (
                    <div key={dayIdx} className={`border-r border-gray-200 relative bg-white ${isToday ? 'bg-blue-50' : ''}` + (dayIdx === 6 ? ' rounded-r-xl' : '')}>
                      {/* Day label */}
                      <div className="h-12 text-center text-lg font-bold bg-gray-100 border-b border-gray-200 flex items-center justify-center sticky top-0 z-20 shadow-sm">
                        <span className={isToday ? 'text-blue-600' : 'text-gray-800'}>{format(day, 'EEE d')}</span>
                      </div>
                      {/* Hour slots */}
                      <div className="relative" style={{ height: 24 * 64 }}>
                        {/* Current time line */}
                        {isToday && (() => {
                          const now = new Date();
                          const hour = now.getHours() + now.getMinutes() / 60;
                          const top = hour * 64;
                          return (
                            <div style={{ top }} className="absolute left-0 right-0 h-0.5 bg-red-500 z-30" />
                          );
                        })()}
                        {dayEvents.map(event => {
                          const start = event.startTime ? new Date(event.startTime) : null;
                          const end = event.endTime ? new Date(event.endTime) : null;
                          const startHour = start ? start.getHours() + start.getMinutes() / 60 : 9;
                          const endHour = end ? end.getHours() + end.getMinutes() / 60 : startHour + 1;
                          const top = (startHour - 1) * 64;
                          const height = Math.max((endHour - startHour) * 64, 40);
                          const platform = platforms.find(p => p.id === event.platform);
                          return (
                            <div
                              key={event.id}
                              className="absolute left-2 right-2 rounded-lg px-3 py-2 text-base font-bold shadow-2xl cursor-pointer border border-white bg-opacity-100 flex items-center"
                              style={{
                                top,
                                height,
                                backgroundColor: platform?.color || '#8B5CF6',
                                color: '#fff',
                                zIndex: 10
                              }}
                              title={event.title}
                            >
                              <span className="mr-2 text-base font-extrabold" style={{minWidth: '48px'}}>{start ? format(start, 'h:mm a') : ''}</span>
                              <span className="truncate text-base font-bold" style={{lineHeight: '1.2'}}>{event.title}</span>
                            </div>
                          );
                        })}
                        {/* Hour lines */}
                        {Array.from({ length: 24 }).map((_, hour) => (
                          <div
                            key={hour}
                            className="absolute left-0 right-0 border-t border-gray-100"
                            style={{ top: hour * 64, height: 0 }}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Event Form Modal */}
      {showEventForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative z-50 mt-16">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedDate ? `Add Event for ${format(selectedDate, 'MMMM d, yyyy')}` : 'Add New Event'}
              </h3>
              <button
                onClick={() => setShowEventForm(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleEventSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Enter event title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Enter event description"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input
                  type="datetime-local"
                  value={newEvent.startTime}
                  onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                <select
                  value={newEvent.platform}
                  onChange={(e) => setNewEvent({ ...newEvent, platform: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                >
                  {platforms.map(platform => (
                    <option key={platform.id} value={platform.id}>
                      {platform.icon} {platform.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                >
                  {eventTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.icon} {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center">
                <input
                  id="notifyBefore"
                  type="checkbox"
                  checked={newEvent.notifyBefore}
                  onChange={(e) => setNewEvent({ ...newEvent, notifyBefore: e.target.checked })}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="notifyBefore" className="ml-2 block text-sm text-gray-700">
                  Notify me 15 minutes before this event
                </label>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEventForm(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification Permission Modal */}
      {showNotificationPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Enable Notifications?</h2>
            <p className="text-gray-600 mb-6">
              Would you like to receive notifications 15 minutes before your events start?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowNotificationPrompt(false);
                  localStorage.setItem('notificationPromptShown', 'true');
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                No Thanks
              </button>
              <button
                onClick={requestNotificationPermission}
                className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Enable Notifications
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentCalendar; 