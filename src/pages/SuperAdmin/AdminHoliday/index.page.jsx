import React, { useEffect, useState, memo } from 'react';
import { Row, Col, Table, Button, Form, Modal } from 'react-bootstrap';
import { SuperAdminHolidayServices } from '../../../services/SuperAdmin';
import './AdminHoliday.css';
import { SweetAlert } from '../../../components/CommonElement/SweetAlert';

const STATIC_USER = 'Admin';

const AdminHoliday = memo(() => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);

  // Add form
  const [name, setName] = useState('');
  const [holidayType, setHolidayType] = useState('');
  const [holidayDate, setHolidayDate] = useState('');

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editName, setEditName] = useState('');
  const [editHolidayType, setEditHolidayType] = useState('');
  const [editHolidayDate, setEditHolidayDate] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  // Delete loading
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  const fetchHolidays = async () => {
    setLoading(true);
    try {
      const res = await SuperAdminHolidayServices.getHolidays({
        queryParams: { PageNumber: 1, PageSize: 1000, SearchTerm: '' },
      });
      const list = res?.result?.data || res?.data || [];
      setHolidays(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Error fetching holidays:', error);
      setHolidays([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  // Add holiday
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !holidayType || !holidayDate) return;
    try {
      const payload = {
        createdBy: STATIC_USER,
        name: name.trim(),
        holidayType: holidayType,
        holidayDate: holidayDate,
      };
      await SuperAdminHolidayServices.addHoliday(payload);
      setName('');
      setHolidayType('');
      setHolidayDate('');
      fetchHolidays();
    } catch (error) {
      console.error('Error adding holiday:', error);
    }
  };

  // Open edit modal
  const handleEdit = (item) => {
    setEditItem(item);
    setEditName(item.name || '');
    setEditHolidayType(item.holidayType || '');
    // Normalize to yyyy-mm-dd if API returns ISO string
    const d = item.holidayDate ? new Date(item.holidayDate) : null;
    const ymd = d ? new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0] : '';
    setEditHolidayDate(ymd);
    setShowEditModal(true);
  };

  // Save edit
  const handleSaveEdit = async () => {
    if (!editItem || !editName.trim() || !editHolidayType || !editHolidayDate) return;
    setEditLoading(true);
    try {
      const payload = {
        id: editItem.id,
        updatedBy: STATIC_USER,
        name: editName.trim(),
        holidayType: editHolidayType,
        holidayDate: editHolidayDate,
      };
      await SuperAdminHolidayServices.updateHoliday(payload);
      setShowEditModal(false);
      setEditItem(null);
      setEditName('');
      setEditHolidayType('');
      setEditHolidayDate('');
      fetchHolidays();
    } catch (error) {
      console.error('Error updating holiday:', error);
    }
    setEditLoading(false);
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditItem(null);
    setEditName('');
    setEditHolidayType('');
    setEditHolidayDate('');
  };

  // Delete holiday
  const handleDelete = async (item) => {
    const confirmed = await SweetAlert.confirm({
      title: 'Are you sure?',
      text: 'You want to delete this holiday?',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    });
    if (!confirmed) return;
    setDeleteLoadingId(item.id);
    try {
      const payload = {
        id: item.id,
        deletedBy: STATIC_USER,
      };
      await SuperAdminHolidayServices.deleteHoliday(payload);
      fetchHolidays();
    } catch (error) {
      console.error('Error deleting holiday:', error);
    }
    setDeleteLoadingId(null);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return isNaN(d) ? '-' : d.toLocaleDateString();
  };

  return (
    <div className='masters-container'>
      <div className='masters-header'>
        <h1>Holiday Master</h1>
      </div>

      {/* Add Holiday */}
      <div className='add-entry-section'>
        <Form onSubmit={handleSubmit}>
          <Row className='align-items-end'>
            <Col md={4}>
              <Form.Label className='form-label'>Name</Form.Label>
              <Form.Control
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Enter holiday name'
                className='form-input'
              />
            </Col>
            <Col md={3}>
              <Form.Label className='form-label'>Holiday Type</Form.Label>
              <Form.Control
                type='text'
                value={holidayType}
                onChange={(e) => setHolidayType(e.target.value)}
                placeholder='Enter holiday type'
                className='form-input'
              />
            </Col>
            <Col md={3}>
              <Form.Label className='form-label'>Holiday Date</Form.Label>
              <Form.Control
                type='date'
                value={holidayDate}
                onChange={(e) => setHolidayDate(e.target.value)}
                className='form-input'
              />
            </Col>
            <Col md={2}>
              <Button
                type='submit'
                className='submit-btn'
                disabled={!name.trim() || !holidayType || !holidayDate || loading}
              >
                Submit →
              </Button>
              <Button
                type='button'
                variant='secondary'
                className='reset-btn ms-2'
                onClick={() => {
                  setName('');
                  setHolidayType('');
                  setHolidayDate('');
                }}
                disabled={loading}
              >
                Reset
              </Button>
            </Col>
          </Row>
        </Form>
      </div>

      {/* Holiday List Table */}
      <div className='table-container'>
        <Table className='masters-table'>
          <thead>
            <tr>
              <th>Sr No</th>
              <th>Name</th>
              <th>Holiday Type</th>
              <th>Holiday Date</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {holidays.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center">
                  {loading ? 'Loading...' : 'No holidays found.'}
                </td>
              </tr>
            ) : (
              holidays.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td>{idx + 1}</td>
                  <td>{item.name || '-'}</td>
                  <td>{item.holidayType || '-'}</td>
                  <td>{formatDate(item.holidayDate)}</td>
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
                      {deleteLoadingId === item.id ? 'Deleting...' : 'Delete'}
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
          <Modal.Title>Edit Holiday</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className='mb-3'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='text'
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder='Enter holiday name'
                disabled={editLoading}
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Holiday Type</Form.Label>
              <Form.Control
                type='text'
                value={editHolidayType}
                onChange={(e) => setEditHolidayType(e.target.value)}
                placeholder='Enter holiday type'
                disabled={editLoading}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Holiday Date</Form.Label>
              <Form.Control
                type='date'
                value={editHolidayDate}
                onChange={(e) => setEditHolidayDate(e.target.value)}
                disabled={editLoading}
              />
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
            disabled={editLoading || !editName.trim() || !editHolidayType || !editHolidayDate}
          >
            {editLoading ? 'Saving...' : 'Save'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
});

AdminHoliday.displayName = 'AdminHoliday';

export default AdminHoliday;