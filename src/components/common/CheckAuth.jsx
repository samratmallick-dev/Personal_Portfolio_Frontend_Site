import React, { useEffect, useState, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from '@/store/auth.slice';

const CheckAuth = ({ children }) => {
      const dispatch = useDispatch();
      const location = useLocation();
      const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
      const [authChecked, setAuthChecked] = useState(false);
      const hasCheckedAuth = useRef(false);

      useEffect(() => {
            if (isAuthenticated) {
                  setAuthChecked(true);
                  hasCheckedAuth.current = true;
                  return;
            }

            if (hasCheckedAuth.current) {
                  return;
            }

            const verifyAuth = async () => {
                  hasCheckedAuth.current = true;
                  await dispatch(checkAuth());
                  setAuthChecked(true);
            };
            verifyAuth();
      }, [dispatch, isAuthenticated]);

      if (!authChecked || isLoading) {
            return (
                  <div className="flex items-center justify-center min-h-screen">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
            );
      }

      if (authChecked && !isAuthenticated) {
            return <Navigate to="/auth/login" state={{ from: location }} replace />;
      }

      return <>{children}</>;
};

export default CheckAuth;
