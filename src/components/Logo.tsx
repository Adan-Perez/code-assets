import React from 'react';
import Image from 'next/image';

const Logo = ({ width = 48, height = 48, backgroundColor = 'slate-900' }) => (
  <div className={`bg-${backgroundColor} rounded-full p-0.5`}>
    <Image src='./favicon_vector.svg' alt='favicon' width={width} height={height} />
  </div>
);

export default Logo;
