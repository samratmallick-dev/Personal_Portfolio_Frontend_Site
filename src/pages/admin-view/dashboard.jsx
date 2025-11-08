import { Fragment, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import * as Icons from 'lucide-react';

import { fetchHeroData } from '@/store/hero.slice';
import { fetchAboutData } from '@/store/about.slice';
import { getAllEducation } from '@/store/education.slice';
import { getAllSkillCategories } from '@/store/skills.slice';
import { getAllProjects, getFeaturedProjects } from '@/store/project.slice';
import { getAllServices } from '@/store/services.slice';
import { getAllMessages, getContactDetails } from '@/store/contact.slice';

const AdminViewDashboard = () => {
      const dispatch = useDispatch();

      const { projectsData, featuredProjects, isLoading: projectLoading } = useSelector((s) => s.project);
      const { servicesData, isLoading: servicesLoading } = useSelector((s) => s.services);
      const { skillsData, isLoading: skillsLoading } = useSelector((s) => s.skills);
      const { educationData, isLoading: educationLoading } = useSelector((s) => s.education);
      const { heroData, isLoading: heroLoading } = useSelector((s) => s.hero);
      const { aboutData, isLoading: aboutLoading } = useSelector((s) => s.about);
      const { messages, contact: contactDetails, isLoading: contactLoading } = useSelector((s) => s.contact);

      useEffect(() => {
            dispatch(fetchHeroData());
            dispatch(fetchAboutData());
            dispatch(getAllEducation());
            dispatch(getAllSkillCategories());
            dispatch(getAllProjects());
            dispatch(getFeaturedProjects());
            dispatch(getAllServices());
            dispatch(getAllMessages());
            dispatch(getContactDetails());
      }, [dispatch]);

      const totals = useMemo(() => {
            const totalProjects = Array.isArray(projectsData) ? projectsData.length : 0;
            const totalServices = Array.isArray(servicesData) ? servicesData.length : 0;
            const totalCategories = Array.isArray(skillsData) ? skillsData.length : 0;
            const totalSkills = Array.isArray(skillsData)
                  ? skillsData.reduce((acc, cat) => acc + (Array.isArray(cat?.skills) ? cat.skills.length : 0), 0)
                  : 0;
            const totalEducation = Array.isArray(educationData) ? educationData.length : 0;
            const totalMessages = Array.isArray(messages) ? messages.length : 0;
            const heroConfigured = !!(heroData && (Array.isArray(heroData) ? heroData.length > 0 : true));
            const aboutConfigured = !!(aboutData && (Array.isArray(aboutData) ? aboutData.length > 0 : true));
            const totalFeatured = Array.isArray(featuredProjects) ? featuredProjects.length : 0;
            return { totalProjects, totalServices, totalCategories, totalSkills, totalEducation, totalMessages, heroConfigured, aboutConfigured, totalFeatured };
      }, [projectsData, servicesData, skillsData, educationData, messages, heroData, aboutData, featuredProjects]);

      const isLoadingAny = projectLoading || servicesLoading || skillsLoading || educationLoading || heroLoading || aboutLoading || contactLoading;

      const stats = [
            { title: 'Projects', value: totals.totalProjects, link: '/admin/projects-list' },
            { title: 'Services', value: totals.totalServices, link: '/admin/services-list' },
            { title: 'Skill Categories', value: totals.totalCategories, link: '/admin/skills-list' },
            { title: 'Skills', value: totals.totalSkills, link: '/admin/skills-list' },
            { title: 'Education', value: totals.totalEducation, link: '/admin/education-list' },
            { title: 'Messages', value: totals.totalMessages, link: '/admin/messages' },
      ];

      const recentMessages = useMemo(() => {
            const list = Array.isArray(messages) ? [...messages] : [];
            list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            return list.slice(0, 5);
      }, [messages]);

      return (
            <Fragment>
                  <div className="space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                              {stats.map((s) => {
                                    return (
                                          <Card key={s.title}>
                                                <CardHeader className="flex flex-row items-center justify-between">
                                                      <CardTitle className="text-base">{s.title}</CardTitle>
                                                      <CardAction>
                                                            <Button asChild variant="outline" size="sm">
                                                                  <Link to={s.link}>Manage</Link>
                                                            </Button>
                                                      </CardAction>
                                                </CardHeader>
                                                <CardContent>
                                                      {isLoadingAny ? (
                                                            <Skeleton className="h-8 w-20" />
                                                      ) : (
                                                            <div className="text-3xl font-bold">{s.value}</div>
                                                      )}
                                                </CardContent>
                                          </Card>
                                    );
                              })}
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                              <Card className="col-span-1 xl:col-span-3">
                                    <CardHeader className="flex items-center justify-between">
                                          <CardTitle>Recent Messages</CardTitle>
                                          <CardAction>
                                                <Button asChild variant="outline" size="sm">
                                                      <Link to="/admin/messages">View All</Link>
                                                </Button>
                                          </CardAction>
                                    </CardHeader>
                                    <CardContent>
                                          {contactLoading ? (
                                                <div className="space-y-3">
                                                      <Skeleton className="h-16 w-full" />
                                                      <Skeleton className="h-16 w-full" />
                                                      <Skeleton className="h-16 w-full" />
                                                </div>
                                          ) : recentMessages.length > 0 ? (
                                                <ul className="space-y-3">
                                                      {recentMessages.map((m) => (
                                                            <li key={m._id} className="p-4 rounded-md border">
                                                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                                                        <div className="font-semibold flex items-center gap-2"><Icons.UserRound className="h-4 w-4" /> {m.name}</div>
                                                                        <div className="text-xs text-muted-foreground">{new Date(m.createdAt).toLocaleString()}</div>
                                                                  </div>
                                                                  <div className="text-sm text-muted-foreground truncate mt-1">{m.message}</div>
                                                            </li>
                                                      ))}
                                                </ul>
                                          ) : (
                                                <div className="text-center p-8 text-muted-foreground">No messages yet.</div>
                                          )}
                                    </CardContent>
                              </Card>

                              <Card className="col-span-1 xl:col-span-2">
                                    <CardHeader className="flex items-center justify-between">
                                          <CardTitle>Contact Details</CardTitle>
                                          <CardAction>
                                                <Button asChild variant="outline" size="sm">
                                                      <Link to="/admin/contact-details">Edit</Link>
                                                </Button>
                                          </CardAction>
                                    </CardHeader>
                                    <CardContent>
                                          {contactLoading ? (
                                                <div className="container mx-auto px-4 text-center">
                                                      <Skeleton className="w-32 h-32 rounded-full mx-auto mb-4" />
                                                      <Skeleton className="h-5 w-40 mx-auto mb-2" />
                                                      <Skeleton className="h-4 w-48 mx-auto mb-2" />
                                                      <Skeleton className="h-4 w-56 mx-auto" />
                                                </div>
                                          ) : (Array.isArray(contactDetails) && contactDetails.length > 0) ? (
                                                (() => {
                                                      const c = contactDetails[0];
                                                      return (
                                                            <div className="container mx-auto px-4 text-center">
                                                                  {c.contactImage && (
                                                                        <img
                                                                              src={c.contactImage}
                                                                              alt="Contact"
                                                                              className="w-32 h-32 object-cover rounded-full mx-auto mb-4 border-4 border-primary/20"
                                                                        />
                                                                  )}
                                                                  <div className="space-y-2">
                                                                        {c.name && (
                                                                              <div className="font-semibold flex items-center gap-2 justify-center"><Icons.UserRound className="h-4 w-4" /> {c.name}</div>
                                                                        )}
                                                                        {c.email && (
                                                                              <div className="text-sm text-muted-foreground flex items-center gap-2 justify-center"><Icons.Mail className="h-4 w-4" /> {c.email}</div>
                                                                        )}
                                                                        {c.mobile && (
                                                                              <div className="text-sm text-muted-foreground flex items-center gap-2 justify-center"><Icons.Phone className="h-4 w-4" /> {c.mobile}</div>
                                                                        )}
                                                                        {c.address && (
                                                                              <div className="text-sm text-muted-foreground flex items-center gap-2 justify-center"><Icons.MapPin className="h-4 w-4" /> {c.address}</div>
                                                                        )}
                                                                  </div>
                                                            </div>
                                                      );
                                                })()
                                          ) : (
                                                <div className="text-center p-8 text-muted-foreground">No contact details yet.</div>
                                          )}
                                    </CardContent>
                              </Card>

                              <Card>
                                    <CardHeader className="flex items-center justify-between">
                                          <CardTitle>Featured Projects</CardTitle>
                                          <CardAction>
                                                <Button asChild variant="outline" size="sm">
                                                      <Link to="/admin/projects-list">Manage</Link>
                                                </Button>
                                          </CardAction>
                                    </CardHeader>
                                    <CardContent>
                                          {projectLoading ? (
                                                <div className="space-y-3">
                                                      <Skeleton className="h-10 w-full" />
                                                      <Skeleton className="h-10 w-full" />
                                                      <Skeleton className="h-10 w-full" />
                                                </div>
                                          ) : Array.isArray(featuredProjects) && featuredProjects.length > 0 ? (
                                                <ul className="space-y-3">
                                                      {featuredProjects.map((p) => (
                                                            <li key={p._id} className="p-3 rounded-md border flex items-center justify-between gap-3">
                                                                  <div className="flex items-center gap-2">
                                                                        <Icons.Star className="h-4 w-4 text-yellow-500" />
                                                                        <div className="font-medium">{p.title}</div>
                                                                  </div>
                                                                  <div className="text-xs text-muted-foreground">{p.status}</div>
                                                            </li>
                                                      ))}
                                                </ul>
                                          ) : (
                                                <div className="text-center p-8 text-muted-foreground">No featured projects selected.</div>
                                          )}
                                    </CardContent>
                              </Card>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <Card>
                                    <CardHeader className="flex items-center justify-between">
                                          <CardTitle>Hero Section</CardTitle>
                                          <CardAction>
                                                <Button asChild variant="outline" size="sm">
                                                      <Link to="/admin/hero-content">Edit</Link>
                                                </Button>
                                          </CardAction>
                                    </CardHeader>
                                    <CardContent>
                                          {heroLoading ? (
                                                <Skeleton className="h-6 w-24" />
                                          ) : (
                                                <div className="flex items-center gap-2 text-sm">
                                                      {totals.heroConfigured ? (
                                                            <span className="inline-flex items-center gap-2 text-green-600"><Icons.CheckCircle2 className="h-4 w-4" /> Configured</span>
                                                      ) : (
                                                            <span className="inline-flex items-center gap-2 text-muted-foreground"><Icons.AlertCircle className="h-4 w-4" /> Not Configured</span>
                                                      )}
                                                </div>
                                          )}
                                    </CardContent>
                              </Card>

                              <Card>
                                    <CardHeader className="flex items-center justify-between">
                                          <CardTitle>About Section</CardTitle>
                                          <CardAction>
                                                <Button asChild variant="outline" size="sm">
                                                      <Link to="/admin/about-content">Edit</Link>
                                                </Button>
                                          </CardAction>
                                    </CardHeader>
                                    <CardContent>
                                          {aboutLoading ? (
                                                <Skeleton className="h-6 w-24" />
                                          ) : (
                                                <div className="flex items-center gap-2 text-sm">
                                                      {totals.aboutConfigured ? (
                                                            <span className="inline-flex items-center gap-2 text-green-600"><Icons.CheckCircle2 className="h-4 w-4" /> Configured</span>
                                                      ) : (
                                                            <span className="inline-flex items-center gap-2 text-muted-foreground"><Icons.AlertCircle className="h-4 w-4" /> Not Configured</span>
                                                      )}
                                                </div>
                                          )}
                                    </CardContent>
                              </Card>
                        </div>
                  </div>
            </Fragment>
      );
};

export default AdminViewDashboard;
