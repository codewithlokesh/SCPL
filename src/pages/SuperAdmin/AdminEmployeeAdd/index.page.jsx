import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Row, Col, Card, Form, Button, Alert, ProgressBar, Badge } from 'react-bootstrap';
import { Formik } from 'formik';
import { toast } from 'react-toastify';

import { SuperAdminMastersServices } from '../../../services/SuperAdmin';
import { SuperAdminCountryServices } from '../../../services/SuperAdmin/Country/index.service';
import { SuperAdminAccountGroupHeadServices } from '../../../services/SuperAdmin/AccountGroupHead/index.service';
import { SuperAdminEmployeeServices } from '../../../services/SuperAdmin';

import logger from '../../../utils/logger';
import './index.css';

// 5-step validation
import { stepOrder, getStepSchema } from './validation';
import FileUpload from '../../../components/CommonElement/FileUpload';

const STEPS_UI = {
  basic: { label: "Basic Details" },
  official: { label: "Official Details" },
  contact: { label: "Contact Details" },
  address: { label: "Address Details" },
  other: { label: "Other Details" },
};

const StepHeader = ({ currentIndex }) => {
  const progress = Math.round(((currentIndex + 1) / stepOrder.length) * 100);
  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
        {stepOrder.map((key, i) => (
          <div key={key} className="text-center" style={{ minWidth: 110 }}>
            <Badge bg={i <= currentIndex ? 'primary' : 'secondary'}>{i + 1}</Badge>
            <div className={`small mt-1 ${i === currentIndex ? 'fw-bold text-primary' : ''}`}>
              {STEPS_UI[key].label}
            </div>
          </div>
        ))}
      </div>
      <ProgressBar now={progress} label={`${progress}%`} />
    </div>
  );
};

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
  const [employeeData, setEmployeeData] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const multiSelectRef = useRef(null);

  // wizard state
  const [stepIndex, setStepIndex] = useState(0);
  const stepKey = stepOrder[stepIndex];
  const currentSchema = useMemo(() => getStepSchema(stepKey), [stepKey]);

  const initialValues = {
    // Mandatory
    createdBy: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    partyName: '',
    partyLogo: 'https://example.com/default-employee-photo.jpg',
    openingBalance: '',
    openingBalanceType: '',
    companyId: '',
    accountGroupHeadId: '',
    isTDSApplicable: false,
    gender: '',
    salary: '',

    // Optional
    addressLine1: '',
    addressLine2: '',
    cityId: '',
    stateId: '',
    pincode: '',
    countryId: '',
    pan: '',
    tan: '',
    aadharNo: '',
    employeeMachineID: '550e8400-e29b-41d4-a716-446655440001',
    locationId: '550e8400-e29b-41d4-a716-446655440002',
    departmentId: '550e8400-e29b-41d4-a716-446655440003',
    designationId: '550e8400-e29b-41d4-a716-446655440004',
    divisionId: '550e8400-e29b-41d4-a716-446655440005',
    doj: '',
    doc: '',
    mobileNumberofficial: '',
    emailIdofficial: '',
    dob: '',
    mobileNumberPersonal: '',
    contactNumberPersonal: '',
    userId: '',
    userPassword: '',
    premissionId: '550e8400-e29b-41d4-a716-446655440006',
    emailIdPersonal: '',
    multipleCompanyId: '',
    tdsSection: '',
    tdsRate: '',

    // managers (kept under "Other")
    leaveRequestUpperManager: '',
    reportingLowerManager: '',
    reportingUpperManager: '',

    // File upload fields
    profilePhoto: null,
    aadhaarCardFile: null,
    panCardFile: null,
    tanFile: null,
  };

  // data loads
  useEffect(() => {
    (async () => {
      await loadCountries();
      await fetchCompanies();
      await fetchGroupHeads();
      await fetchEmployeeData();
    })();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (multiSelectRef.current && !multiSelectRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await SuperAdminMastersServices.getCompanyMasterData();
      setCompanies(res?.data || []);
    } catch (e) { logger("Companies load error", e); }
  };

  const fetchGroupHeads = async () => {
    try {
      const res = await SuperAdminAccountGroupHeadServices.getAccountGroupHeads();
      setGroupHeads(res?.data || []);
    } catch (e) { logger("Group heads load error", e); }
  };

  const fetchEmployeeData = async () => {
    try {
      const res = await SuperAdminEmployeeServices.getEmployee();
      if (Array.isArray(res?.data)) setEmployeeData(res.data);
    } catch (e) { logger("Employee list load error", e); }
  };

  const loadCountries = async () => {
    try {
      setLoadingCountries(true);
      const response = await SuperAdminCountryServices.getCountries();
      setCountries(response?.result?.data || []);
    } catch (e) { toast.error('Failed to load countries'); }
    finally { setLoadingCountries(false); }
  };

  const loadStates = async (countryId) => {
    try {
      setLoadingStates(true);
      const response = await SuperAdminCountryServices.GetStatesByCountryId(countryId);
      setStates(response || []);
    } catch (e) {
      setStates([]);
      toast.error('Failed to load states');
    } finally { setLoadingStates(false); }
  };

  const loadCities = async (countryId, stateId) => {
    try {
      setLoadingCities(true);
      const response = await SuperAdminCountryServices.GetCitiesByCountryIdandStateid(countryId, stateId);
      setCities(response?.data || []);
    } catch (e) {
      setCities([]);
      toast.error('Failed to load cities');
    } finally { setLoadingCities(false); }
  };

  // multi-company
  const handleCompanySelection = (companyId, companyName, setFieldValue) => {
    setSelectedCompanies(prev => {
      const isSelected = prev.find(c => c.id === companyId);
      const next = isSelected ? prev.filter(c => c.id !== companyId) : [...prev, { id: companyId, name: companyName }];
      setFieldValue('multipleCompanyId', next.map(c => c.id).join(','));
      return next;
    });
  };

  const toggleDropdown = () => setIsDropdownOpen(v => !v);

  // final submit
  const createEmployee = async (values, { resetForm }) => {
    setIsSubmitting(true);
    setSubmitError('');
    try {
      // Prepare the JSON data for the "query" field
      const jsonData = {
        ...values,
        openingBalance: parseFloat(values.openingBalance) || 0,
        tdsRate: parseFloat(values.tdsRate) || 0,
        salary: parseFloat(values.salary) || 0,
      };

      // Remove file objects from JSON data as they'll be sent separately
      delete jsonData.profilePhoto;
      delete jsonData.aadhaarCardFile;
      delete jsonData.panCardFile;
      delete jsonData.tanFile;

      // Create FormData for multipart/form-data
      const formData = new FormData();

      // Add the JSON data as a string in the "query" field
      formData.append('query', JSON.stringify(jsonData));

      // Add files if they exist
      if (values.profilePhoto) {
        formData.append('profilepicfile', values.profilePhoto);
      }
      if (values.aadhaarCardFile) {
        formData.append('adhaarcardfile', values.aadhaarCardFile);
      }
      if (values.panCardFile) {
        formData.append('pancardfile', values.panCardFile);
      }
      if (values.tanFile) {
        formData.append('tanfile', values.tanFile);
      }

      const response = await SuperAdminEmployeeServices.addEmployee(formData);
      if (response && response.message === "Record added successfully.") {
        toast.success('Employee created successfully!');
        resetForm();
        setStates([]); setCities([]); setSelectedCompanies([]);
        setStepIndex(0);
      } else {
        const msg = response?.message || 'Failed to create employee';
        setSubmitError(msg);
        toast.error(msg);
      }
    } catch (e) {
      logger('Error creating employee:', e);
      toast.error('An error occurred while creating the employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Step bodies (5 only) ---
  const renderBasic = (f) => {
    const { values, handleChange, handleBlur, errors, touched, setFieldValue } = f;
    return (
      <>
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
                isInvalid={touched.partyName && !!errors.partyName}
                placeholder="Enter employee name"
              />
              <Form.Control.Feedback type="invalid">{errors.partyName}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Gender *</Form.Label>
              <Form.Select
                name="gender"
                value={values.gender}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.gender && !!errors.gender}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.gender}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control type="date" name="dob" value={values.dob} onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <FileUpload
                name="profilePhoto"
                value={values.profilePhoto}
                onChange={(e) => setFieldValue('profilePhoto', e.target.value)}
                accept="image/*"
                fileType="image"
                label="Profile Photo"
                placeholder="Choose profile photo"
                maxSize={2 * 1024 * 1024} // 2MB for profile photo
              />
            </Form.Group>
          </Col>
        </Row>
      </>
    );
  };

  const renderOfficial = (f) => {
    const { values, handleChange, handleBlur, errors, touched, setFieldValue } = f;
    return (
      <>
        {/* Company & Multiple */}
        <Row className="mb-4">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Company *</Form.Label>
              <Form.Select
                name="companyId"
                value={values.companyId}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.companyId && !!errors.companyId}
              >
                <option value="">Select Company</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.companyId}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Multiple Company</Form.Label>
              <div className="position-relative" ref={multiSelectRef}>
                <Form.Control
                  as="div"
                  className="form-control"
                  style={{ minHeight: '38px', cursor: 'pointer', backgroundColor: '#fff' }}
                  onClick={toggleDropdown}
                >
                  {selectedCompanies.length ? (
                    <div className="d-flex flex-wrap gap-1">
                      {selectedCompanies.map(company => (
                        <span key={company.id} className="badge bg-primary me-1" style={{ fontSize: '0.75rem' }}>
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
                  ) : <span className="text-muted">Select companies...</span>}
                </Form.Control>

                {isDropdownOpen && (
                  <div className="custom-dropdown position-absolute w-100"
                    style={{ top: '100%', left: 0, zIndex: 1050, maxHeight: '200px', overflowY: 'auto' }}>
                    {companies.map(company => {
                      const isSelected = selectedCompanies.find(c => c.id === company.id);
                      return (
                        <div
                          key={company.id}
                          className={`dropdown-item d-flex align-items-center justify-content-between ${isSelected ? 'selected' : ''}`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleCompanySelection(company.id, company.companyName, setFieldValue)}
                        >
                          <span>{company.companyName}</span>
                          {isSelected && <span className="text-primary">✓</span>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <input type="hidden" name="multipleCompanyId" value={values.multipleCompanyId || ''} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Account Group Head *</Form.Label>
              <Form.Select
                name="accountGroupHeadId"
                value={values.accountGroupHeadId}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.accountGroupHeadId && !!errors.accountGroupHeadId}
              >
                <option value="">Select Group Head</option>
                {groupHeads.map(h => <option key={h.id} value={h.id}>{h.accountGroupHeadName}</option>)}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.accountGroupHeadId}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        {/* Financial & TDS & Dates */}
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
                isInvalid={touched.openingBalance && !!errors.openingBalance}
                placeholder="0.00" step="0.01"
              />
              <Form.Control.Feedback type="invalid">{errors.openingBalance}</Form.Control.Feedback>
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
                isInvalid={touched.openingBalanceType && !!errors.openingBalanceType}
              >
                <option value="">Select Type</option>
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.openingBalanceType}</Form.Control.Feedback>
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
                isInvalid={touched.salary && !!errors.salary}
                placeholder="0.00" step="0.01"
              />
              <Form.Control.Feedback type="invalid">{errors.salary}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Date of Joining</Form.Label>
              <Form.Control type="date" name="doj" value={values.doj} onChange={handleChange} onBlur={handleBlur} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Date of Confirmation</Form.Label>
              <Form.Control type="date" name="doc" value={values.doc} onChange={handleChange} onBlur={handleBlur} />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-1">
          <Col md={4}>
            <Form.Group>
              <Form.Label>TDS Applicable </Form.Label>
              <Form.Check
                type="switch"
                name="isTDSApplicable"
                checked={values.isTDSApplicable}
                onChange={(e) => f.setFieldValue('isTDSApplicable', e.target.checked)}
              />
            </Form.Group>
          </Col>
          {values.isTDSApplicable && (
            <>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>TDS Section *</Form.Label>
                  <Form.Control
                    type="text"
                    name="tdsSection"
                    value={values.tdsSection}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.tdsSection && !!errors.tdsSection}
                    placeholder="e.g., 194C"
                  />
                  <Form.Control.Feedback type="invalid">{errors.tdsSection}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>TDS Rate (%) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="tdsRate"
                    value={values.tdsRate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.tdsRate && !!errors.tdsRate}
                    placeholder="0.00" step="0.01"
                  />
                  <Form.Control.Feedback type="invalid">{errors.tdsRate}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </>
          )}
        </Row>
      </>
    );
  };

  const renderContact = (f) => {
    const { values, handleChange, handleBlur, errors, touched } = f;
    return (
      <>
        <Row className="mb-4">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Official Mobile Number</Form.Label>
              <Form.Control type="tel" name="mobileNumberofficial" value={values.mobileNumberofficial} onChange={handleChange} />
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
                onBlur={handleBlur}
                isInvalid={touched.emailIdofficial && !!errors.emailIdofficial}
              />
              <Form.Control.Feedback type="invalid">{errors.emailIdofficial}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Personal Mobile Number</Form.Label>
              <Form.Control type="tel" name="mobileNumberPersonal" value={values.mobileNumberPersonal} onChange={handleChange} />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label>Personal Contact Number</Form.Label>
              <Form.Control type="tel" name="contactNumberPersonal" value={values.contactNumberPersonal} onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Personal Email ID</Form.Label>
              <Form.Control
                type="email"
                name="emailIdPersonal"
                value={values.emailIdPersonal}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.emailIdPersonal && !!errors.emailIdPersonal}
              />
              <Form.Control.Feedback type="invalid">{errors.emailIdPersonal}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-2">
          <Col md={6}>
            <Form.Group>
              <Form.Label>User ID</Form.Label>
              <Form.Control
                type="text"
                name="userId"
                value={values.userId}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.userId && !!errors.userId}
                placeholder="Enter user ID"
              />
              <Form.Control.Feedback type="invalid">{errors.userId}</Form.Control.Feedback>
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
                isInvalid={touched.userPassword && !!errors.userPassword}
                placeholder="Enter password"
              />
              <Form.Control.Feedback type="invalid">{errors.userPassword}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
      </>
    );
  };

  const renderAddress = (f) => {
    const { values, handleChange, handleBlur } = f;

    const onCountryChange = async (e) => {
      const countryId = e.target.value;
      f.setFieldValue('countryId', countryId);
      f.setFieldValue('stateId', '');
      f.setFieldValue('cityId', '');
      setCities([]);
      if (countryId) await loadStates(countryId);
      else setStates([]);
    };

    const onStateChange = async (e) => {
      const stateId = e.target.value;
      f.setFieldValue('stateId', stateId);
      f.setFieldValue('cityId', '');
      if (stateId) await loadCities(values.countryId, stateId);
      else setCities([]);
    };

    return (
      <>
        <Row className="mb-4">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Address Line 1</Form.Label>
              <Form.Control type="text" name="addressLine1" value={values.addressLine1} onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Address Line 2</Form.Label>
              <Form.Control type="text" name="addressLine2" value={values.addressLine2} onChange={handleChange} />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={6} className="position-relative">
            <Form.Group>
              <Form.Label>Country</Form.Label>
              <div style={{ position: "relative" }}>
                <Form.Select
                  name="countryId"
                  value={values.countryId}
                  onChange={onCountryChange}
                  onBlur={handleBlur}
                  disabled={loadingCountries}
                  style={loadingCountries ? { backgroundColor: "#f5f5f5" } : {}}
                >
                  <option value="">Select Country</option>
                  {loadingCountries ? <option disabled>Loading...</option> :
                    countries.map(c => <option key={c.id} value={c.id}>{c.countryName}</option>)
                  }
                </Form.Select>
                {loadingCountries && <span className="spinner-border spinner-border-sm text-primary position-absolute" style={{ top: '50%', right: 10, transform: 'translateY(-50%)' }} />}
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
                  onChange={onStateChange}
                  onBlur={handleBlur}
                  disabled={loadingStates || !values.countryId}
                  style={loadingStates ? { backgroundColor: "#f5f5f5" } : {}}
                >
                  <option value="">Select State</option>
                  {loadingStates ? <option disabled>Loading...</option> :
                    states.map(s => <option key={s.id} value={s.id}>{s.stateName}</option>)
                  }
                </Form.Select>
                {loadingStates && <span className="spinner-border spinner-border-sm text-primary position-absolute" style={{ top: '50%', right: 10, transform: 'translateY(-50%)' }} />}
              </div>
            </Form.Group>
          </Col>
        </Row>

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
                  {loadingCities ? <option disabled>Loading...</option> :
                    cities.map(city => <option key={city.id} value={city.id}>{city.cityName}</option>)
                  }
                </Form.Select>
                {loadingCities && <span className="spinner-border spinner-border-sm text-primary position-absolute" style={{ top: '50%', right: 10, transform: 'translateY(-50%)' }} />}
              </div>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Pincode</Form.Label>
              <Form.Control type="text" name="pincode" value={values.pincode} onChange={handleChange} />
            </Form.Group>
          </Col>
        </Row>
      </>
    );
  };

  const renderOther = (f) => {
    const { values, handleChange, handleBlur, errors, touched, setFieldValue } = f;
    return (
      <>
        {/* PAN/TAN/Aadhar */}
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
                isInvalid={touched.pan && !!errors.pan}
                placeholder="Enter PAN number"
              />
              <Form.Control.Feedback type="invalid">{errors.pan}</Form.Control.Feedback>
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
                isInvalid={touched.tan && !!errors.tan}
                placeholder="Enter TAN number"
              />
              <Form.Control.Feedback type="invalid">{errors.tan}</Form.Control.Feedback>
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
                isInvalid={touched.aadharNo && !!errors.aadharNo}
                placeholder="Enter Aadhar number"
              />
              <Form.Control.Feedback type="invalid">{errors.aadharNo}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        {/* Managers */}
        <Row className="mb-4">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Leave Request Upper Manager</Form.Label>
              <Form.Select
                name="leaveRequestUpperManager"
                value={values.leaveRequestUpperManager}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.leaveRequestUpperManager && !!errors.leaveRequestUpperManager}
              >
                <option value="">Select Manager</option>
                {employeeData.map(emp => <option key={emp.id} value={emp.id}>{emp.partyName}</option>)}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.leaveRequestUpperManager}</Form.Control.Feedback>
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
                isInvalid={touched.reportingLowerManager && !!errors.reportingLowerManager}
              >
                <option value="">Select Manager</option>
                {employeeData.map(emp => <option key={emp.id} value={emp.id}>{emp.partyName}</option>)}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.reportingLowerManager}</Form.Control.Feedback>
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
                isInvalid={touched.reportingUpperManager && !!errors.reportingUpperManager}
              >
                <option value="">Select Manager</option>
                {employeeData.map(emp => <option key={emp.id} value={emp.id}>{emp.partyName}</option>)}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.reportingUpperManager}</Form.Control.Feedback>
            </Form.Group>
          </Col>

        </Row>
        <Row className="mb-4">
          <Col md={4}>
            <Form.Group>
              <FileUpload
                name="aadhaarCardFile"
                value={values.aadhaarCardFile}
                onChange={(e) => setFieldValue('aadhaarCardFile', e.target.value)}
                accept="image/*,.pdf"
                fileType="document"
                label="Aadhaar Card"
                placeholder="Choose Aadhaar card file"
                maxSize={5 * 1024 * 1024} // 5MB
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <FileUpload
                name="panCardFile"
                value={values.panCardFile}
                onChange={(e) => setFieldValue('panCardFile', e.target.value)}
                accept="image/*,.pdf"
                fileType="document"
                label="PAN Card"
                placeholder="Choose PAN card file"
                maxSize={5 * 1024 * 1024} // 5MB
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <FileUpload
                name="tanFile"
                value={values.tanFile}
                onChange={(e) => setFieldValue('tanFile', e.target.value)}
                accept="image/*,.pdf"
                fileType="document"
                label="TAN File"
                placeholder="Choose TAN file"
                maxSize={5 * 1024 * 1024} // 5MB
              />
            </Form.Group>
          </Col>
        </Row>
      </>
    );
  };

  const renderStep = (formik) => {
    switch (stepKey) {
      case "basic": return renderBasic(formik);
      case "official": return renderOfficial(formik);
      case "contact": return renderContact(formik);
      case "address": return renderAddress(formik);
      case "other": return renderOther(formik);
      default: return null;
    }
  };

  return (
    <div className='masters-container employee-add-page'>
      <div className='masters-header'>
        <h1>Add New Employee</h1>
        <div className='breadcrumb'>Create Employee Master</div>
      </div>

      <Card className='mt-3'>
        <Card.Header><h5>Employee Information</h5></Card.Header>
        <Card.Body>
          {submitError && <Alert variant="danger" className="mb-3">{submitError}</Alert>}

          <Formik
            initialValues={initialValues}
            validationSchema={currentSchema}
            validateOnChange
            validateOnBlur
            onSubmit={async (values, helpers) => {
              if (stepKey !== "other") {
                setStepIndex(i => Math.min(i + 1, stepOrder.length - 1));
              } else {
                await createEmployee(values, helpers);
              }
            }}
          >
            {(formik) => (
              <Form onSubmit={formik.handleSubmit} className="shadow rounded p-4 bg-white">
                <StepHeader currentIndex={stepIndex} />

                {/* hidden static fields required by API */}
                <input type="hidden" name="createdBy" value={formik.values.createdBy} />
                <input type="hidden" name="employeeMachineID" value={formik.values.employeeMachineID} />
                <input type="hidden" name="locationId" value={formik.values.locationId} />
                <input type="hidden" name="departmentId" value={formik.values.departmentId} />
                <input type="hidden" name="designationId" value={formik.values.designationId} />
                <input type="hidden" name="divisionId" value={formik.values.divisionId} />
                <input type="hidden" name="premissionId" value={formik.values.premissionId} />

                {renderStep(formik)}

                <div className="d-flex justify-content-between mt-4">
                  <Button
                    type="button"
                    variant="outline-secondary"
                    disabled={stepIndex === 0 || isSubmitting}
                    onClick={() => setStepIndex(i => Math.max(i - 1, 0))}
                  >
                    Back
                  </Button>

                  {stepKey !== "other" ? (
                    <Button type="submit" variant="primary" disabled={isSubmitting || !formik.isValid}>
                      Next
                    </Button>
                  ) : (
                    <Button type="submit" variant="success" disabled={isSubmitting || !formik.isValid}>
                      {isSubmitting ? 'Creating Employee...' : 'Create Employee'}
                    </Button>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminEmployeeAdd;
