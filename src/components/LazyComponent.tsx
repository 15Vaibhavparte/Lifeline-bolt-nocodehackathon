import React, { useState, useEffect, useRef } from 'react';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface LazyComponentProps {
  importComponent: () => Promise<any>;
  fallback?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export const LazyComponent: React.FC<LazyComponentProps> = ({
  importComponent,
  fallback,
  className = '',
  children,
  ...props
}) => {
  const [Component, setComponent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !Component && !isLoading) {
          setIsVisible(true);
          setIsLoading(true);
          
          importComponent()
            .then((module) => {
              const ComponentToRender = module.default || module;
              setComponent(() => ComponentToRender);
              setIsLoading(false);
            })
            .catch((err) => {
              setError(err.message);
              setIsLoading(false);
            });
        }
      },
      { rootMargin: '100px', threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [importComponent, Component, isLoading]);

  if (error) {
    return (
      <div className={`p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <p className="text-red-600">Failed to load component: {error}</p>
        <button 
          onClick={() => {
            setError(null);
            setIsLoading(false);
            setIsVisible(false);
          }}
          className="mt-2 text-sm text-red-700 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      {isLoading && (fallback || <LoadingSpinner size="md" text="Loading component..." />)}
      {Component && <Component {...props}>{children}</Component>}
    </div>
  );
};

export default LazyComponent;
