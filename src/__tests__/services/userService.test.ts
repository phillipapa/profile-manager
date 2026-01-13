import { fetchUsers } from '../../services/userService';
import { User } from '../../types/user';

describe('fetchUsers', () => {
  const mockUrl = 'https://jsonplaceholder.typicode.com/users';

  const createResponse = (body: any, ok = true, status = 200) =>
    ({
      ok,
      status,
      json: jest.fn().mockResolvedValue(body),
    } as unknown as Response);

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test('returns users with avatarUrl when the request succeeds', async () => {
    const fakeUsers: User[] = [
      {
        id: 1,
        name: 'John Doe',
        username: 'jdoe',
        email: 'john@example.com',
        phone: '555‑1234',
        website: 'example.com',
        avatarUrl: '',
        address: { street: '', suite: '', city: '', zipcode: '' },
        company: { name: '', catchPhrase: '', bs: '' },
      },
    ];

    const mockFetch = jest
      .spyOn(global, 'fetch')
      .mockResolvedValue(createResponse(fakeUsers));

    const result = await fetchUsers();

    expect(mockFetch).toHaveBeenCalledWith(mockUrl);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: 1,
      name: 'John Doe',
      avatarUrl: 'https://picsum.photos/seed/1/80/80',
    });
  });

  test('throws an error when the response is not ok', async () => {
    const mockFetch = jest
      .spyOn(global, 'fetch')
      .mockResolvedValue(createResponse(null, false, 500));

    await expect(fetchUsers()).rejects.toThrow('Failed to get user list');
    expect(mockFetch).toHaveBeenCalledWith(mockUrl);
  });

  test('propagates network errors', async () => {
    const networkError = new Error('Network failure');
    jest.spyOn(global, 'fetch').mockRejectedValue(networkError);

    await expect(fetchUsers()).rejects.toThrow('Network failure');
  });
});
