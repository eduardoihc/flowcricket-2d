import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders login screen initially', () => {
  render(<App />);
  const loginButton = screen.getByText(/Login/i);
  expect(loginButton).toBeInTheDocument();
});

test('logs in as an admin and views the admin dashboard', () => {
  render(<App />);
  const usernameInput = screen.getByPlaceholderText(/Enter your username/i);
  const loginButton = screen.getByText(/Login/i);

  fireEvent.change(usernameInput, { target: { value: 'admin' } });
  fireEvent.click(loginButton);

  const adminDashboard = screen.getByText(/Admin Dashboard/i);
  expect(adminDashboard).toBeInTheDocument();
});

test('logs in as a grilo and views the grilo dashboard', () => {
  render(<App />);
  const usernameInput = screen.getByPlaceholderText(/Enter your username/i);
  const loginButton = screen.getByText(/Login/i);

  fireEvent.change(usernameInput, { target: { value: 'grilo' } });
  fireEvent.click(loginButton);

  const griloDashboard = screen.getByText(/Grilo Dashboard/i);
  expect(griloDashboard).toBeInTheDocument();
});

test('logs in as a client and views the client dashboard', () => {
  render(<App />);
  const usernameInput = screen.getByPlaceholderText(/Enter your username/i);
  const loginButton = screen.getByText(/Login/i);

  fireEvent.change(usernameInput, { target: { value: 'client' } });
  fireEvent.click(loginButton);

  const clientDashboard = screen.getByText(/Client Dashboard/i);
  expect(clientDashboard).toBeInTheDocument();
});
