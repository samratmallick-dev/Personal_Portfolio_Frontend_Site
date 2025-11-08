import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import CommonForm from '@/components/common/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { adminServiceFormIndex } from '@/config/allFormIndex';
import { getAllServices, createService, updateService, deleteService } from '@/store/services.slice';

const initialFormData = {
  title: '',
  description: '',
  icon: '',
  features: ''
};

const AdminViewServices = () => {
  const dispatch = useDispatch();
  const { isLoading, servicesData, error } = useSelector((state) => state.services);

  const [formData, setFormData] = useState(initialFormData);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(getAllServices());
  }, [dispatch]);

  const handleFormChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    dispatch(createService(formData))
      .then(() => {
        toast.success('Service created successfully');
        setFormData(initialFormData);
        dispatch(getAllServices());
      })
      .catch((err) => toast.error(err?.message || 'Failed to create service'));
  };

  const startEdit = (service) => {
    setIsEdit(true);
    setEditingId(service._id);
    setFormData({
      title: service.title || '',
      description: service.description || '',
      icon: service.icon || '',
      features: Array.isArray(service.features) ? service.features.join(', ') : (service.features || '')
    });
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (!editingId) return;
    dispatch(updateService({ id: editingId, formData }))
      .then(() => {
        toast.success('Service updated successfully');
        setIsEdit(false);
        setEditingId(null);
        setFormData(initialFormData);
        dispatch(getAllServices());
      })
      .catch((err) => toast.error(err?.message || 'Failed to update service'));
  };

  const handleCancelEdit = () => {
    setIsEdit(false);
    setEditingId(null);
    setFormData(initialFormData);
  };

  const handleDelete = (id) => {
    dispatch(deleteService(id))
      .then(() => {
        toast.success('Service deleted successfully');
        dispatch(getAllServices());
      })
      .catch((err) => toast.error(err?.message || 'Failed to delete service'));
  };

  return (
    <Fragment>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Existing Services</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : servicesData && servicesData.length > 0 ? (
                servicesData.map((svc) => (
                  <Card key={svc._id} className="mb-4">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-lg">{svc.title}</CardTitle>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEdit(svc)}
                          disabled={isLoading}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(svc._id)}
                          disabled={isLoading}
                        >
                          Delete
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">{svc.description}</p>
                      {Array.isArray(svc.features) && svc.features.length > 0 ? (
                        <ul className="flex flex-wrap gap-2">
                          {svc.features.map((f, idx) => (
                            <li key={idx} className="px-2 py-1 rounded-md bg-muted/50 text-xs">
                              {f}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center p-8 text-muted-foreground">
                  <p>No services found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>{isEdit ? 'Edit Service' : 'Add New Service'}</CardTitle>
            </CardHeader>
            <CardContent>
              <CommonForm
                formControls={adminServiceFormIndex}
                values={formData}
                onChange={handleFormChange}
                onSubmit={isEdit ? handleUpdateSubmit : handleCreateSubmit}
                buttonText={isEdit ? 'Update Service' : 'Add Service'}
                isLoading={isLoading}
              />
              {isEdit ? (
                <Button variant="outline" className="mt-4" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </Fragment>
  );
};

export default AdminViewServices;
