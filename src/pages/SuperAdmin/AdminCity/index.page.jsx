import React, { useEffect, useState, memo } from 'react';
import { Row, Col, Table, Button, Form, Modal } from 'react-bootstrap';
import { SuperAdminCountryServices } from '../../../services/SuperAdmin';
import './AdminMasters.css';
import { SweetAlert } from '../../../components/CommonElement/SweetAlert';

const AdminCity = memo(() => {
  const [countries, setCountries] = useState([]);
  const [allStates, setAllStates] = useState([]); // Store all states
  const [allCities, setAllCities] = useState([]); // Store all cities
  const [selectedCountryId, setSelectedCountryId] = useState('');
  const [selectedStateId, setSelectedStateId] = useState('');
  const [cityName, setCityName] = useState('');
  const [cityCode, setCityCode] = useState('');
  const [cityDescription, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCity, setEditCity] = useState(null);
  const [editCityName, setEditCityName] = useState('');
  const [editCityCode, setEditCityCode] = useState('');
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

  const fetchAllCities = async () => {
    setLoadingCities(true);
    try {
      const response = await SuperAdminCountryServices.GetCity();
      const citiesData = response?.result?.data || [];
      setAllCities(citiesData);
    } catch (error) {
      console.error('Error loading cities:', error);
      setAllCities([]);
    }
    setLoadingCities(false);
  };

  useEffect(() => {
    fetchCountries();
    fetchAllStates(); // Load all states on initial render
    fetchAllCities(); // Load all cities on initial render
  }, []);

  // Handle country selection
  const handleCountryChange = (e) => {
    const countryId = e.target.value;
    setSelectedCountryId(countryId);
    setSelectedStateId(''); // Reset state selection
    setCityName('');
    setCityCode('');
    setDescription('');
  };

  // Handle state selection
  const handleStateChange = (e) => {
    const stateId = e.target.value;
    setSelectedStateId(stateId);
    setCityName('');
    setCityCode('');
    setDescription('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cityName.trim() || !selectedCountryId || !selectedStateId) return;
    try {
      const payload = {
        cityName: cityName.trim(),
        cityCode: cityCode.trim(),
        cityDescription: cityDescription.trim(),
        countryId: selectedCountryId,
        stateId: selectedStateId,
        createdBy: selectedCountryId,
      }
      const response = await SuperAdminCountryServices.addCity(payload);
      setCityName('');
      setCityCode('');
      setDescription('');
      setSelectedCountryId('');
      setSelectedStateId('');
      fetchAllCities(); 
    } catch (error) {
      console.error('Error adding city:', error);
    }
  };

  // Open edit modal
  const handleEdit = (city) => {
    setEditCity(city);
    setEditCityName(city.cityName || city.particular || '');
    setEditCityCode(city.cityCode || '');
    setEditDescription(city.cityDescription || '');
    setShowEditModal(true);
  };

  // Save edit
  const handleSaveEdit = async () => {
    if (!editCityName.trim() || !editCity) return;
    setEditLoading(true);
    try {
      const payload = {
        id: editCity.id,
        cityName: editCityName.trim(),
        cityCode: editCityCode.trim(),
        cityDescription: editDescription.trim(),
        updatedBy: 'ADMIN',
        countryId: editCity.countryId,
        stateId: editCity.stateId
      };
      const response = await SuperAdminCountryServices.updateCity(payload);
      setShowEditModal(false);
      setEditCity(null);
      setEditCityName('');
      setEditCityCode('');
      setEditDescription('');
      fetchAllCities(); // Refresh all cities after editing
    } catch (error) {
      console.error('Error updating city:', error);
    }
    setEditLoading(false);
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditCity(null);
    setEditCityName('');
    setEditCityCode('');
    setEditDescription('');
  };

  // Delete city
  const handleDelete = async (city) => {
    const confirmed = await SweetAlert.confirm({
      title: 'Are you sure?',
      text: 'You want to delete this city?',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    });
    if (!confirmed) return;
    setDeleteLoadingId(city.id);
    try {
      const payload = {
        id: city.id,
        deletedBy: 'ADMIN',
      }
      console.log(": payload", payload);
      const response = await SuperAdminCountryServices.deleteCity(payload);
      fetchAllCities(); // Refresh all cities after deleting
    } catch (error) {
      console.error('Error deleting city:', error);
    }
    setDeleteLoadingId(null);
  };

  return (
    <div className='masters-container'>
      <div className='masters-header'>
        <h1>City Master</h1>
      </div>

      {/* Add City */}
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
            
            {/* State Select */}
            <Col md={6}>
              <Form.Label className='form-label'>State *</Form.Label>
              <div style={{ position: "relative" }}>
                <Form.Select
                  value={selectedStateId}
                  onChange={handleStateChange}
                  disabled={loadingStates || !selectedCountryId}
                  style={loadingStates ? { backgroundColor: "#f5f5f5" } : {}}
                  className={selectedStateId ? 'no-border' : ''}
                >
                  <option value="">Select State</option>
                  {loadingStates ? (
                    <option disabled>Loading...</option>
                  ) : (
                    allStates
                      .filter(state => !selectedCountryId || state.countryId === selectedCountryId)
                      .map((state) => (
                        <option key={state.id} value={state.id}>
                          {state.stateName || state.particular}
                        </option>
                      ))
                  )}
                </Form.Select>
                {loadingStates && (
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
          </Row>

          <Row className='align-items-end mt-3'>
            {/* City Name */}
            <Col md={6}>
              <Form.Label className='form-label'>City Name *</Form.Label>
              <Form.Control
                type='text'
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                placeholder='Enter city name'
                className={`form-input${selectedStateId ? ' no-border' : ''}`}
                disabled={!selectedStateId}
              />
            </Col>
            
            {/* City Code */}
            <Col md={6}>
              <Form.Label className='form-label'>City Code</Form.Label>
              <Form.Control
                type='text'
                value={cityCode}
                onChange={(e) => setCityCode(e.target.value)}
                placeholder='Enter city code'
                className={`form-input${selectedStateId ? ' no-border' : ''}`}
                disabled={!selectedStateId}
              />
            </Col>
          </Row>

          <Row className='align-items-end mt-3'>
            {/* Description */}
            <Col md={6}>
              <Form.Label className='form-label'>Description</Form.Label>
              <Form.Control
                type='text'
                value={cityDescription}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Enter description'
                className={`form-input${selectedStateId ? ' no-border' : ''}`}
                disabled={!selectedStateId}
              />
            </Col>
          </Row>

          <Row className='mt-3'>
            <Col className='text-center'>
              <Button
                type='submit'
                className='submit-btn me-2'
                disabled={!cityName.trim() || !selectedCountryId || !selectedStateId || loading}
              >
                Submit →
              </Button>
              <Button
                type='button'
                variant='secondary'
                className='reset-btn'
                onClick={() => {
                  setCityName('');
                  setCityCode('');
                  setDescription('');
                  setSelectedCountryId('');
                  setSelectedStateId('');
                }}
                disabled={(!cityName.trim() && !cityCode.trim() && !cityDescription.trim() && !selectedCountryId && !selectedStateId) || loading}
              >
                Reset
              </Button>
            </Col>
          </Row>
        </Form>
      </div>

      {/* City List Table */}
      <div className='table-container'>
        <Table className='masters-table'>
          <thead>
            <tr>
              <th>Sr No</th>
              {/* <th>Country</th>
              <th>State</th> */}
              <th>City Name</th>
              <th>City Code</th>
              <th>Description</th>
              <th>Date</th>
              <th className='text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allCities.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center">
                  {loadingCities ? 'Loading...' : 'No cities found.'}
                </td>
              </tr>
            ) : (
              allCities.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td>{idx + 1}</td>
                  {/* <td>{countries.find(c => c.id === item.countryId)?.countryName || '-'}</td>
                  <td>{allStates.find(s => s.id === item.stateId)?.stateName || allStates.find(s => s.id === item.stateId)?.particular || '-'}</td> */}
                  <td>{item.cityName || item.particular}</td>
                  <td>{item.cityCode || '-'}</td>
                  <td>{item.cityDescription || '-'}</td>
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
          <Modal.Title>Edit City</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className='mb-3'>
              <Form.Label>City Name *</Form.Label>
              <Form.Control
                type='text'
                value={editCityName}
                onChange={(e) => setEditCityName(e.target.value)}
                placeholder='Enter city name'
                disabled={editLoading}
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>City Code</Form.Label>
              <Form.Control
                type='text'
                value={editCityCode}
                onChange={(e) => setEditCityCode(e.target.value)}
                placeholder='Enter city code'
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
            disabled={editLoading || !editCityName.trim()}
          >
            {editLoading ? 'Saving...' : 'Save'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
});

AdminCity.displayName = 'AdminCity';

export default AdminCity