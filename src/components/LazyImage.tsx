import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ImageIcon } from 'lucide-react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  blurPlaceholder?: string; // Base64 encoded blur placeholder
  width?: number;
  height?: number;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
  rootMargin?: string; // Intersection observer root margin
  threshold?: number; // Intersection observer threshold
}

export function LazyImage({
  src,
  alt,
  className = '',
  placeholderClassName = '',
  blurPlaceholder,
  width,
  height,
  objectFit = 'cover',
  loading = 'lazy',
  onLoad,
  onError,
  rootMargin = '50px',
  threshold = 0.1
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (loading === 'eager') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [loading, rootMargin, threshold]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const containerStyle = {
    width: width ? `${width}px` : '100%',
    height: height ? `${height}px` : 'auto',
    minHeight: height ? `${height}px` : '200px'
  };

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={containerStyle}
    >
      {/* Blur placeholder background */}
      {blurPlaceholder && !isLoaded && (
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-sm scale-110"
          style={{ backgroundImage: `url(${blurPlaceholder})` }}
        />
      )}

      {/* Loading placeholder */}
      {!isLoaded && !hasError && (
        <motion.div 
          initial={{ opacity: 1 }}
          animate={{ opacity: isInView ? 0.8 : 1 }}
          className={`absolute inset-0 bg-gray-200 flex items-center justify-center ${placeholderClassName}`}
        >
          <div className="text-center">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            </motion.div>
            <p className="text-sm text-gray-500">Loading image...</p>
          </div>
        </motion.div>
      )}

      {/* Error placeholder */}
      {hasError && (
        <div className={`absolute inset-0 bg-gray-100 flex items-center justify-center ${placeholderClassName}`}>
          <div className="text-center">
            <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Failed to load image</p>
          </div>
        </div>
      )}

      {/* Actual image */}
      {isInView && !hasError && (
        <motion.img
          ref={imgRef}
          src={src}
          alt={alt}
          className={`w-full h-full transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ objectFit }}
          onLoad={handleLoad}
          onError={handleError}
          loading={loading}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Loading overlay animation */}
      {isInView && !isLoaded && !hasError && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
      )}
    </div>
  );
}

// Progressive Image component with multiple quality levels
interface ProgressiveImageProps extends Omit<LazyImageProps, 'src'> {
  srcSet: {
    low: string;    // Low quality/small size
    medium?: string; // Medium quality
    high: string;    // High quality/full size
  };
  sizes?: string;
}

export function ProgressiveImage({
  srcSet,
  sizes,
  alt,
  className = '',
  ...props
}: ProgressiveImageProps) {
  const [currentSrc, setCurrentSrc] = useState(srcSet.low);
  const [isHighQualityLoaded, setIsHighQualityLoaded] = useState(false);

  useEffect(() => {
    // Preload high quality image
    const img = new Image();
    img.onload = () => {
      setCurrentSrc(srcSet.high);
      setIsHighQualityLoaded(true);
    };
    img.src = srcSet.high;

    // Load medium quality if available
    if (srcSet.medium) {
      const mediumImg = new Image();
      mediumImg.onload = () => {
        if (!isHighQualityLoaded) {
          setCurrentSrc(srcSet.medium!);
        }
      };
      mediumImg.src = srcSet.medium;
    }
  }, [srcSet, isHighQualityLoaded]);

  return (
    <LazyImage
      src={currentSrc}
      alt={alt}
      className={`${className} ${!isHighQualityLoaded ? 'filter blur-[0.5px]' : ''}`}
      blurPlaceholder={srcSet.low}
      {...props}
    />
  );
}

// Lazy loading hook for custom implementations
export function useLazyLoading(rootMargin = '50px', threshold = 0.1) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return { ref, isInView };
}

export default LazyImage;
