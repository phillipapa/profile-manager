import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserList from '../../components/UserList';
import { User } from '../../types/user';
import { useUserContext } from '../../context/UserContext';

jest.mock('../UserDetailModal', () => ({
  __esModule: true,
  default: ({ open, user }: { open: boolean; user: User }) => (
    <div data-testid="detail-modal">{open ? `Detail: ${user.name}` : null}</div>
  ),
}));

jest.mock('../UserFormModal', () => ({
  __esModule: true,
  default: ({ open, mode, user }: { open: boolean; mode: 'add' | 'edit'; user: User | null }) => (
    <div data-testid="form-modal">{open ? `Form: ${mode}` : null}</div>
  ),
}));

const mockDispatch = jest.fn();
jest.mock('../../context/UserContext', () => ({
  useUserContext: () => ({
    state: {
      users: [],
      loading: false,
      error: null,
    },
    dispatch: mockDispatch,
  }),
}));

const renderWithState = (stateOverrides: Partial<ReturnType<typeof useUserContext>> = {}) => {
  const mockState = {
    state: {
      users: [],
      loading: false,
      error: null,
    },
    dispatch: mockDispatch,
    ...stateOverrides,
  };

  jest.spyOn(require('../../context/UserContext'), 'useUserContext').mockReturnValue(mockState);

  return render(<UserList />);
};

const mockUsers: User[] = [
  {
    id: 1,
    name: 'baru 1',
    username: 'baru1',
    email: 'baru1@example.com',
    phone: '021-1234',
    website: 'example.com',
    avatarUrl: 'https://picsum.photos/seed/1/80/80',
    address: { street: '', suite: '', city: '', zipcode: '' },
    company: { name: '', catchPhrase: '', bs: '' },
  },
  {
    id: 2,
    name: 'baru 2',
    username: 'baru2',
    email: 'baru2@example.com',
    phone: '021-5678',
    website: 'example.com',
    avatarUrl: 'https://picsum.photos/seed/2/80/80',
    address: { street: '', suite: '', city: '', zipcode: '' },
    company: { name: '', catchPhrase: '', bs: '' },
  },
];

describe('UserList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('show loading spinner when loading', () => {
    renderWithState({ state: { loading: true, users: [], error: null } });

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.queryByText('Add User')).not.toBeInTheDocument();
  });

  test('show error alert when error is set', () => {
    renderWithState({ state: { loading: false, users: [], error: 'Network error' } });

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Network error')).toBeInTheDocument();
  });

  test('render table users', () => {
    renderWithState({ state: { loading: false, users: mockUsers, error: null } });

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(mockUsers.length + 1);

    expect(screen.getByText('baru 1')).toBeInTheDocument();
    expect(screen.getByText('baru 2')).toBeInTheDocument();
  });

  test('open detail modal when eye button clicked', async () => {
    renderWithState({ state: { loading: false, users: mockUsers, error: null } });

    const eyeButtons = screen.getAllByRole('button', { name: /eye/i });
    fireEvent.click(eyeButtons[0]);

    await waitFor(() => {
      expect(screen.getByTestId('detail-modal')).toHaveTextContent('Detail: baru 1');
    });
  });

  test('open form modal in add mode when Add button clicked', async () => {
    renderWithState({ state: { loading: false, users: [], error: null } });

    const addBtn = screen.getByRole('button', { name: /add user/i });
    fireEvent.click(addBtn);

    await waitFor(() => {
      expect(screen.getByTestId('form-modal')).toHaveTextContent('Form: add');
    });
  });

  test('opens form modal edit when edit button clicked', async () => {
    renderWithState({ state: { loading: false, users: mockUsers, error: null } });

    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    fireEvent.click(editButtons[0]);

    await waitFor(() => {
      expect(screen.getByTestId('form-modal')).toHaveTextContent('Form: edit');
    });
  });

  test('dispatch DELETE_USER when delete button is clicked', () => {
    renderWithState({ state: { loading: false, users: mockUsers, error: null } });

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'DELETE_USER', payload: 1 });
  });
});
