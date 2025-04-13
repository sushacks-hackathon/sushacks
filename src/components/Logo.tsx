
import React from 'react';

const Logo: React.FC<{ size?: 'small' | 'medium' | 'large' }> = ({ size = 'medium' }) => {
  let sizeClass;
  
  switch (size) {
    case 'small':
      sizeClass = 'text-xl md:text-2xl';
      break;
    case 'large':
      sizeClass = 'text-4xl md:text-5xl';
      break;
    default:
      sizeClass = 'text-2xl md:text-3xl';
  }
  
  return (
    <div className="flex items-center justify-center">
      <div className={`font-bold ${sizeClass} text-ipblue-600`}>IP<span className="text-ipblue-800">Drive</span></div>
    </div>
  );
};

export default Logo;
