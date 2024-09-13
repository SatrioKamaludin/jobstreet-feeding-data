import {render, screen} from "@testing-library/react";
import RootLayout from "./layout";

describe("RootLayout Component", () => {
    test("renders children correctly", () => {
        render(
            <RootLayout>
                <p>Test</p>
            </RootLayout>
        )
        const childElement = screen.getByText(/Test/i);
        expect(childElement).toBeInTheDocument();
    })
})