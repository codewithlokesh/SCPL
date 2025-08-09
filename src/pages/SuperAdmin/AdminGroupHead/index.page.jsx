import React, { useEffect, useState } from 'react';
import { Row, Col, Table, Button, Form, Modal, Spinner } from 'react-bootstrap';
import { Formik } from 'formik';
import './AdminGroupHead.css';
import { SuperAdminAccountGroupHeadServices } from '../../../services/SuperAdmin/AccountGroupHead/index.service';
import GroupHeadValidationSchema from './validation';
import { SweetAlert } from '../../../components/CommonElement/SweetAlert';
import { Toaster } from '../../../components/CommonElement/Toaster';
import { toast } from 'react-toastify';

const STATIC_USER_ID = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

const AdminAccountGroupHead = () => {
  const [groupHeadData, setGroupHeadData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [accountMasterCategory, setAccountMasterCategory] = useState([]);
  const [loadingAccountMasterCategory, setLoadingAccountMasterCategory] = useState(false);

  const fetchAccountMasterCategory = async () => {
    setLoadingAccountMasterCategory(true);
    try {
      const res = await SuperAdminAccountGroupHeadServices.getAccountMasterCategory();
      const list = Array.isArray(res) ? res : [];
      setAccountMasterCategory(list);
    } catch (error) {
      console.error('Error fetching account master category:', error);
      setAccountMasterCategory([]);
    } finally {
      setLoadingAccountMasterCategory(false);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await SuperAdminAccountGroupHeadServices.getAccountGroupHeads();
      setGroupHeadData(Array.isArray(res?.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching account group heads:', error);
      setGroupHeadData([]);
      toast.error('Failed to load account group heads');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchAccountMasterCategory();
  }, []);

  const initialValues = {
    accountMasterCategory: '',
    accountGroupHeadName: '',
    accountGroupHeadCode: '',
    accountGroupHeadDescription: '',
  };

  const handleAddSubmit = async (values, { resetForm, setSubmitting }) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...values,
        createdBy: STATIC_USER_ID, // static id, not a form field
      };

      const res = await SuperAdminAccountGroupHeadServices.addAccountGroupHead(payload);
      if (res?.message == "Record added successfully.") {
        toast.success('Account group head added successfully');
        setShowAddModal(false);
        resetForm();
        await fetchData();
      } else {
        toast.error(res);
      }
    } catch (error) {
      console.error('Error creating account group head:', error);
      toast.error('Failed to create account group head');
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
      const payload = {
        id: editingItem.id,
        updatedBy: STATIC_USER_ID, // static id
        accountMasterCategory: values.accountMasterCategory,
        accountGroupHeadName: values.accountGroupHeadName,
        accountGroupHeadCode: values.accountGroupHeadCode,
        accountGroupHeadDescription: values.accountGroupHeadDescription,
      };

      const res = await SuperAdminAccountGroupHeadServices.updateAccountGroupHead(payload);
      if (res?.message == "Record added successfully.") {
        toast.success('Account group head updated successfully');
        setShowEditModal(false);
        setEditingItem(null);
        resetForm();
        await fetchData();
      } else {
        toast.error(res);
      }
    } catch (error) {
      console.error('Error updating account group head:', error);
      toast.error('Failed to update account group head');
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
      text: 'You want to delete this group head?',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    });
    if (!confirmed) return;
    if (confirmed) {
      try {
        const payload = {
          id,
          deletedBy: STATIC_USER_ID,
        };
        const res = await SuperAdminAccountGroupHeadServices.deleteAccountGroupHead(payload);
        if (res?.message == "Record deleted successfully.") {
          await fetchData();
          toast.success('Account group head deleted successfully');
        } else {
          toast.error(res);
        }
      } catch (error) {
        console.error('Error deleting account group head:', error);
        toast.error('Failed to delete account group head');
      }
    }
  };

  const filteredData = groupHeadData.filter((item) => {
    const q = searchTerm.toLowerCase();
    return (
      item.accountGroupHeadName?.toLowerCase().includes(q) ||
      item.accountGroupHeadCode?.toLowerCase().includes(q) ||
      item.accountMasterCategory?.toLowerCase().includes(q) ||
      item.accountGroupHeadDescription?.toLowerCase().includes(q)
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

  return (
    <div className='financial-year-container'>
      <div className='financial-year-header'>
        <h1>Manage Account Group Heads</h1>
        <div className='breadcrumb'>Account Group Head Management</div>
      </div>

      <div className='add-entry-section'>
        <Button variant='primary' onClick={() => setShowAddModal(true)} className='add-btn'>
          + Add New Group Head
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
                placeholder='Search group heads...'
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
              <th>Category</th>
              <th>Group Head Name</th>
              <th>Code</th>
              <th>Description</th>
              <th>Created Date</th>
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
                  <td>{item.accountMasterCategory}</td>
                  <td>{item.accountGroupHeadName}</td>
                  <td>{item.accountGroupHeadCode}</td>
                  <td>{item.accountGroupHeadDescription}</td>
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

      {/* Add Group Head Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size='lg' centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Group Head</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik initialValues={initialValues} validationSchema={GroupHeadValidationSchema} onSubmit={handleAddSubmit}>
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
              <Form id='addGroupHeadForm' onSubmit={handleSubmit}>
                <Row>
                <Col md={6}>
                      <Form.Label className='form-label'>Account Master Category *</Form.Label>
                      <div style={{ position: "relative" }}>
                        <Form.Select
                          name='accountMasterCategory'
                          value={values.accountMasterCategory}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={loadingAccountMasterCategory}
                          isInvalid={touched.accountMasterCategory && !!errors.accountMasterCategory}
                          className={values.accountMasterCategory ? 'no-border' : ''}
                        >
                          <option value=''>Select Account Master Category</option>
                          {loadingAccountMasterCategory ? (
                            <option disabled>Loading...</option>
                          ) : (
                            accountMasterCategory.map((cat) => (
                              <option key={cat.id || cat.dataValueField} value={cat.id || cat.dataValueField}>
                                {cat.accountMasterCategoryName || cat.dataTextField}
                              </option>
                            ))
                          )}
                        </Form.Select>
                        <Form.Control.Feedback type='invalid'>
                          {errors.accountMasterCategory}
                        </Form.Control.Feedback>
                        {loadingAccountMasterCategory && (
                          <div style={{ position: "absolute", top: "50%", right: "10px", transform: "translateY(-50%)", zIndex: 2 }}>
                            <span className="spinner-border spinner-border-sm text-primary" />
                          </div>
                        )}
                      </div>
                    </Col>
                  {/* <Col md={6}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Account Master Category *</Form.Label>
                      <Form.Control
                        type='text'
                        name='accountMasterCategory'
                        value={values.accountMasterCategory?.dataValueField}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.accountMasterCategory && !!errors.accountMasterCategory}
                        placeholder='e.g., Assets, Liabilities, Income, Expense'
                      />
                      <Form.Control.Feedback type='invalid'>{errors.accountMasterCategory}</Form.Control.Feedback>
                    </Form.Group>
                  </Col> */}
                  <Col md={6}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Group Head Name *</Form.Label>
                      <Form.Control
                        type='text'
                        name='accountGroupHeadName'
                        value={values.accountGroupHeadName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.accountGroupHeadName && !!errors.accountGroupHeadName}
                        placeholder='e.g., Current Assets'
                      />
                      <Form.Control.Feedback type='invalid'>{errors.accountGroupHeadName}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Group Head Code </Form.Label>
                      <Form.Control
                        type='text'
                        name='accountGroupHeadCode'
                        value={values.accountGroupHeadCode}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.accountGroupHeadCode && !!errors.accountGroupHeadCode}
                        placeholder='e.g., CA-01'
                      />
                      <Form.Control.Feedback type='invalid'>{errors.accountGroupHeadCode}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        // as='textarea'
                        // rows={3}
                        type='text'
                        name='accountGroupHeadDescription'
                        value={values.accountGroupHeadDescription}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={!!(touched.accountGroupHeadDescription && errors.accountGroupHeadDescription)}
                        placeholder='Enter group head description...'
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.accountGroupHeadDescription}
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
          <Button variant='primary' type='submit' form='addGroupHeadForm' disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Group Head'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Group Head Modal */}
      <Modal show={showEditModal} onHide={handleCancelEdit} size='lg' centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Group Head</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingItem && (
            <Formik
              enableReinitialize
              initialValues={{
                accountMasterCategory: editingItem.accountMasterCategoryId || editingItem.accountMasterCategory || '',
                accountGroupHeadName: editingItem.accountGroupHeadName || '',
                accountGroupHeadCode: editingItem.accountGroupHeadCode || '',
                accountGroupHeadDescription: editingItem.accountGroupHeadDescription || '',
              }}
              validationSchema={GroupHeadValidationSchema}
              onSubmit={handleEditSubmit}
            >
              {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                <Form id='editGroupHeadForm' onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className='mb-3'>
                        <Form.Label>Account Master Category *</Form.Label>
                        <Form.Select
                          name='accountMasterCategory'
                          value={values.accountMasterCategory}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={loadingAccountMasterCategory}
                          isInvalid={touched.accountMasterCategory && !!errors.accountMasterCategory}
                        >
                          <option value=''>Select Account Master Category</option>
                          {accountMasterCategory.map((cat) => (
                            <option key={cat.id || cat.dataValueField} value={cat.id || cat.dataValueField}>
                              {cat.accountMasterCategoryName || cat.dataTextField}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type='invalid'>{errors.accountMasterCategory}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className='mb-3'>
                        <Form.Label>Group Head Name *</Form.Label>
                        <Form.Control
                          type='text'
                          name='accountGroupHeadName'
                          value={values.accountGroupHeadName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.accountGroupHeadName && !!errors.accountGroupHeadName}
                          placeholder='e.g., Current Assets'
                        />
                        <Form.Control.Feedback type='invalid'>{errors.accountGroupHeadName}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className='mb-3'>
                        <Form.Label>Group Head Code *</Form.Label>
                        <Form.Control
                          type='text'
                          name='accountGroupHeadCode'
                          value={values.accountGroupHeadCode}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.accountGroupHeadCode && !!errors.accountGroupHeadCode}
                          placeholder='e.g., CA-01'
                        />
                        <Form.Control.Feedback type='invalid'>{errors.accountGroupHeadCode}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className='mb-3'>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          type='text'
                          name='accountGroupHeadDescription'
                          value={values.accountGroupHeadDescription}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={!!(touched.accountGroupHeadDescription && errors.accountGroupHeadDescription)}
                          placeholder='Enter group head description...'
                        />
                        <Form.Control.Feedback type='invalid'>{errors.accountGroupHeadDescription}</Form.Control.Feedback>
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
          <Button variant='primary' type='submit' form='editGroupHeadForm' disabled={isUpdating}>
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>
      <Toaster autoClose={2000} position='top-right' theme='light' />
    </div>
  );
};

AdminAccountGroupHead.displayName = 'AdminAccountGroupHead';

export default AdminAccountGroupHead;