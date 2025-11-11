import React from 'react';

// FIX: Removed invalid LOGO_DATA_URL and created a functional SVG component for the logo.
// This is now the default export, resolving the "no default export" error.
const Logo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      xmlns="http://www.w3.org/2000/svg"
      {...props}
  >
      <path d="M5.93,7.59,12,2,18.07,7.59,12,13.17Z" fill="#8B5CF6" />
      <path d="M12,15.22,16.65,11,18.07,12.41,12,18.48,5.93,12.41,7.35,11Z" fill="#A78BFA" />
      <path d="M12,20.52,16.65,16,18.07,17.41,12,23.48,5.93,17.41,7.35,16Z" fill="#C4B5FD" />
  </svg>
);

export default Logo;
