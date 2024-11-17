import React, { Component } from 'react';
import { logError } from '../utils/logger';
import Button from './Button';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    logError(error, 'ErrorBoundary caught an error:');
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h2>
              <p className="text-gray-600 mb-6">
                {this.state.error?.message || 'An unexpected error occurred.'}
              </p>
              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <pre className="mt-4 p-4 bg-gray-100 rounded text-left text-sm overflow-auto">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
              <div className="mt-6 space-y-4">
                <Button onClick={this.handleRetry} variant="primary">
                  Try Again
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="ml-4"
                >
                  Reload Page
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
