import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getAllMessages, deleteMessageById } from '@/store/contact.slice';
import { toast } from 'sonner';

const AdminMessages = () => {
      const dispatch = useDispatch();
      const { messages, isLoading } = useSelector((state) => state.contact);

      useEffect(() => {
            dispatch(getAllMessages());
      }, [dispatch]);

      const handleDelete = async (id) => {
            try {
                  await dispatch(deleteMessageById(id)).unwrap();
                  toast.success('Message deleted');
                  dispatch(getAllMessages());
            } catch (err) {
                  toast.error(err?.message || 'Failed to delete message');
            }
      };

      return (
            <Fragment>
                  <Card>
                        <CardHeader>
                              <CardTitle>Contact Messages</CardTitle>
                        </CardHeader>
                        <CardContent>
                              {isLoading ? (
                                    <div className="space-y-4">
                                          <Skeleton className="h-16 w-full" />
                                          <Skeleton className="h-16 w-full" />
                                          <Skeleton className="h-16 w-full" />
                                    </div>
                              ) : messages && messages.length > 0 ? (
                                    <div className="space-y-4">
                                          {messages.map((m) => (
                                                <div key={m._id} className="p-4 rounded-md border flex flex-col gap-2">
                                                      <div className="flex flex-wrap justify-between gap-2">
                                                            <div className="font-semibold">{m.name}</div>
                                                            <div className="text-sm text-muted-foreground">{new Date(m.createdAt).toLocaleString()}</div>
                                                      </div>
                                                      <div className="text-sm text-muted-foreground break-all">{m.email} • {m.mobile}</div>
                                                      <div className="text-sm">{m.message}</div>
                                                      <div className="flex justify-end">
                                                            <Button variant="destructive" size="sm" onClick={() => handleDelete(m._id)} disabled={isLoading}>Delete</Button>
                                                      </div>
                                                </div>
                                          ))}
                                    </div>
                              ) : (
                                    <div className="text-center p-8 text-muted-foreground">No messages found.</div>
                              )}
                        </CardContent>
                  </Card>
            </Fragment>
      );
};

export default AdminMessages;
