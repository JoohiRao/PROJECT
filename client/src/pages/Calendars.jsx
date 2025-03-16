import React, { useState, useEffect, useContext } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Localizer for date handling
const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

function Calendars() {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [view, setView] = useState(Views.MONTH); // Default view: Month

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user/tasks", {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        // Convert tasks into calendar events
        const formattedEvents = response.data.map((task) => ({
          id: task._id,
          title: task.title,
          start: new Date(task.deadline),
          end: new Date(task.deadline),
          priority: task.priority,
        }));

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    if (user) fetchTasks();
  }, [user]);

  // Function to get event styling based on priority
  const getEventStyle = (event) => {
    let backgroundColor = "green"; // Default for Low Priority
    if (event.priority === "High") backgroundColor = "red";
    else if (event.priority === "Medium") backgroundColor = "orange";

    return {
      style: {
        backgroundColor,
        color: "white",
        borderRadius: "5px",
        padding: "5px",
      },
    };
  };

  // Function to check for reminders
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      events.forEach((event) => {
        const eventTime = new Date(event.start);
        const timeDiff = eventTime - now;

        if (timeDiff > 0 && timeDiff < 3600000) { // Notify 1 hour before deadline
          new Notification("Task Reminder", { body: `Your task "${event.title}" is due soon!` });
        }
      });
    };

    if (Notification.permission === "granted") {
      const interval = setInterval(checkReminders, 60000); // Check every minute
      return () => clearInterval(interval);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  }, [events]);

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">Task Calendar</h1>

      {/* Dropdown for selecting calendar view */}
      <div className="flex justify-center mb-4">
        <label className="mr-2 font-semibold">View:</label>
        <select
          value={view}
          onChange={(e) => setView(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value={Views.MONTH}>Month</option>
          <option value={Views.WEEK}>Week</option>
          <option value={Views.DAY}>Day</option>
        </select>
      </div>

      {/* Calendar Component */}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        eventPropGetter={getEventStyle}
        views={{ month: true, week: true, day: true }} // Allowed views
        view={view} // Controlled view
        onView={setView} // Updates view on change
      />
    </div>
  );
}

export default Calendars;
