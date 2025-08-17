import React, { useEffect, useState } from 'react';
import { Row, Col, Table, Button, Form, Spinner, Modal } from 'react-bootstrap';
import { Formik } from 'formik';
import './AdminLeaveRequest.css';
import { SuperAdminLeaveRequestServices } from '../../../services/SuperAdmin/LeaveRequest/index.service';
import { SuperAdminMastersServices } from '../../../services/SuperAdmin/Users/index.service';
import { SuperAdminEmployeeServices } from '../../../services/SuperAdmin/Employee/index.service';
import LeaveRequestValidationSchema from './validation';
import { SweetAlert } from '../../../components/CommonElement/SweetAlert';
import { Toaster } from '../../../components/CommonElement/Toaster';
import { toast } from 'react-toastify';

const STATIC_USER_ID = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

const AdminLeaveRequest = () => {
  const [leaveRequestData, setLeaveRequestData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Dropdown data states
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [employeeList,setEmployeeList] = useState([]);
  
  // Loading states for dropdowns
  const [loadingLeaveTypes, setLoadingLeaveTypes] = useState(false);
  const [loadingDesignations, setLoadingDesignations] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  // Add a new state for tracking employee name loading
  const [isEmployeeNamesLoading, setIsEmployeeNamesLoading] = useState(true);

  // Helper function to calculate total days between start and end date
  const calculateTotalDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Calculate difference in milliseconds
    const diffTime = end.getTime() - start.getTime();
    
    // Convert to days and add 1 to include both start and end dates
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    return diffDays;
  };

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  // Helper function to get leave type name
  const getLeaveTypeName = (leaveTypeId) => {
    if (!leaveTypeId) return 'N/A';
    const leaveType = leaveTypes.find(lt => lt.id === leaveTypeId);
    return leaveType ? (leaveType.masterName || leaveType.particular || leaveType.name || 'Unknown Type') : 'Unknown Type';
  };

  // Helper function to get designation name
  const getDesignationName = (designationId) => {
    if (!designationId) return 'N/A';
    const designation = designations.find(des => des.id === designationId);
    return designation ? (designation.masterName || designation.particular || designation.name || 'Unknown Designation') : 'Unknown Designation';
  };

  // Helper function to get employee name
  const getEmployeeName = (employeeId) => {
    if (!employeeId) return 'N/A';
    
    // If still loading employee names, return loading indicator
    if (isEmployeeNamesLoading) {
      return (
        <span className="d-inline-flex align-items-center">
          <Spinner animation="border" size="sm" className="me-2" />
          Loading...
        </span>
      );
    }
    
    const employee = employeeList.find(emp => emp.id === employeeId);
    return employee ? (employee.partyName || 'Unknown Employee') : 'Unknown Employee';
  };

  // Fetch leave types from master data
  const fetchLeaveTypes = async () => {
    setLoadingLeaveTypes(true);
    try {
      const res = await SuperAdminMastersServices.getMasterData({ 
        queryParams: { Category: 'LeaveType' } 
      });
      if(res?.masters?.data?.length > 0){
        setLeaveTypes(res?.masters?.data);
      }else {
        setLeaveTypes([]);
        toast.error('Failed to load leave types');
      }
    } catch (error) {
      console.error('Error fetching leave types:', error);
      setLeaveTypes([]);
    } finally {
      setLoadingLeaveTypes(false);
    }
  };

  // Fetch designations from master data
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

  // Fetch employees by designation
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
        // Don't show error toast as it's normal to have no employees for some designations
      }
    } catch (error) {
      console.error('Error fetching employees by designation:', error);
      setEmployees([]);
      toast.error('Failed to load employees for selected designation');
    } finally {
      setLoadingEmployees(false);
    }
  };

  // Fetch all employees for displaying names in the table
  const fetchAllEmployees = async () => {
    setIsEmployeeNamesLoading(true);
    try {
      const res = await SuperAdminEmployeeServices.getEmployee();
      if(res?.data?.length > 0){
        setEmployeeList(res.data);
      } else {
        setEmployeeList([]);
        console.warn('No employees found or failed to load employees');
      }
    } catch (error) {
      console.error('Error fetching all employees:', error);
      setEmployeeList([]);
    } finally {
      setIsEmployeeNamesLoading(false);
    }
  };

  // Fetch leave requests
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await SuperAdminLeaveRequestServices.getLeaveRequest();
      if(res?.status === 200){
          setLeaveRequestData(Array.isArray(res?.data) ? res.data : []);
      }
      else{
        setLeaveRequestData([]);
        toast.error('Failed to load leave requests');
      }
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      setLeaveRequestData([]);
      toast.error('Failed to load leave requests');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle add submit
  const handleAddSubmit = async (values, { resetForm, setSubmitting }) => {
    setIsSubmitting(true);
    try {
      // Calculate total days
      const totalDays = calculateTotalDays(values.startDate, values.endDate);
      
      // Get current date in ISO format
      const currentDate = new Date().toISOString();
      
      const payload = {
        employeeId: values.employee,
        leaveTypeId: values.leaveType,
        leaveRequestDate: currentDate,
        startDate: values.startDate,
        endDate: values.endDate,
        totalDays: totalDays,
        reason: values.reason || "",
        createdBy: values.employee,
        status: 'Pending', 
      };

      const res = await SuperAdminLeaveRequestServices.addLeaveRequest(payload);
      if (res.status === 200) {
        toast.success('Leave request submitted successfully');
        setShowAddModal(false);
        resetForm();
        await fetchData();
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

  // Handle edit
  const handleEdit = (item) => {
    setEditingItem(item);
    setShowEditModal(true);
  };

  // Handle edit submit
  const handleEditSubmit = async (values, { resetForm, setSubmitting }) => {
    setIsUpdating(true);
    try {
      const currentDate = new Date().toISOString();
      const totalDays = calculateTotalDays(values.startDate, values.endDate);
      const payload = {
        id: editingItem.id,
        updatedBy: editingItem.id,
        leaveTypeId: values.leaveType,
        employeeId: values.employee,
        startDate: values.startDate,
        endDate: values.endDate,
        reason: values.reason,
        leaveRequestDate: currentDate,
        totalDays: totalDays,
      };

      const res = await SuperAdminLeaveRequestServices.updateLeaveRequest(payload);
      if (res?.message === "Record updated successfully.") {
        toast.success('Leave request updated successfully');
        setShowEditModal(false);
        setEditingItem(null);
        resetForm();
        await fetchData();
      } else {
        toast.error(res?.message || 'Failed to update leave request');
      }
    } catch (error) {
      console.error('Error updating leave request:', error);
      toast.error('Failed to update leave request');
    } finally {
      setIsUpdating(false);
      setSubmitting(false);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingItem(null);
  };

  // Handle delete
  const handleDelete = async (id) => {
    const confirmed = await SweetAlert.confirm({
      title: 'Are you sure?',
      text: 'You want to delete this leave request?',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    });
    
    if (confirmed) {
      try {
        const payload = {
          id,
          deletedBy: STATIC_USER_ID,
        };
        const res = await SuperAdminLeaveRequestServices.deleteLeaveRequest(payload);
        if (res?.message === "Record deleted successfully.") {
          await fetchData();
          toast.success('Leave request deleted successfully');
        } else {
          toast.error(res?.message || 'Failed to delete leave request');
        }
      } catch (error) {
        console.error('Error deleting leave request:', error);
        toast.error('Failed to delete leave request');
      }
    }
  };

  // Filter and pagination logic
  const filteredData = leaveRequestData.filter((item) => {
    const q = searchTerm.toLowerCase();
    return (
      getLeaveTypeName(item.leaveTypeId)?.toLowerCase().includes(q) ||
      getEmployeeName(item.employeeId)?.toLowerCase().includes(q) ||
      getDesignationName(item.designationId)?.toLowerCase().includes(q) ||
      item.reason?.toLowerCase().includes(q)
    );
  });

  const totalEntries = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / entriesPerPage));
  const startEntry = totalEntries === 0 ? 0 : (currentPage - 1) * entriesPerPage + 1;
  const endEntry = totalEntries === 0 ? 0 : Math.min(currentPage * entriesPerPage, totalEntries);

  const paginatedData = filteredData.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  // Initial values for forms
  const initialValues = {
    leaveType: '',
    designation: '',
    employee: '',
    startDate: '',
    endDate: '',
    reason: '',
  };

  useEffect(() => {
    fetchData();
    fetchLeaveTypes();
    fetchDesignations();
    fetchAllEmployees(); // Add this line to fetch all employees
  }, []);

  // ... existing JSX code remains the same ...
  return (
    <div className='leave-request-container'>
      <div className='leave-request-header'>
        <h1>Leave Request Management</h1>
        <div className='breadcrumb'>HR Master / Leave Request Management</div>
      </div>

      {/* Add Button Section */}
      <div className='add-entry-section d-flex justify-content-end'>
        <Button variant='primary' onClick={() => setShowAddModal(true)} className='add-btn'>
          + Add New Leave Request
        </Button>
      </div>

      {/* Table Controls */}
      <div className='table-controls'>
        <Row className='align-items-center'>
          <Col md={6}>
            <div className='entries-control'>
              <span>Show</span>
              <Form.Select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                className='entries-select'
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </Form.Select>
              <span>entries</span>
            </div>
          </Col>
          <Col md={6} className='text-end'>
            <div className='search-control'>
              <span>Search:</span>
              <Form.Control
                type='text'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder='Search leave requests...'
                className='search-input'
              />
            </div>
          </Col>
        </Row>
      </div>

      {/* Leave Requests Table */}
      <div className='table-container'>
        <Table className='leave-request-table'>
          <thead>
            <tr>
              <th>Sr No</th>
              <th>Employee</th>
              <th>Leave Type</th>
              {/* <th>Designation</th> */}
              <th>Start Date</th>
              <th>End Date</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading || isEmployeeNamesLoading ? (
              <tr>
                <td colSpan='9' className='text-center'>
                  <Spinner animation='border' size='sm' className='me-2' />
                  {isLoading ? 'Loading leave requests...' : 'Loading employee names...'}
                </td>
              </tr>
            ) : totalEntries === 0 ? (
              <tr>
                <td colSpan='9' className='text-center'>
                  No leave requests found
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <tr key={item.id}>
                  <td>{startEntry + index}</td>
                  <td>{getEmployeeName(item.employeeId)}</td>
                  <td>{getLeaveTypeName(item.leaveTypeId)}</td>
                  {/* <td>{getDesignationName(item.designationId)}</td> */}
                  <td>{formatDate(item.startDate)}</td>
                  <td>{formatDate(item.endDate)}</td>
                  <td>
                    <div className='reason-cell'>
                      {item.reason?.length > 50 
                        ? `${item.reason.substring(0, 50)}...` 
                        : item.reason
                      }
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge status-${item.status?.toLowerCase()}`}>
                      {item.status || 'Pending'}
                    </span>
                  </td>
                  <td>
                    <div className='action-buttons'>
                      <Button
                        variant='primary'
                        size='sm'
                        className='edit-btn me-2'
                        onClick={() => handleEdit(item)}
                      >
                        Update
                      </Button>
                      <Button
                        variant='danger'
                        size='sm'
                        className='delete-btn'
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      {/* Table Summary */}
      <div className='table-summary'>
        <Row className='align-items-center'>
          <Col md={6}>
            <div className='entries-info'>
              Showing {startEntry} to {endEntry} of {totalEntries} entries
            </div>
          </Col>
          <Col md={6} className='text-end'>
            <div className='pagination-controls'>
              <Button
                variant='light'
                size='sm'
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className='pagination-btn'
              >
                Previous
              </Button>
              <Button variant='primary' size='sm' className='pagination-btn active'>
                {currentPage}
              </Button>
              <Button
                variant='light'
                size='sm'
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className='pagination-btn'
              >
                Next
              </Button>
            </div>
          </Col>
        </Row>
      </div>

      {/* Add Leave Request Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size='lg' centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Leave Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik 
            initialValues={initialValues} 
            validationSchema={LeaveRequestValidationSchema} 
            onSubmit={handleAddSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
              <Form id='addLeaveRequestForm' onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className='mb-3'>
                      <Form.Label className='form-label'>Select Leave Type *</Form.Label>
                      <div style={{ position: "relative" }}>
                        <Form.Select
                          name='leaveType'
                          value={values.particular}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={loadingLeaveTypes}
                          isInvalid={touched.leaveType && !!errors.leaveType}
                          className={values.particular ? 'no-border' : ''}
                        >
                          <option value=''>Select Leave Type</option>
                          {loadingLeaveTypes ? (
                            <option disabled>Loading...</option>
                          ) : (
                            leaveTypes.map((type) => (
                              <option key={type.id} value={type.id}>
                                {type.particular}
                              </option>
                            ))
                          )}
                        </Form.Select>
                        <Form.Control.Feedback type='invalid'>
                          {errors.leaveType}
                        </Form.Control.Feedback>
                        {loadingLeaveTypes && (
                          <div style={{ position: "absolute", top: "50%", right: "10px", transform: "translateY(-50%)", zIndex: 2 }}>
                            <span className="spinner-border spinner-border-sm text-primary" />
                          </div>
                        )}
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className='mb-3'>
                      <Form.Label className='form-label'>Select Designation</Form.Label>
                      <div style={{ position: "relative" }}>
                        <Form.Select
                          name='designation'
                          value={values.designation}
                          onChange={(e) => {
                            handleChange(e);
                            // Clear employee selection when designation changes
                            setFieldValue('employee', '');
                            // Fetch employees for new designation
                            fetchEmployeesByDesignation(e.target.value);
                          }}
                          onBlur={handleBlur}
                          disabled={loadingDesignations}
                          isInvalid={touched.designation && !!errors.designation}
                          className={values.designation ? 'no-border' : ''}
                        >
                          <option value=''>Select Designation</option>
                          {loadingDesignations ? (
                            <option disabled>Loading...</option>
                          ) : (
                            designations.map((des) => (
                              <option key={des.id} value={des.id}>
                                {des.particular}
                              </option>
                            ))
                          )}
                        </Form.Select>
                        <Form.Control.Feedback type='invalid'>
                          {errors.designation}
                        </Form.Control.Feedback>
                        {loadingDesignations && (
                          <div style={{ position: "absolute", top: "50%", right: "10px", transform: "translateY(-50%)", zIndex: 2 }}>
                            <span className="spinner-border spinner-border-sm text-primary" />
                          </div>
                        )}
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className='mb-3'>
                      <Form.Label className='form-label'>Select Employee *</Form.Label>
                      <div style={{ position: "relative" }}>
                        <Form.Select
                          name='employee'
                          value={values.employee}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={loadingEmployees || !values.designation}
                          isInvalid={touched.employee && !!errors.employee}
                          className={values.employee ? 'no-border' : ''}
                        >
                          <option value=''>
                            {!values.designation ? 'Please select designation first' : 'Select Employee'}
                          </option>
                          {loadingEmployees ? (
                            <option disabled>Loading...</option>
                          ) : employees.length === 0 ? (
                            <option disabled className='text-center'>No employee found</option>
                          ) : (
                            employees.map((emp) => (
                              <option key={emp.id} value={emp.id}>
                                {emp.name}
                              </option>
                            ))
                          )}
                        </Form.Select>
                        <Form.Control.Feedback type='invalid'>
                          {errors.employee}
                        </Form.Control.Feedback>
                        {loadingEmployees && (
                          <div style={{ position: "absolute", top: "50%", right: "10px", transform: "translateY(-50%)", zIndex: 2 }}>
                            <span className="spinner-border spinner-border-sm text-primary" />
                          </div>
                        )}
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className='mb-3'>
                      <Form.Label className='form-label'>Start Date *</Form.Label>
                      <Form.Control
                        type='date'
                        name='startDate'
                        value={values.startDate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.startDate && !!errors.startDate}
                        min={new Date().toISOString().split('T')[0]}
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.startDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className='mb-3'>
                      <Form.Label className='form-label'>End Date *</Form.Label>
                      <Form.Control
                        type='date'
                        name='endDate'
                        value={values.endDate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.endDate && !!errors.endDate}
                        min={values.startDate || new Date().toISOString().split('T')[0]}
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.endDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className='mb-3'>
                      <Form.Label className='form-label'>Reason *</Form.Label>
                      <Form.Control
                        as='textarea'
                        rows={3}
                        name='reason'
                        value={values.reason}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.reason && !!errors.reason}
                        placeholder='Enter reason for leave...'
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.reason}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowAddModal(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant='primary' type='submit' form='addLeaveRequestForm' disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner animation='border' size='sm' className='me-2' />
                Submitting...
              </>
            ) : (
              'Submit'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={handleCancelEdit} size='lg' centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Leave Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingItem && (
            <Formik
              enableReinitialize
              initialValues={{
                leaveType: editingItem.leaveTypeId || '',
                employee: editingItem.employeeId || editingItem.employee || '',
                startDate: editingItem.startDate ? new Date(editingItem.startDate).toISOString().split('T')[0] : '',
                endDate: editingItem.endDate ? new Date(editingItem.endDate).toISOString().split('T')[0] : '',
                reason: editingItem.reason || '',
              }}
            //   validationSchema={LeaveRequestValidationSchema}
              onSubmit={handleEditSubmit}
              validateOnChange={false} 
              validateOnBlur={false}  
            >
              {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => {
                return (
                  <Form id='editLeaveRequestForm' onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className='mb-3'>
                          <Form.Label className='form-label'>Select Leave Type *</Form.Label>
                          <div style={{ position: "relative" }}>
                            <Form.Select
                              name='leaveType'
                              value={values.leaveType}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              disabled={loadingLeaveTypes}
                              isInvalid={touched.leaveType && !!errors.leaveType}
                            >
                              <option value=''>Select Leave Type</option>
                              {leaveTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                  {type.particular}
                                </option>
                              ))}
                            </Form.Select>
                            <Form.Control.Feedback type='invalid'>
                              {errors.leaveType}
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className='mb-3'>
                          <Form.Label className='form-label'>Select Employee *</Form.Label>
                          <div style={{ position: "relative" }}>
                            <Form.Select
                              name='employee'
                              value={values.employee}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={touched.employee && !!errors.employee}
                            >
                              <option value=''>Select Employee</option>
                              {employeeList.map((emp) => (
                                <option key={emp.id} value={emp.id}>
                                  {emp.partyName || emp.name || emp.employeeName}
                                </option>
                              ))}
                            </Form.Select>
                            <Form.Control.Feedback type='invalid'>
                              {errors.employee}
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className='mb-3'>
                          <Form.Label className='form-label'>Start Date *</Form.Label>
                          <Form.Control
                            type='date'
                            name='startDate'
                            value={values.startDate}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.startDate && !!errors.startDate}
                          />
                          <Form.Control.Feedback type='invalid'>
                            {errors.startDate}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className='mb-3'>
                          <Form.Label className='form-label'>End Date *</Form.Label>
                          <Form.Control
                            type='date'
                            name='endDate'
                            value={values.endDate}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.endDate && !!errors.endDate}
                            min={values.startDate}
                          />
                          <Form.Control.Feedback type='invalid'>
                            {errors.endDate}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12}>
                        <Form.Group className='mb-3'>
                          <Form.Label className='form-label'>Reason *</Form.Label>
                          <Form.Control
                            as='textarea'
                            rows={3}
                            name='reason'
                            value={values.reason}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.reason && !!errors.reason}
                            placeholder='Enter reason for leave...'
                          />
                          <Form.Control.Feedback type='invalid'>
                            {errors.reason}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Form>
                );
              }}
            </Formik>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleCancelEdit} disabled={isUpdating}>
            Cancel
          </Button>
          <Button variant='primary' type='submit' form='editLeaveRequestForm' disabled={isUpdating}>
            {isUpdating ? (
              <>
                <Spinner animation='border' size='sm' className='me-2' />
                Updating...
              </>
            ) : (
              'Update'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <Toaster autoClose={2000} position='top-right' theme='light' />
    </div>
  );
};

AdminLeaveRequest.displayName = 'AdminLeaveRequest';

export default AdminLeaveRequest;