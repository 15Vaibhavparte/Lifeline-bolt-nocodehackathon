import React from 'react';

interface BoltBadgeProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const BoltBadge: React.FC<BoltBadgeProps> = ({ 
  className = '', 
  size = 'medium' 
}) => {
  const sizeClasses = {
    small: 'w-12 h-12 sm:w-16 sm:h-16 md:w-18 md:h-18',
    medium: 'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24',
    large: 'w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28'
  };

  const positionClasses = 'top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4';

  return (
    <div 
      className={`
        fixed ${positionClasses} z-50 
        ${sizeClasses[size]} 
        ${className}
        bolt-badge-container bolt-badge-hover
        cursor-pointer
        drop-shadow-lg hover:drop-shadow-xl
        bolt-badge-mobile
      `}
      onClick={() => window.open('https://bolt.new', '_blank')}
      title="Powered by Bolt.new - Click to visit"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          window.open('https://bolt.new', '_blank');
        }
      }}
    >
      <div className="relative w-full h-full">
        {/* Your actual PNG image */}
        <img 
          src="/bolt-badge.png"
          alt="Powered by Bolt.new"
          className="w-full h-full object-contain"
          style={{ imageRendering: 'crisp-edges' }}
          onError={(e) => {
            // Fallback if image fails to load
            console.warn('Bolt badge image failed to load');
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
        
        {/* Focus ring for accessibility */}
        <div className="absolute inset-0 rounded-full ring-2 ring-blue-500 ring-opacity-0 focus-within:ring-opacity-100 transition-all duration-200"></div>
      </div>
    </div>
  );
};

export default BoltBadge;
