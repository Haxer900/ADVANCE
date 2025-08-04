export default function ZenthraLogo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 200 50" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(24, 100%, 50%)" />
          <stop offset="50%" stopColor="hsl(280, 100%, 70%)" />
          <stop offset="100%" stopColor="hsl(24, 100%, 50%)" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Z */}
      <path 
        d="M15 10 L35 10 L35 15 L25 32 L35 32 L35 37 L15 37 L15 32 L25 15 L15 15 Z" 
        fill="url(#logoGradient)"
        filter="url(#glow)"
      />
      
      {/* E */}
      <path 
        d="M45 10 L65 10 L65 15 L50 15 L50 21 L62 21 L62 26 L50 26 L50 32 L65 32 L65 37 L45 37 Z" 
        fill="url(#logoGradient)"
        filter="url(#glow)"
      />
      
      {/* N */}
      <path 
        d="M75 10 L80 10 L80 25 L88 10 L93 10 L93 37 L88 37 L88 22 L80 37 L75 37 Z" 
        fill="url(#logoGradient)"
        filter="url(#glow)"
      />
      
      {/* T */}
      <path 
        d="M103 10 L123 10 L123 15 L116 15 L116 37 L111 37 L111 15 L103 15 Z" 
        fill="url(#logoGradient)"
        filter="url(#glow)"
      />
      
      {/* H */}
      <path 
        d="M133 10 L138 10 L138 21 L146 21 L146 10 L151 10 L151 37 L146 37 L146 26 L138 26 L138 37 L133 37 Z" 
        fill="url(#logoGradient)"
        filter="url(#glow)"
      />
      
      {/* R */}
      <path 
        d="M161 10 L175 10 Q180 10 180 15 Q180 21 175 21 L170 21 L176 37 L171 37 L166 21 L166 37 L161 37 Z M166 15 L166 16 L175 16 Q175 15 175 15 Z" 
        fill="url(#logoGradient)"
        filter="url(#glow)"
      />
      
      {/* A */}
      <path 
        d="M185 37 L180 23 L175 37 L170 37 L178 10 L182 10 L190 37 Z M176 19 L184 19 L180 15 Z" 
        fill="url(#logoGradient)"
        filter="url(#glow)"
      />
    </svg>
  );
}