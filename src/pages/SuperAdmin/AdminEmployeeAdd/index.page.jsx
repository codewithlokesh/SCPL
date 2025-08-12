import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { SuperAdminMastersServices } from '../../../services/SuperAdmin';
import { SuperAdminCountryServices } from '../../../services/SuperAdmin/Country/index.service';
import logger from '../../../utils/logger';
import FileUpload from '../../../components/CommonElement/FileUpload';
import { uploadFile, validateImageFile } from '../../../utils/fileUpload';
import validation from "./validation";
import './index.css';
import { SuperAdminAccountGroupHeadServices } from '../../../services/SuperAdmin/AccountGroupHead/index.service';
import { SuperAdminEmployeeServices } from '../../../services/SuperAdmin'; // Fix: Import the correct service
import { toast } from 'react-toastify';

const AdminEmployeeAdd = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [groupHeads, setGroupHeads] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Add this state
  const [employeeData, setEmployeeData] = useState([]);

  const initialValues = {
    // Mandatory fields
    createdBy: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    partyName: '',
    partyLogo: 'https://example.com/default-employee-photo.jpg', // Static URL instead of file upload
    openingBalance: '',
    openingBalanceType: '',
    companyId: '',
    accountGroupHeadId: '',
    isTDSApplicable: false,
    gender: '',
    salary: '',
    
    // Optional fields
    addressLine1: '',
    addressLine2: '',
    cityId: '',
    stateId: '',
    pincode: '',
    countryId: '',
    pan: '',
    tan: '',
    aadharNo: '',
    employeeMachineID: '550e8400-e29b-41d4-a716-446655440001', // Static GUID
    locationId: '550e8400-e29b-41d4-a716-446655440002', // Static GUID
    departmentId: '550e8400-e29b-41d4-a716-446655440003', // Static GUID
    designationId: '550e8400-e29b-41d4-a716-446655440004', // Static GUID
    divisionId: '550e8400-e29b-41d4-a716-446655440005', // Static GUID
    doj: '',
    doc: '',
    mobileNumberofficial: '',
    emailIdofficial: '',
    dob: '',
    mobileNumberPersonal: '',
    contactNumberPersonal: '',
    userId: '',
    userPassword: '',
    premissionId: '550e8400-e29b-41d4-a716-446655440006', // Static GUID
    emailIdPersonal: '',
    multipleCompanyId: '',
    tdsSection: '',
    tdsRate: '',
    
    // New hierarchy fields
    leaveRequestUpperManager: '',
    reportingLowerManager: '',
    reportingUpperManager: '',
  };

  // Load countries on component mount
  useEffect(() => {
    loadCountries();
  }, []);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await SuperAdminMastersServices.getCompanyMasterData();
        setCompanies(res.data || []);
      } catch (e) {
        // handle error
      }
    };
    const fetchGroupHeads = async () => {
      try {
        const res = await SuperAdminAccountGroupHeadServices.getAccountGroupHeads();
        setGroupHeads(res.data || []);
      } catch (e) {
        // handle error
      }
    };
    fetchCompanies();
    fetchGroupHeads();
    fetchEmployeeData();
  }, []);

  // Add this useEffect for handling clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.getElementById('companyDropdown');
      const formControl = event.target.closest('.form-control');
      
      if (dropdown && !formControl) {
        dropdown.classList.remove('show');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchEmployeeData = async () => {
    try {
      const res = await SuperAdminEmployeeServices.getEmployee();
      setEmployeeData(res?.data);
      if (res && Array.isArray(res?.data)) {
        setEmployeeData(res?.data);
      }
    } catch (error) {
      console.error("error:", error);
    }
  };
  const loadCountries = async () => {
    try {
      setLoadingCountries(true);
      const response = await SuperAdminCountryServices.getCountries();
      setCountries(response?.result?.data || []);
    } catch (error) {
      console.error('Error loading countries:', error);
      toast.error('Failed to load countries');
    } finally {
      setLoadingCountries(false);
    }
  };

  const loadStates = async (countryId) => {
    try {
      setLoadingStates(true);
      const response = await SuperAdminCountryServices.GetStatesByCountryId(countryId);
      setStates(response || []);
    } catch (error) {
      console.error('Error loading states:', error);
      setStates([]);
      toast.error('Failed to load states');
    } finally {
      setLoadingStates(false);
    }
  };

  const loadCities = async (countryId, stateId) => {
    try {
      setLoadingCities(true);
      const response = await SuperAdminCountryServices.GetCitiesByCountryIdandStateid(countryId, stateId);
      setCities(response?.data || []);
    } catch (error) {
      console.error('Error loading cities:', error);
      setCities([]);
      toast.error('Failed to load cities');
    } finally {
      setLoadingCities(false);
    }
  };

  const handleCompanySelection = (companyId, companyName, setFieldValue) => {
    setSelectedCompanies(prev => {
      const isSelected = prev.find(comp => comp.id === companyId);
      let newSelection;
      
      if (isSelected) {
        newSelection = prev.filter(comp => comp.id !== companyId);
      } else {
        newSelection = [...prev, { id: companyId, name: companyName }];
      }
      
      const companyIds = newSelection.map(comp => comp.id).join(',');
      setFieldValue('multipleCompanyId', companyIds);
      
      return newSelection;
    });
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Remove file upload logic and use static URL directly
      const payload = {
        ...values,
        partyLogo: values.partyLogo, 
        openingBalance: parseFloat(values.openingBalance) || 0,
        tdsRate: parseFloat(values.tdsRate) || 0,
        salary: parseFloat(values.salary) || 0
      };

      const response = await SuperAdminEmployeeServices.addEmployee(payload);
      if (response && (response.message == "Record added successfully.")) {
        toast.success('Employee created successfully!');
        resetForm();
        setStates([]);
        setCities([]);
        // Reset the selected companies state
        setSelectedCompanies([]);
      } else if (response && (response.result === false)) {
        setSubmitError(response?.message || 'Failed to create employee');
        toast.error(response?.message || 'Failed to create employee');
      } else {
        setSubmitError(response?.message || 'Failed to create employee');
        toast.error(response?.message || 'Failed to create employee');
      }
    } catch (error) {
      logger('Error creating employee:', error);
      // setSubmitError('An error occurred while creating the employee');
      toast.error('An error occurred while creating the employee');
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  return (
    <div className='masters-container employee-add-page'>
      <div className='masters-header'>
        <h1>Add New Employee</h1>
        <div className='breadcrumb'>
          Create Employee Master
        </div>
      </div>

      <Card className='mt-3'>
        <Card.Header>
          <h5>Employee Information</h5>
        </Card.Header>
        <Card.Body>
          {submitError && (
            <Alert variant="danger" className="mb-3">
              {submitError}
            </Alert>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={validation}
            onSubmit={handleSubmit}
            validateOnChange={true}
            validateOnBlur={true}
          >
            {({ values, handleChange, handleBlur, handleSubmit, isSubmitting, errors, touched, setFieldValue, isValid }) => {
              const handleCountryChange = (e) => {
                const countryId = e.target.value;
                setFieldValue('countryId', countryId);
                setFieldValue('stateId', '');
                setFieldValue('cityId', '');
                setCities([]);
                
                if (countryId) {
                  loadStates(countryId);
                } else {
                  setStates([]);
                }
              };

              const handleStateChange = (e) => {
                const stateId = e.target.value;
                setFieldValue('stateId', stateId);
                setFieldValue('cityId', '');
                
                if (stateId) {
                  loadCities(values.countryId, stateId);
                } else {
                  setCities([]);
                }
              };

              return (
                <Form onSubmit={handleSubmit} className="shadow rounded p-4 bg-white">
                  {/* Basic Information */}
                  <Row className="mb-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Employee Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="partyName"
                          value={values.partyName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.partyName && errors.partyName}
                          placeholder="Enter employee name"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.partyName}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    {/* Remove the logo upload field - partyLogo will use static URL */}
                  </Row>

                  {/* Company & Account Details */}
                  <Row className="mb-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Company *</Form.Label>
                        <Form.Select
                          name="companyId"
                          value={values.companyId}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.companyId && errors.companyId}
                        >
                          <option value="">Select Company</option>
                          {companies.map((company) => (
                            <option key={company.id} value={company.id}>
                              {company.companyName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.companyId}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Multiple Company</Form.Label>
                        <div className="position-relative">
                          <Form.Control
                            as="div"
                            className="form-control"
                            style={{ 
                              minHeight: '38px',
                              cursor: 'pointer',
                              backgroundColor: '#fff'
                            }}
                            onClick={toggleDropdown}
                          >
                            {selectedCompanies.length > 0 ? (
                              <div className="d-flex flex-wrap gap-1">
                                {selectedCompanies.map(company => (
                                  <span 
                                    key={company.id} 
                                    className="badge bg-primary me-1"
                                    style={{ fontSize: '0.75rem' }}
                                  >
                                    {company.name}
                                    <button
                                      type="button"
                                      className="btn-close btn-close-white ms-1"
                                      style={{ fontSize: '0.5rem' }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleCompanySelection(company.id, company.name, setFieldValue);
                                      }}
                                    />
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-muted">Select companies...</span>
                            )}
                          </Form.Control>
                          
                          {/* Custom Dropdown */}
                          {isDropdownOpen && (
                            <div 
                              className="custom-dropdown position-absolute w-100"
                              style={{
                                top: '100%',
                                left: 0,
                                zIndex: 1050,
                                maxHeight: '200px',
                                overflowY: 'auto'
                              }}
                            >
                              {companies.map((company) => {
                                const isSelected = selectedCompanies.find(comp => comp.id === company.id);
                                return (
                                  <div
                                    key={company.id}
                                    className={`dropdown-item d-flex align-items-center justify-content-between ${isSelected ? 'selected' : ''}`}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleCompanySelection(company.id, company.companyName, setFieldValue)}
                                  >
                                    <span>{company.companyName}</span>
                                    {isSelected && (
                                      <span className="text-primary">✓</span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                        
                        {/* Hidden input to maintain form value */}
                        <input 
                          type="hidden" 
                          name="multipleCompanyId" 
                          value={values.multipleCompanyId || ''} 
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Account Group Head - Move to next row */}
                  <Row className="mb-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Account Group Head *</Form.Label>
                        <Form.Select
                          name="accountGroupHeadId"
                          value={values.accountGroupHeadId}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.accountGroupHeadId && errors.accountGroupHeadId}
                        >
                          <option value="">Select Group Head</option>
                          {groupHeads.map((head) => (
                            <option key={head.id} value={head.id}>
                              {head.accountGroupHeadName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.accountGroupHeadId}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Financial Details */}
                  <Row className="mb-4">
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Opening Balance *</Form.Label>
                        <Form.Control
                          type="number"
                          name="openingBalance"
                          value={values.openingBalance}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.openingBalance && errors.openingBalance}
                          placeholder="0.00"
                          step="0.01"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.openingBalance}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Opening Balance Type *</Form.Label>
                        <Form.Select
                          name="openingBalanceType"
                          value={values.openingBalanceType}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.openingBalanceType && errors.openingBalanceType}
                        >
                          <option value="">Select Type</option>
                          <option value="credit">Credit</option>
                          <option value="debit">Debit</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.openingBalanceType}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Salary *</Form.Label>
                        <Form.Control
                          type="number"
                          name="salary"
                          value={values.salary}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.salary && errors.salary}
                          placeholder="0.00"
                          step="0.01"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.salary}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* TDS Information */}
                  <Row className="mb-4">
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>TDS Applicable *</Form.Label>
                        <Form.Check
                          type="switch"
                          name="isTDSApplicable"
                          checked={values.isTDSApplicable}
                          onChange={(e) => setFieldValue('isTDSApplicable', e.target.checked)}
                        />
                      </Form.Group>
                    </Col>
                    {values.isTDSApplicable && (
                      <>
                        <Col md={3}>
                          <Form.Group>
                            <Form.Label>TDS Section *</Form.Label>
                            <Form.Control
                              type="text"
                              name="tdsSection"
                              value={values.tdsSection}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={touched.tdsSection && errors.tdsSection}
                              placeholder="e.g., 194C"
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.tdsSection}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={3}>
                          <Form.Group>
                            <Form.Label>TDS Rate (%) *</Form.Label>
                            <Form.Control
                              type="number"
                              name="tdsRate"
                              value={values.tdsRate}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={touched.tdsRate && errors.tdsRate}
                              placeholder="0.00"
                              step="0.01"
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.tdsRate}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </>
                    )}
                  </Row>

                  {/* Personal Information */}
                  <Row className="mb-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Gender *</Form.Label>
                        <Form.Select
                          name="gender"
                          value={values.gender}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.gender && errors.gender}
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.gender}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control
                          type="date"
                          name="dob"
                          value={values.dob}
                          onChange={handleChange}
                          placeholder="Select date"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Employment Details - Hidden fields with static GUIDs */}
                  {/* employeeMachineID, locationId, departmentId, designationId, divisionId, premissionId are hidden but included in payload */}

                  {/* Dates */}
                  <Row className="mb-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Date of Joining</Form.Label>
                        <Form.Control
                          type="date"
                          name="doj"
                          value={values.doj}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.doj && errors.doj}
                          placeholder="Select date"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.doj}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Date of Confirmation</Form.Label>
                        <Form.Control
                          type="date"
                          name="doc"
                          value={values.doc}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.doc && errors.doc}
                          placeholder="Select date"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.doc}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Contact Information - Official */}
                  <Row className="mb-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Official Mobile Number</Form.Label>
                        <Form.Control
                          type="tel"
                          name="mobileNumberofficial"
                          value={values.mobileNumberofficial}
                          onChange={handleChange}
                          placeholder="Enter official mobile number"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Official Email ID</Form.Label>
                        <Form.Control
                          type="email"
                          name="emailIdofficial"
                          value={values.emailIdofficial}
                          onChange={handleChange}
                          placeholder="Enter official email"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Contact Information - Personal */}
                  <Row className="mb-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Personal Mobile Number</Form.Label>
                        <Form.Control
                          type="tel"
                          name="mobileNumberPersonal"
                          value={values.mobileNumberPersonal}
                          onChange={handleChange}
                          placeholder="Enter personal mobile number"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Personal Contact Number</Form.Label>
                        <Form.Control
                          type="tel"
                          name="contactNumberPersonal"
                          value={values.contactNumberPersonal}
                          onChange={handleChange}
                          placeholder="Enter personal contact number"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Personal Email */}
                  <Row className="mb-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Personal Email ID</Form.Label>
                        <Form.Control
                          type="email"
                          name="emailIdPersonal"
                          value={values.emailIdPersonal}
                          onChange={handleChange}
                          placeholder="Enter personal email"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* User Account Details */}
                  <Row className="mb-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>User ID</Form.Label>
                        <Form.Control
                          type="text"
                          name="userId"
                          value={values.userId}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.userId && errors.userId}
                          placeholder="Enter user ID"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.userId}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>User Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="userPassword"
                          value={values.userPassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.userPassword && errors.userPassword}
                          placeholder="Enter password"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.userPassword}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Address Information */}
                  <Row className="mb-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Address Line 1</Form.Label>
                        <Form.Control
                          type="text"
                          name="addressLine1"
                          value={values.addressLine1}
                          onChange={handleChange}
                          placeholder="Enter address line 1"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Address Line 2</Form.Label>
                        <Form.Control
                          type="text"
                          name="addressLine2"
                          value={values.addressLine2}
                          onChange={handleChange}
                          placeholder="Enter address line 2"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Country & State */}
                  <Row className="mb-4">
                    <Col md={6} className="position-relative">
                      <Form.Group>
                        <Form.Label>Country</Form.Label>
                        <div style={{ position: "relative" }}>
                          <Form.Select
                            name="countryId"
                            value={values.countryId}
                            onChange={handleCountryChange}
                            onBlur={handleBlur}
                            disabled={loadingCountries}
                            style={loadingCountries ? { backgroundColor: "#f5f5f5" } : {}}
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
                      </Form.Group>
                    </Col>

                    <Col md={6} className="position-relative">
                      <Form.Group>
                        <Form.Label>State</Form.Label>
                        <div style={{ position: "relative" }}>
                          <Form.Select
                            name="stateId"
                            value={values.stateId}
                            onChange={handleStateChange}
                            onBlur={handleBlur}
                            disabled={loadingStates || !values.countryId}
                            style={loadingStates ? { backgroundColor: "#f5f5f5" } : {}}
                          >
                            <option value="">Select State</option>
                            {loadingStates ? (
                              <option disabled>Loading...</option>
                            ) : (
                              states.map((state) => (
                                <option key={state.id} value={state.id}>
                                  {state.stateName}
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
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* City & Pincode */}
                  <Row className="mb-4">
                    <Col md={6} className="position-relative">
                      <Form.Group>
                        <Form.Label>City</Form.Label>
                        <div style={{ position: "relative" }}>
                          <Form.Select
                            name="cityId"
                            value={values.cityId}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={loadingCities || !values.stateId}
                            style={loadingCities ? { backgroundColor: "#f5f5f5" } : {}}
                          >
                            <option value="">Select City</option>
                            {loadingCities ? (
                              <option disabled>Loading...</option>
                            ) : (
                              cities.map((city) => (
                                <option key={city.id} value={city.id}>
                                  {city.cityName}
                                </option>
                              ))
                            )}
                          </Form.Select>
                          {loadingCities && (
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
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Pincode</Form.Label>
                        <Form.Control
                          type="text"
                          name="pincode"
                          value={values.pincode}
                          onChange={handleChange}
                          placeholder="Enter pincode"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Additional Information */}
                  <Row className="mb-4">
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>PAN Number</Form.Label>
                        <Form.Control
                          type="text"
                          name="pan"
                          value={values.pan}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.pan && errors.pan}
                          placeholder="Enter PAN number"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.pan}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>TAN Number</Form.Label>
                        <Form.Control
                          type="text"
                          name="tan"
                          value={values.tan}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.tan && errors.tan}
                          placeholder="Enter TAN number"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.tan}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Aadhar Number</Form.Label>
                        <Form.Control
                          type="text"
                          name="aadharNo"
                          value={values.aadharNo}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.aadharNo && errors.aadharNo}
                          placeholder="Enter Aadhar number"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.aadharNo}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-4">
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Leave Request Upper Manager</Form.Label>
                        <Form.Select
                          name="leaveRequestUpperManager"
                          value={values.leaveRequestUpperManager}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.leaveRequestUpperManager && errors.leaveRequestUpperManager}
                        >
                          <option value="">Select Manager</option>
                          {employeeData.map((employee) => (
                            <option key={employee.id} value={employee.id}>
                              {employee.partyName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.leaveRequestUpperManager}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Reporting Lower Manager</Form.Label>
                        <Form.Select
                          name="reportingLowerManager"
                          value={values.reportingLowerManager}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.reportingLowerManager && errors.reportingLowerManager}
                        >
                          <option value="">Select Manager</option>
                          {employeeData.map((employee) => (
                            <option key={employee.id} value={employee.id}>
                              {employee.partyName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.reportingLowerManager}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Reporting Upper Manager</Form.Label>
                        <Form.Select
                          name="reportingUpperManager"
                          value={values.reportingUpperManager}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.reportingUpperManager && errors.reportingUpperManager}
                        >
                          <option value="">Select Manager</option>
                          {employeeData.map((employee) => (
                            <option key={employee.id} value={employee.id}>
                              {employee.partyName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.reportingUpperManager}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Hidden fields for API requirements */}
                  <input type="hidden" name="createdBy" value={values.createdBy} />
                  <input type="hidden" name="employeeMachineID" value={values.employeeMachineID} />
                  <input type="hidden" name="locationId" value={values.locationId} />
                  <input type="hidden" name="departmentId" value={values.departmentId} />
                  <input type="hidden" name="designationId" value={values.designationId} />
                  <input type="hidden" name="divisionId" value={values.divisionId} />
                  <input type="hidden" name="premissionId" value={values.premissionId} />

                  {/* Submit Button */}
                  <div className="d-flex justify-content-end mt-4">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={isSubmitting}
                      className="px-4"
                    >
                      {isSubmitting ? 'Creating Employee...' : 'Create Employee'}
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminEmployeeAdd;