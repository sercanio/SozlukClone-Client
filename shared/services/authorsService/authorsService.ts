import BackendService from '@/core/services/backendService/backendService';

export default class AuthorsService {
  private backendService: any;

  constructor(session: any) {
    this.backendService = new BackendService(session);
  }

  public async getAll(pageIndex: number, pageSize: number): Promise<any> {
    return this.backendService.get(`Authors?PageIndex=${pageIndex}&PageSize=${pageSize}`);
  }

  public async getById(id: number): Promise<any> {
    return this.backendService.get(`Authors/${id}`);
  }

  public async update(author: any): Promise<any> {
    return this.backendService.put('Authors', author);
  }

  public async searchByUserName(
    userName: string,
    pageIndex: number,
    pageSize: number
  ): Promise<any> {
    return this.backendService.post(`Authors/Dynamic?PageIndex=${pageIndex}&PageSize=${pageSize}`, {
      sort: [
        {
          field: 'userName',
          dir: 'asc',
        },
      ],
      filter: {
        field: 'userName',
        operator: 'contains',
        value: userName,
      },
    });
  }
}
