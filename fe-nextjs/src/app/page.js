"use client";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import Header from "./components/Header";

export default function Home() {
  const jobs = [
    {
      title: "Software Engineer",
      company_name: "Tech Solutions",
      work_type: "Full-time",
      location: "Remote",
      salary: "$120,000/year",
      listing_date: "2023-09-01",
      keyword: "software, engineer, remote"
    },
    {
      title: "Product Manager",
      company_name: "Innovative Labs",
      work_type: "Contract",
      location: "New York, NY",
      salary: "$90,000/year",
      listing_date: "2023-08-25",
      keyword: "product, manager, innovation"
    },
    {
      title: "Data Scientist",
      company_name: "Data Corp",
      work_type: "Part-time",
      location: "San Francisco, CA",
      salary: "$110,000/year",
      listing_date: "2023-09-03",
      keyword: "data, scientist, analysis"
    },
    // Add more job data as needed
  ];

  const [itemsPerPage, setItemsPerPage] = useState(5); // Number of items per page
  const [currentPage, setCurrentPage] = useState(1);
  const [formattedJobs, setFormattedJobs] = useState([]);
  const totalPages = Math.ceil(jobs.length / itemsPerPage);

  // Get current items for the current page
  const currentJobs = useMemo(() => jobs.slice((currentPage - 1)*itemsPerPage, currentPage * itemsPerPage), [currentPage, itemsPerPage]);

  useEffect(() => {
    setFormattedJobs(
      currentJobs.map((job) => ({
        ...job,
        listing_date: format(new Date(job.listing_date), "yyyy-MM-dd"),
      }))
    )
  }, [currentJobs]);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  }

  return (
    <>
      <div className="flex flex-col it
      
      ems-center justify-center min-h-screen bg-gray-100">
        {/* Render HeaderMenu component */}
        <Header />

        <main className="flex-grow container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Job Listings</h1>

          <div className="flex justify-center mb-6">
            <label className="mr-2 text-gray-800 items-center flex">Items per page:</label>
            <select 
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="border border-gray-300 text-gray-800 rounded-md px-4 py-2"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden text-gray-900">
              <thead className="bg-gray-300">
                <tr>
                  <th className="py-2 px-4 text-center">Title</th>
                  <th className="py-2 px-4 text-center">Company Name</th>
                  <th className="py-2 px-4 text-center">Work Type</th>
                  <th className="py-2 px-4 text-center">Location</th>
                  <th className="py-2 px-4 text-center">Salary</th>
                  <th className="py-2 px-4 text-center">Listing Date</th>
                  <th className="py-2 px-4 text-center">Keyword</th>
                  <th className="py-2 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-gray-900">
                {jobs.map((job, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4">{job.title}</td>
                    <td className="py-2 px-4">{job.company_name}</td>
                    <td className="py-2 px-4">{job.work_type}</td>
                    <td className="py-2 px-4">{job.location}</td>
                    <td className="py-2 px-4">{job.salary}</td>
                    <td className="py-2 px-4">{format(new Date(job.listing_date), 'yyyy-MM-dd')}</td>
                    <td className="py-2 px-4">{job.keyword}</td>
                    <td className="py-2 px-4">
                      <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                        Update
                      </button>
                      <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 ml-2">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-center">
            <nav className="relative z-0 inline-flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium text-gray-500 bg-white rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'text-gray-500 bg-white'} rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium text-gray-500 bg-white rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        </main>
      </div>
    </>
  );
}
