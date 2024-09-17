import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeleteModal from './DeleteModal';
import { deleteJob } from '../api/api';

jest.mock('../api/api');

const mockJobsData = {
  id: 1,
  title: 'Software Engineer',
  company_name: 'Tech Corp',
};

const mockOnClose = jest.fn();
const mockOnDeleteSuccess = jest.fn();

describe('DeleteModal Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <DeleteModal
        job={mockJobsData}
        onClose={mockOnClose}
        onDeleteSuccess={mockOnDeleteSuccess}
      />
    );
    expect(getByText('Are you sure you want to delete this job?')).toBeInTheDocument();
    expect(getByText(`${mockJobsData.title} - ${mockJobsData.company_name}`)).toBeInTheDocument();
  });

  it('calls onClose when the No button is clicked', () => {
    const { getByText } = render(
      <DeleteModal
        job={mockJobsData}
        onClose={mockOnClose}
        onDeleteSuccess={mockOnDeleteSuccess}
      />
    );
    fireEvent.click(getByText('No'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls handleDelete and onDeleteSuccess when the Yes button is clicked', async () => {
    deleteJob.mockResolvedValueOnce({});
    const { getByText, getByRole } = render(
      <DeleteModal
        job={mockJobsData}
        onClose={mockOnClose}
        onDeleteSuccess={mockOnDeleteSuccess}
      />
    );
    fireEvent.click(getByText('Yes'));
    expect(deleteJob).toHaveBeenCalledWith(mockJobsData.id);
    await waitFor(() => expect(mockOnDeleteSuccess).toHaveBeenCalled());
    expect(getByRole('dialog')).toHaveTextContent('Job Deleted Successfully!');
  });

  it('displays loading spinner when deleting', async () => {
    deleteJob.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    const { getByText, getByRole } = render(
      <DeleteModal
        job={mockJobsData}
        onClose={mockOnClose}
        onDeleteSuccess={mockOnDeleteSuccess}
      />
    );
    fireEvent.click(getByText('Yes'));
    expect(getByRole('button', { name: 'Yes' })).toBeDisabled();
    expect(getByRole('button', { name: 'Yes' })).toContainElement(getByRole('img', { hidden: true }));
  });
});
