import { createContext, useState, useEffect } from "react";

export const EventsContext = createContext(null);

export default function GlobalContextProvider({ children }) {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const categoriesList = [
        { id: 1, name: "Work" },
        { id: 2, name: "Personal" },
        { id: 3, name: "Family" },
        { id: 4, name: "Social" },
        { id: 5, name: "Health and wellness" },
        { id: 6, name: "Appointment" },
    ];

    

    // Fetch events from API when the provider mounts
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('https://ca9526c0439b4117f870.free.beeceptor.com/api/calendar-backend-new/');
                if (response.ok) {
                    const data = await response.json();
                    setEvents(data);
                } else {
                    console.error('Failed to fetch events:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, []);

    return (
        <EventsContext.Provider value={{ selectedEvent, setSelectedEvent, events, setEvents, categoriesList }}>
            {children}
        </EventsContext.Provider>
    );
}
