import { useState, useEffect, useRef, ComponentType, LazyExoticComponent } from 'react';
import { motion } from 'framer-motion';
import { LoadingSpinner } from './LoadingSpinner';

// Hook for lazy loading components when they come into view
export function useLazyComponent<T = any>(
  importFunction: () => Promise<{ default: ComponentType<T> }>,
  options: {
    rootMargin?: string;
    threshold?: number;
    fallback?: React.ReactNode;
  } = {}
) {
  const [Component, setComponent] = useState<ComponentType<T> | null>(null);
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
              setComponent(() => module.default);
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

  const LazyWrapper = ({ children, ...props }: any) => (
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
export function withLazyLoading<P extends object>(
  importFunction: () => Promise<{ default: ComponentType<P> }>,
  options: {
    fallback?: React.ReactNode;
    rootMargin?: string;
    threshold?: number;
  } = {}
) {
  return function LazyComponent(props: P) {
    const { LazyWrapper } = useLazyComponent(importFunction, options);
    return <LazyWrapper {...props} />;
  };
}

// Lazy loading container for sections
interface LazySection {
  id: string;
  component: () => Promise<{ default: ComponentType<any> }>;
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

export function LazySectionContainer({
  sections,
  containerClassName = '',
  sectionClassName = '',
  rootMargin = '50px',
  threshold = 0.1,
  staggerDelay = 0.1
}: LazySectionContainerProps) {
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
}

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

  static has(key: string) {
    return this.cache.has(key);
  }

  static clear() {
    this.cache.clear();
  }
}

// Preload critical components on idle
export function useIdlePreloading(
  components: Record<string, () => Promise<any>>,
  delay = 2000
) {
  useEffect(() => {
    const preloadComponents = () => {
      Object.entries(components).forEach(([key, importFn]) => {
        ComponentPreloader.preload(key, importFn);
      });
    };

    // Use requestIdleCallback if available, otherwise setTimeout
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(preloadComponents, { timeout: delay });
      return () => cancelIdleCallback(id);
    } else {
      const id = setTimeout(preloadComponents, delay);
      return () => clearTimeout(id);
    }
  }, [components, delay]);
}

// Route-based preloading
export function useRoutePreloading() {
  useEffect(() => {
    // Preload critical routes on app start
    const criticalRoutes = {
      'emergency': () => import('../pages/EmergencyRequest'),
      'donor-dashboard': () => import('../pages/DonorDashboard'),
      'recipient-dashboard': () => import('../pages/RecipientDashboard'),
    };

    useIdlePreloading(criticalRoutes, 1000);
  }, []);
}
