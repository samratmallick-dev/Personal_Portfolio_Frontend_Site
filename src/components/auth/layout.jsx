import React from 'react';
import { Outlet } from 'react-router-dom';
import AuthHeader from './header';

const AuthLayout = () => {
      const year = new Date().getFullYear();
      return (
            <div className="min-h-screen w-full flex flex-col bg-linear-to-br from-background via-background to-primary/5 relative overflow-hidden">
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
                  </div>

                  <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />

                  <AuthHeader />

                  <div className="relative z-10 w-full flex-1 flex items-center justify-center p-6">
                        <Outlet />
                  </div>
            </div>
      );
}

export default AuthLayout;