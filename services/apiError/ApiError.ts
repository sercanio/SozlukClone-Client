export type TApiError = {
  detail: string;
  status: string;
  title: string;
  type: string;
};

export class ApiError extends Error {
  status: number;
  title: string;
  type: string;

  constructor(detail: string, status: number, title: string, type: string) {
    super(detail);
    this.status = status;
    this.title = title;
    this.type = type;
  }
}
