import { motion } from 'framer-motion';
import { Heart, Loader } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  variant?: 'default' | 'minimal' | 'branded';
}

export function LoadingSpinner({ 
  size = 'md', 
  text = 'Loading...', 
  variant = 'default' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  if (variant === 'minimal') {
    return (
      <div className="flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className={`${sizeClasses[size]} text-red-600`}
        >
          <Loader className="w-full h-full" />
        </motion.div>
      </div>
    );
  }

  if (variant === 'branded') {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-8">
        <div className="relative">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute inset-0 bg-red-600 rounded-full opacity-20"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className={`relative ${sizeClasses[size]} text-red-600`}
          >
            <Heart className="w-full h-full" />
          </motion.div>
        </div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`${textSizeClasses[size]} font-medium text-gray-700`}
        >
          {text}
        </motion.p>
      </div>
    );
  }

  // Default variant
  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className={`${sizeClasses[size]} border-2 border-red-600 border-t-transparent rounded-full`}
        />
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute inset-2 bg-red-100 rounded-full flex items-center justify-center"
        >
          <Heart className="h-3 w-3 text-red-600" />
        </motion.div>
      </div>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`${textSizeClasses[size]} font-medium text-gray-600`}
      >
        {text}
      </motion.p>
    </div>
  );
}

// Full screen loading overlay
export function FullScreenLoader({ text = 'Loading Lifeline...' }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm flex items-center justify-center z-50">
      <LoadingSpinner size="lg" text={text} variant="branded" />
    </div>
  );
}

// Page transition loader
export function PageLoader({ text = 'Loading page...' }: { text?: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-soft p-8">
        <LoadingSpinner size="lg" text={text} variant="branded" />
      </div>
    </div>
  );
}

// Default export for lazy loading
export default LoadingSpinner;
