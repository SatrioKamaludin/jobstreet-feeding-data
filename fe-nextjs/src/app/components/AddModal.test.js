import { render, fireEvent, screen } from "@testing-library/react";
import AddModal from "./AddModal";
import { addJob } from "../api/api";

jest.mock("../api/api");

const mockOnClose = jest.fn();
const mockAddOnSuccess = jest.fn();

describe("AddModal", () => {
    test("renders correctly", () => {
        render(
            <AddModal
                onClose={mockOnClose}
                onAddSuccess={mockAddOnSuccess}
            />
        );
        const titleInput = screen.getByLabelText("Title:");
        const companyNameInput = screen.getByLabelText("Company Name:");
        const locationInput = screen.getByLabelText("Location:");
        const salaryInput = screen.getByLabelText("Salary:");
        const workTypeInput = screen.getByLabelText("Work Type:");
        const keywordInput = screen.getByLabelText("Keyword:");
        const addButton = screen.getByText("Add");
        expect(titleInput).toBeInTheDocument();
        expect(companyNameInput).toBeInTheDocument();
        expect(locationInput).toBeInTheDocument();
        expect(salaryInput).toBeInTheDocument();
        expect(workTypeInput).toBeInTheDocument();
        expect(keywordInput).toBeInTheDocument();
        expect(addButton).toBeInTheDocument();
    })

    test("Calls onClose when Cancel is Clicked", () => {
        render(<AddModal onClose={mockOnClose} onAddSuccess={mockAddOnSuccess} />);
        fireEvent.click(screen.getByText(/Cancel/i));
        expect(mockOnClose).toHaveBeenCalled();
    });

    test("Calls handleAdd when Add is Clicked", async () => {
        render(<AddModal onClose={mockOnClose} onAddSuccess={mockAddOnSuccess} />);
        const title = screen.getByLabelText(/Title:/i);
        const companyName = screen.getByLabelText(/Company Name:/i);
        const location = screen.getByLabelText(/Location:/i);
        const salary = screen.getByLabelText(/Salary:/i);
        const workType = screen.getByLabelText(/Work Type:/i);
        const keyword = screen.getByLabelText(/Keyword:/i);
        const addButton = screen.getByText(/Add/i);
        
        fireEvent.change(title, { target: { value: "Test Title" } });
        fireEvent.change(companyName, { target: { value: "Test Company Name" } });
        fireEvent.change(location, { target: { value: "Test Location" } });
        fireEvent.change(salary, { target: { value: "Test Salary" } });
        fireEvent.change(workType, { target: { value: "Test Work Type" } });
        fireEvent.change(keyword, { target: { value: "Test Keyword" } });

        fireEvent.click(addButton);

        expect(mockAddOnSuccess).toHaveBeenCalled();
    });
});