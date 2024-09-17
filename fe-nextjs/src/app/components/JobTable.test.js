import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import JobTable from "./JobTable";

const mockJobsData = [
    {
        title: 'Software Engineer',
        company_name: 'Tech Corp',
        work_type: 'Full-time',
        location: 'Remote',
        salary: '$100,000',
        listing_date: '2023-09-01',
        keyword: 'JavaScript',
    },
    {
        title: 'Product Manager',
        company_name: 'Business Inc',
        work_type: 'Part-time',
        location: 'New York',
        salary: '$80,000',
        listing_date: '2023-08-15',
        keyword: 'Management',
    },
]

const mockHandleUpdateClick = jest.fn();
const mockHandleDeleteClick = jest.fn();
const mockHandleDeleteModalClose = jest.fn();
const mockHandleUpdateModalClose = jest.fn();
const mockFetchJobs = jest.fn();

describe('JobTable Component', () => {
    it('renders the right amount of job rows', () => {
        const { getAllByRole } = render(
            <JobTable
                jobs={mockJobsData}
                handleUpdateClick={mockHandleUpdateClick}
                handleDeleteClick={mockHandleDeleteClick}
                jobToUpdate={null}
                jobToDelete={null}
                handleDeleteModalClose={mockHandleDeleteModalClose}
                handleUpdateModalClose={mockHandleUpdateModalClose}
                fetchJobs={mockFetchJobs}
                showUpdateModal={false}
            />
        )
        const rows = getAllByRole('row')
        expect(rows).toHaveLength(mockJobsData.length + 1)
    })

    it('calls handleUpdateClick when the edit button is clicked', () => {
        const { getAllByRole } = render(
            <JobTable
                jobs={mockJobsData}
                handleUpdateClick={mockHandleUpdateClick}
                handleDeleteClick={mockHandleDeleteClick}
                jobToUpdate={null}
                jobToDelete={null}
                handleDeleteModalClose={mockHandleDeleteModalClose}
                handleUpdateModalClose={mockHandleUpdateModalClose}
                fetchJobs={mockFetchJobs}
                showUpdateModal={false}
            />
        );
        const editButtons = getAllByRole('button', { name: '' });
        fireEvent.click(editButtons[0]);
        expect(mockHandleUpdateClick).toHaveBeenCalledWith(mockJobsData[0]);
    });

    it('calls handleDeleteClick when the delete button is clicked', () => {
        const { getAllByRole } = render(
            <JobTable
                jobs={mockJobsData}
                handleUpdateClick={mockHandleUpdateClick}
                handleDeleteClick={mockHandleDeleteClick}
                jobToUpdate={null}
                jobToDelete={null}
                handleDeleteModalClose={mockHandleDeleteModalClose}
                handleUpdateModalClose={mockHandleUpdateModalClose}
                fetchJobs={mockFetchJobs}
                showUpdateModal={false}
            />
        );
        const deleteButtons = getAllByRole('button', { name: '' });
        fireEvent.click(deleteButtons[1]);
        expect(mockHandleDeleteClick).toHaveBeenCalledWith(mockJobsData[0]);
    });

    it('renders DeleteModal when jobToDelete is provided', () => {
        const { getByRole } = render(
            <JobTable
                jobs={mockJobsData}
                handleUpdateClick={mockHandleUpdateClick}
                handleDeleteClick={mockHandleDeleteClick}
                jobToUpdate={null}
                jobToDelete={mockJobsData[0]}
                handleDeleteModalClose={mockHandleDeleteModalClose}
                handleUpdateModalClose={mockHandleUpdateModalClose}
                fetchJobs={mockFetchJobs}
                showUpdateModal={false}
            />
        );
        expect(getByRole('dialog')).toBeInTheDocument();
    });

    it('renders UpdateModal when showUpdateModal is true', () => {
        const { getByRole } = render(
            <JobTable
                jobs={mockJobsData}
                handleUpdateClick={mockHandleUpdateClick}
                handleDeleteClick={mockHandleDeleteClick}
                jobToUpdate={mockJobsData[0]}
                jobToDelete={null}
                handleDeleteModalClose={mockHandleDeleteModalClose}
                handleUpdateModalClose={mockHandleUpdateModalClose}
                fetchJobs={mockFetchJobs}
                showUpdateModal={true}
            />
        );
        expect(getByRole('dialog')).toBeInTheDocument();
    });
})