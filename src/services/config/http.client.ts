/**
 * HTTP Client - Wrapper around Fetch API with error handling
 */

import type { ErrorResponse } from "@/models";
import { API_CONFIG } from "./api.config";

export interface RequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
}

class HttpClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  /**
   * Set authorization token
   */
  setToken(token: string) {
    this.defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  /**
   * Clear authorization token
   */
  clearToken() {
    delete this.defaultHeaders["Authorization"];
  }

  /**
   * Generic request handler
   */
  private async request<T>(
    method: string,
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const timeout = config.timeout || API_CONFIG.TIMEOUT;
    const retries = config.retries || API_CONFIG.RETRY.MAX_ATTEMPTS;

    const headers = {
      ...this.defaultHeaders,
      ...(config.headers as Record<string, string>),
    };

    let lastError: Error | null = null;

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          method,
          headers,
          ...config,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData: ErrorResponse = await response.json().catch(() => ({
            success: false,
            message: "Unknown error",
            error: response.statusText,
            status: response.status,
            timestamp: new Date().toISOString(),
          }));

          throw new HttpError(errorData.message, response.status, errorData);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        lastError = error as Error;

        // Don't retry on client errors (4xx)
        if (error instanceof HttpError && error.getStatus() >= 400 && error.getStatus() < 500) {
          throw error;
        }

        // Wait before retrying
        if (attempt < retries - 1) {
          await this.delay(API_CONFIG.RETRY.DELAY * (attempt + 1));
        }
      }
    }

    throw lastError || new Error("Request failed");
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>("GET", endpoint, config);
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body?: any,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>("POST", endpoint, {
      ...config,
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    body?: any,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>("PUT", endpoint, {
      ...config,
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    body?: any,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>("PATCH", endpoint, {
      ...config,
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>("DELETE", endpoint, config);
  }

  /**
   * Helper delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Custom HTTP Error class
 */
export class HttpError extends Error {
  private status: number;
  private response?: ErrorResponse;

  constructor(
    message: string,
    status: number,
    response?: ErrorResponse,
  ) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.response = response;
  }

  getStatus(): number {
    return this.status;
  }

  getResponse(): ErrorResponse | undefined {
    return this.response;
  }
}

/**
 * Export singleton HTTP client instance
 */
export const httpClient = new HttpClient(API_CONFIG.BASE_URL);
