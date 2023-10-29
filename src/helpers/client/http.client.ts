import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export class HttpClient {
  private constructor(
    private baseURL = '',
    private config = {} as AxiosRequestConfig,
  ) {}

  static build(baseUrl: string, options?: any) {
    return new HttpClient(baseUrl, options);
  }

  private async base<T>(
    method: string,
    url: string,
    body: any = {},
    methodHeaders: { [key: string]: string } = {},
  ) {
    console.log(
      `URL: ${this.baseURL}${url} METHOD: ${method} PAYLOAD: ${
        body ? JSON.stringify(body) : ''
      }`,
    );
    this.config = {
      baseURL: this.baseURL,
      headers: { 'Content-Type': 'application/json', ...methodHeaders },
    };
    try {
      let response = {} as AxiosResponse<T>;
      switch (method) {
        case 'POST':
          body = JSON.stringify(body);
          response = await axios.post<T, AxiosResponse<T>>(
            `${url}`,
            body,
            this.config,
          );
          break;
        case 'PUT':
          body = JSON.stringify(body);
          response = await axios.put<T, AxiosResponse<T>>(
            `${url}`,
            body,
            this.config,
          );
          break;
        case 'PATCH':
          body = JSON.stringify(body);
          response = await axios.put<T, AxiosResponse<T>>(
            `${url}`,
            body,
            this.config,
          );
          break;
        case 'DELETE':
          response = await axios.delete<T, AxiosResponse<T>>(
            `${url}`,
            this.config,
          );
          break;
        default:
          // GET
          response = await axios.get<T, AxiosResponse<T>>(
            `${url}`,
            this.config,
          );
          break;
      }
      return response.data;
    } catch (error) {
      // console.log('HttpClient Error', error);
      throw new HttpClientError(
        error,
        error?.request,
        error?.response,
        error?.response?.status,
      );
    }
  }

  public async get<T>(
    url: string,
    headers: { [key: string]: string } = {},
  ): Promise<T> {
    const response = await this.base<T>('GET', url, {}, headers);
    return response;
  }

  public async post<T>(
    url: string,
    data: any,
    headers: { [key: string]: string } = {},
  ): Promise<T> {
    const response = await this.base<T>('POST', url, data, headers);
    return response;
  }

  public async put<T>(
    url: string,
    data: any,
    headers: { [key: string]: string } = {},
  ): Promise<T> {
    const response = await this.base<T>('PUT', url, data, headers);
    return response;
  }

  public async patch<T>(
    url: string,
    data: any,
    headers: { [key: string]: string } = {},
  ): Promise<T> {
    const response = await this.base<T>('PATCH', url, data, headers);
    return response;
  }

  public async delete<T>(
    url: string,
    data: any,
    header: { [key: string]: string } = {},
  ): Promise<T> {
    const response = await this.base<T>('DELETE', url, data, header);
    return response;
  }
}

export class HttpClientError extends Error {
  constructor(
    message: string,
    public request: any,
    public response: any,
    public status: number,
  ) {
    super(message);
  }
}
