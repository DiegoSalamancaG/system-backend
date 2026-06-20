export class HttpResponse {
  static success<T>(data: T, message?: string) {
    return {
      status: "success",
      ...(message && { message }),
      data,
    };
  }

  // Para estandarizar respuestas informativas o paginadas
  static paginated<T>(data: T[], total: number, page: number, limit: number) {
    return {
      status: "success",
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
      data,
    };
  }
}
