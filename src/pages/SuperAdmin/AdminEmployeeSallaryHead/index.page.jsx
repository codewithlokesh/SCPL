import React, { useEffect, useState } from 'react';
import { Row, Col, Table, Button, Form, Modal, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import './AdminSallaryHead.css';
import { SuperAdminEmployeeWiseSallaryHeadServices, SuperAdminEmployeeServices, SuperAdminSallaryHeadServices } from '../../../services/SuperAdmin';
import { SweetAlert } from '../../../components/CommonElement/SweetAlert';
import { Toaster } from '../../../components/CommonElement/Toaster';
import { toast } from 'react-toastify';
import superAdminRouteMap from '../../../routes/SuperAdmin/superAdminRouteMap';
import EmployeeWiseSallaryHeadValidationSchema from './validation';
const STATIC_USER_ID = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

const AdminSallaryHead = () => {
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

  const fetchSalaryHeadMasterData = async () => {
    try {
      const res = await SuperAdminSallaryHeadServices.getSallaryHeads();
      if (res && Array.isArray(res?.data)) {
        setSalaryHeadMasterData(res.data);
        setSalaryHeadData(res.data);
      } else {
        setSalaryHeadData([]);
      }
    } catch (error) {
      console.error('Error fetching salary head master data:', error);
        setSalaryHeadData([]);
      }
  };

  useEffect(() => {
    // fetchSalaryHeadData();
    // fetchEmployeeData();
    fetchSalaryHeadMasterData();
  }, []);

  const handleAddSalaryHead = async (values, { resetForm, setSubmitting }) => {
    setSubmitting(true);
    try {
      const payload = {
        salaryHeadName: values.salaryHeadName,
        transactionType: values.transactionType,
        baseAmount: 0,
        createdBy: STATIC_USER_ID,
      };

      const res = await SuperAdminSallaryHeadServices.addSallaryHead(payload);
      if (res?.status === 200) {
        await fetchSalaryHeadMasterData();
        toast.success('Salary head created successfully');
        resetForm();
      } else {
        toast.error(res?.message || 'Failed to create salary head');
      }
    } catch (error) {
      console.error('Error creating salary head:', error);
      toast.error('Failed to create salary head');
    } finally {
      setSubmitting(false);
    }
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
        salaryHeadName: values.salaryHeadName,
        transactionType: values.transactionType,
        baseAmount: 0,
        updatedBy: STATIC_USER_ID,
      };

      const res = await SuperAdminSallaryHeadServices.updateSallaryHead(payload);
      if (res?.message === "Record updated successfully." || res?.status === 'success') {
        toast.success('Salary head updated successfully');
        setShowEditModal(false);
        setEditingItem(null);
        resetForm();
        await fetchSalaryHeadData();
      } else {
        toast.error(res?.message || 'Failed to update salary head');
      }
    } catch (error) {
      console.error('Error updating salary head:', error);
      toast.error('Failed to update salary head');
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
      text: 'You want to delete this salary head?',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    });
    
    if (confirmed) {
      try {
        const payload = {
          id,
          deletedBy: STATIC_USER_ID,
        };
        const res = await SuperAdminSallaryHeadServices.deleteSallaryHead(payload);
        if (res?.message === "Record deleted successfully.") {
          await fetchSalaryHeadData();
          toast.success('Salary head deleted successfully');
        } else {
          toast.error(res?.message || 'Failed to delete salary head');
        }
      } catch (error) {
        console.error('Error deleting salary head:', error);
        toast.error('Failed to delete salary head');
      }
    }
  };

  const filteredData = salaryHeadData.filter((item) => {
    const q = searchTerm.toLowerCase();
    return (
      item.salaryHeadName?.toLowerCase().includes(q) ||
      item.transactionType?.toLowerCase().includes(q) ||
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    });
  };

  return (
    <div className='financial-year-container'>
      <div className='financial-year-header'>
        <h1>Salary Head</h1>
        <div className='breadcrumb'>Salary Head / Salary Head</div>
      </div>

      {/* Salary Head Form Section */}
      <div className='salary-head-form-section'>
        <h3>Salary Head</h3>
        <Formik
          initialValues={{
            transactionType: '',
            salaryHeadName: '',
          }}
          validationSchema={EmployeeWiseSallaryHeadValidationSchema}
          onSubmit={handleAddSalaryHead}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className='mb-3'>
                    <Form.Label>Select Salary Head Type *</Form.Label>
                    <Form.Select
                      name='transactionType'
                      value={values.transactionType}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.transactionType && !!errors.transactionType}
                      required
                    >
                      <option value=''>Select</option>
                      <option value='Credit'>Credit</option>
                      <option value='Debit'>Debit</option>
                    </Form.Select>
                    <Form.Control.Feedback type='invalid'>{errors.transactionType}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className='mb-3'>
                    <Form.Label>Enter Group Head Name *</Form.Label>
                    <Form.Control
                      type='text'
                      name='salaryHeadName'
                      value={values.salaryHeadName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.salaryHeadName && !!errors.salaryHeadName}
                      placeholder='e.g., HRA, TA, DA'
                      required
                    />
                    <Form.Control.Feedback type='invalid'>{errors.salaryHeadName}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <div className='form-buttons'>
                    <Button 
                      variant='primary' 
                      type='submit' 
                      disabled={isSubmitting}
                      className='submit-btn me-2'
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit'}
                    </Button>
                    <Button 
                      variant='warning' 
                      type='button' 
                      onClick={() => window.location.reload()}
                      className='cancel-btn'
                    >
                      Cancel
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </div>

      {/* Salary Head Records Table */}
      <div className='salary-head-records-section mt-3'>
        <h5>Salary Head Records</h5>
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
                <th>#</th>
                <th>Date</th>
                <th>Salary Head Type</th>
                <th>Salary Head</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan='5' className='text-center'>
                    <Spinner animation='border' size='sm' className='me-2' />
                    Loading...
                  </td>
                </tr>
              ) : totalEntries === 0 ? (
                <tr>
                  <td colSpan='5' className='text-center'>
                    No data found
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr key={item.id}>
                    <td>{startEntry + index}</td>
                    <td>{formatDate(item.createdAt)}</td>
                    <td>{item.transactionType}</td>
                    <td>{item.salaryHeadName}</td>
                    <td>
                      <div className='action-buttons'>
                        <Button
                          variant='success'
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
      </div>

      {/* Edit Salary Head Modal */}
      <Modal show={showEditModal} onHide={handleCancelEdit} size='lg' centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Salary Head</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingItem && (
            <Formik
              enableReinitialize
              initialValues={{
                transactionType: editingItem.transactionType || '',
                salaryHeadName: editingItem.salaryHeadName || '',
              }}
              validationSchema={EmployeeWiseSallaryHeadValidationSchema}
              onSubmit={handleEditSubmit}
            >
              {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                <Form id='editSalaryHeadForm' onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className='mb-3'>
                        <Form.Label>Salary Head Type *</Form.Label>
                        <Form.Select
                          name='transactionType'
                          value={values.transactionType}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.transactionType && !!errors.transactionType}
                          required
                        >
                          <option value=''>Select</option>
                          <option value='Credit'>Credit</option>
                          <option value='Debit'>Debit</option>
                        </Form.Select>
                        <Form.Control.Feedback type='invalid'>{errors.transactionType}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className='mb-3'>
                        <Form.Label>Group Head Name *</Form.Label>
                        <Form.Control
                          type='text'
                          name='salaryHeadName'
                          value={values.salaryHeadName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.salaryHeadName && !!errors.salaryHeadName}
                          placeholder='e.g., HRA, TA, DA'
                          required
                        />
                        <Form.Control.Feedback type='invalid'>{errors.salaryHeadName}</Form.Control.Feedback>
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

AdminSallaryHead.displayName = 'AdminSallaryHead';

export default AdminSallaryHead;