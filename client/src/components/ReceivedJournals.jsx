import React, { useState, useEffect } from 'react';
import { Typography, Button } from "@material-tailwind/react";

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

const ReceivedJournals = () => {
  const [sharedJournals, setSharedJournals] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchSharedJournals = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/sharedjournals/get`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch journals");
        }

        const data = await response.json();
        setSharedJournals(data.shared_journals);
      } catch (error) {
        console.error("Error fetching journals:", error);
      }
    };

    fetchSharedJournals();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h5" color="blue-gray">
          Shared Journals
        </Typography>
        <Button size="sm" color="blue" variant="text">
          See all
        </Button>
      </div>
      <div className="space-y-4">
        {sharedJournals.length > 0 ? (
          sharedJournals.map((journal) => (
            <div key={journal.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div>
                  <Typography variant="small" color="blue-gray" className="font-semibold">
                    {journal.title}
                  </Typography>
                  <Typography variant="small" color="gray" className="text-xs">
                    Shared by: {journal.shared_by}
                  </Typography>
                  <Typography variant="small" color="gray" className="text-xs">
                    Permission: {journal.permission}
                  </Typography>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  color="blue"
                  variant="text"
                  onClick={() => window.location.href = `/user/viewjournal/${journal.id}`}
                >
                  View
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <Typography variant="h6" color="gray">
              No shared journals found.
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceivedJournals;