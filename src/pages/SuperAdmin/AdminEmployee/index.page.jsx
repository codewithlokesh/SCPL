import React, { useEffect, useState, memo } from 'react';
import { Row, Col, Card, Table, Button, Form, Modal } from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './AdminEmployee.css';
import { SuperAdminEmployeeServices, SuperAdminCountryServices, SuperAdminMastersServices, SuperAdminAccountGroupHeadServices } from '../../../services/SuperAdmin';
import { SweetAlert } from '../../../components/CommonElement/SweetAlert';
import superAdminRouteMap from '../../../routes/SuperAdmin/superAdminRouteMap';
import logger from '../../../utils/logger';
import { toast } from 'react-toastify';
import { Formik } from 'formik';
import { useRef } from 'react';
import { editStepOrder, getEditStepSchema } from './employeeEditValidationSteps';


const StepHeader = ({ steps, currentIndex, labels }) => {
  const progress = Math.round(((currentIndex + 1) / steps.length) * 100);
  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
        {steps.map((key, i) => (
          <div key={key} className="text-center" style={{ minWidth: 110 }}>
            <span className={`badge ${i <= currentIndex ? 'bg-primary' : 'bg-secondary'}`}>{i + 1}</span>
            <div className={`small mt-1 ${i === currentIndex ? 'fw-bold text-primary' : ''}`}>
              {labels[key]}
            </div>
          </div>
        ))}
      </div>
      <div className="mb-2">
        <div className="progress">
          <div className="progress-bar" role="progressbar" style={{ width: `${progress}%` }}>
            {progress}%
          </div>
        </div>
      </div>
    </div>
  );
};

const STEP_LABELS = {
  basic: "Basic Details",
  official: "Official Details",
  contact: "Contact Details",
  address: "Address Details",
  other: "Other Details",
};


const AdminEmployee = memo(() => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [companyData, setCompanyData] = useState([]);
  const [groupHeadData, setGroupHeadData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true); // Add this new state

  // Add new state for master data
  const [departmentData, setDepartmentData] = useState([]);
  const [designationData, setDesignationData] = useState([]);
  const [employeeIdData, setEmployeeIdData] = useState([]);

  const [editStepIndex, setEditStepIndex] = useState(0);
  const [modalSubmitIntent, setModalSubmitIntent] = useState('next'); // 'next' | 'save'
  const formikRef = useRef(null);

  const fetchEmployeeData = async () => {
    try {
      setTableLoading(true); // Start loading
      const res = await SuperAdminEmployeeServices.getEmployee();
      if (res && Array.isArray(res?.data)) {
        setEmployeeData(res?.data);
      } else {
        setEmployeeData([]); // Ensure empty array if no data
      }
    } catch (error) {
      console.error("error:", error);
      setEmployeeData([]); // Set empty array on error
    } finally {
      setTableLoading(false); // Stop loading
    }
  };

  const fetchCompanyMasterData = async () => {
    try {
      const res = await SuperAdminMastersServices.getCompanyMasterData();
      if (res && Array.isArray(res?.data)) {
        setCompanyData(res?.data);
      }
    } catch (error) {
      logger("error:", error);
    }
  };

  const fetchAccountGroupHeads = async () => {
    setIsLoading(true);
    try {
      const res = await SuperAdminAccountGroupHeadServices.getAccountGroupHeads();
      setGroupHeadData(Array.isArray(res?.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching account group heads:', error);
      setGroupHeadData([]);
      toast.error('Failed to load account group heads');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDepartmentData = async () => {
    try {
      const res = await SuperAdminMastersServices.getDepartmentMasterData();
      if (res && Array.isArray(res?.data)) {
        setDepartmentData(res?.data);
      }
    } catch (error) {
      console.error("error:", error);
    }
  };

  const fetchDesignationData = async () => {
    try {
      const res = await SuperAdminMastersServices.getDesignationMasterData();
      if (res && Array.isArray(res?.data)) {
        setDesignationData(res?.data);
      }
    } catch (error) {
      console.error("error:", error);
    }
  };

  const fetchEmployeeIdData = async () => {
    try {
      const res = await SuperAdminMastersServices.getEmployeeIdMasterData();
      if (res && Array.isArray(res?.data)) {
        setEmployeeIdData(res?.data);
      }
    } catch (error) {
      console.error("error:", error);
    }
  };

  useEffect(() => {
    fetchEmployeeData();
    fetchCompanyMasterData();
    fetchAccountGroupHeads();
    fetchDepartmentData();
    fetchDesignationData();
    fetchEmployeeIdData();
  }, []);

  const loadCountries = async () => {
    try {
      setLoadingCountries(true);
      const response = await SuperAdminCountryServices.getCountries();
      setCountries(response?.result?.data || []);
    } catch (e) {
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
    } catch (e) {
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
    } catch (e) {
      setCities([]);
      toast.error('Failed to load cities');
    } finally {
      setLoadingCities(false);
    }
  };

  const handleEdit = async (item) => {
    const withGeo = {
      ...item,
      countryId: item.countryId || '',
      stateId: item.stateId || '',
      cityId: item.cityId || '',
    };
    setEditingItem(withGeo);
    setShowEditModal(true);
    setEditStepIndex(0);
    setModalSubmitIntent('next');
    await loadCountries();
    if (withGeo.countryId) {
      await loadStates(withGeo.countryId);
    } else {
      setStates([]); setCities([]);
    }
    if (withGeo.countryId && withGeo.stateId) {
      await loadCities(withGeo.countryId, withGeo.stateId);
    } else {
      setCities([]);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    setIsUpdating(true);
    try {
      const payload = {
        id: editingItem.id,
        partyName: editingItem.partyName,
        partyType: editingItem.partyType,
        partyLogo: editingItem.partyLogo,
        partyIntroducerId: editingItem.partyIntroducerId,
        contactPerson: editingItem.contactPerson,
        mobileNo1: editingItem.mobileNo1,
        mobileNo2: editingItem.mobileNo2,
        alternateMobileNo: editingItem.alternateMobileNo,
        email: editingItem.email,
        phoneNo: editingItem.phoneNo,
        addressLine1: editingItem.addressLine1,
        addressLine2: editingItem.addressLine2,
        cityId: editingItem.cityId,
        stateId: editingItem.stateId,
        pincode: editingItem.pincode,
        countryId: editingItem.countryId,
        isRegisteredUnderGST: editingItem.isRegisteredUnderGST,
        gstin: editingItem.gstin,
        pan: editingItem.pan,
        tan: editingItem.tan,
        aadharNo: editingItem.aadharNo,
        openingBalance: editingItem.openingBalance,
        openingBalanceType: editingItem.openingBalanceType,
        companyId: editingItem.companyId,
        accountGroupHeadId: editingItem.accountGroupHeadId,
        isTDSApplicable: editingItem.isTDSApplicable,
        tdsSection: editingItem.tdsSection,
        tdsRate: editingItem.tdsRate,
        creditLimit: editingItem.creditLimit,
        creditDays: editingItem.creditDays,
        updatedBy: editingItem.updatedBy || editingItem.id,
        id: editingItem.id,
        locationId: editingItem.locationId,
        departmentId: editingItem.departmentId,
        designationId: editingItem.designationId,
        divisionId: editingItem.divisionId,
        doj: editingItem.doj,
        doc: editingItem.doc,
        mobileNumberofficial: editingItem.mobileNumberofficial,
        emailIdofficial: editingItem.emailIdofficial,
        gender: editingItem.gender,
        dob: editingItem.dob,
        mobileNumberPersonal: editingItem.mobileNumberPersonal,
        contactNumberPersonal: editingItem.contactNumberPersonal,
        salary: editingItem.salary,
        userId: editingItem.userId,
        userPassword: editingItem.userPassword,
        premissionId: editingItem.premissionId,
        emailIdPersonal: editingItem.emailIdPersonal,
        multipleCompanyId: editingItem.multipleCompanyId
      };

      const res = await SuperAdminEmployeeServices.updateEmployee(payload);

      if (res && (res.message === "Record updated successfully." || res.status === 'success' || res.success === true)) {
        toast.success("Employee updated successfully");
      } else if (res && res.message) {
        toast.error(res.message);
      } else {
        toast.error("Failed to update employee");
      }

      setShowEditModal(false);
      setEditingItem(null);
      await fetchEmployeeData();
    } catch (error) {
      console.error('Error updating employee:', error);
      toast.error("Failed to update employee");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingItem(null);
  };

  const handleDelete = async (id) => {
    try {
      const confirmed = await SweetAlert.confirm({
        title: 'Are you sure?',
        text: 'You want to delete this employee?',
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
      });

      if (confirmed) {
        const payload = {
          id: id,
          deletedBy: id // You might want to get the actual user ID from auth context
        };
        const response = await SuperAdminEmployeeServices.deleteEmployee(payload);
        await fetchEmployeeData();
        SweetAlert.success('Deleted!', 'Employee has been deleted.');
      }

    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error("Failed to delete employee");
    }
  };

  const handleCreateEmployee = () => {
    navigate(superAdminRouteMap.EMPLOYEE_ADD?.path || '/admin/employee/add');
  };

  const filteredData = employeeData.filter(item =>
    item.partyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.mobileNo1?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.pan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startEntry = (currentPage - 1) * entriesPerPage + 1;
  const endEntry = Math.min(currentPage * entriesPerPage, totalEntries);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  // Add these helper functions at the top of the component
  const getCompanyName = (companyId, companyData) => {
    const company = companyData.find(c => c.id === companyId);
    return company ? company.companyName : companyId || '-';
  };

  const getGroupHeadName = (groupId, groupHeadData) => {
    const groupHead = groupHeadData.find(g => g.id === groupId);
    return groupHead ? groupHead.accountGroupHeadName : groupId || '-';
  };

  // Add helper functions for names
  const getDepartmentName = (departmentId, departmentData) => {
    const dept = departmentData.find(d => d.id === departmentId);
    return dept ? dept.departmentName : departmentId || '-';
  };

  const getDesignationName = (designationId, designationData) => {
    const desig = designationData.find(d => d.id === designationId);
    return desig ? desig.designationName : designationId || '-';
  };

  const getEmployeeIdName = (employeeId, employeeIdData) => {
    const empId = employeeIdData.find(e => e.id === employeeId);
    return empId ? empId.employeeIdName : employeeId || '-';
  };

  return (
    <div className='masters-container'>
      <div className='masters-header'>
        <div className='d-flex justify-content-between align-items-center'>
          <div>
            <h1>Manage Employees</h1>
            <div className='breadcrumb'>
              Manage Employee Master
            </div>
          </div>
          <Button
            variant='primary'
            size='lg'
            onClick={handleCreateEmployee}
            className='create-company-btn'
          >
            <i className='fas fa-plus me-2'></i>
            Create Employee
          </Button>
        </div>
      </div>

      {/* Table Controls */}
      <div className='table-controls'>
        <Row className='align-items-center'>
          <Col md={6}>
            <div className='entries-control'>
              <span>Show</span>
              <Form.Select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                className='entries-select'
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </Form.Select>
              <span>entries</span>
            </div>
          </Col>
          <Col md={6} className='text-end'>
            <div className='search-control'>
              <span>Search:</span>
              <Form.Control
                type='text'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder='Search by employee name, contact person, email, mobile, PAN, or machine ID...'
                className='search-input'
              />
            </div>
          </Col>
        </Row>
      </div>

      {/* Data Table */}
      <div className='table-container'>
        <div className='table-scroll-container'>
          <Table className='masters-table'>
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Employee Name</th>
                <th>Company</th>
                <th>Account Group Head</th>
                <th>Contact Person</th>
                <th>Mobile No</th>
                <th>Email</th>
                {/* <th>Department</th>
                <th>Designation</th> */}
                <th>DOJ</th>
                <th>PAN</th>
                <th>Address</th>
                <th>Status</th>
                <th>Created Date</th>
                <th style={{ width: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableLoading ? (
                <tr>
                  <td colSpan="15" className="text-center py-5">
                    <div className="d-flex flex-column align-items-center justify-content-center">
                      <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <div className="text-muted">Loading employees...</div>
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="15" className="text-center py-5">
                    <div className="d-flex flex-column align-items-center justify-content-center">
                      <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                      <div className="text-muted fs-5">No employees found</div>
                      <div className="text-muted small">
                        {searchTerm ? 'Try adjusting your search criteria' : 'No employee data available'}
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr key={item.id}>
                    <td>{startEntry + index}</td>
                    <td>{item.partyName || '-'}</td>
                    <td>{getCompanyName(item.companyId, companyData)}</td>
                    <td>{getGroupHeadName(item.accountGroupHeadId, groupHeadData)}</td>
                    <td>{item.contactPerson || '-'}</td>
                    <td>{item.mobileNo1 || item.mobileNumberofficial || '-'}</td>
                    <td>{item.email || item.emailIdofficial || '-'}</td>
                    {/* <td>{getDepartmentName(item.departmentId, departmentData)}</td>
                    <td>{getDesignationName(item.designationId, designationData)}</td> */}
                    <td>{item.doj ? new Date(item.doj).toLocaleDateString() : '-'}</td>
                    <td>{item.pan || '-'}</td>
                    <td style={{ maxWidth: '200px', wordWrap: 'break-word' }}>
                      {item.addressLine1 && item.addressLine2 ?
                        `${item.addressLine1}, ${item.addressLine2}` :
                        item.addressLine1 || item.addressLine2 || '-'}
                    </td>
                    <td>
                      <span className={`badge ${item.isActive ? 'bg-success' : 'bg-danger'}`}>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}</td>
                    <td>
                      <div className="d-flex gap-2 justify-content-center">
                        <Button
                          variant='primary'
                          size='sm'
                          className='edit-btn'
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant='danger'
                          size='sm'
                          className='delete-btn'
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </div>

      {/* Table Summary and Pagination - Only show when there's data and not loading */}
      {!tableLoading && filteredData.length > 0 && (
        <div className='table-summary'>
          <Row className='align-items-center'>
            <Col md={6}>
              <div className='entries-info'>
                Showing {startEntry} to {endEntry} of {totalEntries} entries
              </div>
            </Col>
            <Col md={6} className='text-end'>
              <div className='pagination-controls'>
                <Button
                  variant='light'
                  size='sm'
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className='pagination-btn'
                >
                  Previous
                </Button>
                <Button
                  variant='primary'
                  size='sm'
                  className='pagination-btn active'
                >
                  {currentPage}
                </Button>
                <Button
                  variant='light'
                  size='sm'
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className='pagination-btn'
                >
                  Next
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      )}

      {/* Edit Modal - Fix Employee ID to be select */}
      <Modal show={showEditModal} onHide={handleCancelEdit} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Edit Employee Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {editingItem && (
            <Formik
              innerRef={formikRef}
              initialValues={editingItem}
              enableReinitialize
              validationSchema={getEditStepSchema(editStepOrder[editStepIndex])}
              onSubmit={async (values, helpers) => {
                // Move forward or save based on intent
                if (modalSubmitIntent === 'next' && editStepIndex < editStepOrder.length - 1) {
                  setEditStepIndex(i => i + 1);
                  return;
                }
                // Final save
                setIsUpdating(true);
                try {
                  const payload = {
                    ...values,
                    openingBalance: values.openingBalance ? Number(values.openingBalance) : 0,
                    tdsRate: values.tdsRate ? Number(values.tdsRate) : 0,
                    salary: values.salary ? Number(values.salary) : 0,
                    updatedBy: values.updatedBy || values.id,
                  };
                  const res = await SuperAdminEmployeeServices.updateEmployee(payload);
                  if (res && (res.message === "Record updated successfully." || res.status === 'success' || res.success === true)) {
                    toast.success("Employee updated successfully");
                    setShowEditModal(false);
                    setEditingItem(null);
                    await fetchEmployeeData();
                  } else {
                    toast.error(res?.message || "Failed to update employee");
                  }
                } catch (err) {
                  console.error('Error updating employee:', err);
                  toast.error("Failed to update employee");
                } finally {
                  setIsUpdating(false);
                }
              }}
            >
              {(f) => {
                const { values, errors, touched, handleChange, handleBlur, setFieldValue, submitForm } = f;

                // Handlers for cascading selects
                const onCountryChange = async (e) => {
                  const countryId = e.target.value;
                  setFieldValue('countryId', countryId);
                  setFieldValue('stateId', '');
                  setFieldValue('cityId', '');
                  setCities([]);
                  if (countryId) await loadStates(countryId);
                  else setStates([]);
                };
                const onStateChange = async (e) => {
                  const stateId = e.target.value;
                  setFieldValue('stateId', stateId);
                  setFieldValue('cityId', '');
                  if (stateId) await loadCities(values.countryId, stateId);
                  else setCities([]);
                };

                // Step sections
                const renderBasic = () => (
                  <>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Employee Name *</Form.Label>
                          <Form.Control
                            type="text"
                            name="partyName"
                            value={values.partyName || ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.partyName && !!errors.partyName}
                          />
                          <Form.Control.Feedback type="invalid">{errors.partyName}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Gender</Form.Label>
                          <Form.Select
                            name="gender"
                            value={values.gender}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.gender && !!errors.gender}
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Date of Birth</Form.Label>
                          <Form.Control
                            type="date"
                            name="dob"
                            value={values.dob ? String(values.dob).split('T')[0] : ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </>
                );

                const renderOfficial = () => (
                  <>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Company *</Form.Label>
                          <Form.Select
                            name="companyId"
                            value={values.companyId || ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.companyId && !!errors.companyId}
                          >
                            <option value="">Select Company</option>
                            {companyData.map(company => (
                              <option key={company.id} value={company.id}>{company.companyName}</option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">{errors.companyId}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Account Group Head *</Form.Label>
                          <Form.Select
                            name="accountGroupHeadId"
                            value={values.accountGroupHeadId || ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.accountGroupHeadId && !!errors.accountGroupHeadId}
                          >
                            <option value="">Select Group Head</option>
                            {groupHeadData.map(head => (
                              <option key={head.id} value={head.id}>{head.accountGroupHeadName}</option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">{errors.accountGroupHeadId}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Opening Balance *</Form.Label>
                          <Form.Control
                            type="number"
                            name="openingBalance"
                            value={values.openingBalance ?? ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.openingBalance && !!errors.openingBalance}
                          />
                          <Form.Control.Feedback type="invalid">{errors.openingBalance}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Opening Balance Type *</Form.Label>
                          <Form.Select
                            name="openingBalanceType"
                            value={values.openingBalanceType || ''}
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
                        <Form.Group className="mb-3">
                          <Form.Label>Salary *</Form.Label>
                          <Form.Control
                            type="number"
                            name="salary"
                            value={values.salary ?? ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.salary && !!errors.salary}
                          />
                          <Form.Control.Feedback type="invalid">{errors.salary}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>TDS Applicable</Form.Label>
                          <Form.Check
                            type="switch"
                            name="isTDSApplicable"
                            checked={!!values.isTDSApplicable}
                            onChange={(e) => setFieldValue('isTDSApplicable', e.target.checked)}
                          />
                        </Form.Group>
                      </Col>
                      {values.isTDSApplicable && (
                        <>
                          <Col md={3}>
                            <Form.Group className="mb-3">
                              <Form.Label>TDS Section *</Form.Label>
                              <Form.Control
                                type="text"
                                name="tdsSection"
                                value={values.tdsSection || ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={touched.tdsSection && !!errors.tdsSection}
                                placeholder="e.g., 194C"
                              />
                              <Form.Control.Feedback type="invalid">{errors.tdsSection}</Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md={3}>
                            <Form.Group className="mb-3">
                              <Form.Label>TDS Rate (%) *</Form.Label>
                              <Form.Control
                                type="number"
                                name="tdsRate"
                                value={values.tdsRate ?? ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={touched.tdsRate && !!errors.tdsRate}
                                step="0.01"
                              />
                              <Form.Control.Feedback type="invalid">{errors.tdsRate}</Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        </>
                      )}
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Date of Joining</Form.Label>
                          <Form.Control
                            type="date"
                            name="doj"
                            value={values.doj ? String(values.doj).split('T')[0] : ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Date of Confirmation</Form.Label>
                          <Form.Control
                            type="date"
                            name="doc"
                            value={values.doc ? String(values.doc).split('T')[0] : ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </>
                );

                const renderContact = () => (
                  <>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Official Mobile Number</Form.Label>
                          <Form.Control
                            type="text"
                            name="mobileNumberofficial"
                            value={values.mobileNumberofficial || ''}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Official Email</Form.Label>
                          <Form.Control
                            type="email"
                            name="emailIdofficial"
                            value={values.emailIdofficial || ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.emailIdofficial && !!errors.emailIdofficial}
                          />
                          <Form.Control.Feedback type="invalid">{errors.emailIdofficial}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Personal Mobile Number</Form.Label>
                          <Form.Control
                            type="text"
                            name="mobileNumberPersonal"
                            value={values.mobileNumberPersonal || ''}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Personal Contact Number</Form.Label>
                          <Form.Control
                            type="text"
                            name="contactNumberPersonal"
                            value={values.contactNumberPersonal || ''}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Personal Email</Form.Label>
                          <Form.Control
                            type="email"
                            name="emailIdPersonal"
                            value={values.emailIdPersonal || ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.emailIdPersonal && !!errors.emailIdPersonal}
                          />
                          <Form.Control.Feedback type="invalid">{errors.emailIdPersonal}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>User ID</Form.Label>
                          <Form.Control
                            type="text"
                            name="userId"
                            value={values.userId || ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.userId && !!errors.userId}
                          />
                          <Form.Control.Feedback type="invalid">{errors.userId}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>User Password</Form.Label>
                          <Form.Control
                            type="password"
                            name="userPassword"
                            value={values.userPassword || ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.userPassword && !!errors.userPassword}
                          />
                          <Form.Control.Feedback type="invalid">{errors.userPassword}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                  </>
                );

                const renderAddress = () => (
                  <>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Address Line 1</Form.Label>
                          <Form.Control
                            type="text"
                            name="addressLine1"
                            value={values.addressLine1 || ''}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Address Line 2</Form.Label>
                          <Form.Control
                            type="text"
                            name="addressLine2"
                            value={values.addressLine2 || ''}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6} className="position-relative">
                        <Form.Group className="mb-3">
                          <Form.Label>Country</Form.Label>
                          <div style={{ position: 'relative' }}>
                            <Form.Select
                              name="countryId"
                              value={values.countryId || ''}
                              onChange={onCountryChange}
                              onBlur={handleBlur}
                              disabled={loadingCountries}
                              style={loadingCountries ? { backgroundColor: '#f5f5f5' } : {}}
                            >
                              <option value="">Select Country</option>
                              {countries.map(c => (
                                <option key={c.id} value={c.id}>{c.countryName}</option>
                              ))}
                            </Form.Select>
                            {loadingCountries && (
                              <span className="spinner-border spinner-border-sm text-primary"
                                style={{ position: 'absolute', top: '50%', right: 10, transform: 'translateY(-50%)' }} />
                            )}
                          </div>
                        </Form.Group>
                      </Col>

                      <Col md={6} className="position-relative">
                        <Form.Group className="mb-3">
                          <Form.Label>State</Form.Label>
                          <div style={{ position: 'relative' }}>
                            <Form.Select
                              name="stateId"
                              value={values.stateId || ''}
                              onChange={onStateChange}
                              onBlur={handleBlur}
                              disabled={loadingStates || !values.countryId}
                              style={loadingStates ? { backgroundColor: '#f5f5f5' } : {}}
                            >
                              <option value="">Select State</option>
                              {states.map(s => (
                                <option key={s.id} value={s.id}>{s.stateName}</option>
                              ))}
                            </Form.Select>
                            {loadingStates && (
                              <span className="spinner-border spinner-border-sm text-primary"
                                style={{ position: 'absolute', top: '50%', right: 10, transform: 'translateY(-50%)' }} />
                            )}
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6} className="position-relative">
                        <Form.Group className="mb-3">
                          <Form.Label>City</Form.Label>
                          <div style={{ position: 'relative' }}>
                            <Form.Select
                              name="cityId"
                              value={values.cityId || ''}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              disabled={loadingCities || !values.stateId}
                              style={loadingCities ? { backgroundColor: '#f5f5f5' } : {}}
                            >
                              <option value="">Select City</option>
                              {cities.map(city => (
                                <option key={city.id} value={city.id}>{city.cityName}</option>
                              ))}
                            </Form.Select>
                            {loadingCities && (
                              <span className="spinner-border spinner-border-sm text-primary"
                                style={{ position: 'absolute', top: '50%', right: 10, transform: 'translateY(-50%)' }} />
                            )}
                          </div>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Pincode</Form.Label>
                          <Form.Control
                            type="text"
                            name="pincode"
                            value={values.pincode || ''}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </>
                );

                const renderOther = () => (
                  <>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>PAN Number</Form.Label>
                          <Form.Control
                            type="text"
                            name="pan"
                            value={values.pan || ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.pan && !!errors.pan}
                          />
                          <Form.Control.Feedback type="invalid">{errors.pan}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Aadhar Number</Form.Label>
                          <Form.Control
                            type="text"
                            name="aadharNo"
                            value={values.aadharNo || ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.aadharNo && !!errors.aadharNo}
                          />
                          <Form.Control.Feedback type="invalid">{errors.aadharNo}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>TAN Number</Form.Label>
                          <Form.Control
                            type="text"
                            name="tan"
                            value={values.tan || ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.tan && !!errors.tan}
                          />
                          <Form.Control.Feedback type="invalid">{errors.tan}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Active Status</Form.Label>
                          <Form.Select
                            name="isActive"
                            value={values.isActive ? 'true' : 'false'}
                            onChange={(e) => setFieldValue('isActive', e.target.value === 'true')}
                          >
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                  </>
                );

                const stepKey = editStepOrder[editStepIndex];

                return (
                  <Form onSubmit={f.handleSubmit}>
                    <StepHeader steps={editStepOrder} currentIndex={editStepIndex} labels={STEP_LABELS} />
                    {stepKey === 'basic' && renderBasic()}
                    {stepKey === 'official' && renderOfficial()}
                    {stepKey === 'contact' && renderContact()}
                    {stepKey === 'address' && renderAddress()}
                    {stepKey === 'other' && renderOther()}

                    <div className="d-flex justify-content-between mt-3">
                      <Button
                        variant="outline-secondary"
                        type="button"
                        disabled={editStepIndex === 0 || isUpdating}
                        onClick={() => setEditStepIndex(i => Math.max(i - 1, 0))}
                      >
                        Back
                      </Button>

                      {stepKey !== 'other' ? (
                        <Button
                          variant="primary"
                          type="button"
                          disabled={isUpdating}
                          onClick={() => { setModalSubmitIntent('next'); submitForm(); }}
                        >
                          Next
                        </Button>
                      ) : (
                        <Button
                          variant="success"
                          type="button"
                          disabled={isUpdating}
                          onClick={() => { setModalSubmitIntent('save'); submitForm(); }}
                        >
                          {isUpdating ? 'Saving...' : 'Save Changes'}
                        </Button>
                      )}
                    </div>
                  </Form>
                );
              }}
            </Formik>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant='secondary' onClick={handleCancelEdit} disabled={isUpdating}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
});

AdminEmployee.displayName = 'AdminEmployee';

export default AdminEmployee;