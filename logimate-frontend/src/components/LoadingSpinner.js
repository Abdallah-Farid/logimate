import React from 'react';
import { ClipLoader } from 'react-spinners';

function LoadingSpinner({ loading, size = 50 }) {
  if (!loading) return null;

  return (
    <div className="flex items-center justify-center p-4">
      <ClipLoader color="#0052CC" size={size} />
    </div>
  );
}

export default LoadingSpinner;
