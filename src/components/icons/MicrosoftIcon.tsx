
import React from 'react';

const MicrosoftIcon = ({ className, size = 24, ...props }: React.SVGProps<SVGSVGElement> & { size?: number }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      {...props}
    >
      <rect x="4" y="4" width="7" height="7" fill="currentColor" />
      <rect x="13" y="4" width="7" height="7" fill="currentColor" />
      <rect x="4" y="13" width="7" height="7" fill="currentColor" />
      <rect x="13" y="13" width="7" height="7" fill="currentColor" />
    </svg>
  );
};

export default MicrosoftIcon;
