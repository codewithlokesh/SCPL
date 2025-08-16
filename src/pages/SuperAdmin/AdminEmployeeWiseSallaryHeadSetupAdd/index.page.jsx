import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Form, Spinner } from 'react-bootstrap';
import { Formik } from 'formik';
import './AdminEmployeeWiseSallaryHeadSetupAdd.css';
import { SweetAlert } from '../../../components/CommonElement/SweetAlert';
import { Toaster } from '../../../components/CommonElement/Toaster';
import { toast } from 'react-toastify';
import { SuperAdminEmployeeServices, SuperAdminMastersServices, SuperAdminSallaryHeadSetupServices, SuperAdminEmployeeWiseSallaryHeadServices } from '../../../services/SuperAdmin';

const STATIC_USER_ID = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

const AdminEmployeeWiseSallaryHeadAddSetup = () => {
  const [sallaryHead, setSallaryHead] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [loadingDesignations, setLoadingDesignations] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Separate credit and debit salary heads
  const creditSalaryHeads = sallaryHead.filter(head => head.transactionType === 'Credit');
  const debitSalaryHeads = sallaryHead.filter(head => head.transactionType === 'Debit');

  const fetchSallaryHeadData = async () => {
    setIsLoading(true);
    try {
      const res = await SuperAdminSallaryHeadSetupServices.getSallaryHeadsSetup();
      setSallaryHead(Array.isArray(res?.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching Sallary heads:', error);
      setSallaryHead([]);
      toast.error('Failed to load Sallary heads');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDesignations = async () => {
    setLoadingDesignations(true);
    try {
      const res = await SuperAdminMastersServices.getMasterData({ 
        queryParams: { Category: 'Designation' } 
      });
      if(res?.masters?.data?.length > 0){
        setDesignations(res?.masters?.data);
      }
      else {
        setDesignations([]);
        toast.error('Failed to load designations');
      }
    } catch (error) {
      console.error('Error fetching designations:', error);
      setDesignations([]);
    } finally {
      setLoadingDesignations(false);
    }
  };

  const fetchEmployeesByDesignation = async (designationId) => {
    if (!designationId) {
      setEmployees([]);
      return;
    }
    setLoadingEmployees(true);
    try {
      const res = await SuperAdminEmployeeServices.getEmployeeByDesignationId(designationId);
      if(res?.data?.length > 0){
          const list = Array.isArray(res?.data) ? res.data : [];
          setEmployees(list);
      }
      else{
        setEmployees([]);
      }
    } catch (error) {
      console.error('Error fetching employees by designation:', error);
      setEmployees([]);
      toast.error('Failed to load employees for selected designation');
    } finally {
      setLoadingEmployees(false);
    }
  };

  useEffect(() => {
    fetchSallaryHeadData();
    fetchDesignations();
  }, []);

  const initialValues = {
    designationId: '',
    employeeId: '',
    creditAmounts: {},
    debitAmounts: {}
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    if (!values.employeeId) {
      toast.error('Please select an employee');
      return;
    }

    setIsSubmitting(true);
    try {
      const allSalaryHeads = [...creditSalaryHeads, ...debitSalaryHeads];
      const promises = [];

      // Create API calls for each salary head with amount
      allSalaryHeads.forEach(head => {
        const amount = head.transactionType === 'Credit' 
          ? values.creditAmounts[head.id] || 0
          : values.debitAmounts[head.id] || 0;

        if (amount > 0) {
          const payload = {
            employeeId: values.employeeId,
            salaryHeadId: head.id,
            amount: amount,
            createdBy: values.employeeId 
          };

          promises.push(SuperAdminEmployeeWiseSallaryHeadServices.addEmployeeWiseSallaryHead(payload));
        }
      });

      if (promises.length === 0) {
        toast.warning('Please enter at least one amount');
        return;
      }

      const results = await Promise.all(promises);
      const successCount = results.filter(res => res?.message === "Record added successfully.").length;

      if (successCount > 0) {
        toast.success(`Successfully set up salary head)`);
        resetForm();
        setSubmitting(false);
      } else {
        toast.error('Failed to set up salary heads');
      }
    } catch (error) {
      console.error('Error setting up salary heads:', error);
      toast.error('Failed to set up salary heads');
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  const handleDesignationChange = (designationId) => {
    fetchEmployeesByDesignation(designationId);
  };

  return (
    <div className='financial-year-container'>
      <div className='financial-year-header'>
        <h1>Salary Head</h1>
        <div className='breadcrumb'>Salary Head / Salary Head</div>
      </div>

      <div className='salary-head-form-container'>
        <Formik 
          initialValues={initialValues} 
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, handleChange, handleSubmit, setFieldValue }) => (
            <Form onSubmit={handleSubmit}>
              <Row className='mb-4'>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Select Designation</Form.Label>
                    <Form.Select
                      name='designationId'
                      value={values.designationId}
                      onChange={(e) => {
                        handleChange(e);
                        handleDesignationChange(e.target.value);
                      }}
                      disabled={loadingDesignations}
                    >
                      <option value=''>Select Designation</option>
                      {designations.map((designation) => (
                        <option key={designation.id} value={designation.id}>
                          {designation.particular}
                        </option>
                      ))}
                    </Form.Select>
                    {loadingDesignations && (
                      <div className='mt-2'>
                        <Spinner animation='border' size='sm' className='me-2' />
                        Loading designations...
                      </div>
                    )}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Select Employee *</Form.Label>
                    <Form.Select
                      name='employeeId'
                      value={values.employeeId}
                      onChange={handleChange}
                      disabled={!values.designationId || loadingEmployees}
                    >
                      <option value=''>Select Employee</option>
                      {employees.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                          {employee.employeeName || employee.name} - {employee.employeeCode || employee.code}
                        </option>
                      ))}
                    </Form.Select>
                    {loadingEmployees && (
                      <div className='mt-2'>
                        <Spinner animation='border' size='sm' className='me-2' />
                        Loading employees...
                      </div>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                {/* Credit Salary Head Section */}
                <Col md={6}>
                  <div className='salary-head-section'>
                    <h4>Credit Salary Head</h4>
                    <div className='salary-head-table'>
                      <table className='table table-bordered'>
                        <thead>
                          <tr>
                            <th width="10%">#</th>
                            <th width="60%">Credit Salary Head</th>
                            <th width="30%">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {creditSalaryHeads.map((head, index) => (
                            <tr key={head.id}>
                              <td>{index + 1}</td>
                              <td>{head.salaryHeadName}</td>
                              <td>
                                <Form.Control
                                  type='number'
                                  placeholder='0'
                                  value={values.creditAmounts[head.id] || ''}
                                  onChange={(e) => setFieldValue(`creditAmounts.${head.id}`, e.target.value)}
                                  min="0"
                                  step="0.01"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Col>

                {/* Debit Salary Head Section */}
                <Col md={6}>
                  <div className='salary-head-section'>
                    <h4>Debit Salary Head</h4>
                    <div className='salary-head-table'>
                      <table className='table table-bordered'>
                        <thead>
                          <tr>
                            <th width="10%">#</th>
                            <th width="60%">Debit Salary Head</th>
                            <th width="30%">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {debitSalaryHeads.map((head, index) => (
                            <tr key={head.id}>
                              <td>{index + 1}</td>
                              <td>{head.salaryHeadName}</td>
                              <td>
                                <Form.Control
                                  type='number'
                                  placeholder='0'
                                  value={values.debitAmounts[head.id] || ''}
                                  onChange={(e) => setFieldValue(`debitAmounts.${head.id}`, e.target.value)}
                                  min="0"
                                  step="0.01"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Col>
              </Row>

              <Row className='mt-4'>
                <Col className='text-center'>
                  <Button 
                    variant='primary' 
                    type='submit' 
                    className='me-3'
                    disabled={isSubmitting || !values.employeeId}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </Button>
                  <Button 
                    variant='warning' 
                    type='button'
                    onClick={() => window.location.reload()}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </div>

      <Toaster autoClose={2000} position='top-right' theme='light' />
    </div>
  );
};

AdminEmployeeWiseSallaryHeadAddSetup.displayName = 'AdminEmployeeWiseSallaryHeadAddSetup';

export default AdminEmployeeWiseSallaryHeadAddSetup;