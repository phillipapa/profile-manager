import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import UserFormModal from '../../components/UserFormModal';
import { User } from '../../types/user';
import { message } from 'antd';

jest.mock('antd', () => {
  const original = jest.requireActual('antd');
  return {
    ...original,
    message: {
      success: jest.fn(),
      error: jest.fn(),
    },
  };
});

const mockDispatch = jest.fn();
jest.mock('../../context/UserContext', () => ({
  useUserContext: () => ({
    dispatch: mockDispatch,
  }),
}));

const mockUser: User = {
  id: 1,
  name: 'John Doe',
  username: 'jdoe',
  email: 'john@example.com',
  phone: '555-1234',
  website: 'johndoe.com',
  avatarUrl: 'https://picsum.photos/seed/1/80/80',
  address: { street: '', suite: '', city: '', zipcode: '' },
  company: { name: '', catchPhrase: '', bs: '' },
};

const renderComponent = (props: Partial<React.ComponentProps<typeof UserFormModal>>) => {
  return render(
    <UserFormModal
      open={true}
      onClose={jest.fn()}
      mode="add"
      user={null}
      {...props}
    />
  );
};

describe('UserFormModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders in add mode with empty form', () => {
    renderComponent({ mode: 'add' });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Add New User')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  test('renders in edit mode with pre‑filled values', () => {
    renderComponent({ mode: 'edit', user: mockUser });

    expect(screen.getByDisplayValue(mockUser.name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockUser.username)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockUser.email)).toBeInTheDocument();
  });

  test('shows validation errors when required fields are empty', async () => {
    renderComponent({ mode: 'add' });

    userEvent.click(screen.getByRole('button', { name: /add/i }));

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith('Enter your name');
      expect(message.error).toHaveBeenCalledWith('Enter desired username');
      expect(message.error).toHaveBeenCalledWith('Enter valid email');
    });

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  test('shows email format validation error', async () => {
    renderComponent({ mode: 'add' });

    userEvent.type(screen.getByLabelText(/email/i), 'invalid-email');
    userEvent.click(screen.getByRole('button', { name: /add/i }));

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith('Enter valid email');
    });
  });

  test('dispatches ADD_USER and shows success on valid add', async () => {
    renderComponent({ mode: 'add' });

    userEvent.type(screen.getByLabelText(/full name/i), 'saya test');
    userEvent.type(screen.getByLabelText(/username/i), 'saya123');
    userEvent.type(screen.getByLabelText(/email/i), 'saya@example.com');

    userEvent.click(screen.getByRole('button', { name: /add/i }));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'ADD_USER',
          payload: expect.objectContaining({
            name: 'Alice Smith',
            username: 'asmith',
            email: 'alice@example.com',
          }),
        })
      );
      expect(message.success).toHaveBeenCalledWith('User added');
    });
  });

  test('dispatches UPDATE_USER and shows success on valid edit', async () => {
    renderComponent({ mode: 'edit', user: mockUser });

    userEvent.clear(screen.getByLabelText(/full name/i));
    userEvent.type(screen.getByLabelText(/full name/i), 'test2 update');
    userEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'UPDATE_USER',
          payload: expect.objectContaining({
            id: mockUser.id,
            name: 'John Updated',
          }),
        })
      );
      expect(message.success).toHaveBeenCalledWith('User updated');
    });
  });

  test('calls onClose after successful submit', async () => {
    const onClose = jest.fn();
    renderComponent({ mode: 'add', onClose });

    userEvent.type(screen.getByLabelText(/full name/i), 'test');
    userEvent.type(screen.getByLabelText(/username/i), 'test');
    userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');

    userEvent.click(screen.getByRole('button', { name: /add/i }));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
