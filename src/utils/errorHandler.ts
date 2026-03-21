import { AxiosError } from "axios";
import { ApiError } from "../services/types";

type ErrorMessagePayload = {
  message?: string | string[];
  error?: string;
};

class ErrorHandler {
  private static normalizeMessage(message?: string | string[]): string {
    if (Array.isArray(message)) {
      return message.join("; ");
    }

    if (typeof message === "string" && message.trim().length > 0) {
      return message;
    }

    return "Đã có lỗi xảy ra. Vui lòng thử lại.";
  }

  private static getAxiosStatus(error: AxiosError): number {
    return error.response?.status ?? 500;
  }

  static handleError(error: unknown): ApiError {
    if (error instanceof AxiosError) {
      const statusCode = this.getAxiosStatus(error);
      const data = error.response?.data as ErrorMessagePayload | undefined;

      return {
        statusCode,
        message: this.normalizeMessage(data?.message) || error.message,
        error: data?.error || "Error",
      };
    }

    if (error instanceof Error) {
      return {
        statusCode: 500,
        message: error.message || "Đã có lỗi xảy ra. Vui lòng thử lại.",
        error: "Error",
      };
    }

    return {
      statusCode: 500,
      message: "Đã có lỗi xảy ra. Vui lòng thử lại.",
      error: "Error",
    };
  }

  static getErrorMessage(error: unknown): string {
    const normalizedError = this.handleError(error);
    return normalizedError.message;
  }

  private static hasStatus(error: unknown, statusCode: number): boolean {
    if (error instanceof AxiosError) {
      return this.getAxiosStatus(error) === statusCode;
    }

    return false;
  }

  static isAuthError(error: unknown): boolean {
    return this.hasStatus(error, 401);
  }

  static isNotFoundError(error: unknown): boolean {
    return this.hasStatus(error, 404);
  }

  static isValidationError(error: unknown): boolean {
    return this.hasStatus(error, 400);
  }

  static isConflictError(error: unknown): boolean {
    return this.hasStatus(error, 409);
  }

  static isForbiddenError(error: unknown): boolean {
    return this.hasStatus(error, 403);
  }
}

export default ErrorHandler;
