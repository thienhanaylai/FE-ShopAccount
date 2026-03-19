import { AxiosError } from "axios";
import { ApiError } from "../services/types";

class ErrorHandler {
  static handleError(error: AxiosError | Error): ApiError {
    if (error instanceof AxiosError) {
      // Handle Axios error
      const status = error.response?.status || 500;
      const data = error.response?.data as any;

      return {
        statusCode: status,
        message: data?.message || error.message,
        error: data?.error || "Error",
      };
    }

    // Handle generic Error
    return {
      statusCode: 500,
      message: error.message || "An unknown error occurred",
      error: "Error",
    };
  }

  static getErrorMessage(error: AxiosError | Error): string {
    if (error instanceof AxiosError) {
      const data = error.response?.data as any;
      return data?.message || error.message || "An error occurred";
    }
    return error.message || "An unknown error occurred";
  }

  static isAuthError(error: AxiosError | Error): boolean {
    if (error instanceof AxiosError) {
      return error.response?.status === 401;
    }
    return false;
  }

  static isNotFoundError(error: AxiosError | Error): boolean {
    if (error instanceof AxiosError) {
      return error.response?.status === 404;
    }
    return false;
  }

  static isValidationError(error: AxiosError | Error): boolean {
    if (error instanceof AxiosError) {
      return error.response?.status === 400;
    }
    return false;
  }

  static isConflictError(error: AxiosError | Error): boolean {
    if (error instanceof AxiosError) {
      return error.response?.status === 409;
    }
    return false;
  }

  static isForbiddenError(error: AxiosError | Error): boolean {
    if (error instanceof AxiosError) {
      return error.response?.status === 403;
    }
    return false;
  }
}

export default ErrorHandler;
