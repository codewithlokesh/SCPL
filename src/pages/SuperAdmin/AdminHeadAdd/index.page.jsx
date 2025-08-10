import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import './AdminHeadAdd.css';
import { SuperAdminAccountGroupHeadServices } from '../../../services/SuperAdmin/AccountGroupHead/index.service';
import GroupHeadValidationSchema from './validation';
import { toast } from 'react-toastify';
import { SuperAdminCountryServices, SuperAdminMastersServices } from '../../../services/SuperAdmin';
import { SuperAdminAccountHeadServices } from '../../../services/SuperAdmin/AccountHead/index.service';
import logger from '../../../utils/logger';

const STATIC_USER_ID = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

const AdminAccountHeadAdd = () => {
  const [groupHeadData, setGroupHeadData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionType, setTransactionType] = useState([]);
  const [loadingTransactionType] = useState(false);
  const [countries, setCountries] = useState([]);
  const [allStates, setAllStates] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  const fetchGroupHeadData = async () => {
    try {
      const res = await SuperAdminAccountGroupHeadServices.getAccountGroupHeads();
      setGroupHeadData(Array.isArray(res?.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching account group heads:', error);
      setGroupHeadData([]);
      toast.error('Failed to load account group heads');
    }
  };

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

  const fetchCompanyData = async () => {
    try {
      const res = await SuperAdminMastersServices.getCompanyMasterData();
      if (res && Array.isArray(res?.data)) {
        setCompanyData(res?.data);
      }
    } catch (error) {
      logger('error:', error);
    }
  };

  const fetchTransactionType = async () => {
    try {
      const res = await SuperAdminAccountHeadServices.getTransactionType();
      if (res && Array.isArray(res)) {
        setTransactionType(res);
      }
    } catch (error) {
      logger('error:', error);
    }
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
    fetchGroupHeadData();
    fetchCountries();
    fetchAllStates();
    fetchAllCities();
    fetchCompanyData();
    fetchTransactionType();
  }, []);

  const initialValues = {
    partyName: '',
    partyType: '',
    partyLogo: '',
    partyIntroducerId: '',

    contactPerson: '',
    mobileNo1: '',
    mobileNo2: '',
    alternateMobileNo: '',
    email: '',
    phoneNo: '',

    addressLine1: '',
    addressLine2: '',
    countryId: '',
    stateId: '',
    cityId: '',
    pincode: '',

    isRegisteredUnderGST: false,
    gstin: '',
    pan: '',
    tan: '',
    aadharNo: '',

    openingBalance: 0,
    openingBalanceType: '',

    companyId: '',
    accountGroupHeadId: '',

    isTDSApplicable: false,
    tdsSection: '',
    tdsRate: '',
    creditLimit: '',
    creditDays: '',
    createdBy: STATIC_USER_ID,
  };

  const handleAddSubmit = async (values, { resetForm, setSubmitting }) => {
    setIsSubmitting(true);
    try {
      const payload = {
        createdBy: STATIC_USER_ID,
        partyName: values.partyName,
        partyType: values.partyType,
        partyLogo: 'https://dummyimage.com/200x200/cccccc/000000.png&text=Logo',
        partyIntroducerId: values.partyIntroducerId || 'bb439f20-5212-45f2-bb57-895f6d856f10',

        contactPerson: values.contactPerson,
        mobileNo1: values.mobileNo1,
        mobileNo2: values.mobileNo2,
        alternateMobileNo: values.alternateMobileNo,
        email: values.email,
        phoneNo: values.phoneNo,

        addressLine1: values.addressLine1,
        addressLine2: values.addressLine2,
        countryId: values.countryId,
        stateId: values.stateId,
        cityId: values.cityId,
        pincode: values.pincode,

        isRegisteredUnderGST: !!values.isRegisteredUnderGST,
        gstin: values.gstin,
        pan: values.pan,
        tan: values.tan,
        aadharNo: values.aadharNo,

        openingBalance: Number(values.openingBalance ?? 0),
        openingBalanceType: values.openingBalanceType,

        companyId: values.companyId,
        accountGroupHeadId: values.accountGroupHeadId,

        isTDSApplicable: !!values.isTDSApplicable,
        tdsSection: values.tdsSection,
        tdsRate: values.tdsRate !== '' ? Number(values.tdsRate) : 0,
        creditLimit: values.creditLimit !== '' ? Number(values.creditLimit) : 0,
        creditDays: values.creditDays !== '' ? Number(values.creditDays) : 0,
      };
      const res = await SuperAdminAccountHeadServices.addAccountGroupHead(payload);
      if (res?.status === 400) {
        const errors = res.data;
        Object.keys(errors).forEach(field => {
          const message = errors[field]?.[0] || '';
        });
      }

      if (res?.message?.toLowerCase?.().includes('success') || (res && res.result !== false)) {
        toast.success('Account head added successfully');
        resetForm();
      } else {
        toast.error(res?.message || 'Failed to add account head');
      }
    } catch (error) {
      console.error('Error creating account head:', error);
      toast.error('Failed to create account head');
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  return (
    <div className='financial-year-container'>
      <div className='financial-year-header'>
        <h1>Add Account Head</h1>
        <div className='breadcrumb'>Account Head Management</div>
      </div>

      <Formik initialValues={initialValues} validationSchema={GroupHeadValidationSchema} onSubmit={handleAddSubmit}>
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, resetForm }) => (
          <Form id='addGroupHeadForm' onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Label className='form-label'>Party Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="partyName"
                  value={values.partyName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.partyName && !!errors.partyName}
                  placeholder="Enter party name"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.partyName}
                </Form.Control.Feedback>
              </Col>
              <Col md={6}>
                <Form.Label className='form-label'>Party Type</Form.Label>
                <Form.Control
                  type="text"
                  name="partyType"
                  value={values.partyType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g., Customer, Vendor"
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Label className='form-label'>Company *</Form.Label>
                <Form.Select
                  name="companyId"
                  value={values.companyId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.companyId && !!errors.companyId}
                >
                  <option value="">Select Company</option>
                  {companyData.map(c => (
                    <option key={c.id} value={c.id}>{c.companyName}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.companyId}
                </Form.Control.Feedback>
              </Col>
              <Col md={6}>
                <Form.Label className='form-label'>Account Group Head *</Form.Label>
                <Form.Select
                  name="accountGroupHeadId"
                  value={values.accountGroupHeadId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.accountGroupHeadId && !!errors.accountGroupHeadId}
                >
                  <option value="">Select Account Group Head</option>
                  {groupHeadData.map(g => (
                    <option key={g.id} value={g.id}>{g.accountGroupHeadName}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.accountGroupHeadId}
                </Form.Control.Feedback>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Label className='form-label'>Contact Person</Form.Label>
                <Form.Control
                  type="text"
                  name="contactPerson"
                  value={values.contactPerson}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter contact person"
                />
              </Col>
              <Col md={6}>
                <Form.Label className='form-label'>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="user@example.com"
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Label className='form-label'>Mobile No 1</Form.Label>
                <Form.Control
                  type="text"
                  name="mobileNo1"
                  value={values.mobileNo1}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Mobile"
                />
              </Col>
              <Col md={4}>
                <Form.Label className='form-label'>Mobile No 2</Form.Label>
                <Form.Control
                  type="text"
                  name="mobileNo2"
                  value={values.mobileNo2}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Alternate mobile"
                />
              </Col>
              <Col md={4}>
                <Form.Label className='form-label'>Phone No</Form.Label>
                <Form.Control
                  type="text"
                  name="phoneNo"
                  value={values.phoneNo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Phone"
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Label className='form-label'>Address Line 1</Form.Label>
                <Form.Control
                  type="text"
                  name="addressLine1"
                  value={values.addressLine1}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Address line 1"
                />
              </Col>
              <Col md={6}>
                <Form.Label className='form-label'>Address Line 2</Form.Label>
                <Form.Control
                  type="text"
                  name="addressLine2"
                  value={values.addressLine2}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Address line 2"
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Label className='form-label'>Country *</Form.Label>
                <Form.Select
                  name="countryId"
                  value={values.countryId}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  onBlur={handleBlur}
                  isInvalid={touched.countryId && !!errors.countryId}
                  disabled={loadingCountries}
                >
                  <option value="">Select Country</option>
                  {countries.map(country => (
                    <option key={country.id} value={country.id}>{country.countryName}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.countryId}
                </Form.Control.Feedback>
              </Col>
              <Col md={4}>
                <Form.Label className='form-label'>State *</Form.Label>
                <Form.Select
                  name="stateId"
                  value={values.stateId}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  onBlur={handleBlur}
                  isInvalid={touched.stateId && !!errors.stateId}
                  disabled={loadingStates || !values.countryId}
                >
                  <option value="">Select State</option>
                  {allStates
                    .filter(s => String(s.countryId) === String(values.countryId))
                    .map(state => (
                      <option key={state.id} value={state.id}>{state.stateName}</option>
                    ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.stateId}
                </Form.Control.Feedback>
              </Col>
              <Col md={4}>
                <Form.Label className='form-label'>City *</Form.Label>
                <Form.Select
                  name="cityId"
                  value={values.cityId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.cityId && !!errors.cityId}
                  disabled={loadingCities || !values.stateId}
                >
                  <option value="">Select City</option>
                  {allCities
                    .filter(c => String(c.stateId) === String(values.stateId) && String(c.stateId) === String(values.stateId))
                    .map(city => (
                      <option key={city.id} value={city.id}>{city.cityName}</option>
                    ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.cityId}
                </Form.Control.Feedback>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Label className='form-label'>Pincode</Form.Label>
                <Form.Control
                  type="text"
                  name="pincode"
                  value={values.pincode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Pincode"
                />
              </Col>
              <Col md={4} className='d-flex align-items-end'>
                <Form.Check
                  type="checkbox"
                  id="isRegisteredUnderGST"
                  name="isRegisteredUnderGST"
                  label="Registered under GST"
                  checked={values.isRegisteredUnderGST}
                  onChange={(e) => {
                    const syntheticEvent = {
                      target: {
                        name: 'isRegisteredUnderGST',
                        value: e.target.checked
                      }
                    };
                    handleChange(syntheticEvent);
                  }}
                />
              </Col>
              <Col md={4}>
                <Form.Label className='form-label'>GSTIN</Form.Label>
                <Form.Control
                  type="text"
                  name="gstin"
                  value={values.gstin}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="GSTIN"
                  disabled={!values.isRegisteredUnderGST}
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Label className='form-label'>PAN</Form.Label>
                <Form.Control
                  type="text"
                  name="pan"
                  value={values.pan}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="PAN"
                />
              </Col>
              <Col md={4}>
                <Form.Label className='form-label'>TAN</Form.Label>
                <Form.Control
                  type="text"
                  name="tan"
                  value={values.tan}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="TAN"
                />
              </Col>
              <Col md={4}>
                <Form.Label className='form-label'>Aadhar No</Form.Label>
                <Form.Control
                  type="text"
                  name="aadharNo"
                  value={values.aadharNo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Aadhar No"
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Label className='form-label'>Opening Balance *</Form.Label>
                <Form.Control
                  type="number"
                  name="openingBalance"
                  value={values.openingBalance}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.openingBalance && !!errors.openingBalance}
                  min="0"
                  step="0.01"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.openingBalance}
                </Form.Control.Feedback>
              </Col>
              <Col md={4}>
                <Form.Label className='form-label'>Opening Balance Type *</Form.Label>
                <Form.Select
                  name="openingBalanceType"
                  value={values.openingBalanceType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.openingBalanceType && !!errors.openingBalanceType}
                  disabled={loadingTransactionType}
                >
                  <option value="">Select Type</option>
                  {transactionType.map(t => (
                    <option key={t.dataValueField} value={t.dataValueField}>
                      {t.dataTextField}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.openingBalanceType}
                </Form.Control.Feedback>
              </Col>
              <Col md={4} className='d-flex align-items-end'>
                <Form.Check
                  type="checkbox"
                  id="isTDSApplicable"
                  name="isTDSApplicable"
                  label="TDS Applicable"
                  checked={values.isTDSApplicable}
                  onChange={(e) => {
                    const syntheticEvent = {
                      target: {
                        name: 'isTDSApplicable',
                        value: e.target.checked
                      }
                    };
                    handleChange(syntheticEvent);
                  }}
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Label className='form-label'>TDS Section</Form.Label>
                <Form.Control
                  type="text"
                  name="tdsSection"
                  value={values.tdsSection}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="TDS Section"
                  disabled={!values.isTDSApplicable}
                />
              </Col>
              <Col md={4}>
                <Form.Label className='form-label'>TDS Rate</Form.Label>
                <Form.Control
                  type="number"
                  name="tdsRate"
                  value={values.tdsRate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  disabled={!values.isTDSApplicable}
                />
              </Col>
              <Col md={4}>
                <Form.Label className='form-label'>Credit Limit</Form.Label>
                <Form.Control
                  type="number"
                  name="creditLimit"
                  value={values.creditLimit}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Label className='form-label'>Credit Days</Form.Label>
                <Form.Control
                  type="number"
                  name="creditDays"
                  value={values.creditDays}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="0"
                  min="0"
                  step="1"
                />
              </Col>
            </Row>

            <div className="d-flex gap-2 mt-2">
              <Button variant='secondary' type='button' onClick={() => resetForm()} disabled={isSubmitting}>
                Reset
              </Button>
              <Button variant='primary' type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Account Head'}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

AdminAccountHeadAdd.displayName = 'AdminAccountHeadAdd';

export default AdminAccountHeadAdd;