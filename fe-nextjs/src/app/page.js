"use client";
import { useEffect, useMemo, useState } from 'react';
import { getJobs } from './api/api';
import Header from './components/Header';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import DeleteModal from './components/DeleteModal';
import UpdateModal from './components/UpdateModal';
import AddModal from './components/AddModal';

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [search, setSearch] = useState('');
  const [jobToDelete, setJobToDelete] = useState(null);
  const [jobToUpdate, setJobToUpdate] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchJobs = async () => {
    try {
      const data = await getJobs(currentPage, itemsPerPage, search);
      setJobs(data.results);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [currentPage, itemsPerPage, search]);

  const currentJobs = useMemo(() => jobs, [jobs]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  }

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = () => {
    setSearch(searchTerm);
    setCurrentPage(1); // Reset to the first page when searching
  };

  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleAddModalClose = () => {
    setShowAddModal(false);
  };

  const handleUpdateClick = (job) => {
    setJobToUpdate(job);
    setShowUpdateModal(true);
  };

  const handleUpdateModalClose = () => {
    setShowUpdateModal(false);
  };

  const handleJobAdd = async () => {
    try {
      await fetchJobs();
    } catch (error) {
      console.error("Error adding job:", error);
    }
  }

  const handleJobUpdate = async () => {
    try {
      await fetchJobs();
    } catch (error) {
      console.error("Error updating job:", error);
    }
  }

  const handleDeleteClick = (job) => {
    setJobToDelete(job);
  };

  const handleDeleteModalClose = () => {
    setJobToDelete(null);
  };

  const handleDeleteSuccess = () => {
    fetchJobs();
  }

  const generatePaginationButtons = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    // Adjust the start and end page if the number of pages is less than 5
    if (totalPages <= 5) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 3) {
        endPage = 5;
      }
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 4;
      }
    }

    for (let page = startPage; page <= endPage; page++) {
      pages.push(page);
    }

    return pages;
  };

  const paginationButtons = generatePaginationButtons();

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        {/* Render HeaderMenu component */}
        {/* <Header /> */}

        <main className="flex-grow container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Job Listings</h1>

          {/* Search and Items Per Page */}
          <div className="flex flex-col items-center space-y-4 mb-6 w-full">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSearchClick}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Search
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-gray-800">Items per page:</label>
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
          </div>

          <div className="flex justify-center space-x-4 mb-6">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              onClick={handleAddClick}
            >
              + Add Jobs
            </button>
            <button className="bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-cyan-600">
              Scrape from Jobstreet
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
              Export
            </button>
          </div>

          {showAddModal && (
            <AddModal onClose={handleAddModalClose} onAddSuccess={handleJobAdd} />
          )}

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
                {currentJobs.map((job, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4">{job.title}</td>
                    <td className="py-2 px-4">{job.company_name}</td>
                    <td className="py-2 px-4">{job.work_type}</td>
                    <td className="py-2 px-4">{job.location}</td>
                    <td className="py-2 px-4">{job.salary}</td>
                    <td className="py-2 px-4">{format(new Date(job.listing_date), 'yyyy-MM-dd')}</td>
                    <td className="py-2 px-4">{job.keyword}</td>
                    <td className="py-2 px-4 flex">
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        onClick={() => handleUpdateClick(job)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 ml-2"
                        onClick={() => handleDeleteClick(job)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
                {jobToDelete && (
                  <DeleteModal
                    job={jobToDelete}
                    onClose={handleDeleteModalClose}
                    onDeleteSuccess={handleDeleteSuccess}
                  />
                )}
                {showUpdateModal && (
                  <UpdateModal
                    job={jobToUpdate}
                    onClose={handleUpdateModalClose}
                    onUpdateSuccess={handleJobUpdate}
                  />
                )}
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
              {paginationButtons.includes(1) && (
                <button
                  onClick={() => handlePageChange(1)}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${currentPage === 1 ? 'bg-blue-500 text-white' : 'text-gray-500 bg-white'} rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                >
                  1
                </button>
              )}
              {paginationButtons.length > 1 && paginationButtons[0] > 2 && (
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium text-gray-500 bg-white rounded-md shadow-sm">
                  ...
                </span>
              )}
              {paginationButtons.slice(1, -1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${currentPage === page ? 'bg-blue-500 text-white' : 'text-gray-500 bg-white'} rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                >
                  {page}
                </button>
              ))}
              {paginationButtons.length > 1 && paginationButtons[paginationButtons.length - 1] < totalPages - 1 && (
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium text-gray-500 bg-white rounded-md shadow-sm">
                  ...
                </span>
              )}
              {paginationButtons.includes(totalPages) && (
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${currentPage === totalPages ? 'bg-blue-500 text-white' : 'text-gray-500 bg-white'} rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                >
                  {totalPages}
                </button>
              )}
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
