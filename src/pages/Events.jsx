import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalContext from "../hooks/useGlobalContext";
import { Button } from "@mui/material";

export default function FilteredEvents() {
  const [categoryFilter, setCategoryFilter] = useState(""); // State for category filter
  const [filteredEvents, setFilteredEvents] = useState([])

  const navigate = useNavigate();
  const { events, categoriesList } = useGlobalContext();

  const handleCategoryFilterChange = (event) => {
    setCategoryFilter(event.target.value);
  };

  console.log({categoryFilter});

  useEffect(() => {
    const filteredData = categoryFilter
    ? events.filter((event) => event.category?.id == categoryFilter)
    : events;
    console.log({filteredData})
    setFilteredEvents(filteredData)
  }, [categoryFilter])

  const renderEventCard = (event) => (
    <div key={event.id} className="mb-4 rounded-lg shadow-lg transform transition-transform duration-200 hover:scale-105 bg-white">
      <div className="flex flex-row">
      <div className="w-[15px] rounded-l-lg" 
        style={{
          backgroundColor: event.bgColor || "#ffffff",
          color: event.textColor || "#333333",
        }}>
      </div>
      <div className="flex-grow  p-4">
      {event.title !== "" && (
        <div>
          <h1 className="text-xl mb-1">{new Date(event?.date)?.toDateString()}</h1>
          <h2 className="text-lg mb-1">Title: {event.title}</h2>
          <p className="text-base mb-1">
            Description: {event.description || "-"}
          </p>
          <p className="text-sm">
            Category: {event?.category?.name}
          </p>
        </div>)
      }
      </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-6 gap-6  h-screen p-4 bg-gradient-to-br from-purple-100 to-indigo-100">
      <div className="flex justify-between items-center mb-4">
        <Button size="small" variant='outlined' onClick={() => navigate("/")}>
          Back
        </Button>
        <select
          value={categoryFilter}
          onChange={handleCategoryFilterChange}
          className="border rounded-lg px-4 py-2 shadow-md bg-white"
        >
          <option value="">All Categories</option>
          {categoriesList.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => renderEventCard(event))
        ) : (
          <p className="text-gray-600 italic mt-4">
            No events found for the selected category.
          </p>
        )}
      </div>
    </div>
  );
}
