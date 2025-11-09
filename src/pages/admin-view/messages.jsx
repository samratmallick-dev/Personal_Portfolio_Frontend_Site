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
                  toast.error(err || 'Failed to delete message');
            }
      };

      const sortedMessages = [...(messages || [])].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      return (
            <Fragment>
                  <Card className="shadow-sm">
                        <CardHeader>
                              <CardTitle className="text-xl font-semibold">Contact Messages</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                              {isLoading ? (
                                    <div className="space-y-4">
                                          <Skeleton className="h-16 w-full" />
                                          <Skeleton className="h-16 w-full" />
                                          <Skeleton className="h-16 w-full" />
                                    </div>
                              ) : sortedMessages.length > 0 ? (
                                    sortedMessages.map((m) => (
                                          <div
                                                key={m._id}
                                                className="p-4 rounded-md border flex flex-col gap-2"
                                          >
                                                <div className="flex items-center justify-between">
                                                      <span className="font-semibold">{m.name}</span>
                                                      <span className="text-xs text-muted-foreground">
                                                            {new Date(m.createdAt).toLocaleString()}
                                                      </span>
                                                </div>

                                                <div className="text-sm text-muted-foreground">
                                                      {m.email} • {m.mobile}
                                                </div>

                                                <div className="text-sm wrap-break-word leading-relaxed">
                                                      {m.message}
                                                </div>

                                                <div className="flex justify-end">
                                                      <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleDelete(m._id)}
                                                            disabled={isLoading}
                                                      >
                                                            Delete
                                                      </Button>
                                                </div>
                                          </div>
                                    ))
                              ) : (
                                    <div className="text-center py-10 text-muted-foreground">
                                          No messages found.
                                    </div>
                              )}
                        </CardContent>
                  </Card>
            </Fragment>
      );
};

export default AdminMessages;
