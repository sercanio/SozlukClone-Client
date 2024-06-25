/* eslint-disable no-useless-escape */
import { Session } from 'next-auth';
import BackendService from '@services/backendService/backendService';
import DOMPurify from 'isomorphic-dompurify';
import {
  EntriesGetAllResponse,
  EntriesGetByIdResponse,
  EntriesPostRequest,
  UpdateEntryByUserRequest,
  UpdateEntryByUserResponse,
} from '@/types/DTOs/EntriesDTOs';

export default class EntriesService {
  private backendService: BackendService;

  constructor(session: Session) {
    this.backendService = new BackendService(session);
  }

  public async getAll(pageIndex: number, pageSize: number): Promise<EntriesGetAllResponse> {
    return this.backendService.get<EntriesGetAllResponse>(
      `Entries?PageIndex=${pageIndex}&PageSize=${pageSize}`
    );
  }

  public async getAllForHomePage(
    pageIndex: number,
    pageSize: number
  ): Promise<EntriesGetAllResponse> {
    return this.backendService.get<EntriesGetAllResponse>(
      `Entries/ForHomePage?PageIndex=${pageIndex}&PageSize=${pageSize}`
    );
  }

  public async getAllByAuthorId(
    pageIndex: number,
    pageSize: number,
    authorId: number,
  ): Promise<EntriesGetAllResponse> {
    return this.backendService.get<EntriesGetAllResponse>(`Entries/GetListByAuthorId?PageIndex=${pageIndex}&PageSize=${pageSize}&authorId=${authorId}`)
  }

  public async getMostLikedAllByAuthorId(
    pageIndex: number,
    pageSize: number,
    authorId: number,
  ): Promise<EntriesGetAllResponse> {
    return this.backendService.get<EntriesGetAllResponse>(`Entries/GetTopLikedListByAuthorId?PageIndex=${pageIndex}&PageSize=${pageSize}&authorId=${authorId}`)
  }


  public async getMostFavoritedEntriesByAuthorId(
    pageIndex: number,
    pageSize: number,
    authorId: number,
  ): Promise<EntriesGetAllResponse> {
    return this.backendService.get<EntriesGetAllResponse>(`Entries/GetMostFavoritedListByAuthorId?PageIndex=${pageIndex}&PageSize=${pageSize}&authorId=${authorId}`)
  }

  public async getFavoriteEntriesOfAuthorByAuthorId(
    pageIndex: number,
    pageSize: number,
    authorId: number,
  ): Promise<EntriesGetAllResponse> {
    return this.backendService.get<EntriesGetAllResponse>(`Entries/GetFavoritesByAuthorId?PageIndex=${pageIndex}&PageSize=${pageSize}&authorId=${authorId}`)
  }

  public async getAllByTitleId(
    pageIndex: number,
    pageSize: number,
    titleId: number,
  ): Promise<EntriesGetAllResponse>{
    return this.backendService.get<EntriesGetAllResponse>(`Entries/GetListByTitleId?PageIndex=${pageIndex}&PageSize=${pageSize}&titleId=${titleId}`)
  }

  public async getById(id: number): Promise<EntriesGetByIdResponse> {
    return this.backendService.get<EntriesGetByIdResponse>(`Entries/${id}`);
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

  public async update<UpdateEntryByUserResponse>(data: UpdateEntryByUserRequest): Promise<UpdateEntryByUserResponse> {
    const response = await this.backendService.put<UpdateEntryByUserResponse, UpdateEntryByUserRequest>(
      'Entries',
      { ...data, content: data.content }
    )
    return response;
  }

  public async delete(id: number): Promise<void> {
    return this.backendService.delete(`Entries/${id}`);
  }

  public formatEntryContent(content: string): string {
    let sanitizedContent = DOMPurify.sanitize(content, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });

    sanitizedContent = this.convertBkz(sanitizedContent);
    sanitizedContent = this.convertGbkz(sanitizedContent);
    sanitizedContent = this.convertSpoilers(sanitizedContent);
    sanitizedContent = this.convertAsteriksBkz(sanitizedContent);
    sanitizedContent = this.convertLinks(sanitizedContent);
    sanitizedContent = this.convertImageLinks(sanitizedContent);
    sanitizedContent = this.lowercaseExceptLinks(sanitizedContent);
    sanitizedContent = this.convertParagraphs(sanitizedContent);
    return DOMPurify.sanitize(sanitizedContent);
  }

  private sanitizeText(text: string): string {
    return text.replace(/[^a-zA-Z0-9ığüşöçİĞÜŞÖÇ\s]/g, '');
  }

  private convertBkz(text: string): string {
    const bkzRegex = /\(bkz: (#\d+|[^)]+)\)/g;
    return text.replace(bkzRegex, (match, p1) => {
      if (p1.startsWith('#')) {
        // Handle numeric bkz with #
        const entryId = p1.slice(1); // Remove the # symbol
        return `(bkz: <a href="/tanim/${entryId}" id="internallink">${p1}</a>)`;
      } else {
        // Handle normal bkz
        const sanitizedPhrase = this.sanitizeText(p1);
        const encodedPhrase = encodeURIComponent(sanitizedPhrase);
        return `(bkz: <a href="/?baslik=${encodedPhrase}" id="internallink">${sanitizedPhrase}</a>)`;
      }
    });
  }

  private convertGbkz(text: string): string {
    const gbkzRegex = /\(gbkz: ([^)]+)\)/g;
    return text.replace(gbkzRegex, (match, p1) => {
      const sanitizedPhrase = this.sanitizeText(p1);
      const encodedPhrase = encodeURIComponent(sanitizedPhrase);
      return `<a href="/?baslik=${encodedPhrase}" id="internallink">${sanitizedPhrase}</a>`;
    });
  }

  private convertAsteriksBkz(text: string): string {
    const asteriksBkzRegex = /\`:([^`]+)\`/g;
    return text.replace(asteriksBkzRegex, (match, p1) => {
      const sanitizedPhrase = this.sanitizeText(p1);
      const encodedPhrase = encodeURIComponent(sanitizedPhrase);
      return `<a href="/?baslik=${encodedPhrase}" title='(bkz: ${sanitizedPhrase})' id="internallink">*</a>`;
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
              href="/?baslik=${encodeURIComponent(p1)}" id="internallink">
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

  private convertImageLinks(text: string): string {
    const imageLinkRegex = /\[img: (https?:\/\/[^\s]+)\]/g;
    return text.replace(
      imageLinkRegex,
      (match, p1) => `
        <a href="${p1}" target="_blank" rel="noopener noreferrer" title="orijinal boyutta gör">
          <img src="${p1}" alt="yazar tarafından eklenmiş görsel" class="entry-img" onerror="this.onerror=null;this.src='https://placeimg.com/200/300/animals';" />
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

  private convertParagraphs(text: string): string {
    return text
      .split('\n\n')
      .map(paragraph => `<p>${paragraph.trim()}</p>`)
      .join('');
  }

  async getTopLikedByAuthorId(page: number, pageSize: number, authorId: number) {
    // Fetch entries sorted by likes
  }

  async getTopFavoritedByAuthorId(page: number, pageSize: number, authorId: number) {
    // Fetch entries sorted by favorites
  }

  async getFavoritesByAuthorId(page: number, pageSize: number, authorId: number) {
    // Fetch favorited entries by the author
  }
}
