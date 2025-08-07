import React, { useEffect, useState, memo } from 'react';
import { Row, Col, Table, Button, Form, Modal } from 'react-bootstrap';
import { SuperAdminCountryServices } from '../../../services/SuperAdmin';
import './AdminMasters.css';
import { SweetAlert } from '../../../components/CommonElement/SweetAlert';

const AdminState = memo(() => {
  const [countries, setCountries] = useState([]);
  const [allStates, setAllStates] = useState([]); // Store all states
  const [selectedCountryId, setSelectedCountryId] = useState('');
  const [stateName, setStateName] = useState('');
  const [stateCode, setStateCode] = useState('');
  const [stateDescription, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editState, setEditState] = useState(null);
  const [editStateName, setEditStateName] = useState('');
  const [editStateCode, setEditStateCode] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  // Delete loading state
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  // Fetch country list
  const fetchCountries = async () => {
    setLoadingCountries(true);
    try {
      const res = await SuperAdminCountryServices.getCountries();
      setCountries(res?.result?.data || []);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
    setLoadingCountries(false);
  };

  const fetchAllStates = async () => {
    setLoadingStates(true);
    try {
      const response = await SuperAdminCountryServices.GetStates();
      const statesData = response?.result?.data || [];
      setAllStates(statesData);
    } catch (error) {
      console.error('Error loading states:', error);
      setAllStates([]);
    }
    setLoadingStates(false);
  };

  useEffect(() => {
    fetchCountries();
    fetchAllStates(); // Load all states on initial render
  }, []);

  // Handle country selection - only for adding new states
  const handleCountryChange = (e) => {
    const countryId = e.target.value;
    setSelectedCountryId(countryId);
    setStateName('');
    setStateCode('');
    setDescription('');
    // Don't fetch states by country - keep showing all states
  };

  // Add state
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stateName.trim() || !selectedCountryId) return;
    try {
      const payload = {
        stateName: stateName.trim(),
        stateCode: stateCode.trim(),
        stateDescription: stateDescription.trim(),
        countryId: selectedCountryId,
        createdBy: selectedCountryId,
      }
      const response = await SuperAdminCountryServices.addState(payload);
      (": response", response);
      setStateName('');
      setStateCode('');
      setDescription('');
      setSelectedCountryId(''); // Add this line to reset country selection
      fetchAllStates(); // Refresh all states after adding
    } catch (error) {
      console.error('Error adding state:', error);
    }
  };

  // Open edit modal
  const handleEdit = (state) => {
    setEditState(state);
    setEditStateName(state.stateName || state.particular || '');
    setEditStateCode(state.stateCode || '');
    setEditDescription(state.stateDescription || '');
    setShowEditModal(true);
  };

  // Save edit
  const handleSaveEdit = async () => {
    if (!editStateName.trim() || !editState) return;
    setEditLoading(true);
    try {
      const payload = {
        id: editState.id,
        stateName: editStateName.trim(),
        stateCode: editStateCode.trim(),
        stateDescription: editDescription.trim(),
        updatedBy: editState.id,
        countryId: editState.countryId
      };
      const response = await SuperAdminCountryServices.updateState(payload);
      setShowEditModal(false);
      setEditState(null);
      setEditStateName('');
      setEditStateCode('');
      setEditDescription('');
      fetchAllStates(); // Refresh all states after editing
    } catch (error) {
      console.error('Error updating state:', error);
    }
    setEditLoading(false);
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditState(null);
    setEditStateName('');
    setEditStateCode('');
    setEditDescription('');
  };

  // Delete state
  const handleDelete = async (state) => {
    const confirmed = await SweetAlert.confirm({
      title: 'Are you sure?',
      text: 'You want to delete this state?',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    });
    if (!confirmed) return;
    setDeleteLoadingId(state.id);
    try {
      const payload = {
        id: state.id,
        deletedBy: state.id,
      }
      const response = await SuperAdminCountryServices.deleteState(payload);
      fetchAllStates(); // Refresh all states after deleting
    } catch (error) {
      console.error('Error deleting state:', error);
    }
    setDeleteLoadingId(null);
  };

  return (
    <div className='masters-container'>
      <div className='masters-header'>
        <h1>State Master</h1>
      </div>

      {/* Add State */}
      <div className='add-entry-section'>
        <Form onSubmit={handleSubmit}>
          <Row className='align-items-end'>
            {/* Country Select */}
            <Col md={6}>
              <Form.Label className='form-label'>Country *</Form.Label>
              <div style={{ position: "relative" }}>
                <Form.Select
                  value={selectedCountryId}
                  onChange={handleCountryChange}
                  disabled={loadingCountries}
                  style={loadingCountries ? { backgroundColor: "#f5f5f5" } : {}}
                  className={selectedCountryId ? 'no-border' : ''}
                >
                  <option value="">Select Country</option>
                  {loadingCountries ? (
                    <option disabled>Loading...</option>
                  ) : (
                    countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.countryName}
                      </option>
                    ))
                  )}
                </Form.Select>
                {loadingCountries && (
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "10px",
                      transform: "translateY(-50%)",
                      zIndex: 2,
                    }}
                  >
                    <span className="spinner-border spinner-border-sm text-primary" />
                  </div>
                )}
              </div>
            </Col>
            
            {/* State Name */}
            <Col md={6}>
              <Form.Label className='form-label'>State Name *</Form.Label>
              <Form.Control
                type='text'
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                placeholder='Enter state name'
                className={`form-input${selectedCountryId ? ' no-border' : ''}`}
                disabled={!selectedCountryId}
              />
            </Col>
          </Row>

          <Row className='align-items-end mt-3'>
            {/* State Code */}
            <Col md={6}>
              <Form.Label className='form-label'>State Code</Form.Label>
              <Form.Control
                type='text'
                value={stateCode}
                onChange={(e) => setStateCode(e.target.value)}
                placeholder='Enter state code'
                className={`form-input${selectedCountryId ? ' no-border' : ''}`}
                disabled={!selectedCountryId}
              />
            </Col>
            
            {/* Description */}
            <Col md={6}>
              <Form.Label className='form-label'>Description</Form.Label>
              <Form.Control
                type='text'
                value={stateDescription}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Enter description'
                className={`form-input${selectedCountryId ? ' no-border' : ''}`}
                disabled={!selectedCountryId}
              />
            </Col>
          </Row>

          <Row className='mt-3'>
            <Col className='text-center'>
              <Button
                type='submit'
                className='submit-btn me-2'
                disabled={!stateName.trim() || !selectedCountryId || loading}
              >
                Submit →
              </Button>
              <Button
                type='button'
                variant='secondary'
                className='reset-btn'
                onClick={() => {
                  setStateName('');
                  setStateCode('');
                  setDescription('');
                  setSelectedCountryId('');
                  // Don't change the states display
                }}
                disabled={(!stateName.trim() && !stateCode.trim() && !stateDescription.trim() && !selectedCountryId) || loading}
              >
                Reset
              </Button>
            </Col>
          </Row>
        </Form>
      </div>

      {/* State List Table */}
      <div className='table-container'>
        <Table className='masters-table'>
          <thead>
            <tr>
              <th>Sr No</th>
              <th>Country</th>
              <th>State Name</th>
              <th>State Code</th>
              <th>Description</th>
              <th>Date</th>
              <th className='text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allStates.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center">
                  {loadingStates ? 'Loading...' : 'No states found.'}
                </td>
              </tr>
            ) : (
              allStates.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td>{idx + 1}</td>
                  <td>{countries.find(c => c.id === item.countryId)?.countryName || '-'}</td>
                  <td>{item.stateName || item.particular}</td>
                  <td>{item.stateCode || '-'}</td>
                  <td>{item.stateDescription || '-'}</td>
                  <td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}</td>
                  <td className='text-center'>
                    <Button
                      variant='primary'
                      size='sm'
                      className='edit-btn me-1'
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </Button>
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
          <Modal.Title>Edit State</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className='mb-3'>
              <Form.Label>State Name *</Form.Label>
              <Form.Control
                type='text'
                value={editStateName}
                onChange={(e) => setEditStateName(e.target.value)}
                placeholder='Enter state name'
                disabled={editLoading}
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>State Code</Form.Label>
              <Form.Control
                type='text'
                value={editStateCode}
                onChange={(e) => setEditStateCode(e.target.value)}
                placeholder='Enter state code'
                disabled={editLoading}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type='text'
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder='Enter description'
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
            disabled={editLoading || !editStateName.trim()}
          >
            {editLoading ? 'Saving...' : 'Save'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
});

AdminState.displayName = 'AdminState';

export default AdminState