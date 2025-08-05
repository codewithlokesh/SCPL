import React, { useState } from 'react';
import { Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './AdminMasters.css';
import { SuperAdminMastersServices } from '../../../services/SuperAdmin';
import { Toaster } from '../../../components/CommonElement/Toaster';
import logger from '../../../utils/logger';
import FileUpload from '../../../components/CommonElement/FileUpload';
import { uploadFile, validateImageFile } from '../../../utils/fileUpload';

// Updated validation schema
const CompanyValidationSchema = Yup.object().shape({
  companyName: Yup.string()
    .required('Company name is required')
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must not exceed 100 characters'),
  logo: Yup.mixed()
    .required('Logo is required')
    .test('fileSize', 'File size must be less than 5MB', (value) => {
      if (!value) return true;
      return value && value.size <= 5 * 1024 * 1024;
    })
    .test('fileType', 'Please select a valid image file', (value) => {
      if (!value) return true;
      return value && ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'].includes(value.type);
    }),
  gstNumber: Yup.string()
    .required('GST number is required')
    .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GST number format'),
  registeredAddress: Yup.string()
    .required('Registered address is required')
    .min(10, 'Address must be at least 10 characters'),
  location: Yup.string()
    .required('Location is required'),
  pincode: Yup.string()
    .required('Pincode is required')
    .matches(/^[1-9][0-9]{5}$/, 'Invalid pincode format'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  website: Yup.string()
    .url('Invalid website URL')
    .required('Website is required'),
  bankName: Yup.string()
    .required('Bank name is required'),
  accountNumber: Yup.string()
    .required('Account number is required')
    .matches(/^[0-9]{9,18}$/, 'Invalid account number'),
  ifscCode: Yup.string()
    .required('IFSC code is required')
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code format'),
  branch: Yup.string()
    .required('Branch is required'),
  contactPersonName: Yup.string()
    .required('Contact person name is required')
    .min(2, 'Contact person name must be at least 2 characters'),
  contactNumber: Yup.string()
    .required('Contact number is required')
    .matches(/^[6-9]\d{9}$/, 'Invalid contact number format'),
  panNumber: Yup.string()
    .required('PAN number is required')
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN number format'),
  tanNumber: Yup.string()
    .required('TAN number is required')
    .matches(/^[A-Z]{4}[0-9]{5}[A-Z]{1}$/, 'Invalid TAN number format'),
  createdBy: Yup.string()
    .required('Created by is required'),
  financialYearId: Yup.string()
    .required('Financial year ID is required'),
});

const AdminCompanyAdd = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const initialValues = {
    companyName: '',
    logo: null,
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

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Handle logo file upload
      let logoPath = '';
      if (values.logo && values.logo instanceof File) {
        const uploadResult = await uploadFile(values.logo, '/images/');
        if (uploadResult.success) {
          logoPath = uploadResult.filePath;
        } else {
          throw new Error('Failed to upload logo file');
        }
      }

      // Prepare payload with logo path
      const payload = {
        ...values,
        logo: logoPath || values.logo
      };

      const response = await SuperAdminMastersServices.addMaster(payload);
      
      if (response && (response.success || response.status === 'success')) {
        Toaster.success('Company created successfully!');
        resetForm();
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
            validationSchema={CompanyValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange, handleBlur, handleSubmit, isSubmitting, errors, touched, setFieldValue }) => (
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
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
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <FileUpload
                        name="logo"
                        value={values.logo}
                        onChange={(e) => setFieldValue('logo', e.target.value)}
                        onBlur={handleBlur}
                        isInvalid={touched.logo && errors.logo}
                        error={touched.logo && errors.logo}
                        label="Company Logo *"
                        accept="image/*"
                        placeholder="Upload company logo (JPEG, PNG, GIF, WebP - Max 5MB)"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* GST and PAN Information */}
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
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
                    <Form.Group className="mb-3">
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

                {/* TAN Number */}
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
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
                </Row>

                {/* Address Information */}
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
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

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
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
                    <Form.Group className="mb-3">
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

                {/* Contact Information */}
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
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
                    <Form.Group className="mb-3">
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

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
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
                    <Form.Group className="mb-3">
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

                {/* Bank Information */}
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
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
                    <Form.Group className="mb-3">
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

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
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
                    <Form.Group className="mb-3">
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
            )}
          </Formik>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminCompanyAdd;