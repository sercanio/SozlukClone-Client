/* eslint-disable no-useless-escape */
import { Session } from 'next-auth';
import BackendService from '@services/backendService/backendService';
import { TitlesGetAllResponse, TitlesGetByIdResponse } from '@/types/DTOs/TitlesDTOs';
import { EntriesPostRequest } from '@/types/DTOs/EntriesDTOs';

export default class EntriesService {
  private backendService: BackendService;

  constructor(session: Session) {
    this.backendService = new BackendService(session);
  }

  public async getAll(pageIndex: number, pageSize: number): Promise<TitlesGetAllResponse> {
    return this.backendService.get<TitlesGetAllResponse>(
      `Entries?PageIndex=${pageIndex}&PageSize=${pageSize}`
    );
  }

  public async getById(id: number): Promise<TitlesGetByIdResponse> {
    return this.backendService.get<TitlesGetByIdResponse>(`Entries/${id}`);
  }

  public async create<EntriesGetByIdResponse>(
    data: EntriesPostRequest
  ): Promise<EntriesGetByIdResponse> {
    const response = await this.backendService.post<EntriesGetByIdResponse, EntriesPostRequest>(
      'Entries',
      { ...data, content: data.content }
    );
    return response;
  }

  public async delete(id: number): Promise<void> {
    return this.backendService.delete(`Entries/${id}`);
  }

  public formatEntryContent(content: string): string {
    let formattedContent = content;
    formattedContent = this.convertBkz(formattedContent);
    formattedContent = this.convertGbkz(formattedContent);
    formattedContent = this.convertSpoilers(formattedContent);
    formattedContent = this.convertAsteriksBkz(formattedContent);
    formattedContent = this.convertLinks(formattedContent);
    formattedContent = this.lowercaseExceptLinks(formattedContent);
    return formattedContent;
  }

  private sanitizeText(text: string): string {
    return text.replace(/[^a-zA-Z0-9ığüşöçİĞÜŞÖÇ\s]/g, '');
  }

  private convertBkz(text: string): string {
    const bkzRegex = /\(bkz: ([^)]+)\)/g;
    return text.replace(bkzRegex, (match, p1) => {
      const sanitizedPhrase = this.sanitizeText(p1);
      const encodedPhrase = encodeURIComponent(sanitizedPhrase);
      return `(bkz: <a href="http://localhost:3000/?baslik=${encodedPhrase}">${sanitizedPhrase}</a>)`;
    });
  }

  private convertGbkz(text: string): string {
    const gbkzRegex = /\(gbkz: ([^)]+)\)/g;
    return text.replace(gbkzRegex, (match, p1) => {
      const sanitizedPhrase = this.sanitizeText(p1);
      const encodedPhrase = encodeURIComponent(sanitizedPhrase);
      return `<a href="http://localhost:3000/?baslik=${encodedPhrase}">${sanitizedPhrase}</a>`;
    });
  }

  private convertAsteriksBkz(text: string): string {
    const asteriksBkzRegex = /\`:([^`]+)\`/g;
    return text.replace(asteriksBkzRegex, (match, p1) => {
      const sanitizedPhrase = this.sanitizeText(p1);
      const encodedPhrase = encodeURIComponent(sanitizedPhrase);
      return `<a href="http://localhost:3000/?baslik=${encodedPhrase}" title='(bkz: ${sanitizedPhrase})'>*</a>`;
    });
  }

  private convertSpoilers(text: string): string {
    const spoilerRegex = /--- `([^`]+)` ---/g;
    return text.replace(
      spoilerRegex,
      (match, p1) => `
        <p>
            ---
            <a
              href="http://localhost:3000/?baslik=${encodeURIComponent(p1)}">
              spoiler
            </a>
            ---
          </p>
          `
    );
  }

  private convertLinks(text: string): string {
    const linkRegex = /\[(https?:\/\/[^\s]+)\s([^\]]+)\]/g;
    return text.replace(
      linkRegex,
      (match, p1, p2) => `
        <a href="${p1}">
          ${p2.toLowerCase()}
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-link">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M9 15l6 -6"/>
            <path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464"/>
            <path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463"/>
          </svg>
        </a>`
    );
  }

  private lowercaseExceptLinks(text: string): string {
    const linkRegex = /\[(https?:\/\/[^\s]+)\s([^\]]+)\]/g;

    let match;
    const segments = [];
    let currentIndex = 0;

    while ((match = linkRegex.exec(text)) !== null) {
      const beforeLink = text.slice(currentIndex, match.index).toLowerCase();
      const url = match[1];
      const linkText = match[2];

      segments.push(beforeLink);
      segments.push(`[${url} ${linkText}]`);

      currentIndex = match.index + match[0].length;
    }

    segments.push(text.slice(currentIndex).toLowerCase());

    return segments.join('');
  }
}
