export default class TitleService {
  public static async getAll() {
    const titles = await fetch('http://localhost:60805/api/Titles?PageIndex=0&PageSize=50', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    return titles;
  }
}
