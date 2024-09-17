import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import Pagination from "./Pagination";

describe('Pagination Component', () => {
    it('renders the right amount of page buttons', () => {
        const { getAllByRole } = render(
            <Pagination
                totalPages={5}
                currentPage={1}
                onPageChange={() => { }}
            />
        )
        const buttons = getAllByRole('button')
        expect(buttons).toHaveLength(7)
    })

    it('make the prev button disabled when on page 1', () => {
        const { getByText } = render(
            <Pagination
                currentPage={1}
                totalPages={5}
                onPageChange={() => { }}
            />
        )
        const prev = getByText('Previous')
        expect(prev).toBeDisabled()
    })

    it('make the next button disabled when on last page', () => {
        const { getByText } = render(
            <Pagination
                currentPage={5}
                totalPages={5}
                onPageChange={() => { }}
            />
        )
        const next = getByText('Next')
        expect(next).toBeDisabled()
    })

    it('calls onPageChange when a page button is clicked', () => {
        const mockOnPageChange = jest.fn();
        const { getAllByRole } = render(
            <Pagination
                currentPage={1}
                totalPages={5}
                onPageChange={mockOnPageChange}
            />
        )
        const buttons = getAllByRole('button')
        fireEvent.click(buttons[3])
        expect(mockOnPageChange).toHaveBeenCalled()
    })

    it('calls onPageChange when the next button is clicked', () => {
        const mockOnPageChange = jest.fn();
        const { getByText } = render(
            <Pagination
                currentPage={1}
                totalPages={5}
                onPageChange={mockOnPageChange}
            />
        )
        const next = getByText('Next')
        fireEvent.click(next)
        expect(mockOnPageChange).toHaveBeenCalled()
    })

    it('calls onPageChange when the prev button is clicked', () => {
        const mockOnPageChange = jest.fn();
        const { getByText } = render(
            <Pagination
                currentPage={3}
                totalPages={5}
                onPageChange={mockOnPageChange}
            />
        )
        const prev = getByText('Previous')
        fireEvent.click(prev)
        expect(mockOnPageChange).toHaveBeenCalled()
    })
})