import React from "react";
import { Typography, Card, CardBody, Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";

const TABLE_ROW = [
  {
    title: "First Journal Entry",
    description: "Reflections on today's productivity.",
    date: "October 11, 2024",
    status: "Completed",
    color: "green",
    viewLater: false,
  },
  {
    title: "Morning Thoughts",
    description: "Ideas after the morning run.",
    date: "October 10, 2024",
    status: "In Progress",
    color: "orange",
    viewLater: true,
  },
  {
    title: "Evening Reflection",
    description: "A wrap-up of the day’s events.",
    date: "October 9, 2024",
    status: "Completed",
    color: "green",
    viewLater: false,
  },
  {
    title: "Weekend Plans",
    description: "Planning the upcoming weekend.",
    date: "October 8, 2024",
    status: "Pending",
    color: "red",
    viewLater: true,
  },
];

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

function DashBoard() {
  return (
    <section className="min-h-screen bg-gray-50 py-10 px-4 md:px-8 lg:px-16">
        <div className="flex flex-col text-center items-center max-w-screen-xl mx-auto mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Journal Overview
            </h1>
            <p className="text-lg text-gray-600 mb-8">
            A summary of your recent journal entries.
            </p>
            <Link to='/user/createjournal' className="w-full sm:w-auto  px-9 py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                Create Journal
            </Link>
        </div>
        
      <Card className="max-w-screen-xl mx-auto shadow-lg">
        <CardBody className="overflow-auto !px-4 md:px-8 py-6">
          {TABLE_ROW.length > 0 ? (
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
                {TABLE_ROW.map(({ title, description, date, viewLater }, index) => {
                  const isLast = index === TABLE_ROW.length - 1;
                  const classes = isLast
                    ? "!px-4 py-4"
                    : "!px-4 py-4 border-b border-gray-300";

                  return (
                    <tr
                      key={title}
                      className={`${viewLater ? "bg-yellow-50" : ""}`}
                    >
                      <td className={classes}>
                        <div className="flex items-center gap-3 text-left">
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className={`!font-semibold ${
                                viewLater ? "text-yellow-700" : ""
                              }`}
                            >
                              {title}{" "}
                              {viewLater && (
                                <span className="text-xs text-yellow-600">
                                  (View Later)
                                </span>
                              )}
                            </Typography>
                            <Typography
                              variant="small"
                              className="!font-normal text-gray-600"
                            >
                              {description}
                            </Typography>
                            <Typography
                              variant="small"
                              className="!font-normal text-gray-400"
                            >
                              {date}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="flex justify-end">
                          <Link to='/user/viewjournal' className="sm px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
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
                No journal found. Create a new Journal!.
              </Typography>
            </div>
          )}
        </CardBody>
      </Card>
    </section>
  );
}

export default DashBoard;
