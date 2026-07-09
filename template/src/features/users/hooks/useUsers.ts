import { useQuery } from '@tanstack/react-query';
import { useReducer } from 'react';
import { usersApi } from '../api/usersApi';
import type { UserFilters } from '../types';

type UsersAction =
  | { type: 'SET_FILTERS'; payload: Partial<UserFilters> }
  | { type: 'RESET_FILTERS' }
  | { type: 'SET_PAGE'; payload: number };

function filtersReducer(state: UserFilters, action: UsersAction): UserFilters {
  switch (action.type) {
    case 'SET_FILTERS':
      return { ...state, ...action.payload, page: 1 };
    case 'RESET_FILTERS':
      return { page: 1, limit: 10 };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    default:
      return state;
  }
}

export function useUsers(initialFilters: UserFilters = { page: 1, limit: 10 }) {
  const [filters, dispatch] = useReducer(filtersReducer, initialFilters);

  const query = useQuery({
    queryKey: ['users', filters],
    queryFn: () => usersApi.getAll(filters),
    staleTime: 5 * 60 * 1000,
    select: (response) => ({
      users: response.data,
      total: response.total,
    }),
  });

  const setFilters = (newFilters: Partial<UserFilters>) =>
    dispatch({ type: 'SET_FILTERS', payload: newFilters });

  const setPage = (page: number) =>
    dispatch({ type: 'SET_PAGE', payload: page });

  return {
    ...query,
    filters,
    setFilters,
    setPage,
  };
}
