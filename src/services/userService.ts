import { User } from '../types/user';

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  if (!response.ok) {
    throw new Error('Failed to get user list');
  }
  const data: User[] = await response.json();

  return data.map((user) => ({
    ...user,
    avatarUrl: `https://picsum.photos/seed/${user.id}/80/80`,
}));
}
