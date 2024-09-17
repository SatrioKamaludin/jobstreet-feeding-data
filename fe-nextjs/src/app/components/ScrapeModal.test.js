import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ScrapeModal from './ScrapeModal';
import { scrapeJob } from '../api/api';

jest.mock('../api/api');

const mockOnClose = jest.fn();
const mockOnScrapeSuccess = jest.fn();

describe('ScrapeModal Component', () => {
    it('renders', () => {
        const { getByText, getByLabelText } = render(
            <ScrapeModal
                onClose={mockOnClose}
                onScrapeSuccess={mockOnScrapeSuccess}
            />
        );
        expect(getByText('Scrape from Jobstreet')).toBeInTheDocument();
        expect(getByLabelText('Location:')).toBeInTheDocument();
        expect(getByLabelText('Keyword:')).toBeInTheDocument();
        expect(getByLabelText('Page:')).toBeInTheDocument();
    });

    it('calls onClose when the Cancel button is clicked', () => {
        const { getByText } = render(
            <ScrapeModal
                onClose={mockOnClose}
                onScrapeSuccess={mockOnScrapeSuccess}
            />
        );
        fireEvent.click(getByText('Cancel'));
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('updates input values correctly', () => {
        const { getByLabelText } = render(
            <ScrapeModal
                onClose={mockOnClose}
                onScrapeSuccess={mockOnScrapeSuccess}
            />
        );
        fireEvent.change(getByLabelText('Location:'), { target: { value: 'New Location' } });
        expect(getByLabelText('Location:')).toHaveValue('New Location');
    });

    it('calls handleScrape and onScrapeSuccess when the Scrape button is clicked', async () => {
        scrapeJob.mockResolvedValueOnce({ message: 'Scrape successful' });
        const { getByText, getByLabelText } = render(
            <ScrapeModal
                onClose={mockOnClose}
                onScrapeSuccess={mockOnScrapeSuccess}
            />
        );
        fireEvent.change(getByLabelText('Location:'), { target: { value: 'New Location' } });
        fireEvent.change(getByLabelText('Keyword:'), { target: { value: 'JavaScript' } });
        fireEvent.change(getByLabelText('Page:'), { target: { value: '1' } });
        fireEvent.click(getByText('Start Scraping'));
        expect(scrapeJob).toHaveBeenCalledWith('New Location', 'JavaScript', 1, expect.any(Object));
        await waitFor(() => expect(mockOnScrapeSuccess).toHaveBeenCalled());
        expect(getByText('Scrape successful')).toBeInTheDocument();
    });

    it('displays loading spinner when scraping', async () => {
        scrapeJob.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
        const { getByText, getByLabelText, container } = render(
            <ScrapeModal
                onClose={mockOnClose}
                onScrapeSuccess={mockOnScrapeSuccess}
            />
        );

        fireEvent.change(getByLabelText('Location:'), { target: { value: 'New Location' } });
        fireEvent.change(getByLabelText('Keyword:'), { target: { value: 'JavaScript' } });
        fireEvent.change(getByLabelText('Page:'), { target: { value: '1' } });
        fireEvent.click(getByText('Start Scraping'));

        await waitFor(() => {
            const button = getByText((content, element) => {
                return element.tagName.toLowerCase() === 'button' && /Start Scraping/i.test(content);
            });
            expect(button).toBeDisabled();
        });

        const spinnerIcon = container.querySelector('.fa-spinner');
        expect(spinnerIcon).toBeInTheDocument();
    });

    it('cancels scraping when the Cancel button is clicked during scraping', async () => {
        scrapeJob.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
        const { getByText, getByLabelText } = render(
            <ScrapeModal
                onClose={mockOnClose}
                onScrapeSuccess={mockOnScrapeSuccess}
            />
        );

        fireEvent.change(getByLabelText('Location:'), { target: { value: 'New Location' } });
        fireEvent.change(getByLabelText('Keyword:'), { target: { value: 'JavaScript' } });
        fireEvent.change(getByLabelText('Page:'), { target: { value: '1' } });
        fireEvent.click(getByText('Start Scraping'));
        fireEvent.click(getByText('Cancel'));
        expect(mockOnScrapeSuccess).toHaveBeenCalled();
    });
})