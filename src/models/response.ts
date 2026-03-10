/**
 * Generic API Response wrapper from Spring Boot backend
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

/**
 * Paginated response from backend
 */
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Error response from backend
 */
export interface ErrorResponse {
  success: false;
  message: string;
  error: string;
  status: number;
  timestamp: string;
}
