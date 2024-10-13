import React, { useState, useEffect } from 'react';
import { Typography } from "@material-tailwind/react";
import { FaTrash } from 'react-icons/fa';

const SharedJournal = () => {
    const [sharedJournals, setSharedJournals] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');

        const fetchSharedJournals = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/get/sharedjournalbyuser`, {
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

    const handleDeleteJournal = async (journalId, user_id) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/journals/${journalId}/revokeshare/${user_id}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to delete the shared journal');
            }

            // Update the state to remove the deleted journal from the list
            setSharedJournals((prevJournals) =>
                prevJournals.filter((journal) => journal.id !== journalId)
            );
        } catch (error) {
            console.error("Error deleting journal:", error);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 mt-2">
            <div className="flex justify-between items-center mb-4">
                <Typography variant="h5" color="blue-gray">
                    Shared Journals
                </Typography>
            </div>
            <div className="space-y-4">
                {sharedJournals && sharedJournals.length > 0 ? (
                    sharedJournals.map((journal) => (
                        <div key={journal.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div>
                                    <Typography variant="small" color="blue-gray" className="font-semibold">
                                        {journal.title}
                                    </Typography>
                                    <Typography variant="small" color="gray" className="text-xs">
                                        Shared to: {journal.shared_to}
                                    </Typography>
                                    <Typography variant="small" color="gray" className="text-xs">
                                        Permission: {journal.permission}
                                    </Typography>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <FaTrash
                                    className="text-red-500 hover:text-red-700 cursor-pointer"
                                    size={20}
                                    onClick={() => handleDeleteJournal(journal.id, journal.user_id)}
                                />
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

export default SharedJournal;
