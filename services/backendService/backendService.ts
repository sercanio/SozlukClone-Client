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
      },
      withCredentials: true,
    };

    if (session?.user?.accessToken && baseConfig.headers) {
      baseConfig.headers.Authorization = `Bearer ${session.user.accessToken}`;
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
      throw this.handleError(error);
    }
  }

  private handleError(error: any): ApiError {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      const status = error.response?.status || 500;
      const statusText = error.response?.statusText || 'Internal Server Error';
      return new ApiError(errorMessage, status, statusText);
    }
    return new ApiError(error.message, 500, 'Internal Server Error');
  }
}
