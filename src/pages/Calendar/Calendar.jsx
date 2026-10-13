import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendar.css";
import Navbar from "../../components/Navbar";
import CalendarCard from "../../components/CalendarCard";

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState(() => {
    return JSON.parse(localStorage.getItem("calendarEvents")) || {};
  });

  const [formData, setFormData] = useState({
    time: "",
    description: "",
    website: "",
  });

  // Popup alerts when time matches event
useEffect(() => {
  if (Notification.permission !== "granted") {
    Notification.requestPermission().then((permission) => {
      if (permission !== "granted") {
        console.warn("Notifications blocked by user.");
      }
    });
  }

  const interval = setInterval(() => {
    const now = new Date();
    const nowStr = now.toTimeString().slice(0, 5); // HH:MM
    const todayKey = now.toDateString();
    const todaysEvents = events[todayKey] || [];

    const updatedEvents = { ...events };
    let changed = false;

    todaysEvents.forEach((event, idx) => {
      if (
        event.time &&
        !event.notified &&
        event.status !== "complete" &&
        event.time === nowStr
      ) {
        // 🔔 Trigger notification
        if (Notification.permission === "granted") {
          new Notification("⏰ Event Reminder", {
            body: `${event.description} at ${event.time}`,
            icon: "https://cdn-icons-png.flaticon.com/512/1827/1827349.png",
          });

          try {
            const audio = new Audio("/notification.mp3"); // Ensure file is in /public
            audio.play();
          } catch (err) {
            console.error("Audio failed to play:", err);
          }
        }

        // ✅ Mark event as notified
        updatedEvents[todayKey][idx].notified = true;
        changed = true;
      }
    });

    if (changed) {
      setEvents(updatedEvents);
      localStorage.setItem("calendarEvents", JSON.stringify(updatedEvents));
    }
  }, 60000); // every 60 seconds

  return () => clearInterval(interval);
}, [events]);



  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const saveEvents = (newEvents) => {
    localStorage.setItem("calendarEvents", JSON.stringify(newEvents));
  };

  const addEvent = () => {
    const dateKey = selectedDate.toDateString();
    const newEvent = {
      ...formData,
      status: "pending",
      notified: false,
    };
    const updatedEvents = {
      ...events,
      [dateKey]: [...(events[dateKey] || []), newEvent],
    };
    setEvents(updatedEvents);
    saveEvents(updatedEvents);
    setFormData({ time: "", description: "", website: "" });
  };

  const deleteEvent = (dateKey, index) => {
    const updated = [...events[dateKey]];
    updated.splice(index, 1);
    const updatedEvents = { ...events, [dateKey]: updated };
    setEvents(updatedEvents);
    saveEvents(updatedEvents);
  };

  const markComplete = (dateKey, index) => {
    const updated = [...events[dateKey]];
    updated[index].status = "complete";
    const updatedEvents = { ...events, [dateKey]: updated };
    setEvents(updatedEvents);
    saveEvents(updatedEvents);
  };

  // Show event description inside calendar tile
  const tileContent = ({ date }) => {
    const dateKey = date.toDateString();
    const dayEvents = events[dateKey] || [];

    return (
      <div className="tile-events">
        {dayEvents.slice(0, 2).map((event, i) => (
          <div
            key={i}
            className={`tile-event ${event.status}`}
            title={`${event.time} - ${event.description}`}
          >
            {event.description}
          </div>
        ))}
        {dayEvents.length > 2 && <span className="more-events">+{dayEvents.length - 2} more</span>}
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="calendar-container">
        <div className="calendar-left">
          <h2>Deadline Dream Dates</h2>
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            tileContent={tileContent}
          />

          <div className="form">
            <h3>Create New Event</h3>
            <p><strong>Date:</strong> {selectedDate.toDateString()}</p>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="website"
              placeholder="Website URL"
              value={formData.website}
              onChange={handleInputChange}
            />
            <button onClick={addEvent}>Add Event</button>
          </div>
        </div>

        <div className="calendar-right">
          <h2>Events for {selectedDate.toDateString()}</h2>
          {(events[selectedDate.toDateString()] || []).map((event, index) => (
            <CalendarCard
              key={index}
              event={event}
              dateKey={selectedDate.toDateString()}
              index={index}
              onDelete={() => deleteEvent(selectedDate.toDateString(), index)}
              onComplete={() => markComplete(selectedDate.toDateString(), index)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default CalendarPage;
