import { handleApiError } from '../../utils/apiErrorHandler';

describe('API Error Handler', () => {
  test('handles server response error', () => {
    const error = { response: { data: { message: 'Server error' } } };
    expect(handleApiError(error)).toBe('Server error');
  });

  test('handles network error', () => {
    const error = { message: 'Network Error' };
    expect(handleApiError(error)).toBe('Network Error');
  });

  test('handles default error', () => {
    const error = { message: 'Unknown Error' };
    expect(handleApiError(error)).toBe('An unexpected error occurred');
  });
});
