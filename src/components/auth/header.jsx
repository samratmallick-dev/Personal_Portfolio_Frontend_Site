import React from 'react';
import { ThemeToggle } from '../common/theme-toggle';
const AuthHeader = () => (
      <header className="backdrop-blur-sm" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className='container mx-auto flex items-center justify-between h-20 px-4 md:px-6'>
                  <div className='flex items-center flex-col justify-center'>
                        <div className='flex items-end px-4 select-none'>
                              <span className='text-5xl font-bold text-green-600'>S</span>
                              <span className='font-bold text-3xl'>amrat.</span>
                        </div>
                        <span className='text-xs'>Auth Panel</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                        <ThemeToggle />
                  </div>
            </div>
      </header>
);

export default AuthHeader;
