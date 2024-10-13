import React, { useState, useEffect } from "react";
import { Typography, Card, CardBody, Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import ReceivedJournals from '../components/ReceivedJournals';
import SharedJournal from "../components/SharedJournals";

const TABLE_HEAD = [
  {
    head: "Journal Entry",
    customeStyle: "!text-left",
  },
  {
    head: "Actions",
    customeStyle: "text-right",
  },
];

function Dashboard() {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch journals from the backend
  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchJournals = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/list/journals`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch journals");
        }

        const data = await response.json();
        setJournals(data.journals);
      } catch (error) {
        console.error("Error fetching journals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJournals();
  }, []);

  return (
    <section className="min-h-screen bg-gray-50 py-10 px-4 md:px-8 lg:px-16">
      <div className="max-w-screen-xl mx-auto">
        {/* Header with Journal Overview Text and Create Journal Button */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col text-center items-start">
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-1">
              Journal Overview
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              A summary of your recent journal entries.
            </p>
          </div>
          <Link to='/user/createjournal'>
            <Button
              color="blue"
              className="hover:bg-blue-700 py-2 px-6 text-lg"
            >
              Create Journal
            </Button>
          </Link>
        </div>

        <div className="flex gap-8">
          <div className="w-2/3">
            <Card className="shadow-lg">
              <CardBody className="overflow-auto !px-4 md:px-8 py-6">
                {loading ? (
                  <Typography variant="h6" color="gray" className="text-center">
                    Loading journals...
                  </Typography>
                ) : (journals && journals.length > 0) ? (
                  <table className="w-full min-w-max table-auto">
                    <thead>
                      <tr>
                        {TABLE_HEAD.map(({ head, customeStyle }) => (
                          <th
                            key={head}
                            className={`border-b border-gray-300 !px-4 !pb-4 ${customeStyle}`}
                          >
                            <Typography
                              color="blue-gray"
                              variant="small"
                              className="!font-bold"
                            >
                              {head}
                            </Typography>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {journals.map((journal, index) => {
                        const { title, content, created_at, view_later } = journal;
                        const isLast = index === journals.length - 1;
                        const classes = isLast
                          ? "!px-4 py-4"
                          : "!px-4 py-4 border-b border-gray-300";

                        return (
                          <tr key={journal.id} className={`${view_later ? "bg-yellow-50" : ""}`}>
                            <td className={classes}>
                              <div className="flex items-center gap-3 text-left">
                                <div>
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`!font-semibold ${view_later ? "text-yellow-700" : ""}`}
                                  >
                                    {title}{" "}
                                    {view_later && (
                                      <span className="text-xs text-yellow-600">
                                        (View Later)
                                      </span>
                                    )}
                                  </Typography>
                                  <Typography variant="small" className="!font-normal text-gray-600">
                                    {content.length > 50 ? content.substring(0, 50) + '...' : content}
                                  </Typography>
                                  <Typography variant="small" className="!font-normal text-gray-400">
                                    {new Date(created_at).toLocaleDateString()}
                                  </Typography>
                                </div>
                              </div>
                            </td>
                            <td className={classes}>
                              <div className="flex justify-end">
                                <Link
                                  to={{
                                    pathname: `/user/viewjournal/${journal.id}`,
                                  }}
                                  state={{ journal }} // Pass the journal object
                                  className="sm:px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                                >
                                  View Journal
                                </Link>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-10">
                    <Typography variant="h6" color="gray">
                      No journal found. Create a new Journal!
                    </Typography>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
          <div className="w-1/3">
            <ReceivedJournals />
            <SharedJournal />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;