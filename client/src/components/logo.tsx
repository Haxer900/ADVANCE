interface LogoProps {
  className?: string;
  variant?: 'default' | 'white' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = '', variant = 'default', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12'
  };

  const colorClasses = {
    default: 'text-zenthra-black',
    white: 'text-white',
    dark: 'text-zenthra-black'
  };

  const textColor = variant === 'white' ? 'text-white' : 'text-zenthra-black';
  const accentColor = variant === 'white' ? 'text-white' : 'text-zenthra-gold';

  return (
    <div className={`flex items-center ${className}`}>
      {/* Modern Logo Icon */}
      <div className={`${sizeClasses[size]} flex items-center justify-center mr-3`}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${sizeClasses[size]} w-auto`}
        >
          {/* Elegant Z lettermark with premium styling */}
          <rect
            x="2"
            y="2"
            width="36"
            height="36"
            rx="4"
            className={`stroke-2 fill-none ${textColor}`}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Z design */}
          <path
            d="M12 14 L28 14 L12 26 L28 26"
            className={`stroke-3 ${accentColor}`}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>
      
      {/* Brand Text */}
      <div className="flex flex-col">
        <span className={`font-bold text-xl tracking-wide ${textColor}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
          MORE THAN FASHION
        </span>
        <span className={`text-xs tracking-widest ${accentColor}`} style={{ fontFamily: 'Inter, sans-serif' }}>
          PREMIUM
        </span>
      </div>
    </div>
  );
}