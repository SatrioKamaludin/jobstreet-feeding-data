import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import RootLayout from './layout';

// Mock the Inter function from next/font/google
jest.mock('next/font/google', () => ({
    Inter: () => ({
        className: 'inter',
    }),
}));

describe('RootLayout Component', () => {
    it('renders children correctly', () => {
        const { getByText } = render(
            <RootLayout>
                <div>Test Child</div>
            </RootLayout>,
            { container: document.body }
        );
        expect(getByText('Test Child')).toBeInTheDocument();
    });

    it('applies the Inter font class to the body', () => {
        const { container } = render(
            <RootLayout>
                <div>Test Child</div>
            </RootLayout>,
            { container: document.body }
        );
        const bodyElement = container.querySelector('body');
        expect(bodyElement).toHaveClass('inter');
    });
});