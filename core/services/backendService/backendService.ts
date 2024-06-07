/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/return-await */
import axios, { AxiosInstance } from 'axios';
import { Session } from 'next-auth';
import ApiError from '../apiError/ApiError';

export default class BackendService {
  private axiosInstance: AxiosInstance;

  constructor(session: Session) {
    this.axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      timeout: Number(process.env.NEXT_PUBLIC_AXIOS_TIMEOUT) || 10000,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user.accessToken}`,
      },
      withCredentials: true,
    });
  }

  public async get(url: string, headers?: any): Promise<any> {
    try {
      const response = await this.axiosInstance.get(url, { headers });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  public async post(url: string, data: any, headers?: any): Promise<any> {
    try {
      const response = await this.axiosInstance.post(url, data, { headers });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  public async put(url: string, data: any, headers?: any): Promise<any> {
    try {
      const response = await this.axiosInstance.put(url, data, { headers });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  public async delete(url: string, headers?: any): Promise<any> {
    try {
      const response = await this.axiosInstance.delete(url, { headers });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any): void {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      const status = error.response?.status || 500;
      const statusText = error.response?.statusText || 'Internal Server Error';

      throw new ApiError(errorMessage, status, statusText);
    } else {
      throw new Error(error.message);
    }
  }
}
