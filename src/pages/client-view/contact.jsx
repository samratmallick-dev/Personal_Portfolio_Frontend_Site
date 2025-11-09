import CommonForm from '@/components/common/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import ContactDetail from '@/components/user-view/contact-details';
import { contactFormIndex } from '@/config/allFormIndex';
import { Facebook, Github, Instagram, Linkedin } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import profileImage from '@/assets/profileimage.png';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getContactDetails, sendContactMessage } from '@/store/contact.slice';
import { toast } from 'sonner';

const MyContact = () => {
      const dispatch = useDispatch();
      const { contact: contactDetails, isLoading } = useSelector((state) => state.contact);
      const initialFormData = contactFormIndex.reduce((acc, control) => {
            acc[control.name] = '';
            return acc;
      }, {});

      const [formData, setFormData] = useState(initialFormData);

      useEffect(() => {
            dispatch(getContactDetails());
      }, [dispatch]);

      const handleChange = (name, value) => {
            setFormData(prev => ({
                  ...prev,
                  [name]: value
            }));
      };

      const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                  await dispatch(sendContactMessage(formData)).unwrap();
                  toast.success('Message sent successfully!');
                  setFormData(initialFormData);
            } catch (err) {
                  toast.error(err?.message || 'Failed to send message');
            }
      };

      return (
            <section id="contact" className="py-20 mt-10">
                  <div className="container mx-auto px-4">
                        <div className="w-full flex lg:flex-row flex-col items-center gap-4">
                              <h2 className="text-5xl font-bold text-center text-gradient">Get In Touch</h2>
                              <div className="w-44 h-1 bg-gradient-to-l from-primary to-secondary rounded-lg flex order-last lg:mt-10 mt-0"></div>
                        </div>
                        <div className='w-full flex flex-col md:flex-row items-center gap-4 mt-8'>
                              <div className='md:w-1/2 w-full flex flex-col items-center justify-center gap-8'>
                                    <img src={(contactDetails && contactDetails[0]?.contactImage) || profileImage} alt="Contact" className="w-40 h-40 rounded-full mx-auto border-4 border-primary/20 object-cover" />
                                    <Card className="hover-lift tech-glow">
                                          <CardHeader className="text-center text-3xl font-bold text-gradient">
                                                <CardTitle>Contact & Location</CardTitle>
                                          </CardHeader>
                                          <CardContent className="space-y-4">
                                                {(() => {
                                                      const data = contactDetails && contactDetails.length > 0 ? contactDetails[0] : null;
                                                      if (!data) {
                                                            return (
                                                                  <div className="text-center text-muted-foreground">No contact details found.</div>
                                                            );
                                                      }
                                                      const items = [
                                                            { label: 'Name', value: data.name || '-', link: '#' },
                                                            { label: 'Email', value: data.email || '-', link: data.email ? `mailto:${data.email}` : '#' },
                                                            { label: 'Mobile', value: data.mobile || '-', link: data.mobile ? `tel:${data.mobile}` : '#' },
                                                            { label: 'Address', value: data.address || '-', link: '#' },
                                                      ];
                                                      return items.map((item, index) => (
                                                            <ContactDetail key={index} label={item.label} value={
                                                                  <Link to={item.link} target="_blank" rel="noopener noreferrer">{item.value}</Link>
                                                            } />
                                                      ));
                                                })()}
                                          </CardContent>
                                          <CardFooter className={'flex items-center gap-4 flex-wrap'}>
                                                <Button
                                                      onClick={() => window.open('https://www.facebook.com/samratmallick.dev/', '_blank')}      
                                                      variant="outline"
                                                      size="sm"
                                                      className="hover:bg-primary text-muted-foreground hover:text-white transition-colors duration-300 ease-out"
                                                >
                                                      <Facebook className="w-5 h-5 mr-2" />
                                                      Facebook
                                                </Button>
                                                <Button
                                                      onClick={() => window.open('https://www.instagram.com/samratmallick.dev/', '_blank')}      
                                                      variant="outline"
                                                      size="sm"
                                                      className="hover:bg-primary text-muted-foreground hover:text-white transition-colors duration-300 ease-out"
                                                >
                                                      <Instagram className="w-5 h-5 mr-2" />
                                                      Instagram
                                                </Button>
                                                <Button
                                                      onClick={() => window.open('https://github.com/samratmallick-dev/', '_blank')}      
                                                      variant="outline"
                                                      size="sm"
                                                      className="hover:bg-primary text-muted-foreground hover:text-white transition-colors duration-300 ease-out"
                                                >
                                                      <Github className="w-5 h-5 mr-2" />
                                                      GitHub
                                                </Button>
                                                <Button
                                                      onClick={() => window.open('https://www.linkedin.com/in/samrat-mallick01', '_blank')}      
                                                      variant="outline"
                                                      size="sm"
                                                      className="hover:bg-primary text-muted-foreground hover:text-white transition-colors duration-300 ease-out"
                                                >
                                                      <Linkedin className="w-5 h-5 mr-2" />
                                                      LinkedIn
                                                </Button>
                                          </CardFooter>
                                    </Card>

                              </div>
                              <div className='md:w-1/2 w-full flex items-center justify-center'>
                                    <Card className="hover-lift bg-background/30 hover:border-0 tech-glow w-full max-w-lg flex flex-col p-4 md:p-6 lg:p-8">
                                          <CardHeader className="text-2xl font-semibold">
                                                <CardTitle>Send Me a Message</CardTitle>
                                          </CardHeader>
                                          <CardContent>
                                                <CommonForm
                                                      formControls={contactFormIndex}
                                                      onSubmit={handleSubmit}
                                                      buttonText="Send Message"
                                                      values={formData}
                                                      onChange={handleChange}
                                                      isLoading={isLoading}
                                                />
                                          </CardContent>
                                    </Card>
                              </div>
                        </div>
                  </div>
            </section>
      );
}

export default MyContact;
