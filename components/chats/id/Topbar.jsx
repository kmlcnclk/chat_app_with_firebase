import React from 'react';
import { useSelector } from 'react-redux';
import NextImage from 'next/image';

function Topbar() {
  const otherUser = useSelector((state) => state.otherUser.value);

  return (
    <div className="w-full h-[80px] px-5 py-4 flex items-center space-x-5 shadow-lg">
      <NextImage
        src={otherUser.photoURL}
        width="48px"
        height="48px"
        objectFit="contain"
        className="rounded-full"
        alt={otherUser.displayName}
        priority={true}
      />
      <h3 className="font-semibold">{otherUser.displayName}</h3>
    </div>
  );
}

export default Topbar;
