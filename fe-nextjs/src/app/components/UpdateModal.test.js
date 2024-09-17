import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UpdateModal from './UpdateModal';
import { updateJob } from '../api/api';

jest.mock('../api/api');

const mockJobsData = {
    id: 1,
    title: 'Software Engineer',
    company_name: 'Tech Corp',
    location: 'Remote',
    salary: '$100,000',
    work_type: 'Full-time',
    keyword: 'JavaScript',
};

const mockOnClose = jest.fn();
const mockOnUpdateSuccess = jest.fn();

describe('UpdateModal Component', () => {
    it('renders correctly', () => {
        const { getByText } = render(
            <UpdateModal
                job={mockJobsData}
                onClose={mockOnClose}
                onUpdateSuccess={mockOnUpdateSuccess}
            />
        );
        expect(getByText('Update Job')).toBeInTheDocument();
        expect(getByText('Title:')).toBeInTheDocument();
        expect(getByText('Company Name:')).toBeInTheDocument();
        expect(getByText('Location:')).toBeInTheDocument();
        expect(getByText('Salary:')).toBeInTheDocument();
        expect(getByText('Work Type:')).toBeInTheDocument();
        expect(getByText('Keyword:')).toBeInTheDocument();
    });

    it('calls onClose when the Cancel button is clicked', () => {
        const { getByText } = render(
            <UpdateModal
                job={mockJobsData}
                onClose={mockOnClose}
                onUpdateSuccess={mockOnUpdateSuccess}
            />
        );
        fireEvent.click(getByText('Cancel'));
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('calls handleUpdate and onUpdateSuccess when the Update button is clicked', async () => {
        updateJob.mockResolvedValueOnce({});
        const { getByText, getByRole } = render(
            <UpdateModal
                job={mockJobsData}
                onClose={mockOnClose}
                onUpdateSuccess={mockOnUpdateSuccess}
            />
        );
        fireEvent.click(getByText('Update'));
        expect(updateJob).toHaveBeenCalledWith(mockJobsData.id, {
            title: mockJobsData.title,
            company_name: mockJobsData.company_name,
            location: mockJobsData.location,
            salary: mockJobsData.salary,
            work_type: mockJobsData.work_type,
            keyword: mockJobsData.keyword,
        });
        await waitFor(() => expect(mockOnUpdateSuccess).toHaveBeenCalled());
        expect(getByRole('dialog')).toHaveTextContent('Job Updated Successfully!');
    });

    it('displays loading spinner when updating', async () => {
        updateJob.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
        const { getByText, getByRole } = render(
            <UpdateModal
                job={mockJobsData}
                onClose={mockOnClose}
                onUpdateSuccess={mockOnUpdateSuccess}
            />
        );
        // Find the update button by its text "Update"
        const updateButton = getByText('Update');

        // Click the update button
        fireEvent.click(updateButton);

        // Assert that the button is disabled while updating
        expect(updateButton).toBeDisabled();

        // Look for the spinner inside the button (by its FontAwesome `faSpinner` icon role)
        const spinnerIcon = getByRole('img', { hidden: true });
        expect(spinnerIcon).toHaveClass('fa-spinner'); // Check for the spinner icon class
    });
})