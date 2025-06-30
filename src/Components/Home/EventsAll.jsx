"use client";

import { useEffect, useState, useMemo, useContext } from "react";
import axios from "axios";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUsers,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaSearch
} from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AuthContexts } from "../../Providers/AuthProvider";

const EventsAll = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joiningEvent, setJoiningEvent] = useState(null);

  const { user } = useContext(AuthContexts) || {};
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterDateRange, setFilterDateRange] = useState("allDates");

  const getUserEmail = () => {
    return user?.email;
  };

  const userEmail = getUserEmail();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://event-mangemnet-server-5.onrender.com/events", {
        withCredentials: true,
      });
      setEvents(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events. Please try again.");
      toast.error("Failed to load events", { id: 'fetchEventsError' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleJoinEvent = async (eventId) => {
    if (!userEmail) {
      toast.error("Please log in to join events.");
      navigate("/login");
      return;
    }

    if (joiningEvent === eventId) return;

    try {
      setJoiningEvent(eventId);

      const event = events.find((e) => e._id === eventId);

      const currentUserHasJoined = event?.attendees?.some((attendee) => {
        const normalizedAttendee = attendee?.toLowerCase().trim();
        const normalizedUserEmail = userEmail.toLowerCase().trim();
        return normalizedAttendee === normalizedUserEmail;
      });

      if (currentUserHasJoined) {
        toast.success("You have already joined this event!");
        setJoiningEvent(null);
        return;
      }

      const response = await axios.post(
        `https://event-mangemnet-server-5.onrender.com/events/${eventId}/join`,
        { email: userEmail },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("🎉 Successfully joined the event!");
        await fetchEvents();
      }
    } catch (error) {
      console.error("Error joining event:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to join event. Please try again.";

      if (error.response?.status === 400) {
        if (errorMessage.toLowerCase().includes("already joined")) {
          toast.success("You have already joined this event!");
        } else if (errorMessage.toLowerCase().includes("full")) {
          toast.error("Sorry, this event is full!");
        } else {
          toast.error(errorMessage);
        }
      } else {
        toast.error("Something went wrong. Please try again.");
      }

      await fetchEvents();
    } finally {
      setJoiningEvent(null);
    }
  };

  const isSameDay = (d1, d2) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const getWeekBounds = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const weekStart = new Date(d.setDate(diff));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    return { start: weekStart, end: weekEnd };
  };

  const isToday = (eventDate) => {
    const today = new Date();
    return isSameDay(new Date(eventDate), today);
  };

  const isCurrentWeek = (eventDate) => {
    const today = new Date();
    const { start: weekStart, end: weekEnd } = getWeekBounds(today);
    const eventDt = new Date(eventDate);
    return eventDt >= weekStart && eventDt <= weekEnd;
  };

  const isLastWeek = (eventDate) => {
    const today = new Date();
    const lastWeekDay = new Date(today);
    lastWeekDay.setDate(today.getDate() - 7);
    const { start: lastWeekStart, end: lastWeekEnd } = getWeekBounds(lastWeekDay);
    const eventDt = new Date(eventDate);
    return eventDt >= lastWeekStart && eventDt <= lastWeekEnd;
  };

  const isCurrentMonth = (eventDate) => {
    const today = new Date();
    const eventDt = new Date(eventDate);
    return eventDt.getFullYear() === today.getFullYear() &&
           eventDt.getMonth() === today.getMonth();
  };

  const isLastMonth = (eventDate) => {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const eventDt = new Date(eventDate);
    return eventDt.getFullYear() === lastMonth.getFullYear() &&
           eventDt.getMonth() === lastMonth.getMonth();
  };

  const filteredEvents = useMemo(() => {
    let tempEvents = [...events];

    if (searchTerm) {
      tempEvents = tempEvents.filter((event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterDate) {
      const selectedDate = new Date(filterDate);
      tempEvents = tempEvents.filter((event) =>
        isSameDay(new Date(event.dateTime), selectedDate)
      );
    } else if (filterDateRange !== "allDates") {
      tempEvents = tempEvents.filter((event) => {
        const eventDate = new Date(event.dateTime);
        switch (filterDateRange) {
          case "today":
            return isToday(eventDate);
          case "currentWeek":
            return isCurrentWeek(eventDate);
          case "lastWeek":
            return isLastWeek(eventDate);
          case "currentMonth":
            return isCurrentMonth(eventDate);
          case "lastMonth":
            return isLastMonth(eventDate);
          default:
            return true;
        }
      });
    }

    return tempEvents;
  }, [events, searchTerm, filterDate, filterDateRange]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterDate("");
    setFilterDateRange("allDates");
    toast.success("Filters cleared!");
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
        <p className="ml-4 text-xl text-red-600 font-semibold mt-4">
          Loading Events...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 text-center min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <FaExclamationTriangle className="mx-auto text-6xl text-red-500 mb-4" />
        <p className="text-xl text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchEvents}
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            style: {
              background: "#10B981",
              color: "#fff",
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#10B981',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: "#EF4444",
              color: "#fff",
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#EF4444',
            },
          },
        }}
      />

      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
          <span className="text-red-600">🎉</span> Explore All Events
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Discover a diverse range of exciting events, from international congresses to meditation classes, and connect with communities that share your interests.
        </p>
      </div>

      <div className="mb-8 flex flex-col md:flex-row justify-center items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <input
            type="text"
            placeholder="Search by Property or Employee"
            className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative flex-1 min-w-[150px] max-w-[200px]">
          <input
            type="date"
            className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-gray-700 appearance-none"
            value={filterDate}
            onChange={(e) => {
              setFilterDate(e.target.value);
              setFilterDateRange("allDates");
            }}
          />
          <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        <div className="relative flex-1 min-w-[150px] max-w-[200px]">
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-gray-700 appearance-none pr-8"
            value={filterDateRange}
            onChange={(e) => {
              setFilterDateRange(e.target.value);
              setFilterDate("");
            }}
          >
            <option value="allDates">Select a date range</option>
            <option value="today">Today</option>
            <option value="currentWeek">Current Week</option>
            <option value="lastWeek">Last Week</option>
            <option value="currentMonth">Current Month</option>
            <option value="lastMonth">Last Month</option>
          </select>
          <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>

        <button
          onClick={handleClearFilters}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 transition-colors duration-200 shadow-sm"
        >
          Clear Filters <span className="font-bold text-gray-500">X</span>
        </button>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-md">
          <div className="text-6xl mb-4 text-gray-400">🔍</div>
          <p className="text-xl text-gray-500 mb-4">
            No events found matching your criteria.
          </p>
          <p className="text-gray-400">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => {
            const isLoggedIn = !!userEmail;

            const attendees = Array.isArray(event.attendees)
              ? event.attendees
              : [];

            const currentUserHasJoined = isLoggedIn && attendees.some((attendee) => {
              if (typeof attendee !== "string") return false;
              const normalizedAttendee = attendee.toLowerCase().trim();
              const normalizedUserEmail = userEmail.toLowerCase().trim();
              return normalizedAttendee === normalizedUserEmail;
            });

            const currentAttendees = event.currentAttendees || 0;
            const maxAttendees = event.maxAttendees || 0;
            const isFull = maxAttendees > 0 && currentAttendees >= maxAttendees;
            const isJoining = joiningEvent === event._id;

            const isButtonDisabled = !isLoggedIn || currentUserHasJoined || isFull || isJoining;

            return (
              <div
                key={event._id}
                className="bg-white rounded-2xl border overflow-hidden transform transition-all duration-300 hover:scale-103 hover:shadow-2xl relative"
              >
                <div className="relative">
                  <img
                    src={event.image || "https://placehold.co/600x400/cccccc/333333?text=Event+Image"}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = "https://placehold.co/600x400/cccccc/333333?text=Event+Image";
                    }}
                  />
                  <div className="absolute top-4 right-4 flex flex-col items-end gap-2 z-10">
                    {currentUserHasJoined && (
                      <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-md">
                        <FaCheckCircle className="w-3 h-3" />
                        You Joined
                      </div>
                    )}
                    {isFull && (
                      <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                        Full
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-800 line-clamp-2 pr-2">
                      {event.title}
                    </h3>
                  </div>

                  <p className="text-sm text-gray-500 mb-4">
                    Organized by: <span className="font-medium text-red-600">{event.name}</span>
                  </p>

                  <div className="space-y-2 text-gray-700 mb-4">
                    <div className="flex items-center gap-3">
                      <FaCalendarAlt className="text-red-500 flex-shrink-0" />
                      <span className="text-sm font-medium">
                        {new Date(event.dateTime).toLocaleString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <FaMapMarkerAlt className="text-red-500 flex-shrink-0" />
                      <span className="text-sm font-medium line-clamp-1">
                        {event.location}
                      </span>
                    </div>

                    {event.description && (
                      <p className="text-gray-600 text-sm mt-3 line-clamp-3">
                        {event.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <FaUsers className="text-red-500" />
                      <span className="text-sm font-semibold">
                        {currentAttendees} / {maxAttendees || "Unlimited"} Attendees
                      </span>
                    </div>

                    {maxAttendees > 0 && (
                      <div className="flex-1 ml-4 h-2 bg-gray-200 rounded-full">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isFull ? "bg-red-500" : "bg-green-500"
                          }`}
                          style={{
                            width: `${Math.min(
                              (currentAttendees / maxAttendees) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    )}
                  </div>

                  {attendees.length > 0 && (
                    <div className="pt-4 mt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-2">
                        Who's Going:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {attendees.slice(0, 4).map((attendee, index) => (
                          <span
                            key={index}
                            className={`text-xs px-2 py-1 rounded-full ${
                              isLoggedIn && attendee?.toLowerCase().trim() ===
                              userEmail.toLowerCase().trim()
                                ? "bg-green-100 text-green-800 font-semibold"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {isLoggedIn && attendee?.toLowerCase().trim() ===
                            userEmail.toLowerCase().trim()
                              ? "You"
                              : attendee?.split("@")[0] || "Unknown"}
                          </span>
                        ))}
                        {attendees.length > 4 && (
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                            +{attendees.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <button
                    className={`w-full mt-6 py-2.5 px-4 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm ${
                      !isLoggedIn
                        ? "bg-gray-500 cursor-not-allowed"
                        : currentUserHasJoined
                        ? "bg-green-600 cursor-default"
                        : isFull
                        ? "bg-gray-400 cursor-not-allowed"
                        : isJoining
                        ? "bg-red-400 cursor-wait"
                        : "bg-red-600 hover:bg-red-700 hover:scale-105 active:scale-95"
                    }`}
                    onClick={() => handleJoinEvent(event._id)}
                    disabled={isButtonDisabled}
                    title={
                      !isLoggedIn
                        ? "Please log in to join events"
                        : isJoining
                        ? "Processing your request..."
                        : currentUserHasJoined
                        ? "You have already joined this event"
                        : isFull
                        ? "This event is full"
                        : "Click to join this event"
                    }
                  >
                    {isJoining ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Joining...
                      </>
                    ) : !isLoggedIn ? (
                      <>
                        <FaInfoCircle className="w-4 h-4" />
                        Log in to Join
                      </>
                    ) : currentUserHasJoined ? (
                      <>
                        <FaCheckCircle className="w-4 h-4" />
                        Already Joined
                      </>
                    ) : isFull ? (
                      "Event Full"
                    ) : (
                      "Join Event"
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EventsAll;
