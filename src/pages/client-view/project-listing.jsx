import ProjectCard from '@/components/user-view/project-card';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProjects } from '@/store/project.slice';
import ProjectsSkeleton from '@/components/loaders/ProjectsSkeleton';

const MyAllProjectList = () => {
      const dispatch = useDispatch();
      const { projectsData, isLoading } = useSelector((state) => state.project);

      useEffect(() => {
            dispatch(getAllProjects());
      }, [dispatch]);

      return (
            <div className="relative mt-20">
                  <div className="container mx-auto p-4">
                        <h2 className="text-4xl font-bold text-center mb-12 text-gradient">My All Projects</h2>
                        <div className="p-4 backdrop-blur-sm rounded-lg">
                              <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto'>
                                    {isLoading ? (
                                          <ProjectsSkeleton />
                                    ) : projectsData && projectsData.length > 0 ? (
                                          projectsData.map((project, index) => (
                                                <div
                                                      key={project._id || index}
                                                      className="animate-slide-up"
                                                      style={{ animationDelay: `${index * 0.2}s` }}
                                                >
                                                      <ProjectCard {...project} />
                                                </div>
                                          ))
                                    ) : (
                                          <div className="col-span-full text-center text-muted-foreground">No projects found.</div>
                                    )}
                              </div>
                        </div>
                  </div>
            </div>
      );
}

export default MyAllProjectList;
