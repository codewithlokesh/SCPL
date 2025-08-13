import React, { useEffect, useState, memo } from 'react';
import { Row, Col, Card, Table, Button, Form, Modal } from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './AdminEmployee.css';
import { SuperAdminEmployeeServices, SuperAdminCountryServices, SuperAdminMastersServices, SuperAdminAccountGroupHeadServices } from '../../../services/SuperAdmin';
import { SweetAlert } from '../../../components/CommonElement/SweetAlert';
import superAdminRouteMap from '../../../routes/SuperAdmin/superAdminRouteMap';
import logger from '../../../utils/logger';
import { toast } from 'react-toastify';

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
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Employee Name</Form.Label>
                    <Form.Control
                      type='text'
                      value={editingItem.partyName || ''}
                      onChange={(e) => setEditingItem({...editingItem, partyName: e.target.value})}
                      placeholder='Enter employee name'
                      disabled={isUpdating}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Company</Form.Label>
                    <Form.Select
                      value={editingItem.companyId || ''}
                      onChange={e => setEditingItem({ ...editingItem, companyId: e.target.value })}
                      disabled={isUpdating}
                    >
                      <option value="">Select Company</option>
                      {companyData.map(company => (
                        <option key={company.id} value={company.id}>
                          {company.companyName}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Account Group Head</Form.Label>
                    <Form.Select
                      value={editingItem.accountGroupHeadId || ''}
                      onChange={e => setEditingItem({ ...editingItem, accountGroupHeadId: e.target.value })}
                      disabled={isUpdating}
                    >
                      <option value="">Select Group Head</option>
                      {groupHeadData.map(head => (
                        <option key={head.id} value={head.id}>
                          {head.accountGroupHeadName}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {/* <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Department</Form.Label>
                    <Form.Select
                      value={editingItem.departmentId || ''}
                      onChange={e => setEditingItem({ ...editingItem, departmentId: e.target.value })}
                      disabled={isUpdating}
                    >
                      <option value="">Select Department</option>
                      {departmentData.map(dept => (
                        <option key={dept.id} value={dept.id}>
                          {dept.departmentName}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Designation</Form.Label>
                    <Form.Select
                      value={editingItem.designationId || ''}
                      onChange={e => setEditingItem({ ...editingItem, designationId: e.target.value })}
                      disabled={isUpdating}
                    >
                      <option value="">Select Designation</option>
                      {designationData.map(desig => (
                        <option key={desig.id} value={desig.id}>
                          {desig.designationName}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row> */}

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Opening Balance</Form.Label>
                    <Form.Control
                      type='number'
                      value={editingItem.openingBalance || ''}
                      onChange={(e) => setEditingItem({...editingItem, openingBalance: Number(e.target.value)})}
                      placeholder='Enter opening balance'
                      disabled={isUpdating}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Opening Balance Type</Form.Label>
                    <Form.Select
                      value={editingItem.openingBalanceType || ''}
                      onChange={(e) => setEditingItem({...editingItem, openingBalanceType: e.target.value})}
                      disabled={isUpdating}
                    >
                      <option value="">Select Type</option>
                      <option value="credit">Credit</option>
                      <option value="debit">Debit</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>TDS Applicable</Form.Label>
                    <Form.Check
                      type="switch"
                      checked={editingItem.isTDSApplicable || false}
                      onChange={(e) => setEditingItem({...editingItem, isTDSApplicable: e.target.checked})}
                      disabled={isUpdating}
                    />
                  </Form.Group>
                </Col>
                {editingItem.isTDSApplicable && (
                  <>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>TDS Section</Form.Label>
                        <Form.Control
                          type='text'
                          value={editingItem.tdsSection || ''}
                          onChange={(e) => setEditingItem({...editingItem, tdsSection: e.target.value})}
                          placeholder='e.g., 194C'
                          disabled={isUpdating}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>TDS Rate (%)</Form.Label>
                        <Form.Control
                          type='number'
                          value={editingItem.tdsRate || ''}
                          onChange={(e) => setEditingItem({...editingItem, tdsRate: Number(e.target.value)})}
                          placeholder='0.00'
                          step="0.01"
                          disabled={isUpdating}
                        />
                      </Form.Group>
                    </Col>
                  </>
                )}
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Contact Person</Form.Label>
                    <Form.Control
                      type='text'
                      value={editingItem.contactPerson || ''}
                      onChange={(e) => setEditingItem({...editingItem, contactPerson: e.target.value})}
                      placeholder='Enter contact person'
                      disabled={isUpdating}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Mobile Number (Official)</Form.Label>
                    <Form.Control
                      type='text'
                      value={editingItem.mobileNumberofficial || ''}
                      onChange={(e) => setEditingItem({...editingItem, mobileNumberofficial: e.target.value})}
                      placeholder='Enter official mobile number'
                      disabled={isUpdating}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email (Official)</Form.Label>
                    <Form.Control
                      type='email'
                      value={editingItem.emailIdofficial || ''}
                      onChange={(e) => setEditingItem({...editingItem, emailIdofficial: e.target.value})}
                      placeholder='Enter official email'
                      disabled={isUpdating}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Personal Email</Form.Label>
                    <Form.Control
                      type='email'
                      value={editingItem.emailIdPersonal || ''}
                      onChange={(e) => setEditingItem({...editingItem, emailIdPersonal: e.target.value})}
                      placeholder='Enter personal email'
                      disabled={isUpdating}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date of Joining</Form.Label>
                    <Form.Control
                      type='date'
                      value={editingItem.doj ? editingItem.doj.split('T')[0] : ''}
                      onChange={(e) => setEditingItem({...editingItem, doj: e.target.value})}
                      disabled={isUpdating}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date of Confirmation</Form.Label>
                    <Form.Control
                      type='date'
                      value={editingItem.doc ? editingItem.doc.split('T')[0] : ''}
                      onChange={(e) => setEditingItem({...editingItem, doc: e.target.value})}
                      disabled={isUpdating}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select
                      value={editingItem.gender || ''}
                      onChange={(e) => setEditingItem({...editingItem, gender: e.target.value})}
                      disabled={isUpdating}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control
                      type='date'
                      value={editingItem.dob ? editingItem.dob.split('T')[0] : ''}
                      onChange={(e) => setEditingItem({...editingItem, dob: e.target.value})}
                      disabled={isUpdating}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Personal Mobile Number</Form.Label>
                    <Form.Control
                      type='text'
                      value={editingItem.mobileNumberPersonal || ''}
                      onChange={(e) => setEditingItem({...editingItem, mobileNumberPersonal: e.target.value})}
                      placeholder='Enter personal mobile number'
                      disabled={isUpdating}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Personal Contact Number</Form.Label>
                    <Form.Control
                      type='text'
                      value={editingItem.contactNumberPersonal || ''}
                      onChange={(e) => setEditingItem({...editingItem, contactNumberPersonal: e.target.value})}
                      placeholder='Enter personal contact number'
                      disabled={isUpdating}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>User ID</Form.Label>
                    <Form.Control
                      type='text'
                      value={editingItem.userId || ''}
                      onChange={(e) => setEditingItem({...editingItem, userId: e.target.value})}
                      placeholder='Enter user ID'
                      disabled={isUpdating}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>User Password</Form.Label>
                    <Form.Control
                      type='password'
                      value={editingItem.userPassword || ''}
                      onChange={(e) => setEditingItem({...editingItem, userPassword: e.target.value})}
                      placeholder='Enter password'
                      disabled={isUpdating}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>PAN Number</Form.Label>
                    <Form.Control
                      type='text'
                      value={editingItem.pan || ''}
                      onChange={(e) => setEditingItem({...editingItem, pan: e.target.value})}
                      placeholder='Enter PAN number'
                      disabled={isUpdating}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Aadhar Number</Form.Label>
                    <Form.Control
                      type='text'
                      value={editingItem.aadharNo || ''}
                      onChange={(e) => setEditingItem({...editingItem, aadharNo: e.target.value})}
                      placeholder='Enter Aadhar number'
                      disabled={isUpdating}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Salary</Form.Label>
                    <Form.Control
                      type='number'
                      value={editingItem.salary || ''}
                      onChange={(e) => setEditingItem({...editingItem, salary: Number(e.target.value)})}
                      placeholder='Enter salary'
                      disabled={isUpdating}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Active Status</Form.Label>
                    <Form.Select
                      value={editingItem.isActive ? 'true' : 'false'}
                      onChange={(e) => setEditingItem({...editingItem, isActive: e.target.value === 'true'})}
                      disabled={isUpdating}
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6} className="position-relative">
                  <Form.Group className="mb-3">
                    <Form.Label>Country</Form.Label>
                    <div style={{ position: 'relative' }}>
                      <Form.Select
                        value={editingItem.countryId || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditingItem({ ...editingItem, countryId: val, stateId: '', cityId: '' });
                          setStates([]); setCities([]);
                          if (val) loadStates(val);
                        }}
                        disabled={loadingCountries}
                        style={loadingCountries ? { backgroundColor: '#f5f5f5' } : {}}
                      >
                        <option value="">Select Country</option>
                        {loadingCountries ? (
                          <option disabled>Loading...</option>
                        ) : (
                          countries.map((c) => (
                            <option key={c.id} value={c.id}>{c.countryName}</option>
                          ))
                        )}
                      </Form.Select>
                      {loadingCountries && (
                        <span className="spinner-border spinner-border-sm text-primary"
                              style={{ position:'absolute', top:'50%', right:10, transform:'translateY(-50%)' }} />
                      )}
                    </div>
                  </Form.Group>
                </Col>

                <Col md={6} className="position-relative">
                  <Form.Group className="mb-3">
                    <Form.Label>State</Form.Label>
                    <div style={{ position: 'relative' }}>
                      <Form.Select
                        value={editingItem.stateId || ''}
                        onChange={(e) => {
                          const stateId = e.target.value;
                          setEditingItem({ ...editingItem, stateId, cityId: '' });
                          setCities([]);
                          if (stateId) loadCities(editingItem.countryId, stateId);
                        }}
                        disabled={loadingStates || !editingItem.countryId}
                        style={loadingStates ? { backgroundColor: '#f5f5f5' } : {}}
                      >
                        <option value="">Select State</option>
                        {loadingStates ? (
                          <option disabled>Loading...</option>
                        ) : (
                          states.map((s) => (
                            <option key={s.id} value={s.id}>{s.stateName}</option>
                          ))
                        )}
                      </Form.Select>
                      {loadingStates && (
                        <span className="spinner-border spinner-border-sm text-primary"
                              style={{ position:'absolute', top:'50%', right:10, transform:'translateY(-50%)' }} />
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
                        value={editingItem.cityId || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, cityId: e.target.value })}
                        disabled={loadingCities || !editingItem.stateId}
                        style={loadingCities ? { backgroundColor: '#f5f5f5' } : {}}
                      >
                        <option value="">Select City</option>
                        {loadingCities ? (
                          <option disabled>Loading...</option>
                        ) : (
                          cities.map((city) => (
                            <option key={city.id} value={city.id}>{city.cityName}</option>
                          ))
                        )}
                      </Form.Select>
                      {loadingCities && (
                        <span className="spinner-border spinner-border-sm text-primary"
                              style={{ position:'absolute', top:'50%', right:10, transform:'translateY(-50%)' }} />
                      )}
                    </div>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Pincode</Form.Label>
                    <Form.Control
                      type='text'
                      value={editingItem.pincode || ''}
                      onChange={(e) => setEditingItem({...editingItem, pincode: e.target.value})}
                      placeholder='Enter pincode'
                      disabled={isUpdating}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Address Line 1</Form.Label>
                    <Form.Control
                      type='text'
                      value={editingItem.addressLine1 || ''}
                      onChange={(e) => setEditingItem({...editingItem, addressLine1: e.target.value})}
                      placeholder='Enter address line 1'
                      disabled={isUpdating}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Address Line 2</Form.Label>
                    <Form.Control
                      type='text'
                      value={editingItem.addressLine2 || ''}
                      onChange={(e) => setEditingItem({...editingItem, addressLine2: e.target.value})}
                      placeholder='Enter address line 2'
                      disabled={isUpdating}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant='secondary' 
            onClick={handleCancelEdit}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button 
            variant='primary' 
            onClick={handleSaveEdit}
            disabled={isUpdating}
          >
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
});

AdminEmployee.displayName = 'AdminEmployee';

export default AdminEmployee;