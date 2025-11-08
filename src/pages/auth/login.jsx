import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import CommonForm from '@/components/common/form';
import { authLoginFormIndex } from '@/config/allFormIndex';
import { Lock, Mail, Sparkles, ArrowRight } from 'lucide-react';
import { loginUser } from '@/store/auth.slice';
import { toast } from 'sonner';

const Login = () => {
      const navigate = useNavigate();
      const dispatch = useDispatch();
      const [formData, setFormData] = useState({ email: '', password: '' });
      const { isLoading, isAuthenticated, error } = useSelector((state) => state.auth);

      useEffect(() => {
            if (isAuthenticated) {
                  navigate('/admin/dashboard');
            }
      }, [isAuthenticated, navigate]);

      useEffect(() => {
            if (error) {
                  toast.error('Login Failed', {
                        description: error || 'Invalid email or password. Please check your credentials.',
                        duration: 5000,
                  });
            }
      }, [error]);

      const handleChange = (name, value) => {
            setFormData((prev) => ({ ...prev, [name]: value }));
      };

      const onSubmit = async (e) => {
            e.preventDefault();
            if (!formData.email || !formData.password) {
                  toast.error('Validation Error', {
                        description: 'Please fill in all fields',
                  });
                  return;
            }
            dispatch(loginUser(formData));
      };

      return (
            <div className="w-full h-full flex items-center justify-center">
                  <div className="w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-0 md:gap-8 lg:gap-12">
                        <div className="hidden md:flex flex-col justify-center space-y-8 p-8 lg:p-12">
                              <div className="space-y-2">
                                    <div className='flex flex-col justify-start'>
                                          <div className='flex items-end select-none'>
                                                <span className='text-5xl font-bold text-green-600'>S</span>
                                                <span className='font-bold text-3xl'>amrat.</span>
                                          </div>
                                          <span className='text-xs text-muted-foreground'>Auth Panel</span>
                                    </div>
                              </div>

                              <div className="space-y-4">
                                    <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                                          Welcome back to your
                                          <span className="block text-primary mt-2">Creative Space</span>
                                    </h2>
                                    <p className="text-muted-foreground text-lg">
                                          Manage your portfolio, showcase your projects, and connect with your audience.
                                    </p>
                              </div>
                              <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm">
                                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <Lock className="w-4 h-4 text-primary" />
                                          </div>
                                          <span className="text-muted-foreground">Secure authentication</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <Mail className="w-4 h-4 text-primary" />
                                          </div>
                                          <span className="text-muted-foreground">Email notifications</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <Sparkles className="w-4 h-4 text-primary" />
                                          </div>
                                          <span className="text-muted-foreground">Modern dashboard</span>
                                    </div>
                              </div>
                        </div>

                        <div className="w-full flex items-center justify-center">
                              <Card className="w-full max-w-md border md:border rounded-2xl shadow-lg md:shadow-2xl bg-background/95 backdrop-blur-xl">
                                    <CardHeader className="space-y-3 px-8 py-4">
                                          <div className="space-y-2 text-center md:text-left">
                                                <CardTitle className="text-3xl md:text-2xl font-bold">
                                                      Sign in to your account
                                                </CardTitle>
                                                <CardDescription className="text-base md:text-sm">
                                                      Enter your credentials to access the admin panel
                                                </CardDescription>
                                          </div>
                                    </CardHeader>

                                    <CardContent className="p-6 md:p-8 pt-0 space-y-6">
                                          <CommonForm
                                                formControls={authLoginFormIndex}
                                                onSubmit={onSubmit}
                                                buttonText={
                                                      isLoading ? (
                                                            <span className="flex items-center justify-center gap-2">
                                                                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                                  Signing in...
                                                            </span>
                                                      ) : (
                                                            <span className="flex items-center justify-center gap-2">
                                                                  Sign in
                                                                  <ArrowRight className="w-4 h-4" />
                                                            </span>
                                                      )
                                                }
                                                values={formData}
                                                onChange={handleChange}
                                                isLoading={isLoading}
                                          />
                                    </CardContent>
                              </Card>
                        </div>
                  </div>
            </div>
      );
};

export default Login;