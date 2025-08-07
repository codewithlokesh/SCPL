import React, { useEffect, useState, memo } from 'react';
import { Row, Col, Table, Button, Form, Modal } from 'react-bootstrap';
import { SuperAdminCountryServices } from '../../../services/SuperAdmin';
import './AdminMasters.css';
import { SweetAlert } from '../../../components/CommonElement/SweetAlert';

const AdminCountry = memo(() => {
  const [countries, setCountries] = useState([]);
  const [countryName, setCountryName] = useState('');
  const [loading, setLoading] = useState(false);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCountry, setEditCountry] = useState(null);
  const [editCountryName, setEditCountryName] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  // Delete loading state
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  // Fetch country list
  const fetchCountries = async () => {
    setLoading(true);
    try {
      const res = await SuperAdminCountryServices.getCountries();
      setCountries(res?.result?.data || []);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  // Add country
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!countryName.trim()) return;
    try {
      const payload = {
        countryName: countryName.trim(),
        createdBy: '09602',
      }
      await SuperAdminCountryServices.addCountry(payload);
      setCountryName('');
      fetchCountries();
    } catch (error) {
      console.error('Error adding country:', error);
    }
  };

  // Open edit modal
  const handleEdit = (country) => {
    setEditCountry(country);
    setEditCountryName(country.countryName || country.particular || '');
    setShowEditModal(true);
  };

  // Save edit
  const handleSaveEdit = async () => {
    if (!editCountryName.trim() || !editCountry) return;
    setEditLoading(true);
    try {
      const payload = {
        id: editCountry.id,
        countryName: editCountryName.trim(),
        updatedBy: editCountry.id,
      };
      const response = await SuperAdminCountryServices.updateCountry(payload);
      setShowEditModal(false);
      setEditCountry(null);
      setEditCountryName('');
      fetchCountries();
    } catch (error) {
      console.error('Error updating country:', error);
    }
    setEditLoading(false);
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditCountry(null);
    setEditCountryName('');
  };

  // Delete country
  const handleDelete = async (country) => {
    const confirmed = await SweetAlert.confirm({
      title: 'Are you sure?',
      text: 'You want to delete this country?',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    });
    if (!confirmed) return;
    setDeleteLoadingId(country.id);
    try {
      const payload = {
        id: country.id,
        deletedBy: country.id,
      }
      const response = await SuperAdminCountryServices.deleteCountry(payload);
      console.log(": response", response);
      fetchCountries();
    } catch (error) {
      console.error('Error deleting country:', error);
    }
    setDeleteLoadingId(null);
  };

  return (
    <div className='masters-container'>
      <div className='masters-header'>
        <h1>Country Master</h1>
      </div>

      {/* Add Country */}
      <div className='add-entry-section'>
        <Form onSubmit={handleSubmit}>
          <Row className='align-items-end'>
            <Col md={4}>
              <Form.Label className='form-label'>Country Name</Form.Label>
              <Form.Control
                type='text'
                value={countryName}
                onChange={(e) => setCountryName(e.target.value)}
                placeholder='Enter country name'
                className='form-input'
              />
            </Col>
            <Col md={2}>
              <Button
                type='submit'
                className='submit-btn'
                disabled={!countryName.trim() || loading}
              >
                Submit →
              </Button>
            </Col>
            <Col md={2}>
              <Button
                type='button'
                variant='secondary'
                className='reset-btn'
                onClick={() => setCountryName('')}
                disabled={!countryName.trim() || loading}
              >
                Reset
              </Button>
            </Col>
          </Row>
        </Form>
      </div>

      {/* Country List Table */}
      <div className='table-container'>
        <Table className='masters-table'>
          <thead>
            <tr>
              <th>Sr No</th>
              <th>Country Name</th>
              <th>Date</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {countries.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center">
                  {loading ? 'Loading...' : 'No countries found.'}
                </td>
              </tr>
            ) : (
              countries.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td>{idx + 1}</td>
                  <td>{item.countryName || item.particular}</td>
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
          <Modal.Title>Edit Country</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Country Name</Form.Label>
              <Form.Control
                type='text'
                value={editCountryName}
                onChange={(e) => setEditCountryName(e.target.value)}
                placeholder='Enter country name'
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
            disabled={editLoading || !editCountryName.trim()}
          >
            {editLoading ? 'Saving...' : 'Save'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
});

AdminCountry.displayName = 'AdminCountry';

export default AdminCountry;