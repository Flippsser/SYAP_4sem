export class DataShapeError extends Error {
  constructor() {
    super('Ошибка структуры данных');
    this.name = 'DataShapeError';
  }
}

export function getQueryErrorMessage(error: unknown): string {
  if (error instanceof DataShapeError) {
    return 'Ошибка структуры данных';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Неизвестная ошибка';
}
