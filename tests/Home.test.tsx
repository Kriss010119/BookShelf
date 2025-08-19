import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom';
import Home from '../src/pages/Home/Home';

describe('Home Page', () => {
  it('should render home page with title', () => {
    render(<Home />);

    const titleElement = screen.getByText(/Welcome to BookShelf/i);
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toBeVisible();
  });
});