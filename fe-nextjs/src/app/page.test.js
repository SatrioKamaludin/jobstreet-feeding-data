import React from 'react';
import { render, fireEvent, screen } from "@testing-library/react";
import Home from "./page";

describe("Home", () => {
    test("renders Job Listing header", () => {
        render(<Home />);
        const header = screen.getByText(/Job Listings/i);
        expect(header).toBeInTheDocument();
    });

    test("renders Add Jobs button and can open AddModal", () => {
        render(<Home />);
        const addButton = screen.getByText(/\+ Add Jobs/i);
        expect(addButton).toBeInTheDocument();

        fireEvent.click(addButton);
        const modalTitle = screen.getByTestId(/Add Job/i);
        expect(modalTitle).toBeInTheDocument();
    })

    test("renders Search input and handle Search", () => {
        render(<Home />);
        const searchInput = screen.getByPlaceholderText(/Search.../i);
        fireEvent.change(searchInput, { target: { value: "test" } });

        expect(searchInput).toHaveValue("test"); //or toBe
    })
})
