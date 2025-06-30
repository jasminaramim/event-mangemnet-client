"use client"

import { useContext, useEffect, useState } from "react"
import { toast, Toaster } from "react-hot-toast"
import Swal from "sweetalert2"
import { motion } from "framer-motion"
import { AuthContexts } from "../../Providers/AuthProvider"
import axios from "axios"

const MyEvents = () => {
    const { user, axiosPublic } = useContext(AuthContexts) || {}
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentEvent, setCurrentEvent] = useState(null)
    const [formData, setFormData] = useState({
        title: "",
        name: "",
        dateTime: "",
        location: "",
        image: "",
        description: "",
        maxAttendees: 0,
    })
    const [updating, setUpdating] = useState(false)

    // Redirect to login if user is not authenticated
    if (!user) {
        return (
            <div className="text-center py-10 text-red-600">
                Please{" "}
                <a href="/login" className="underline text-blue-600 hover:text-blue-800">
                    log in
                </a>{" "}
                to view your events.
            </div>
        )
    }

    // Handle context error
    const handleContextError = () => {
        console.error("AuthContexts is null. Ensure MyEvents is wrapped in AuthProvider.")
        return <div className="text-center py-4 text-red-600">Error: Authentication context not found</div>
    }

    // Fetch events created by logged-in user
    const fetchEvents = async () => {
        if (user?.email) {
            try {
                const response = await axios.get(`http://localhost:5000/events/email/${user.email}`)
                setEvents(Array.isArray(response.data) ? response.data : [])
                setLoading(false)
            } catch (err) {
                console.error("Error fetching events:", err)
                toast.error(err.response?.data?.message || "Failed to load events")
                setEvents([])
                setLoading(false)
            }
        }
    }

    const [authContextError, setAuthContextError] = useState(false)

    useEffect(() => {
        if (!user) {
            setAuthContextError(true)
        } else {
            fetchEvents()
        }
    }, [user, axiosPublic])

    if (authContextError) {
        return handleContextError()
    }

    // Handle delete
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This will permanently delete the event and all its attendees.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e3342f",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:5000/events/${id}`)
                    setEvents(events.filter((event) => event._id !== id))
                    Swal.fire("Deleted!", "The event has been deleted successfully.", "success")
                } catch (error) {
                    console.error("Error deleting event:", error)
                    Swal.fire("Error!", error.response?.data?.message || "Could not delete the event.", "error")
                }
            }
        })
    }

    // Open update modal
    const openUpdateModal = (event) => {
        setCurrentEvent(event)
        setFormData({
            title: event.title || "",
            name: event.name || "",
            dateTime: event.dateTime ? new Date(event.dateTime).toISOString().slice(0, 16) : "",
            location: event.location || "",
            image: event.image || "",
            description: event.description || "",
            maxAttendees: event.maxAttendees || 0,
            creatorEmail: event.creatorEmail || user.email,
        })
        setIsModalOpen(true)
    }

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false)
        setCurrentEvent(null)
        setFormData({
            title: "",
            name: "",
            dateTime: "",
            location: "",
            image: "",
            description: "",
            maxAttendees: 0,
        })
    }

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: name === "maxAttendees" ? Number.parseInt(value) || 0 : value,
        })
    }

    // Handle update submission
    const handleUpdate = async (e) => {
        e.preventDefault()
        setUpdating(true)

        try {
            // Validate required fields
            if (!formData.title || !formData.name || !formData.dateTime || !formData.location || !formData.description) {
                toast.error("Please fill in all required fields")
                setUpdating(false)
                return
            }

            // Validate max attendees
            const currentAttendees = currentEvent.currentAttendees || 0
            if (formData.maxAttendees > 0 && formData.maxAttendees < currentAttendees) {
                toast.error(`Maximum attendees cannot be less than current attendees (${currentAttendees})`)
                setUpdating(false)
                return
            }

            const response = await axios.put(`http://localhost:5000/events/${currentEvent._id}`, formData)

            if (response.data.success) {
                toast.success("Event updated successfully!")
                closeModal()
                // Refresh events list
                await fetchEvents()
            } else {
                toast.error("Failed to update event")
            }
        } catch (error) {
            console.error("Error updating event:", error)
            toast.error(error.response?.data?.message || "Something went wrong while updating the event!")
        } finally {
            setUpdating(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="w-12 h-12 border-4 border-t-red-600 border-gray-300 rounded-full"
                />
                <p className="ml-4 text-xl text-gray-600">Loading your events...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
            <Toaster position="top-center" />

            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-10"
                >
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">My Events</h2>
                    <p className="text-gray-600 text-lg">Manage and update your created events</p>
                </motion.div>

                {events.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-center py-20"
                    >
                        <div className="text-6xl mb-4">📅</div>
                        <p className="text-xl text-gray-500 mb-4">No events found</p>
                        <p className="text-gray-400">Create your first event to get started!</p>
                    </motion.div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event, index) => (
                            <motion.div
                                key={event._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                {/* Event Image */}
                                {event.image && (
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={event.image || "/placeholder.svg?height=200&width=400"}
                                            alt={event.title}
                                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                        />
                                        <div className="absolute top-4 right-4">
                                            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">My Event</div>
                                        </div>
                                    </div>
                                )}

                                {/* Event Header */}
                                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4">
                                    <h3 className="text-xl font-bold mb-1 line-clamp-2">{event.title}</h3>
                                    <p className="text-red-100 text-sm">Organized by: {event.name}</p>
                                </div>

                                {/* Event Details */}
                                <div className="p-6 space-y-4">
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
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

                                    <div className="flex items-center gap-3 text-gray-700">
                                        <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span className="text-sm font-medium line-clamp-1">{event.location}</span>
                                    </div>

                                    {event.description && <p className="text-gray-600 text-sm line-clamp-3">{event.description}</p>}

                                    {/* Attendee Count */}
                                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 004 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                                            </svg>
                                            <span className="text-sm font-semibold">
                                                {event.currentAttendees || 0} / {event.maxAttendees || "Unlimited"}
                                            </span>
                                        </div>

                                        {/* Progress Bar for Limited Events */}
                                        {event.maxAttendees > 0 && (
                                            <div className="flex-1 ml-4">
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-red-500 h-2 rounded-full transition-all duration-300"
                                                        style={{
                                                            width: `${Math.min(((event.currentAttendees || 0) / event.maxAttendees) * 100, 100)}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 mt-6">
                                        <button
                                            onClick={() => openUpdateModal(event)}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all duration-300 hover:scale-105 active:scale-95"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                            </svg>
                                            Update
                                        </button>
                                        <button
                                            onClick={() => handleDelete(event._id)}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all duration-300 hover:scale-105 active:scale-95"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 012 0v4a1 1 0 11-2 0V7zM12 7a1 1 0 10-2 0v4a1 1 0 102 0V7z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Update Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm"> {/* Increased opacity, added backdrop-blur */}
                    <motion.div
                        initial={{ opacity: 0, y: -50 }} // Slightly different initial animation
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }} // Added exit animation for smoother closing
                        transition={{ duration: 0.3, type: "spring", damping: 20, stiffness: 300 }} // Spring animation
                        className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto transform scale-100 transition-all duration-300" // Increased max-w, rounded, added transform for potential scale effects
                    >
                        {/* Modal Header */}
                        <div className="bg-red-700 text-white px-8 py-5 rounded-t-3xl flex items-center justify-between sticky top-0 z-10"> {/* Sticky header, darker gradient, more padding */}
                            <h3 className="text-2xl font-extrabold flex items-center gap-3"> {/* Bolder text, added icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                                Update Event Details
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-white hover:text-blue-200 transition-colors p-2 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-blue-400" // More prominent close button
                                aria-label="Close modal"
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleUpdate} className="p-8 space-y-6"> {/* Increased padding */}
                            {/* Event Title */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">Event Title <span className="text-red-500">*</span></label> {/* Bolder label, required indicator */}
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter event title"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all duration-200 text-gray-800 placeholder-gray-400" // Enhanced focus and border
                                />
                            </div>

                            {/* Organizer Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">Organizer Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter organizer name"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
                                />
                            </div>

                            {/* Date and Time */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">Date and Time <span className="text-red-500">*</span></label>
                                <input
                                    type="datetime-local"
                                    name="dateTime"
                                    value={formData.dateTime}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all duration-200 text-gray-800"
                                />
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">Location <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="Enter event location"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
                                />
                            </div>

                            {/* Event Image URL */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">Event Image URL</label>
                                <input
                                    type="url"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
                                />
                                {formData.image && (
                                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 flex flex-col items-center"> {/* Added preview styling */}
                                        <p className="text-sm text-gray-600 mb-3 font-medium">Image Preview:</p>
                                        <img
                                            src={formData.image || "/placeholder.svg?height=128&width=192"}
                                            alt="Event preview"
                                            className="w-64 h-40 object-cover rounded-lg shadow-md border border-gray-300" // Larger preview, better border
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">Description <span className="text-red-500">*</span></label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe your event"
                                    required
                                    rows={5} // Increased rows
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all duration-200 resize-y text-gray-800 placeholder-gray-400" // Enhanced focus, resize-y
                                />
                            </div>

                            {/* Maximum Attendees */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    Maximum Attendees (0 for unlimited)
                                </label>
                                <input
                                    type="number"
                                    name="maxAttendees"
                                    value={formData.maxAttendees}
                                    onChange={handleChange}
                                    placeholder="Enter maximum attendee count"
                                    min="0"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
                                />
                                {currentEvent && currentEvent.currentAttendees > 0 && (
                                    <p className="text-sm text-gray-500 mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md"> {/* Added warning styling */}
                                        <strong className="text-yellow-700">Important:</strong> Current attendees are {currentEvent.currentAttendees}. You cannot set the maximum below this number.
                                    </p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4"> {/* Responsive buttons */}
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-6 py-3 text-gray-700 bg-gray-200 rounded-xl hover:bg-gray-300 transition-all duration-300 font-medium hover:scale-105 active:scale-95" // Enhanced button styling
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="flex-1 px-6 py-3 text-white bg-red-500 rounded-xl hover:bg-red-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 font-bold flex items-center justify-center gap-2 hover:scale-105 active:scale-95" // Enhanced button styling
                                >
                                    {updating ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> {/* Larger spinner */}
                                            Updating...
                                        </>
                                    ) : (
                                        "Update Event"
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    )
}

export default MyEvents