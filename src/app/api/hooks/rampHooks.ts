import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from '@app/api/client';

export type RampsApiResponse<T = unknown> = {
  data: T[];
  page: number;
  take: number;
  total: number;
  totalPages: number;
};

export type RampsQueryParams = {
  page?: number;
  take?: number;
  order_createdAt?: 'ASC' | 'DESC' | string;
  where__district?: string;
  where__type?: string;
  where__query?: string;
};

const defaultParams = { page: 1, take: 10, order_createdAt: 'DESC' } as const;

async function fetchRamps(params: RampsQueryParams): Promise<RampsApiResponse> {
  const searchParams: Record<string, string> = {};
  const p = { ...defaultParams, ...(params || {}) } as RampsQueryParams;

  if (p.page !== undefined) searchParams.page = String(p.page);
  if (p.take !== undefined) searchParams.take = String(p.take);
  if (p.order_createdAt) searchParams.order_createdAt = String(p.order_createdAt);
  if (p.where__district) searchParams.where__district = String(p.where__district);
  if (p.where__type) searchParams.where__type = String(p.where__type);
  if (p.where__query) searchParams.where__query = String(p.where__query);

  return await api.get('ramps', { searchParams }).json<RampsApiResponse>();
}

export const useRamps = (
  params: RampsQueryParams,
  options?: { enabled?: boolean },
): UseQueryResult<RampsApiResponse, unknown> => {
  const key = [
    'ramps',
    params?.page ?? 1,
    params?.take ?? 10,
    params?.order_createdAt ?? 'DESC',
    params?.where__district ?? '',
    params?.where__type ?? '',
    params?.where__query ?? '',
  ] as const;

  const queryOptions: UseQueryOptions<
    RampsApiResponse,
    unknown,
    RampsApiResponse,
    readonly unknown[]
  > = {
    queryKey: key as readonly unknown[],
    queryFn: () => fetchRamps(params),
    // 공식 문서 스타일 옵션
    staleTime: 1000 * 60,
    enabled: options?.enabled ?? true,
  };

  return useQuery<RampsApiResponse, unknown, RampsApiResponse, readonly unknown[]>(queryOptions);
};
