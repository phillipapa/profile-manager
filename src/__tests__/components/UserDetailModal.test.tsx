import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import UserDetailModal from '../../components/UserDetailModal';
import { User } from '../../types/user';

const mockUser: User = {
  id: 1,
  name: 'John Doe',
  username: 'jdoe',
  email: 'john@example.com',
  phone: '123-456-7890',
  website: 'johndoe.com',
  avatarUrl: 'https://example.com/avatar.jpg',
  address: {
    street: 'jl alamat address',
    suite: 'apart',
    city: 'jkt',
    zipcode: '10000',
  },
  company: {
    name: 'Corpo',
    catchPhrase: 'nice things',
    bs: 'good stuff',
  },
};

describe('UserDetailModal', () => {
  const onClose = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('render modal with user data when open', () => {
    render(
      <UserDetailModal open={true} onClose={onClose} user={mockUser} />
    );

    expect(
      screen.getByRole('heading', { name: `${mockUser.name}'s Details` })
    ).toBeInTheDocument();

    const avatar = screen.getByRole('img', { name: /avatar/i });
    expect(avatar).toHaveAttribute('src', mockUser.avatarUrl);

    const description = screen.getByRole('table');
    const rows = within(description).getAllByRole('row');
    const expected = [
      ['Username', mockUser.username],
      ['E-mail', mockUser.email],
      ['Phone', mockUser.phone],
      ['Website', mockUser.website],
      ['Company', mockUser.company.name],
      [
        'Address',
        `${mockUser.address.street}, ${mockUser.address.suite}, ${mockUser.address.city} ${mockUser.address.zipcode}`,
      ],
    ];

    expected.forEach(([label, value], i) => {
      const row = rows[i];
      expect(within(row).getByText(label)).toBeInTheDocument();
      expect(within(row).getByText(value)).toBeInTheDocument();
    });
  });

  test('not render when open is false', () => {
    render(
      <UserDetailModal open={false} onClose={onClose} user={mockUser} />
    );

    const dialog = screen.queryByRole('dialog');
    expect(dialog).not.toBeInTheDocument();
  });

  test('calls onClose when close icon is clicked', async () => {
    render(
      <UserDetailModal open={true} onClose={onClose} user={mockUser} />
    );

    const closeBtn = screen.getByRole('button', { name: /close/i });
    await userEvent.click(closeBtn);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('no footer', () => {
    render(
      <UserDetailModal open={true} onClose={onClose} user={mockUser} />
    );

    const footer = document.querySelector('.ant-modal-footer');
    expect(footer).not.toBeInTheDocument();
  });
});
