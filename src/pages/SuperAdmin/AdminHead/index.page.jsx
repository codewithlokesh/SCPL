import React, { useEffect, useState } from 'react';
import { Row, Col, Table, Button, Spinner, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import superAdminRouteMap from '../../../routes/SuperAdmin/superAdminRouteMap';
import { SuperAdminAccountHeadServices } from '../../../services/SuperAdmin/AccountHead/index.service';
import { SuperAdminAccountGroupHeadServices } from '../../../services/SuperAdmin/AccountGroupHead/index.service';
import { SuperAdminCountryServices, SuperAdminMastersServices } from '../../../services/SuperAdmin';
import { SweetAlert } from '../../../components/CommonElement/SweetAlert';
import { Toaster } from '../../../components/CommonElement/Toaster';
import { toast } from 'react-toastify';
import AccountHeadValidationSchema from '../AdminHeadAdd/validation';
import logger from '../../../utils/logger';

const STATIC_USER_ID = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

const AdminAccountHead = () => {
  const navigate = useNavigate();

  const [accountHeads, setAccountHeads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Additional data for edit modal
  const [groupHeadData, setGroupHeadData] = useState([]);
  const [transactionType, setTransactionType] = useState([]);
  const [countries, setCountries] = useState([]);
  const [allStates, setAllStates] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  const fetchAccountHeads = async () => {
    setIsLoading(true);
    try {
      const res = await SuperAdminAccountHeadServices.getAccountHeads();
      const list = Array.isArray(res?.data) ? res.data : [];
      setAccountHeads(list);
    } catch (e) {
      setAccountHeads([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGroupHeadData = async () => {
    try {
      const res = await SuperAdminAccountGroupHeadServices.getAccountGroupHeads();
      setGroupHeadData(Array.isArray(res?.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching account group heads:', error);
      setGroupHeadData([]);
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
    fetchAccountHeads();
    fetchGroupHeadData();
    fetchCountries();
    fetchAllStates();
    fetchAllCities();
    fetchCompanyData();
    fetchTransactionType();
  }, []);

  const handleAddNavigate = () => {
    navigate(superAdminRouteMap.ACCOUNT_HEAD_ADD.path);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (values, { resetForm, setSubmitting }) => {
    setIsUpdating(true);
    try {
      const payload = {
        id: editingItem.id,
        updatedBy: STATIC_USER_ID,
        partyName: values.partyName,
        partyType: values.partyType,
        partyLogo: editingItem.partyLogo || 'https://dummyimage.com/200x200/cccccc/000000.png&text=Logo',
        partyIntroducerId: values.partyIntroducerId || editingItem.partyIntroducerId || 'bb439f20-5212-45f2-bb57-895f6d856f10',

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

      const res = await SuperAdminAccountHeadServices.updateAccountGroupHead(payload);
      if (res?.message?.toLowerCase?.().includes('success') || (res && res.result !== false)) {
        toast.success('Account head updated successfully');
        setShowEditModal(false);
        setEditingItem(null);
        resetForm();
        await fetchAccountHeads();
      } else {
        toast.error(res?.message || 'Failed to update account head');
      }
    } catch (error) {
      console.error('Error updating account head:', error);
      toast.error('Failed to update account head');
    } finally {
      setIsUpdating(false);
      setSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingItem(null);
  };

  const handleDelete = async (id) => {
    const confirmed = await SweetAlert.confirm({
      title: 'Are you sure?',
      text: 'You want to delete this account head?',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    });
    
    if (!confirmed) return;
    
    try {
      const payload = {
        id,
        deletedBy: STATIC_USER_ID,
      };
      const res = await SuperAdminAccountHeadServices.deleteAccountGroupHead(payload);
      if (res?.message?.toLowerCase?.().includes('success') || (res && res.result !== false)) {
        await fetchAccountHeads();
        toast.success('Account head deleted successfully');
      } else {
        toast.error(res?.message || 'Failed to delete account head');
      }
    } catch (error) {
      console.error('Error deleting account head:', error);
      toast.error('Failed to delete account head');
    }
  };

  const yesNo = (v) => (v ? 'Yes' : 'No');

  return (
    <div className='financial-year-container'>
      <div className='financial-year-header'>
        <h1>Manage Account Heads</h1>
        <div className='breadcrumb'>Account Head Management</div>
      </div>

      <div className='add-entry-section mb-3 d-flex justify-content-end'>
        <Button variant='primary' onClick={handleAddNavigate} className='add-btn'>
          + Add New Account Head
        </Button>
      </div>

      {/* Horizontal scroller */}
      <div style={{ overflowX: 'auto' }}>
        <Table className='financial-year-table' striped bordered hover responsive={false} style={{ minWidth: 1600 }}>
          <thead>
            <tr>
              <th>Sr No</th>
              <th>partyName</th>
              <th>partyType</th>
              <th>contactPerson</th>
              <th>mobileNo1</th>
              <th>mobileNo2</th>
              <th>alternateMobileNo</th>
              <th>email</th>
              <th>phoneNo</th>
              <th>addressLine1</th>
              <th>addressLine2</th>
              <th>pincode</th>
              {/* <th>countryId</th> */}
              <th>isRegisteredUnderGST</th>
              <th>gstin</th>
              <th>pan</th>
              <th>tan</th>
              <th>aadharNo</th>
              <th>openingBalance</th>
              <th>openingBalanceType</th>
              <th>isTDSApplicable</th>
              <th>tdsSection</th>
              <th>tdsRate</th>
              <th>creditLimit</th>
              <th>creditDays</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan='27' className='text-center' style={{ padding: '40px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <Spinner animation='border' size='lg' />
                    <span style={{ fontSize: '16px', fontWeight: '500' }}>Loading Account Heads...</span>
                  </div>
                </td>
              </tr>
            ) : accountHeads.length === 0 ? (
              <tr>
                <td colSpan='27' className='text-center' style={{ padding: '20px' }}>No data found</td>
              </tr>
            ) : (
              accountHeads.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td>{idx + 1}</td>
                  <td>{item.partyName || ''}</td>
                  <td>{item.partyType || ''}</td>
                  <td>{item.contactPerson || ''}</td>
                  <td>{item.mobileNo1 || ''}</td>
                  <td>{item.mobileNo2 || ''}</td>
                  <td>{item.alternateMobileNo || ''}</td>
                  <td>{item.email || ''}</td>
                  <td>{item.phoneNo || ''}</td>
                  <td>{item.addressLine1 || ''}</td>
                  <td>{item.addressLine2 || ''}</td>
                  <td>{item.pincode || ''}</td>
                  {/* <td>{item.countryId || ''}</td> */}
                  <td>{yesNo(item.isRegisteredUnderGST)}</td>
                  <td>{item.gstin || ''}</td>
                  <td>{item.pan || ''}</td>
                  <td>{item.tan || ''}</td>
                  <td>{item.aadharNo || ''}</td>
                  <td>{item.openingBalance ?? ''}</td>
                  <td>{item.openingBalanceType || ''}</td>
                  <td>{yesNo(item.isTDSApplicable)}</td>
                  <td>{item.tdsSection || ''}</td>
                  <td>{item.tdsRate ?? ''}</td>
                  <td>{item.creditLimit ?? ''}</td>
                  <td>{item.creditDays ?? ''}</td>
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
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      {/* Edit Account Head Modal */}
      <Modal show={showEditModal} onHide={handleCancelEdit} size='xl' centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Account Head</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingItem && (
            <Formik
              enableReinitialize
              initialValues={{
                partyName: editingItem.partyName || '',
                partyType: editingItem.partyType || '',
                partyIntroducerId: editingItem.partyIntroducerId || '',
                contactPerson: editingItem.contactPerson || '',
                mobileNo1: editingItem.mobileNo1 || '',
                mobileNo2: editingItem.mobileNo2 || '',
                alternateMobileNo: editingItem.alternateMobileNo || '',
                email: editingItem.email || '',
                phoneNo: editingItem.phoneNo || '',
                addressLine1: editingItem.addressLine1 || '',
                addressLine2: editingItem.addressLine2 || '',
                countryId: editingItem.countryId || '',
                stateId: editingItem.stateId || '',
                cityId: editingItem.cityId || '',
                pincode: editingItem.pincode || '',
                isRegisteredUnderGST: editingItem.isRegisteredUnderGST || false,
                gstin: editingItem.gstin || '',
                pan: editingItem.pan || '',
                tan: editingItem.tan || '',
                aadharNo: editingItem.aadharNo || '',
                openingBalance: editingItem.openingBalance || 0,
                openingBalanceType: editingItem.openingBalanceType || '',
                companyId: editingItem.companyId || '',
                accountGroupHeadId: editingItem.accountGroupHeadId || '',
                isTDSApplicable: editingItem.isTDSApplicable || false,
                tdsSection: editingItem.tdsSection || '',
                tdsRate: editingItem.tdsRate || '',
                creditLimit: editingItem.creditLimit || '',
                creditDays: editingItem.creditDays || '',
              }}
              validationSchema={AccountHeadValidationSchema}
              onSubmit={handleEditSubmit}
            >
              {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                <Form id='editAccountHeadForm' onSubmit={handleSubmit}>
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
                        onChange={handleChange}
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
                        onChange={handleChange}
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
                          .filter(c => String(c.stateId) === String(values.stateId))
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
                </Form>
              )}
            </Formik>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleCancelEdit} disabled={isUpdating}>
            Cancel
          </Button>
          <Button variant='primary' type='submit' form='editAccountHeadForm' disabled={isUpdating}>
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Toaster autoClose={2000} position='top-right' theme='light' />
    </div>
  );
};

AdminAccountHead.displayName = 'AdminAccountHead';
export default AdminAccountHead;