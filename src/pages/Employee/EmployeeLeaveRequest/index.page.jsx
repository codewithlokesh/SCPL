import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Button, Spinner, Card } from 'react-bootstrap';
import { Formik } from 'formik';
import { SuperAdminMastersServices } from '../../../services/SuperAdmin/Users/index.service';
import { SuperAdminLeaveRequestServices } from '../../../services/SuperAdmin/LeaveRequest/index.service';
import { toast } from 'react-toastify';
import { Toaster } from '../../../components/CommonElement/Toaster';
import LeaveRequestValidationSchema from './validation';
import { useSelector } from 'react-redux';
import { getUserAuthData } from '../../../redux/AuthSlice/index.slice';
// Validation schema


const LeaveRequest = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loadingLeaveTypes, setLoadingLeaveTypes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userData = useSelector(getUserAuthData);
  const calculateTotalDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const fetchLeaveTypes = async () => {
    setLoadingLeaveTypes(true);
    try {
      const res = await SuperAdminMastersServices.getMasterData({
        queryParams: { Category: 'LeaveType' }
      });
      if (res?.masters?.data?.length > 0) {
        setLeaveTypes(res?.masters?.data);
      } else {
        setLeaveTypes([]);
        toast.error('Failed to load leave types');
      }
    } catch (error) {
      console.error('Error fetching leave types:', error);
      setLeaveTypes([]);
      toast.error('Failed to load leave types');
    } finally {
      setLoadingLeaveTypes(false);
    }
  };

  // Handle form submit
  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    setIsSubmitting(true);
    try {
      const totalDays = calculateTotalDays(values.startDate, values.endDate);
      const currentDate = new Date().toISOString();
      const payload = {
        employeeId: userData?.id,
        leaveTypeId: values.leaveType,
        leaveRequestDate: currentDate,
        startDate: values.startDate,
        endDate: values.endDate,
        totalDays: totalDays,
        reason: values.reason || "",
        createdBy: userData?.id,
      };

      const res = await SuperAdminLeaveRequestServices.addLeaveRequest(payload);
      if (res.status === 200) {
        toast.success('Leave request submitted successfully');
        resetForm();
      } else {
        toast.error(res?.message || 'Failed to submit leave request');
      }
    } catch (error) {
      console.error('Error submitting leave request:', error);
      toast.error('Failed to submit leave request');
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  // Initial values for the form
  const initialValues = {
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
  };

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  return (
    <>
      <div className="container-fluid mt-3">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="text-primary mb-0">Leave Request</h3>
          <nav aria-label="breadcrumb" className="text-nowrap">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">Manage Leave</li>
              <li className="breadcrumb-item active" aria-current="page">Leave Request</li>
            </ol>
          </nav>
        </div>
        <Card className="shadow-sm">
          <Card.Body className="p-4">
            <Formik
              initialValues={initialValues}
              validationSchema={LeaveRequestValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={4}>
                      <Form.Group className='mb-3'>
                        <Form.Label className='form-label fw-semibold'>Select Leave Type *</Form.Label>
                        <div style={{ position: "relative" }}>
                          <Form.Select
                            name='leaveType'
                            value={values.leaveType}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={loadingLeaveTypes}
                            isInvalid={touched.leaveType && !!errors.leaveType}
                            className={values.leaveType ? 'form-select' : 'form-select'}
                          >
                            <option value=''>Select Leave Type</option>
                            {loadingLeaveTypes ? (
                              <option disabled>Loading...</option>
                            ) : (
                              leaveTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                  {type.particular || type.masterName || type.name}
                                </option>
                              ))
                            )}
                          </Form.Select>
                          <Form.Control.Feedback type='invalid'>
                            {errors.leaveType}
                          </Form.Control.Feedback>
                          {loadingLeaveTypes && (
                            <div style={{ position: "absolute", top: "50%", right: "10px", transform: "translateY(-50%)", zIndex: 2 }}>
                              <Spinner animation="border" size="sm" className="text-primary" />
                            </div>
                          )}
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className='mb-3'>
                        <Form.Label className='form-label fw-semibold'>Start Date *</Form.Label>
                        <Form.Control
                          type='date'
                          name='startDate'
                          value={values.startDate}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.startDate && !!errors.startDate}
                          min={new Date().toISOString().split('T')[0]}
                          className='form-control'
                        />
                        <Form.Control.Feedback type='invalid'>
                          {errors.startDate}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className='mb-3'>
                        <Form.Label className='form-label fw-semibold'>End Date *</Form.Label>
                        <Form.Control
                          type='date'
                          name='endDate'
                          value={values.endDate}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.endDate && !!errors.endDate}
                          min={values.startDate || new Date().toISOString().split('T')[0]}
                          className='form-control'
                        />
                        <Form.Control.Feedback type='invalid'>
                          {errors.endDate}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12}>
                      <Form.Group className='mb-4'>
                        <Form.Label className='form-label fw-semibold'>Reason *</Form.Label>
                        <Form.Control
                          as='textarea'
                          rows={4}
                          name='reason'
                          value={values.reason}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.reason && !!errors.reason}
                          placeholder='Please provide a detailed reason for your leave request...'
                          className='form-control'
                        />
                        <Form.Control.Feedback type='invalid'>
                          {errors.reason}
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                          {values.reason?.length || 0}/500 characters
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Action Buttons */}
                  <div className='d-flex gap-2'>
                    <Button
                      variant='primary'
                      type='submit'
                      disabled={isSubmitting}
                      className='px-4'
                    >
                      {isSubmitting ? (
                        <>
                          <Spinner animation='border' size='sm' className='me-2' />
                          Submitting...
                        </>
                      ) : (
                        'Submit'
                      )}
                    </Button>
                    <Button
                      variant='secondary'
                      type='button'
                      onClick={() => window.history.back()}
                      className='px-4'
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </Card.Body>
        </Card>
      </div>

      <Toaster autoClose={2000} position='top-right' theme='light' />
    </>
  );
};

export default LeaveRequest;
