import React, { useState, useEffect, useRef, ComponentType } from 'react';
import { motion } from 'framer-motion';
import { LoadingSpinner } from '../components/LoadingSpinner';

// Hook for lazy loading components when they come into view
export function useLazyComponent(
  importFunction: () => Promise<any>,
  options: {
    rootMargin?: string;
    threshold?: number;
    fallback?: React.ReactNode;
  } = {}
): {
  LazyWrapper: React.FC<any>;
  isLoaded: boolean;
  isLoading: boolean;
  error: Error | null;
  isInView: boolean;
} {
  const [Component, setComponent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { rootMargin = '100px', threshold = 0.1, fallback } = options;

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !Component && !isLoading) {
          setIsInView(true);
          setIsLoading(true);
          
          importFunction()
            .then((module) => {
              setComponent(() => module.default || module);
              setIsLoading(false);
            })
            .catch((err) => {
              setError(err);
              setIsLoading(false);
            });
        }
      },
      { rootMargin, threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [Component, isLoading, importFunction, rootMargin, threshold]);

  const LazyWrapper: React.FC<any> = ({ children, ...props }) => (
    <div ref={ref} {...props}>
      {isLoading && (fallback || <LoadingSpinner size="md" text="Loading component..." />)}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
          <p className="text-red-600">Failed to load component</p>
          <button 
            onClick={() => {
              setError(null);
              setIsLoading(false);
              setIsInView(false);
            }}
            className="mt-2 text-sm text-red-700 underline"
          >
            Retry
          </button>
        </div>
      )}
      {Component && <Component {...props}>{children}</Component>}
    </div>
  );

  return { LazyWrapper, isLoaded: !!Component, isLoading, error, isInView };
}

// Higher-order component for lazy loading
export function withLazyLoading(
  importFunction: () => Promise<any>,
  options: {
    fallback?: React.ReactNode;
    rootMargin?: string;
    threshold?: number;
  } = {}
) {
  return function LazyComponent(props: any) {
    const { LazyWrapper } = useLazyComponent(importFunction, options);
    return <LazyWrapper {...props} />;
  };
}

// Lazy loading container for sections
interface LazySection {
  id: string;
  component: () => Promise<any>;
  props?: any;
  fallback?: React.ReactNode;
  className?: string;
}

interface LazySectionContainerProps {
  sections: LazySection[];
  containerClassName?: string;
  sectionClassName?: string;
  rootMargin?: string;
  threshold?: number;
  staggerDelay?: number;
}

export const LazySectionContainer: React.FC<LazySectionContainerProps> = ({
  sections,
  containerClassName = '',
  sectionClassName = '',
  rootMargin = '50px',
  threshold = 0.1,
  staggerDelay = 0.1
}) => {
  return (
    <div className={containerClassName}>
      {sections.map((section, index) => {
        const { LazyWrapper, isLoaded } = useLazyComponent(section.component, {
          rootMargin,
          threshold,
          fallback: section.fallback
        });

        return (
          <motion.div
            key={section.id}
            className={`${sectionClassName} ${section.className || ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ 
              duration: 0.5, 
              delay: isLoaded ? index * staggerDelay : 0 
            }}
          >
            <LazyWrapper {...section.props} />
          </motion.div>
        );
      })}
    </div>
  );
};

// Pre-loading utilities
export class ComponentPreloader {
  private static cache = new Map<string, Promise<any>>();

  static preload(key: string, importFunction: () => Promise<any>) {
    if (!this.cache.has(key)) {
      this.cache.set(key, importFunction());
    }
    return this.cache.get(key);
  }

  static get(key: string) {
    return this.cache.get(key);
  }

  static clear(key?: string) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  static has(key: string) {
    return this.cache.has(key);
  }
}

// Preload critical components on idle
export function useComponentPreloader(imports: Record<string, () => Promise<any>>) {
  useEffect(() => {
    const preloadOnIdle = () => {
      Object.entries(imports).forEach(([key, importFn]) => {
        ComponentPreloader.preload(key, importFn);
      });
    };

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(preloadOnIdle);
    } else {
      setTimeout(preloadOnIdle, 100);
    }
  }, [imports]);
}

// Progressive loading hook for heavy components
export function useProgressiveLoading<T>(
  lightComponent: () => Promise<{ default: ComponentType<T> }>,
  heavyComponent: () => Promise<{ default: ComponentType<T> }>,
  delay = 1000
) {
  const [showHeavy, setShowHeavy] = useState(false);
  const { LazyWrapper: LightWrapper, isLoaded: lightLoaded } = useLazyComponent(lightComponent);
  const { LazyWrapper: HeavyWrapper, isLoaded: heavyLoaded } = useLazyComponent(
    heavyComponent,
    { rootMargin: '200px' }
  );

  useEffect(() => {
    if (lightLoaded) {
      const timer = setTimeout(() => setShowHeavy(true), delay);
      return () => clearTimeout(timer);
    }
  }, [lightLoaded, delay]);

  return {
    LightWrapper,
    HeavyWrapper,
    showHeavy: showHeavy && heavyLoaded,
    lightLoaded,
    heavyLoaded
  };
}
