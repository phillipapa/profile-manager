import { render, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UserProvider, useUserContext, userReducer } from '../../context/UserContext';
import { fetchUsers } from '../../services/userService';
import { User } from '../../types/user';

jest.mock('../services/userService');

const mockUsers: User[] = [
  {
    id: 1,
    name: 'Baru 1',
    username: 'baru1',
    email: 'baru1@example.com',
    phone: '123',
    website: 'example.com',
    avatarUrl: 'https://picsum.photos/seed/1/80/80',
    address: { street: '', suite: '', city: '', zipcode: '' },
    company: { name: '', catchPhrase: '', bs: '' },
  },
];

describe('userReducer', () => {
  const initial = { users: [], loading: false, error: null };

  it('SET_USER', () => {
    const next = userReducer(initial, { type: 'SET_USER', payload: mockUsers });
    expect(next.users).toEqual(mockUsers);
  });

  it('ADD_USER', () => {
    const next = userReducer(initial, { type: 'ADD_USER', payload: mockUsers[0] });
    expect(next.users).toEqual([mockUsers[0]]);
  });

  it('UPDATE_USER', () => {
    const state = { ...initial, users: [mockUsers[0]] };
    const updated = { ...mockUsers[0], name: 'Updated' };
    const next = userReducer(state, { type: 'UPDATE_USER', payload: updated });
    expect(next.users[0].name).toBe('Updated');
  });

  it('DELETE_USER', () => {
    const state = { ...initial, users: [mockUsers[0]] };
    const next = userReducer(state, { type: 'DELETE_USER', payload: 1 });
    expect(next.users).toHaveLength(0);
  });

  it('SET_LOADING', () => {
    const next = userReducer(initial, { type: 'SET_LOADING', payload: true });
    expect(next.loading).toBe(true);
  });

  it('SET_ERROR', () => {
    const next = userReducer(initial, { type: 'SET_ERROR', payload: 'oops' });
    expect(next.error).toBe('oops');
  });
});

describe('UserProvider', () => {
  const TestComponent = () => {
    const { state, dispatch } = useUserContext();
    return (
      <div>
        <span data-testid="count">{state.users.length}</span>
        <button onClick={() => dispatch({ type: 'ADD_USER', payload: mockUsers[0] })}>Add</button>
      </div>
    );
  };

  it('render children', () => {
    const { getByText } = render(
      <UserProvider>
        <div>Child</div>
      </UserProvider>
    );
    expect(getByText('Child')).toBeInTheDocument();
  });

  it('initial fetch success', async () => {
    (fetchUsers as jest.Mock).mockResolvedValueOnce(mockUsers);
    const { getByTestId } = render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );
    await waitFor(() => expect(getByTestId('count')).toHaveTextContent('1'));
  });

  it('initial fetch error', async () => {
    (fetchUsers as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    const { getByText } = render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );
    await waitFor(() => expect(getByText(/Error/i)).toBeInTheDocument());
  });

  it('success dispatch', async () => {
    (fetchUsers as jest.Mock).mockResolvedValueOnce([]);
    const { getByTestId, getByText } = render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );
    await waitFor(() => expect(getByTestId('count')).toHaveTextContent('0'));
    act(() => getByText('Add').click());
    expect(getByTestId('count')).toHaveTextContent('1');
  });
});

describe('useUserContext error', () => {
  it('throws when no provider', () => {
    const fn = () => render(<div>{useUserContext().state.users.length}</div>);
    expect(fn).toThrow('useUserContext wrong Provider');
  });
});
