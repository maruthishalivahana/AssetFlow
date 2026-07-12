export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export const successResponse = <T>(message: string, data?: T): ApiResponse<T> => {
  return {
    success: true,
    message,
    ...(typeof data !== 'undefined' ? { data } : {}),
  };
};
