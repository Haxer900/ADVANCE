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

  const textColor = variant === 'white' ? 'text-white' : 'text-zenthra-black';

  return (
    <div className={`flex items-center group cursor-pointer transition-all duration-500 hover:scale-105 ${className}`}>
      {/* Premium Golden Z Logo Icon */}
      <div className={`${sizeClasses[size]} flex items-center justify-center mr-3 relative`}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${sizeClasses[size]} w-auto transition-all duration-300 group-hover:drop-shadow-lg`}
        >
          {/* Elegant golden frame */}
          <rect
            x="2"
            y="2"
            width="36"
            height="36"
            rx="6"
            stroke="url(#goldGradient)"
            className="stroke-2 fill-none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Elegant Z with golden gradient */}
          <path
            d="M12 14 L28 14 L12 26 L28 26"
            stroke="url(#goldGradient)"
            className="stroke-3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="#FFA500" />
              <stop offset="100%" stopColor="#FF8C00" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
      </div>
      
      {/* Elegant Brand Text */}
      <div className="flex flex-col">
        <span 
          className="font-bold text-xl tracking-wide bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent group-hover:tracking-wider transition-all duration-300"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          ZENTHRA
        </span>
        <span 
          className={`text-xs tracking-widest ${textColor} opacity-80 group-hover:opacity-100 transition-all duration-300`}
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          WOMEN'S FASHION
        </span>
      </div>
    </div>
  );
}