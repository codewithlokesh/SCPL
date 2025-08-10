import React, { useEffect, useState } from 'react';
import { Row, Col, Table, Button, Form, Modal, Spinner } from 'react-bootstrap';
import { SuperAdminRoleMastersServices } from '../../../services/SuperAdmin';
import './AdminRoleMaster.css';
import { SweetAlert } from '../../../components/CommonElement/SweetAlert';
import RoleMasterValidation from './validation.jsx';
import { toast } from 'react-toastify';

const AdminRoleMasters = () => {
  const [roles, setRoles] = useState([]);
  const [roleName, setRoleName] = useState('');
  const [description, setRoleDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editRole, setEditRole] = useState(null);
  const [editRoleName, setEditRoleName] = useState('');
  const [editRoleDescription, setEditRoleDescription] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  // Delete loading state
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  // Validation errors
  const [errors, setErrors] = useState({});

  // Fetch role list
  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await SuperAdminRoleMastersServices.getMasters();
      setRoles(res?.data?.data || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error('Failed to fetch roles. Please try again.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Validate form
  const validateForm = async () => {
    try {
      const formData = {
        roleName: roleName.trim(),
        description: description.trim(),
      };
      await RoleMasterValidation.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationError) {
      const newErrors = {};
      validationError.inner.forEach((error) => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  // Add role
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validateForm();
    if (!isValid) return;

    setSubmitLoading(true);
    try {
      const payload = {
        roleName: roleName.trim(),
        description: description.trim(),
        createdBy: 'acd31973-b6ba-42e2-a83b-40ddc56e854a', 
      };
      await SuperAdminRoleMastersServices.addRoleMasters(payload);
      setRoleName('');
      setRoleDescription('');
      setErrors({});
      fetchRoles();
      toast.success('Role created successfully!');
    } catch (error) {
      console.error('Error adding role:', error);
      toast.error('Failed to create role. Please try again.');
    }
    setSubmitLoading(false);
  };

  // Open edit modal
  const handleEdit = (role) => {
    setEditRole(role);
    setEditRoleName(role.roleName || '');
    setEditRoleDescription(role.description || '');
    setShowEditModal(true);
  };

  // Validate edit form
  const validateEditForm = async () => {
    try {
      const formData = {
        roleName: editRoleName.trim(),
        description: editRoleDescription.trim(),
      };
      await RoleMasterValidation.validate(formData, { abortEarly: false });
      return true;
    } catch (validationError) {
      const newErrors = {};
      validationError.inner.forEach((error) => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  // Save edit
  const handleSaveEdit = async () => {
    const isValid = await validateEditForm();
    if (!isValid || !editRole) return;

    setEditLoading(true);
    try {
      const payload = {
        id: editRole.id,
        roleName: editRoleName.trim(),
        description: editRoleDescription.trim(),
        updatedBy: 'acd31973-b6ba-42e2-a83b-40ddc56e854a', // This should come from user context
      };
      await SuperAdminRoleMastersServices.updateRoleMasters(payload);
      setShowEditModal(false);
      setEditRole(null);
      setEditRoleName('');
      setEditRoleDescription('');
      setErrors({});
      fetchRoles();
      toast.success('Role updated successfully!');
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update role. Please try again.');
    }
    setEditLoading(false);
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditRole(null);
    setEditRoleName('');
    setEditRoleDescription('');
    setErrors({});
  };

  // Delete role
  const handleDelete = async (role) => {
    const confirmed = await SweetAlert.confirm({
      title: 'Are you sure?',
      text: 'You want to delete this role?',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    });
    if (!confirmed) return;

    setDeleteLoadingId(role.id);
    try {
      const payload = {
        id: role.id,
        deletedBy: 'acd31973-b6ba-42e2-a83b-40ddc56e854a', // This should come from user context
      };
      await SuperAdminRoleMastersServices.deleteRoleMasters(payload);
      fetchRoles();
      toast.success('Role deleted successfully!');
    } catch (error) {
      console.error('Error deleting role:', error);
      toast.error('Failed to delete role. Please try again.');
    }
    setDeleteLoadingId(null);
  };

  // Reset form
  const handleReset = () => {
    setRoleName('');
    setRoleDescription('');
    setErrors({});
  };

  return (
    <div className='masters-container'>
      <div className='masters-header'>
        <h1>Role Master</h1>
      </div>

      {/* Add Role */}
      <div className='add-entry-section'>
        <Form onSubmit={handleSubmit}>
          <Row className='align-items-end'>
            <Col md={4}>
              <Form.Label className='form-label'>Role Name *</Form.Label>
              <Form.Control
                type='text'
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder='Enter role name'
                className={`form-input ${errors.roleName ? 'is-invalid' : ''}`}
                isInvalid={!!errors.roleName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.roleName}
              </Form.Control.Feedback>
            </Col>
            <Col md={4}>
              <Form.Label className='form-label'>Role Description</Form.Label>
              <Form.Control
                type='text'
                value={description}
                onChange={(e) => setRoleDescription(e.target.value)}
                placeholder='Enter role description'
                className={`form-input ${errors.description ? 'is-invalid' : ''}`}
                isInvalid={!!errors.description}
              />
              <Form.Control.Feedback type="invalid">
                {errors.description}
              </Form.Control.Feedback>
            </Col>
            <Col md={2}>
              <Button
                type='submit'
                className='submit-btn'
                disabled={!roleName.trim() || submitLoading}
              >
                {submitLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Submitting...
                  </>
                ) : (
                  'Submit →'
                )}
              </Button>
            </Col>
            <Col md={2}>
              <Button
                type='button'
                variant='secondary'
                className='reset-btn'
                onClick={handleReset}
                disabled={(!roleName.trim() && !description.trim()) || submitLoading}
              >
                Reset
              </Button>
            </Col>
          </Row>
        </Form>
      </div>

      {/* Role List Table */}
      <div className='table-container'>
        <Table className='masters-table'>
          <thead>
            <tr>
              <th>Sr No</th>
              <th>Role Name</th>
              <th>Role Description</th>
              <th>Date</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center">
                  <div className="d-flex justify-content-center align-items-center py-4">
                    <Spinner animation="border" role="status" className="me-2">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    Loading roles...
                  </div>
                </td>
              </tr>
            ) : roles.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center">
                  No roles found.
                </td>
              </tr>
            ) : (
              roles?.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td>{idx + 1}</td>
                  <td>{item.roleName}</td>
                  <td>{item.description || '-'}</td>
                  <td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}</td>
                  <td>
                    <Button
                      variant='primary'
                      size='sm'
                      className='edit-btn'
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant='danger'
                      size='sm'
                      className='delete-btn'
                      onClick={() => handleDelete(item)}
                      disabled={deleteLoadingId === item.id}
                    >
                      {deleteLoadingId === item.id ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-1"
                          />
                          Deleting...
                        </>
                      ) : (
                        'Delete'
                      )}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={handleCancelEdit} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Role Name *</Form.Label>
              <Form.Control
                type='text'
                value={editRoleName}
                onChange={(e) => setEditRoleName(e.target.value)}
                placeholder='Enter role name'
                disabled={editLoading}
                className={errors.roleName ? 'is-invalid' : ''}
                isInvalid={!!errors.roleName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.roleName}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Role Description</Form.Label>
              <Form.Control
                type='text'
                value={editRoleDescription}
                onChange={(e) => setEditRoleDescription(e.target.value)}
                placeholder='Enter role description'
                disabled={editLoading}
                className={errors.description ? 'is-invalid' : ''}
                isInvalid={!!errors.description}
              />
              <Form.Control.Feedback type="invalid">
                {errors.description}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='secondary'
            onClick={handleCancelEdit}
            disabled={editLoading}
          >
            Cancel
          </Button>
          <Button
            variant='primary'
            onClick={handleSaveEdit}
            disabled={editLoading || !editRoleName.trim()}
          >
            {editLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Saving...
              </>
            ) : (
              'Save'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminRoleMasters;