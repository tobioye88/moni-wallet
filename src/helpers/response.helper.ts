export class ResponseHelper {
  static success<T>(data: T, message = 'Success'): IResponseHelper<T> {
    return { data, message };
  }

  static error<T>(message: string, data: T | null): IResponseHelper<T> {
    return { data, message };
  }

  static paged<T>(
    data: T | null,
    page: number,
    size: number,
    total: number,
    message = 'success',
  ): IResponseHelper<T> {
    return {
      data,
      message,
      meta: {
        page: Number(page),
        size: Number(size),
        total: Number(total),
      },
    };
  }
}

export interface IResponseHelper<T> {
  message?: string;
  data: T;
  meta?: {
    page?: number;
    size?: number;
    total?: number;
  };
}
