export function handleApiError(error) {
  // Log the error for debugging
  console.error('[API Error]:', error);

  if (error.response) {
    // Handle specific HTTP status codes
    return error.response.data?.message || 'Server error';
  } else if (error.message === 'Network Error') {
    return 'Network Error';
  }
  
  return 'An unexpected error occurred';
}
