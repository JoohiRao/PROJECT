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
  const [view, setView] = useState(Views.MONTH);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user/tasks", {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        // Convert tasks to calendar events
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

  // Styling based on priority
  const getEventStyle = (event) => {
    let backgroundColor = "green"; // Low Priority
    if (event.priority === "High") backgroundColor = "red";
    else if (event.priority === "Medium") backgroundColor = "orange";

    return {
      style: {
        backgroundColor,
        color: "gray",
        borderRadius: "5px",
        padding: "5px",
      },
    };
  };

  // Reminder notifications
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      events.forEach((event) => {
        const eventTime = new Date(event.start);
        const timeDiff = eventTime - now;

        if (timeDiff > 0 && timeDiff < 3600000) {
          new Notification("Task Reminder", { body: `Your task "${event.title}" is due soon!` });
        }
      });
    };

    if (Notification.permission === "granted") {
      const interval = setInterval(checkReminders, 60000);
      return () => clearInterval(interval);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  }, [events]);

  // Style for the calendar cells and texts
  const calendarStyle = {
    style: {
      backgroundColor: "#1a1a1a",
      color: "gray",
      borderColor: "gray",
    },
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-gray-400">
      <div className="w-full max-w-6xl p-6 bg-[#1a1a1a] shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-400">Task Calendar</h1>

        {/* Calendar View Selector */}
        <div className="flex justify-center mb-4">
          <label className="mr-2 font-semibold text-gray-500">View:</label>
          <select
            value={view}
            onChange={(e) => setView(e.target.value)}
            className="p-2 bg-[#333333] border border-gray-500 text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={Views.MONTH}>Month</option>
            <option value={Views.WEEK}>Week</option>
            <option value={Views.DAY}>Day</option>
          </select>
        </div>

        {/* Calendar Component */}
        <div className="bg-[#1a1a1a] p-4 rounded-lg shadow-lg">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500, backgroundColor: "#1a1a1a", color: "gray" }}
            eventPropGetter={getEventStyle}
            views={{ month: true, week: true, day: true }}
            view={view}
            onView={setView}
            dayPropGetter={() => calendarStyle} // Styling day cells
          />
        </div>
      </div>
    </div>
  );
}

export default Calendars;
