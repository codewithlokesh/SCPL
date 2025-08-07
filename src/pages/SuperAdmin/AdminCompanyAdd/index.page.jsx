import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { SuperAdminMastersServices } from '../../../services/SuperAdmin';
import { SuperAdminCountryServices } from '../../../services/SuperAdmin/Country/index.service';
import { Toaster } from '../../../components/CommonElement/Toaster';
import logger from '../../../utils/logger';
import FileUpload from '../../../components/CommonElement/FileUpload';
import { uploadFile, validateImageFile } from '../../../utils/fileUpload';
import validation from "./validation";
import './index.css';

const AdminCompanyAdd = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  const initialValues = {
    companyName: '',
    logo: null,
    countryId: '',
    stateId: '',
    cityId: '',
    gstNumber: '',
    registeredAddress: '',
    location: '',
    pincode: '',
    email: '',
    website: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    branch: '',
    contactPersonName: '',
    contactNumber: '',
    panNumber: '',
    tanNumber: '',
    createdBy: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    financialYearId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  };

  // Load countries on component mount
  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    try {
      setLoadingCountries(true);
      const response = await SuperAdminCountryServices.getCountries();
      setCountries(response?.result?.data || []);
    } catch (error) {
      console.error('Error loading countries:', error);
      Toaster.error('Failed to load countries');
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
      Toaster.error('Failed to load states');
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
      Toaster.error('Failed to load cities');
    } finally {
      setLoadingCities(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Handle logo file upload
      let logoPath = '';
      // if (values.logo && values.logo instanceof File) {
      //   const uploadResult = await uploadFile(values.logo, '/images/');
      //   if (uploadResult.success) {
      //     logoPath = uploadResult.filePath;
      //   } else {
      //     throw new Error('Failed to upload logo file');
      //   }
      // }

      // const payload = {
      //   ...values,
      //   logo: logoPath || values.logo
      // };
      const payload = {
        ...values,
        logo: ''
      };

      const response = await SuperAdminMastersServices.addMaster(payload);
      
      if (response && (response.success || response.status === 'success')) {
        Toaster.success('Company created successfully!');
        resetForm();
        // Reset the cascading dropdowns
        setStates([]);
        setCities([]);
      } else {
        setSubmitError(response?.message || 'Failed to create company');
        Toaster.error(response?.message || 'Failed to create company');
      }
    } catch (error) {
      logger('Error creating company:', error);
      setSubmitError('An error occurred while creating the company');
      Toaster.error('An error occurred while creating the company');
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  return (
    <div className='masters-container'>
      <div className='masters-header'>
        <h1>Add New Company</h1>
        <div className='breadcrumb'>
          Create Company Master
        </div>
      </div>

      <Card className='mt-3'>
        <Card.Header>
          <h5>Company Information</h5>
        </Card.Header>
        <Card.Body>
          {submitError && (
            <Alert variant="danger" className="mb-3">
              {submitError}
            </Alert>
          )}

          <Formik
            initialValues={initialValues}
            // validationSchema={validation}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange, handleBlur, handleSubmit, isSubmitting, errors, touched, setFieldValue }) => {
              // Handle country change
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

              // Handle state change
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
                  {/* Country & State */}
                  <Row className="mb-4">
                    {/* Country */}
                    <Col md={6} className="position-relative">
                      <Form.Group>
                        <Form.Label>Country *</Form.Label>
                        <div style={{ position: "relative" }}>
                          <Form.Select
                            name="countryId"
                            value={values.countryId}
                            onChange={handleCountryChange}
                            onBlur={handleBlur}
                            isInvalid={touched.countryId && errors.countryId}
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
                        <Form.Control.Feedback type="invalid">
                          {errors.countryId}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    {/* State */}
                    <Col md={6} className="position-relative">
                      <Form.Group>
                        <Form.Label>State *</Form.Label>
                        <div style={{ position: "relative" }}>
                          <Form.Select
                            name="stateId"
                            value={values.stateId}
                            onChange={handleStateChange}
                            onBlur={handleBlur}
                            isInvalid={touched.stateId && errors.stateId}
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
                        <Form.Control.Feedback type="invalid">
                          {errors.stateId}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* City & Company Name */}
                  <Row className="mb-4">
                    {/* City */}
                    <Col md={6} className="position-relative">
                      <Form.Group>
                        <Form.Label>City *</Form.Label>
                        <div style={{ position: "relative" }}>
                          <Form.Select
                            name="cityId"
                            value={values.cityId}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.cityId && errors.cityId}
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
                        <Form.Control.Feedback type="invalid">
                          {errors.cityId}
                        </Form.Control.Feedback>
                        {loadingCities && <small className="text-muted">Loading cities...</small>}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Company Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="companyName"
                          value={values.companyName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.companyName && errors.companyName}
                          placeholder="Enter company name"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.companyName}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Continue grouping the rest of your fields in pairs of two columns per row, using the same pattern */}

                  {/* GST Number & PAN Number */}
                  <Row className="mb-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>GST Number *</Form.Label>
                        <Form.Control
                          type="text"
                          name="gstNumber"
                          value={values.gstNumber}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.gstNumber && errors.gstNumber}
                          placeholder="e.g., 22AAAAA0000A1Z5"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.gstNumber}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>PAN Number *</Form.Label>
                        <Form.Control
                          type="text"
                          name="panNumber"
                          value={values.panNumber}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.panNumber && errors.panNumber}
                          placeholder="e.g., ABCDE1234F"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.panNumber}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* TAN Number & Registered Address */}
                  <Row className="mb-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>TAN Number *</Form.Label>
                        <Form.Control
                          type="text"
                          name="tanNumber"
                          value={values.tanNumber}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.tanNumber && errors.tanNumber}
                          placeholder="e.g., ABCD12345E"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.tanNumber}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Registered Address *</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="registeredAddress"
                          value={values.registeredAddress}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.registeredAddress && errors.registeredAddress}
                          placeholder="Enter complete registered address"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.registeredAddress}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Location & Pincode */}
                  <Row className="mb-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Location *</Form.Label>
                        <Form.Control
                          type="text"
                          name="location"
                          value={values.location}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.location && errors.location}
                          placeholder="Enter location"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.location}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Pincode *</Form.Label>
                        <Form.Control
                          type="text"
                          name="pincode"
                          value={values.pincode}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.pincode && errors.pincode}
                          placeholder="e.g., 123456"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.pincode}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Email & Website */}
                  <Row className="mb-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Email *</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.email && errors.email}
                          placeholder="Enter email address"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Website *</Form.Label>
                        <Form.Control
                          type="url"
                          name="website"
                          value={values.website}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.website && errors.website}
                          placeholder="https://example.com"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.website}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Contact Person Name & Contact Number */}
                  <Row className="mb-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Contact Person Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="contactPersonName"
                          value={values.contactPersonName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.contactPersonName && errors.contactPersonName}
                          placeholder="Enter contact person name"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.contactPersonName}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Contact Number *</Form.Label>
                        <Form.Control
                          type="text"
                          name="contactNumber"
                          value={values.contactNumber}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.contactNumber && errors.contactNumber}
                          placeholder="e.g., 9876543210"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.contactNumber}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Bank Name & Account Number */}
                  <Row className="mb-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Bank Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="bankName"
                          value={values.bankName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.bankName && errors.bankName}
                          placeholder="Enter bank name"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.bankName}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Account Number *</Form.Label>
                        <Form.Control
                          type="text"
                          name="accountNumber"
                          value={values.accountNumber}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.accountNumber && errors.accountNumber}
                          placeholder="Enter account number"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.accountNumber}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* IFSC Code & Branch */}
                  <Row className="mb-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>IFSC Code *</Form.Label>
                        <Form.Control
                          type="text"
                          name="ifscCode"
                          value={values.ifscCode}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.ifscCode && errors.ifscCode}
                          placeholder="e.g., SBIN0001234"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.ifscCode}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Branch *</Form.Label>
                        <Form.Control
                          type="text"
                          name="branch"
                          value={values.branch}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.branch && errors.branch}
                          placeholder="Enter branch name"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.branch}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Hidden fields for API requirements */}
                  <input type="hidden" name="createdBy" value={values.createdBy} />
                  <input type="hidden" name="financialYearId" value={values.financialYearId} />

                  {/* Submit Button */}
                  <div className="d-flex justify-content-end mt-4">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={isSubmitting}
                      className="px-4"
                    >
                      {isSubmitting ? 'Creating Company...' : 'Create Company'}
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

export default AdminCompanyAdd;