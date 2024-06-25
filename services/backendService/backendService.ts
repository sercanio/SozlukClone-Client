import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Session } from 'next-auth';
import { ApiError } from '@services/apiError/ApiError';

export type RequestHeaders = Record<string, string>;

export default class BackendService {
  private axiosInstance: AxiosInstance;

  constructor(session: Session | null) {
    const baseConfig: AxiosRequestConfig = {
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      timeout: Number(process.env.NEXT_PUBLIC_AXIOS_TIMEOUT) || 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': 'tr'
      },
      withCredentials: true,
    };

    if (session?.user?.accessToken && baseConfig.headers) {
      baseConfig.headers["Authorization"] = `Bearer ${session.user.accessToken}`;
    }

    this.axiosInstance = axios.create(baseConfig);
  }

  public async get<T>(url: string, headers?: RequestHeaders): Promise<T> {
    return this.request<T>({ method: 'GET', url, headers });
  }

  public async post<T, U>(url: string, data: U, headers?: RequestHeaders): Promise<T> {
    return this.request<T>({ method: 'POST', url, data, headers });
  }

  public async put<T, U>(url: string, data: U, headers?: RequestHeaders): Promise<T> {
    return this.request<T>({ method: 'PUT', url, data, headers });
  }

  public async delete<T>(url: string, headers?: RequestHeaders): Promise<T> {
    return this.request<T>({ method: 'DELETE', url, headers });
  }

  public async postFormData<T>(url: string, formData: FormData): Promise<T> {
    try {
      const response = await this.axiosInstance.post<T>(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  public async updateFormData<T>(url: string, formData: FormData): Promise<T> {
    try {
      const response = await this.axiosInstance.put<T>(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.request<T>(config);
      return response.data;
    } catch (error: any) {
      console.error('Request failed:', {
        method: config.method,
        url: config.url,
        headers: config.headers,
        data: config.data,
        error: error.response ? {
          status: error.response.status,
          data: {
            status: error.response.data?.status,
            type: error.response.data?.type,
            title: error.response.data?.title,
            traceId: error.response.data?.traceId,
            errors: error.response.data?.errors?.id.toString()
          },
        } : error.message,
      });
      throw this.handleError(error);
    }
  }

  private handleError(error: any): ApiError {
    if (axios.isAxiosError(error)) {
      const detail = error.response?.data?.detail || 'Something went wrong';
      const status = error.response?.data?.status || 500;
      const title = error.response?.data?.title || 'Internal Server Error';
      const type = error.response?.data?.type || "";

      return new ApiError(detail, status, title, type);
    }
    return new ApiError('Something went wrong', 500, 'Internal Server Error', "https://example.com");
  }
}
