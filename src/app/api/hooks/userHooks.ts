import { useQuery } from '@tanstack/react-query';
import { getMe, type User } from '../users';

export const useMe = () => {
  return useQuery<User, Error>({
    queryKey: ['me'],
    queryFn: () => getMe(),
  });
};
