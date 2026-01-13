import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

jest.mock('../components/UserList', () => () => (
  <div data-testid="mock-user-list">Mock UserList</div>
));

describe('App component', () => {
  test('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText(/Profile Manager/i)).toBeInTheDocument();
  });

  test('renders header with correct title and background color', () => {
    render(<App />);
    const title = screen.getByRole('heading', { level: 3, name: /Profile Manager/i });
    expect(title).toBeInTheDocument();

    const header = title.closest('.ant-layout-header');
    expect(header).toHaveStyle('background: #f0f7ff');
  });

  test('renders content area with correct padding and contains UserList', () => {
    render(<App />);
    const content = screen.getByRole('main');
    expect(content).toHaveStyle('padding: 24px');
    expect(screen.getByTestId('mock-user-list')).toBeInTheDocument();
  });
});
