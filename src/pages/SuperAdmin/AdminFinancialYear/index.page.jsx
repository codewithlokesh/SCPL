import React, { useEffect, useState } from 'react';
import { Row, Col, Table, Button, Form, Modal, Spinner } from 'react-bootstrap';
import { Formik } from 'formik';
import { useSearchParams } from 'react-router-dom';
import './AdminFinancialYear.css';
import { SuperAdminFinancialYearServices } from '../../../services/SuperAdmin/FinancialYear/index.service';
import FinancialYearValidationSchema from './validation';
import { SweetAlert } from '../../../components/CommonElement/SweetAlert';
import { Toaster } from '../../../components/CommonElement/Toaster';
import { toast } from 'react-toastify';

const AdminFinancialYear = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [financialYearData, setFinancialYearData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await SuperAdminFinancialYearServices.getFinancialYears();
      setFinancialYearData(Array.isArray(res?.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching financial year data:', error);
      setFinancialYearData([]);
      toast.error('Failed to load financial years');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const initialValues = {
    financialYearName: '',
    startDate: '',
    endDate: '',
    closedDate: '',
    financialYearDescription: '',
  };

  const handleAddSubmit = async (values, { resetForm, setSubmitting }) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...values,
        createdBy: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        startDate: new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
        closedDate: values.closedDate ? new Date(values.closedDate).toISOString() : '2025-08-09T05:39:28.523Z',
      };

      const res = await SuperAdminFinancialYearServices.addFinancialYear(payload);
      if(res == 'Record added successfully.'){
        toast.success('Financial Year added successfully');
        setShowAddModal(false);
        resetForm();
        await fetchData();
      }
      else{
        toast.error(res);
      }
    } catch (error) {
      console.error('Error creating financial year:', error);
      toast.error('Failed to create financial year');
    } finally {
      setIsSubmitting(false);
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
      const { createdBy, ...restValues } = values;

      const payload = {
        ...restValues,
        id: editingItem.id,
        startDate: new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
        closedDate: values.closedDate ? new Date(values.closedDate).toISOString() : "2025-08-09T05:39:28.523Z",
        updatedBy: editingItem.id
      };
      const res = await SuperAdminFinancialYearServices.updateFinancialYear(payload);
      if(res == 'Record updated successfully.'){
      toast.success('Financial Year updated successfully');
      setShowEditModal(false);
      setEditingItem(null);
      resetForm();
      await fetchData();
      }
      else{
        toast.error(res);
      }
    } catch (error) {
      console.error('Error updating financial year:', error);
      toast.error('Failed to update financial year');
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
      text: 'You want to delete this Year?',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    });
    if (!confirmed) return;
    if(confirmed){
      try {
        const payload = {
          id,
          deletedBy: id, 
        };
        await SuperAdminFinancialYearServices.deleteFinancialYear(payload);
        await fetchData();
        SweetAlert.success('Deleted!', 'Financial Year has been deleted.');
        toast.success('Financial Year deleted');
      } catch (error) {
        console.error('Error deleting financial year:', error);
        toast.error('Failed to delete financial year');
      }
    }
  };

  const filteredData = financialYearData.filter(item =>
    item.financialYearName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.financialYearDescription?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEntries = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / entriesPerPage));
  const startEntry = totalEntries === 0 ? 0 : (currentPage - 1) * entriesPerPage + 1;
  const endEntry = totalEntries === 0 ? 0 : Math.min(currentPage * entriesPerPage, totalEntries);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const openDatePicker = (e) => {
    // only left click
    if (e.button !== undefined && e.button !== 0) return;
    // prevent text selection and default focus drag
    e.preventDefault?.();
    const input = e.currentTarget;
    if (typeof input.showPicker === 'function') {
      input.showPicker();
    } else {
      input.focus();
    }
  };

  return (
    <div className='financial-year-container'>
      <div className='financial-year-header'>
        <h1>Manage Financial Years</h1>
        <div className='breadcrumb'>
          Financial Year Management
        </div>
      </div>

      {/* Add New Financial Year Button */}
      <div className='add-entry-section'>
        <Button
          variant='primary'
          onClick={() => setShowAddModal(true)}
          className='add-btn'
        >
          + Add New Financial Year
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
                placeholder='Search financial years...'
                className='search-input'
              />
            </div>
          </Col>
        </Row>
      </div>

      {/* Data Table */}
      <div className='table-container'>
        <Table className='financial-year-table'>
          <thead>
            <tr>
              <th>Sr No</th>
              <th>Financial Year Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Closed Date</th>
              <th>Description</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="8" className="text-center">
                  <Spinner animation="border" size="sm" className="me-2" />
                  Loading...
                </td>
              </tr>
            ) : totalEntries === 0 ? (
              <tr>
                <td colSpan="8" className="text-center">No data found</td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <tr key={item.id}>
                  <td>{startEntry + index}</td>
                  <td>{item.financialYearName}</td>
                  <td>{formatDate(item.startDate)}</td>
                  <td>{formatDate(item.endDate)}</td>
                  <td>{formatDate(item.closedDate)}</td>
                  <td>{item.financialYearDescription}</td>
                  <td>{formatDate(item.createdAt)}</td>
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

      {/* Table Summary and Pagination */}
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
              <Button
                variant='primary'
                size='sm'
                className='pagination-btn active'
              >
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

      {/* Add Financial Year Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Financial Year</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={initialValues}
            validationSchema={FinancialYearValidationSchema}
            onSubmit={handleAddSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
              <Form id="addFinancialYearForm" onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Financial Year Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="financialYearName"
                        value={values.financialYearName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.financialYearName && errors.financialYearName}
                        placeholder="e.g., FY 2024-25"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.financialYearName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Start Date *</Form.Label>
                      <Form.Control
                        type="date"
                        name="startDate"
                        value={values.startDate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.startDate && errors.startDate}
                        onMouseDown={openDatePicker}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.startDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>End Date *</Form.Label>
                      <Form.Control
                        type="date"
                        name="endDate"
                        value={values.endDate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.endDate && errors.endDate}
                        onMouseDown={openDatePicker}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.endDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Closed Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="closedDate"
                        value={values.closedDate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={!!(touched.closedDate && errors.closedDate)}
                        onMouseDown={openDatePicker}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.closedDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="financialYearDescription"
                        value={values.financialYearDescription}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={!!(touched.financialYearDescription && errors.financialYearDescription)}
                        placeholder="Enter financial year description..."
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.financialYearDescription}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='secondary'
            onClick={() => setShowAddModal(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant='primary'
            type="submit"
            form="addFinancialYearForm"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Financial Year'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Financial Year Modal */}
      <Modal show={showEditModal} onHide={handleCancelEdit} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Financial Year</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingItem && (
            <Formik
              initialValues={{
                financialYearName: editingItem.financialYearName || '',
                startDate: editingItem.startDate ? new Date(editingItem.startDate).toISOString().split('T')[0] : '',
                endDate: editingItem.endDate ? new Date(editingItem.endDate).toISOString().split('T')[0] : '',
                closedDate: editingItem.closedDate ? new Date(editingItem.closedDate).toISOString().split('T')[0] : '',
                financialYearDescription: editingItem.financialYearDescription || '',
                createdBy: editingItem.createdBy || editingItem.id,
              }}
              validationSchema={FinancialYearValidationSchema}
              onSubmit={handleEditSubmit}
            >
              {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                <Form id="editFinancialYearForm" onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Financial Year Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="financialYearName"
                          value={values.financialYearName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.financialYearName && errors.financialYearName}
                          placeholder="e.g., FY 2024-25"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.financialYearName}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Start Date *</Form.Label>
                        <Form.Control
                          type="date"
                          name="startDate"
                          value={values.startDate}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.startDate && errors.startDate}
                          onMouseDown={openDatePicker}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.startDate}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>End Date *</Form.Label>
                        <Form.Control
                          type="date"
                          name="endDate"
                          value={values.endDate}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.endDate && errors.endDate}
                          onMouseDown={openDatePicker}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.endDate}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Closed Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="closedDate"
                          value={values.closedDate}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={!!(touched.closedDate && errors.closedDate)}
                          onMouseDown={openDatePicker}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.closedDate}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="financialYearDescription"
                          value={values.financialYearDescription}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={!!(touched.financialYearDescription && errors.financialYearDescription)}
                          placeholder="Enter financial year description..."
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.financialYearDescription}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              )}
            </Formik>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='secondary'
            onClick={handleCancelEdit}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            variant='primary'
            type="submit"
            form="editFinancialYearForm"
            disabled={isUpdating}
          >
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>
      <Toaster autoClose={2000} position="top-right" theme="light" />
    </div>
  );
};

AdminFinancialYear.displayName = 'AdminFinancialYear';

export default AdminFinancialYear;