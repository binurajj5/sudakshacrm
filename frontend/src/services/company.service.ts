import { api } from '@/lib/api-client';
import { Company, CreateCompanyDto, UpdateCompanyDto } from '@/types/company';

export const companyService = {
  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    status?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.status) queryParams.append('status', params.status);

    const query = queryParams.toString();
    return api.get<{ data: Company[]; total: number; page: number; limit: number }>(
      `/companies${query ? `?${query}` : ''}`
    );
  },

  async getById(id: string) {
    return api.get<Company>(`/companies/${id}`);
  },

  async create(data: CreateCompanyDto) {
    return api.post<Company>('/companies', data);
  },

  async update(id: string, data: UpdateCompanyDto) {
    return api.patch<Company>(`/companies/${id}`, data);
  },

  async delete(id: string) {
    return api.delete(`/companies/${id}`);
  },
};
