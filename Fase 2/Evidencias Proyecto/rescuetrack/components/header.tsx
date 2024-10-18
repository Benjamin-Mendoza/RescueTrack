'use client';

import * as React from 'react';

import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';

import useScroll from '@/hooks/use-scroll';
import { cn } from '@/lib/utils';

export default function Header() {
  const scrolled = useScroll(5);
  const selectedLayout = useSelectedLayoutSegment();

  return (
    <div
      className={cn(
        `sticky inset-x-0 top-0 z-30 w-full transition-all border-b border-gray-200`,
        {
          'border-b border-gray-200 bg-white/75 backdrop-blur-lg': scrolled,
          'border-b border-gray-200 bg-white': selectedLayout,
        }
      )}
    >
      
      <div className="flex h-[47px] items-center justify-between px-4" style={{ backgroundColor: '#003153' }}>
        
        <div className="hidden md:block"></div>

        
        <div className="md:hidden flex items-center justify-center w-full">
          <span className="text-2xl font-bold text-red-500">Rescue</span>
          <span className="text-2xl font-bold text-white">Track</span> 
        </div>
      </div>
    </div>
  );
}



