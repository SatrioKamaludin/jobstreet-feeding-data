"use client";
import { useEffect, useMemo, useState } from 'react';
import { downloadFile, getJobs } from './api/api';
import Header from './components/Header';
import AddModal from './components/AddModal';
import Pagination from './components/Pagination';
import JobTable from './components/JobTable';
import ScrapeModal from './components/ScrapeModal';

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
  const [showScrapeModal, setShowScrapeModal] = useState(false);

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

  const handleScrapeClick = () => {
    setShowScrapeModal(true);
  };

  const handleScrapeModalClose = () => {
    setShowScrapeModal(false);
  };

  const handleExportClick = () => {
    downloadFile();
  };

  const handleUpdateClick = (job) => {
    setJobToUpdate(job);
    setShowUpdateModal(true);
  };

  const handleUpdateModalClose = () => {
    setShowUpdateModal(false);
  };

  const handleDeleteClick = (job) => {
    setJobToDelete(job);
  };

  const handleDeleteModalClose = () => {
    setJobToDelete(null);
  };

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
            <button
              className="bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-cyan-600"
              onClick={handleScrapeClick}
            >
              Scrape from Jobstreet
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600" onClick={handleExportClick}>
              Export
            </button>
          </div>

          {showAddModal && (
            <AddModal onClose={handleAddModalClose} onAddSuccess={fetchJobs} />
          )}

          {showScrapeModal && (
            <ScrapeModal onClose={handleScrapeModalClose} onScrapeSuccess={fetchJobs} />
          )}

          <JobTable
            jobs={currentJobs}
            handleUpdateClick={handleUpdateClick}
            handleDeleteClick={handleDeleteClick}
            jobToUpdate={jobToUpdate}
            jobToDelete={jobToDelete}
            handleDeleteModalClose={handleDeleteModalClose}
            handleUpdateModalClose={handleUpdateModalClose}
            fetchJobs={fetchJobs}
            showUpdateModal={showUpdateModal}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </main>
      </div>
    </>
  );
}
