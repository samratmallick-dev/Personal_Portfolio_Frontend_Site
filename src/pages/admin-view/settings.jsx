import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { User, Mail, Lock, CheckCircle2, ArrowLeft } from 'lucide-react';
import CommonForm from '@/components/common/form';
import {
      adminUpdateEmailFormIndex,
      adminEmailOTPFormIndex,
      adminUpdatePasswordFormIndex,
      adminPasswordOTPFormIndex
} from '@/config/allFormIndex';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { generateOTP, verifyOTPAndUpdateEmail, verifyOTPAndUpdatePassword } from '@/store/auth.slice';

const AdminSettings = () => {
      const { user } = useSelector((state) => state.auth);
      const navigate = useNavigate();
      const dispatch = useDispatch();

      const [emailStep, setEmailStep] = useState('idle');
      const [emailFormData, setEmailFormData] = useState({ newEmail: '' });
      const [emailOTPData, setEmailOTPData] = useState({ otp: '' });
      const [emailErrors, setEmailErrors] = useState({});
      const [emailLoading, setEmailLoading] = useState(false);

      const [passwordStep, setPasswordStep] = useState('idle');
      const [passwordFormData, setPasswordFormData] = useState({ newPassword: '', confirmPassword: '' });
      const [passwordOTPData, setPasswordOTPData] = useState({ otp: '' });
      const [passwordErrors, setPasswordErrors] = useState({});
      const [passwordLoading, setPasswordLoading] = useState(false);

      const handleEmailChange = (name, value) => {
            setEmailFormData({ ...emailFormData, [name]: value });
            if (emailErrors[name]) {
                  setEmailErrors({ ...emailErrors, [name]: '' });
            }
      };

      const handleEmailOTPChange = (name, value) => {
            setEmailOTPData({ ...emailOTPData, [name]: value });
            if (emailErrors[name]) {
                  setEmailErrors({ ...emailErrors, [name]: '' });
            }
      };

      const handleSendEmailOTP = async (e) => {
            e.preventDefault();
            setEmailLoading(true);

            try {
                  const result = await dispatch(generateOTP({
                        purpose: 'email_update',
                        newEmail: emailFormData.newEmail
                  })).unwrap();

                  setEmailStep('otp-sent');
            } catch (error) {
                  setEmailErrors({ newEmail: error?.message || 'Failed to send OTP' });
            } finally {
                  setEmailLoading(false);
            }
      };

      const handleVerifyEmailOTP = async (e) => {
            e.preventDefault();
            setEmailLoading(true);

            try {
                  const result = await dispatch(verifyOTPAndUpdateEmail({
                        otp: emailOTPData.otp,
                        newEmail: emailFormData.newEmail
                  })).unwrap();

                  setEmailStep('success');

                  setTimeout(() => {
                        navigate('/auth/login');
                  }, 2000);
            } catch (error) {
                  setEmailErrors({ otp: error?.message || 'Invalid or expired OTP' });
            } finally {
                  setEmailLoading(false);
            }
      };

      const resetEmailFlow = () => {
            setEmailStep('idle');
            setEmailFormData({ newEmail: '' });
            setEmailOTPData({ otp: '' });
            setEmailErrors({});
      };

      const handlePasswordChange = (name, value) => {
            setPasswordFormData({ ...passwordFormData, [name]: value });
            if (passwordErrors[name]) {
                  setPasswordErrors({ ...passwordErrors, [name]: '' });
            }
      };

      const handlePasswordOTPChange = (name, value) => {
            setPasswordOTPData({ ...passwordOTPData, [name]: value });
            if (passwordErrors[name]) {
                  setPasswordErrors({ ...passwordErrors, [name]: '' });
            }
      };

      const handleSendPasswordOTP = async (e) => {
            e.preventDefault();

            if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
                  setPasswordErrors({ confirmPassword: 'Passwords do not match' });
                  return;
            }

            if (passwordFormData.newPassword.length < 6) {
                  setPasswordErrors({ newPassword: 'Password must be at least 6 characters long' });
                  return;
            }

            setPasswordLoading(true);

            try {
                  const result = await dispatch(generateOTP({
                        purpose: 'password_update'
                  })).unwrap();

                  setPasswordStep('otp-sent');
            } catch (error) {
                  setPasswordErrors({ newPassword: error?.message || 'Failed to send OTP' });
            } finally {
                  setPasswordLoading(false);
            }
      };

      const handleVerifyPasswordOTP = async (e) => {
            e.preventDefault();
            setPasswordLoading(true);

            try {
                  const result = await dispatch(verifyOTPAndUpdatePassword({
                        otp: passwordOTPData.otp,
                        newPassword: passwordFormData.newPassword
                  })).unwrap();

                  setPasswordStep('success');

                  setTimeout(() => {
                        navigate('/auth/login');
                  }, 2000);
            } catch (error) {
                  setPasswordErrors({ otp: error?.message || 'Invalid or expired OTP' });
            } finally {
                  setPasswordLoading(false);
            }
      };

      const resetPasswordFlow = () => {
            setPasswordStep('idle');
            setPasswordFormData({ newPassword: '', confirmPassword: '' });
            setPasswordOTPData({ otp: '' });
            setPasswordErrors({});
      };

      return (
            <div className="space-y-6 max-w-4xl">
                  <div>
                        <h1 className="text-3xl font-bold">Settings</h1>
                        <p className="text-muted-foreground mt-2">Manage your account settings and security</p>
                  </div>

                  <Card>
                        <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Account Information
                              </CardTitle>
                              <CardDescription>Your current account details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-2 flex-wrap">
                                          <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                                          <div className="p-3 bg-sidebar-accent rounded-lg font-medium text-wrap">{user?.name || 'N/A'}</div>
                                    </div>
                                    <div className="flex flex-col gap-2 flex-wrap">
                                          <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                                          <div className="p-3 bg-sidebar-accent rounded-lg font-medium text-wrap">{user?.email || 'N/A'}</div>
                                    </div>
                              </div>
                        </CardContent>
                  </Card>

                  <Card>
                        <CardHeader>
                              <CardTitle>Security Settings</CardTitle>
                              <CardDescription>Update your email or password with OTP verification</CardDescription>
                        </CardHeader>
                        <CardContent>
                              <Tabs defaultValue="email" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 mb-6 bg-sidebar-accent">
                                          <TabsTrigger value="email" className="flex items-center gap-2">
                                                <Mail className="w-4 h-4" />
                                                Email
                                          </TabsTrigger>
                                          <TabsTrigger value="password" className="flex items-center gap-2">
                                                <Lock className="w-4 h-4" />
                                                Password
                                          </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="email" className="space-y-4 mt-0">
                                          <div className="space-y-2">
                                                <h3 className="text-lg font-semibold">Update Email Address</h3>
                                                <p className="text-sm text-muted-foreground">
                                                      {emailStep === 'idle' && 'Change your email address with OTP verification'}
                                                      {emailStep === 'otp-sent' && 'Enter the verification code sent to your new email'}
                                                      {emailStep === 'success' && 'Email updated successfully!'}
                                                </p>
                                          </div>

                                          {emailStep === 'idle' && (
                                                <div className="pt-4">
                                                      <CommonForm
                                                            formControls={adminUpdateEmailFormIndex}
                                                            values={emailFormData}
                                                            onChange={handleEmailChange}
                                                            onSubmit={handleSendEmailOTP}
                                                            errors={emailErrors}
                                                            isLoading={emailLoading}
                                                            buttonText="Send Verification Code"
                                                      />
                                                </div>
                                          )}

                                          {emailStep === 'otp-sent' && (
                                                <div className="space-y-4 pt-4">
                                                      <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={resetEmailFlow}
                                                            className="mb-2"
                                                      >
                                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                                            Back to Email Form
                                                      </Button>
                                                      <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                                                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                                                  A verification code has been sent to <strong>{emailFormData.newEmail}</strong>
                                                            </p>
                                                      </div>
                                                      <CommonForm
                                                            formControls={adminEmailOTPFormIndex}
                                                            values={emailOTPData}
                                                            onChange={handleEmailOTPChange}
                                                            onSubmit={handleVerifyEmailOTP}
                                                            errors={emailErrors}
                                                            isLoading={emailLoading}
                                                            buttonText="Verify & Update Email"
                                                      />
                                                </div>
                                          )}

                                          {emailStep === 'success' && (
                                                <div className="text-center py-12">
                                                      <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                                      <h3 className="text-xl font-semibold mb-2">Email Updated Successfully!</h3>
                                                      <p className="text-muted-foreground">
                                                            Your email has been updated. Redirecting to login...
                                                      </p>
                                                </div>
                                          )}
                                    </TabsContent>

                                    <TabsContent value="password" className="space-y-4 mt-0">
                                          <div className="space-y-2">
                                                <h3 className="text-lg font-semibold">Update Password</h3>
                                                <p className="text-sm text-muted-foreground">
                                                      {passwordStep === 'idle' && 'Change your password with OTP verification'}
                                                      {passwordStep === 'otp-sent' && 'Enter the verification code sent to your email'}
                                                      {passwordStep === 'success' && 'Password updated successfully!'}
                                                </p>
                                          </div>

                                          {passwordStep === 'idle' && (
                                                <div className="pt-4">
                                                      <CommonForm
                                                            formControls={adminUpdatePasswordFormIndex}
                                                            values={passwordFormData}
                                                            onChange={handlePasswordChange}
                                                            onSubmit={handleSendPasswordOTP}
                                                            errors={passwordErrors}
                                                            isLoading={passwordLoading}
                                                            buttonText="Send Verification Code"
                                                      />
                                                </div>
                                          )}

                                          {passwordStep === 'otp-sent' && (
                                                <div className="space-y-4 pt-4">
                                                      <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={resetPasswordFlow}
                                                            className="mb-2"
                                                      >
                                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                                            Back to Password Form
                                                      </Button>
                                                      <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                                                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                                                  A verification code has been sent to <strong>{user?.email}</strong>
                                                            </p>
                                                      </div>
                                                      <CommonForm
                                                            formControls={adminPasswordOTPFormIndex}
                                                            values={passwordOTPData}
                                                            onChange={handlePasswordOTPChange}
                                                            onSubmit={handleVerifyPasswordOTP}
                                                            errors={passwordErrors}
                                                            isLoading={passwordLoading}
                                                            buttonText="Verify & Update Password"
                                                      />
                                                </div>
                                          )}

                                          {passwordStep === 'success' && (
                                                <div className="text-center py-12">
                                                      <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                                      <h3 className="text-xl font-semibold mb-2">Password Updated Successfully!</h3>
                                                      <p className="text-muted-foreground">
                                                            Your password has been updated. Redirecting to login...
                                                      </p>
                                                </div>
                                          )}
                                    </TabsContent>
                              </Tabs>
                        </CardContent>
                  </Card>
            </div>
      );
};

export default AdminSettings;
