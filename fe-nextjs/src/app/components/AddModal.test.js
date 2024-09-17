import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import AddModal from "./AddModal";
import { addJob } from "../api/api";

jest.mock("../api/api");

const mockOnClose = jest.fn();
const mockOnAddSuccess = jest.fn();

describe("AddModal", () => {
    it("renders correctly", () => {
        const { getByText, getByLabelText } = render(
            <AddModal
                onClose={mockOnClose}
                onAddSuccess={mockOnAddSuccess}
            />
        )
        expect(getByText('Add Job')).toBeInTheDocument();
        expect(getByLabelText('Title:')).toBeInTheDocument();
        expect(getByLabelText('Company Name:')).toBeInTheDocument();
        expect(getByLabelText('Location:')).toBeInTheDocument();
        expect(getByLabelText('Salary:')).toBeInTheDocument();
        expect(getByLabelText('Work Type:')).toBeInTheDocument();
        expect(getByLabelText('Keyword:')).toBeInTheDocument();
    })

    it("Calls onClose when Cancel is Clicked", () => {
        const { getByText } = render(
            <AddModal
                onClose={mockOnClose}
                onAddSuccess={mockOnAddSuccess}
            />
        );
        fireEvent.click(getByText('Cancel'));
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('updates input values correctly', () => {
        const { getByLabelText } = render(
            <AddModal
                onClose={mockOnClose}
                onAddSuccess={mockOnAddSuccess}
            />
        );
        fireEvent.change(getByLabelText('Title:'), { target: { value: 'New Title' } });
        expect(getByLabelText('Title:')).toHaveValue('New Title');
    });

    test("Calls handleAdd when Add is Clicked", async () => {
        addJob.mockResolvedValueOnce({});
        const { getByText, getByLabelText, getByRole } = render(
            <AddModal
                onClose={mockOnClose}
                onAddSuccess={mockOnAddSuccess}
            />
        )
        const title = screen.getByLabelText(/Title:/i);
        const companyName = screen.getByLabelText(/Company Name:/i);
        const location = screen.getByLabelText(/Location:/i);
        const salary = screen.getByLabelText(/Salary:/i);
        const workType = screen.getByLabelText(/Work Type:/i);
        const keyword = screen.getByLabelText(/Keyword:/i);

        fireEvent.change(title, { target: { value: "Test Title" } });
        fireEvent.change(companyName, { target: { value: "Test Company Name" } });
        fireEvent.change(location, { target: { value: "Test Location" } });
        fireEvent.change(salary, { target: { value: "Test Salary" } });
        fireEvent.change(workType, { target: { value: "Test Work Type" } });
        fireEvent.change(keyword, { target: { value: "Test Keyword" } });

        fireEvent.click(getByText('Add'));

        expect(addJob).toHaveBeenCalledWith({
            title: "Test Title",
            company_name: "Test Company Name",
            location: "Test Location",
            salary: "Test Salary",
            work_type: "Test Work Type",
            keyword: "Test Keyword",
        });

        await waitFor(() => expect(mockOnAddSuccess).toHaveBeenCalled());
        expect(getByRole('dialog')).toHaveTextContent('Job Added Successfully!');
    });

    it('displays loading spinner when adding', async () => {
        addJob.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
        const { getByText, getByRole } = render(
            <AddModal
                onClose={mockOnClose}
                onAddSuccess={mockOnAddSuccess}
            />
        )

        fireEvent.change(getByLabelText('Title:'), { target: { value: 'New Title' } });
        fireEvent.change(getByLabelText('Company Name:'), { target: { value: 'New Company' } });
        fireEvent.change(getByLabelText('Location:'), { target: { value: 'New Location' } });
        fireEvent.change(getByLabelText('Salary:'), { target: { value: '100000' } });
        fireEvent.change(getByLabelText('Work Type:'), { target: { value: 'Full-time' } });
        fireEvent.change(getByLabelText('Keyword:'), { target: { value: 'JavaScript' } });

        fireEvent.click(getByText('Add'));
        expect(getByText('Add')).toBeDisabled();
        const spinnerIcon = container.querySelector('.fa-spinner');
        expect(spinnerIcon).toBeInTheDocument();
    });
});