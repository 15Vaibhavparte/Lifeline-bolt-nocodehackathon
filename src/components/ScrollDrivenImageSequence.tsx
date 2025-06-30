import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface ImageFrame {
  src: string;
  alt?: string;
}

interface ScrollDrivenImageSequenceProps {
  images: ImageFrame[];
  frameHeight?: number;
  className?: string;
  containerClassName?: string;
  scrollMultiplier?: number; // Controls scroll sensitivity
}

export function ScrollDrivenImageSequence({ 
  images, 
  frameHeight = 400, 
  className = '', 
  containerClassName = '',
  scrollMultiplier = 1.2
}: ScrollDrivenImageSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  // Use framer-motion's useScroll to track scroll position within the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  // Add spring animation for smoother transitions
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Transform scroll progress to frame index with smooth interpolation
  const frameIndex = useTransform(
    smoothProgress,
    [0, 1],
    [0, Math.max(0, images.length - 1)]
  );

  // Preload all images for smooth playback
  useEffect(() => {
    const imagePromises = images.map(image => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = image.src;
      });
    });

    Promise.all(imagePromises)
      .then(() => setIsLoaded(true))
      .catch(console.error);
  }, [images]);

  // Update current frame based on scroll position with debouncing
  const updateFrame = useCallback((latest: number) => {
    const newFrame = Math.round(latest);
    if (newFrame !== currentFrame && newFrame >= 0 && newFrame < images.length) {
      setCurrentFrame(newFrame);
      setIsScrolling(true);
      
      // Reset scrolling state after a delay
      setTimeout(() => setIsScrolling(false), 150);
    }
  }, [currentFrame, images.length]);

  // Subscribe to frame index changes
  useEffect(() => {
    const unsubscribe = frameIndex.on('change', updateFrame);
    return () => unsubscribe();
  }, [frameIndex, updateFrame]);

  // Enhanced scroll behavior for mobile
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const scrollSensitivity = scrollMultiplier;
      container.scrollTop += e.deltaY * scrollSensitivity;
    };

    // Add momentum scrolling for iOS
    (container.style as any).webkitOverflowScrolling = 'touch';
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [scrollMultiplier]);

  if (!isLoaded) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 rounded-2xl ${containerClassName}`}
        style={{ height: frameHeight }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading frames...</p>
        </div>
      </div>
    );
  }

  const scrollHeight = frameHeight * 4; // Increase scroll area for smoother control

  return (
    <div className={`relative ${containerClassName}`}>
      {/* Scrollable container with internal scrolling */}
      <div 
        ref={containerRef}
        className="overflow-y-auto overflow-x-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 custom-scrollbar"
        style={{ 
          height: frameHeight,
          scrollBehavior: 'auto', // Changed from 'smooth' for better control
          scrollbarWidth: 'thin',
          scrollbarColor: '#DC2626 #f1f1f1'
        }}
      >
        {/* Content that creates scroll distance */}
        <div style={{ height: scrollHeight }}>
          {/* Sticky image container */}
          <div 
            className="sticky top-0 flex items-center justify-center bg-white rounded-2xl shadow-soft overflow-hidden"
            style={{ height: frameHeight }}
          >
            <motion.div
              className={`relative w-full h-full ${className}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                filter: isScrolling ? 'brightness(1.1)' : 'brightness(1)'
              }}
              transition={{ 
                duration: 0.3,
                filter: { duration: 0.1 }
              }}
            >
              {/* Current frame image with enhanced transitions */}
              <motion.img
                key={currentFrame} // Force re-render for smoother transitions
                src={images[currentFrame]?.src}
                alt={images[currentFrame]?.alt || `Frame ${currentFrame + 1}`}
                className="w-full h-full object-cover"
                style={{ 
                  imageRendering: 'crisp-edges',
                  willChange: 'transform, opacity'
                }}
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1 }}
              />
              
              {/* Enhanced overlay with better contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              
              {/* Frame indicator with animation */}
              <motion.div 
                className="absolute bottom-4 left-4 bg-black/80 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm"
                animate={{ 
                  scale: isScrolling ? 1.05 : 1,
                  opacity: isScrolling ? 1 : 0.8
                }}
                transition={{ duration: 0.1 }}
              >
                <span className="font-mono">{String(currentFrame + 1).padStart(2, '0')}</span>
                <span className="mx-2 opacity-60">/</span>
                <span className="font-mono opacity-80">{String(images.length).padStart(2, '0')}</span>
              </motion.div>

              {/* Enhanced progress bar */}
              <div className="absolute bottom-4 right-4 w-32 h-2 bg-black/30 rounded-full overflow-hidden backdrop-blur-sm">
                <motion.div
                  className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-sm"
                  animate={{
                    width: `${((currentFrame + 1) / images.length) * 100}%`,
                    boxShadow: isScrolling ? '0 0 8px rgba(239, 68, 68, 0.6)' : '0 0 4px rgba(239, 68, 68, 0.3)'
                  }}
                  transition={{ 
                    width: { duration: 0.1 },
                    boxShadow: { duration: 0.1 }
                  }}
                />
              </div>

              {/* Scroll indication for better UX */}
              <motion.div 
                className="absolute top-4 right-4 text-white/80 text-xs bg-black/50 px-2 py-1 rounded-full backdrop-blur-sm"
                animate={{ 
                  opacity: currentFrame === 0 ? 1 : 0 
                }}
                transition={{ duration: 0.3 }}
              >
                ↓ Scroll to explore
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll hint at the bottom */}
          <div className="flex flex-col items-center justify-center h-24 text-gray-500">
            <motion.div 
              className="animate-bounce mb-2"
              animate={{ 
                opacity: currentFrame >= images.length - 1 ? 0.3 : 0.7 
              }}
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                />
              </svg>
            </motion.div>
            <p className="text-xs text-center">
              {currentFrame >= images.length - 1 ? 'End of sequence' : 'Keep scrolling'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Default export for easier importing
export default ScrollDrivenImageSequence;
