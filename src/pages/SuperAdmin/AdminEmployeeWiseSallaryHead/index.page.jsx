import React, { useEffect, useState } from 'react';
import { Row, Col, Table, Button, Form, Modal, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import './AdminEmployeeWiseSallaryHead.css';
import { SuperAdminEmployeeWiseSallaryHeadServices, SuperAdminEmployeeServices, SuperAdminSallaryHeadServices } from '../../../services/SuperAdmin';
import { SweetAlert } from '../../../components/CommonElement/SweetAlert';
import { Toaster } from '../../../components/CommonElement/Toaster';
import { toast } from 'react-toastify';
import superAdminRouteMap from '../../../routes/SuperAdmin/superAdminRouteMap';
import EmployeeWiseSallaryHeadValidationSchema from './validation';
const STATIC_USER_ID = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
const AdminEmployeeWiseSallaryHead = () => {
  const navigate = useNavigate();
  const [salaryHeadData, setSalaryHeadData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Additional data for display and edit modal
  const [employeeData, setEmployeeData] = useState([]);
  const [salaryHeadMasterData, setSalaryHeadMasterData] = useState([]);

  const fetchSalaryHeadData = async () => {
    setIsLoading(true);
    try {
      const res = await SuperAdminEmployeeWiseSallaryHeadServices.getEmployeeWiseSallaryHeadsSetup();
      if (res?.data && Array.isArray(res.data)) {
        setSalaryHeadData(res.data);
      } else {
        setSalaryHeadData([]);
      }
    } catch (error) {
      console.error('Error fetching salary head data:', error);
      setSalaryHeadData([]);
      toast.error('Failed to load salary head data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployeeData = async () => {
    try {
      const res = await SuperAdminEmployeeServices.getEmployee();
      if (res && Array.isArray(res?.data)) {
        setEmployeeData(res.data);
      } else {
        setEmployeeData([]);
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
      setEmployeeData([]);
    }
  };

  const fetchSalaryHeadMasterData = async () => {
    try {
      const res = await SuperAdminSallaryHeadServices.getSallaryHeads();
      if (res && Array.isArray(res?.data)) {
        setSalaryHeadMasterData(res.data);
      } else {
        setSalaryHeadMasterData([]);
      }
    } catch (error) {
      console.error('Error fetching salary head master data:', error);
      setSalaryHeadMasterData([]);
    }
  };

  useEffect(() => {
    fetchSalaryHeadData();
    fetchEmployeeData();
    fetchSalaryHeadMasterData();
  }, []);

  const handleAddSalaryHead = () => {
    navigate(superAdminRouteMap.SALLARY_HEAD_SETUP_ADD.path);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (values, { resetForm, setSubmitting }) => {
    setIsUpdating(true);
    try {
      const payload = {
        id: editingItem.id,
        employeeId: values.employeeId,
        salaryHeadId: values.salaryHeadId,
        amount: Number(values.amount),
        updatedBy: STATIC_USER_ID,
      };

      const res = await SuperAdminEmployeeWiseSallaryHeadServices.updateEmployeeWiseSallaryHead(payload);
      if (res?.message === "Record updated successfully." || res?.status === 'success') {
        toast.success('Salary head setup updated successfully');
        setShowEditModal(false);
        setEditingItem(null);
        resetForm();
        await fetchSalaryHeadData();
      } else {
        toast.error(res?.message || 'Failed to update salary head setup');
      }
    } catch (error) {
      console.error('Error updating salary head setup:', error);
      toast.error('Failed to update salary head setup');
    } finally {
      setIsUpdating(false);
      setSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingItem(null);
  };

  const handleDelete = async (id) => {
    const confirmed = await SweetAlert.confirm({
      title: 'Are you sure?',
      text: 'You want to delete this salary head setup?',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    });
    
    if (confirmed) {
      try {
        const payload = {
          id,
          deletedBy: STATIC_USER_ID,
        };
        const res = await SuperAdminEmployeeWiseSallaryHeadServices.deleteEmployeeWiseSallaryHead(payload);
        if (res?.message === "Record deleted successfully.") {
          await fetchSalaryHeadData();
          toast.success('Salary head setup deleted successfully');
        } else {
          toast.error(res?.message || 'Failed to delete salary head setup');
        }
      } catch (error) {
        console.error('Error deleting salary head setup:', error);
        toast.error('Failed to delete salary head setup');
      }
    }
  };

  // Helper functions to get names from IDs
  const getEmployeeName = (employeeId) => {
    const employee = employeeData.find(emp => emp.id === employeeId);
    return employee ? employee.partyName || employee.employeeName : employeeId || '-';
  };

  const getSalaryHeadName = (salaryHeadId) => {
    const salaryHead = salaryHeadMasterData.find(sh => sh.id === salaryHeadId);
    return salaryHead ? salaryHead.salaryHeadName || salaryHead.name : salaryHeadId || '-';
  };

  const filteredData = salaryHeadData.filter((item) => {
    const q = searchTerm.toLowerCase();
    return (
      getEmployeeName(item.employeeId)?.toLowerCase().includes(q) ||
      getSalaryHeadName(item.salaryHeadId)?.toLowerCase().includes(q) ||
      item.amount?.toString().includes(q) ||
      item.id?.toLowerCase().includes(q)
    );
  });

  const totalEntries = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / entriesPerPage));
  const startEntry = totalEntries === 0 ? 0 : (currentPage - 1) * entriesPerPage + 1;
  const endEntry = totalEntries === 0 ? 0 : Math.min(currentPage * entriesPerPage, totalEntries);

  const paginatedData = filteredData.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const formatAmount = (amount) => {
    if (amount === null || amount === undefined) return '-';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className='financial-year-container'>
      <div className='financial-year-header'>
        <h1>Manage Employee Wise Salary Heads</h1>
        <div className='breadcrumb'>Employee Wise Salary Head Management</div>
      </div>

      <div className='add-entry-section'>
        <Button variant='primary' onClick={handleAddSalaryHead} className='add-btn'>
          + Add Salary Head
        </Button>
      </div>

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
                placeholder='Search salary heads...'
                className='search-input'
              />
            </div>
          </Col>
        </Row>
      </div>

      <div className='table-container'>
        <Table className='financial-year-table'>
          <thead>
            <tr>
              <th>Sr No</th>
              <th>Employee Name</th>
              <th>Salary Head</th>
              <th>Amount</th>
              <th>Created Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan='7' className='text-center'>
                  <Spinner animation='border' size='sm' className='me-2' />
                  Loading...
                </td>
              </tr>
            ) : totalEntries === 0 ? (
              <tr>
                <td colSpan='7' className='text-center'>
                  No data found
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <tr key={item.id}>
                  <td>{startEntry + index}</td>
                  <td>{getEmployeeName(item.employeeId)}</td>
                  <td>{getSalaryHeadName(item.salaryHeadId)}</td>
                  <td>{formatAmount(item.amount)}</td>
                  <td>{formatDate(item.createdAt)}</td>
                  <td>
                    <span className={`status-badge ${item.isActive ? 'active' : 'inactive'}`}>
                      {item.isActive ? 'Active' : 'Inactive'}
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
                        Edit
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

      {/* Edit Salary Head Modal */}
      <Modal show={showEditModal} onHide={handleCancelEdit} size='lg' centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Salary Head Setup</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingItem && (
            <Formik
              enableReinitialize
              initialValues={{
                employeeId: editingItem.employeeId || '',
                salaryHeadId: editingItem.salaryHeadId || '',
                amount: editingItem.amount || '',
              }}
              validationSchema={EmployeeWiseSallaryHeadValidationSchema}
              onSubmit={handleEditSubmit}
            >
              {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                <Form id='editSalaryHeadForm' onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className='mb-3'>
                        <Form.Label>Employee *</Form.Label>
                        <Form.Select
                          name='employeeId'
                          value={values.employeeId}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.employeeId && !!errors.employeeId}
                          required
                        >
                          <option value=''>Select Employee</option>
                          {employeeData.map((emp) => (
                            <option key={emp.id} value={emp.id}>
                              {emp.partyName || emp.employeeName || emp.id}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type='invalid'>{errors.employeeId}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className='mb-3'>
                        <Form.Label>Salary Head *</Form.Label>
                        <Form.Select
                          name='salaryHeadId'
                          value={values.salaryHeadId}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.salaryHeadId && !!errors.salaryHeadId}
                          required
                        >
                          <option value=''>Select Salary Head</option>
                          {salaryHeadMasterData.map((sh) => (
                            <option key={sh.id} value={sh.id}>
                              {sh.salaryHeadName || sh.name || sh.id}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type='invalid'>{errors.salaryHeadId}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className='mb-3'>
                        <Form.Label>Amount *</Form.Label>
                        <Form.Control
                          type='number'
                          name='amount'
                          value={values.amount}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.amount && !!errors.amount}
                          placeholder='Enter amount'
                          step='0.01'
                          min='0.01'
                          required
                        />
                        <Form.Control.Feedback type='invalid'>{errors.amount}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              )}
            </Formik>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleCancelEdit} disabled={isUpdating}>
            Cancel
          </Button>
          <Button variant='primary' type='submit' form='editSalaryHeadForm' disabled={isUpdating}>
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Toaster autoClose={2000} position='top-right' theme='light' />
    </div>
  );
};

AdminEmployeeWiseSallaryHead.displayName = 'AdminEmployeeWiseSallaryHead';

export default AdminEmployeeWiseSallaryHead;