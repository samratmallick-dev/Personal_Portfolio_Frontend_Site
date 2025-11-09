import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import MyPortfolio from './pages/client-view/portfolio';
import MyPortfoliopageLayout from './components/user-view/layout';
import MyAllProjectList from './pages/client-view/project-listing';
import MyContact from './pages/client-view/contact';
import { useDisableContextMenuAndCopy } from './components/common/useDisableContextMenuAndCopy';
import Login from './pages/auth/login';
import AuthLayout from './components/auth/layout';
import AdminViewDashboard from './pages/admin-view/dashboard';
import AdminLayout from './components/admin-view/layout';
import AdminViewHero from './pages/admin-view/hero';
import AdminViewAbout from './pages/admin-view/about';
import AdminViewEducation from './pages/admin-view/education';
import AdminViewProject from './pages/admin-view/project';
import AdminViewSkills from './pages/admin-view/skills';
import AdminViewServices from './pages/admin-view/services';
import AdminSettings from './pages/admin-view/settings';
import AdminViewContactDetails from './pages/admin-view/contactdetails';
import AdminMessages from './pages/admin-view/messages';
import CheckAuth from './components/common/CheckAuth';

const App = () => {

      // useDisableContextMenuAndCopy();

      return (
            <div className="flex flex-col overflow-hidden bg-background min-h-screen">
                  <Routes>
                        <Route path="/admin" element={<CheckAuth><AdminLayout /></CheckAuth>}>
                              <Route index element={<Navigate to="dashboard" replace />} />
                              <Route path="dashboard" element={<AdminViewDashboard />} />
                              <Route path="hero-content" element={<AdminViewHero />} />
                              <Route path="about-content" element={<AdminViewAbout />} />
                              <Route path="education-list" element={<AdminViewEducation />} />
                              <Route path="projects-list" element={<AdminViewProject />} />
                              <Route path="skills-list" element={<AdminViewSkills />} />
                              <Route path="services-list" element={<AdminViewServices />} />
                              <Route path="contact-details" element={<AdminViewContactDetails />} />
                              <Route path="messages" element={<AdminMessages />} />
                              <Route path="settings" element={<AdminSettings />} />
                              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                        </Route>

                        <Route path="/auth" element={<AuthLayout />}>
                              <Route index element={<Navigate to="login" replace />} />
                              <Route path="login" element={<Login />} />
                              <Route path="*" element={<Navigate to="login" replace />} />
                        </Route>

                        <Route path="/" element={<Navigate to="/portfolio/home" replace />} />
                        <Route path="/portfolio" element={<Navigate to="/portfolio/home" replace />} />
                        <Route path="/portfolio" element={<MyPortfoliopageLayout />}>
                              <Route index element={<Navigate to="home" replace />} />
                              <Route path="home" element={<MyPortfolio />} />
                              <Route path="projects" element={<MyAllProjectList />} />
                              <Route path="contact" element={<MyContact />} />
                              <Route path="*" element={<Navigate to="/portfolio/home" replace />} />
                        </Route>
                        <Route path="*" element={<Navigate to="/portfolio/home" replace />} />
                  </Routes>
            </div>
      );
};

export default App;
