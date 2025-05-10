export const usersQueriesMap = {
  createUser: 'create-user.sql',
  getUsersByEmail: 'get-users-by-email.sql',
  getUserById: 'get-user-by-id.sql',
  getAllUsers: 'get-users.sql',
} as const;

export type UsersQueries = keyof typeof usersQueriesMap;
