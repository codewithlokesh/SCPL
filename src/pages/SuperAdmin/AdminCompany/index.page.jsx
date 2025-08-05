import React, { useEffect, useState, memo } from 'react';
import { Row, Col, Card, Table, Button, Form, Modal } from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminMasters.css';
import { SuperAdminMastersServices } from '../../../services/SuperAdmin';
import logger from '../../../utils/logger';
import { Toaster } from '../../../components/CommonElement/Toaster';
import { SweetAlert } from '../../../components/CommonElement/SweetAlert';
import superAdminRouteMap from '../../../routes/SuperAdmin/superAdminRouteMap';

const AdminCompany = memo(() => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchCompanyMasterData = async () => {
    try {
      const res = await SuperAdminMastersServices.getCompanyMasterData();
      console.log(": ", res);
      if (res && Array.isArray(res)) {
        setCompanyData(res);
      }
    } catch (error) {
      logger("error:", error);
    }
  };

  useEffect(() => {
    fetchCompanyMasterData();
  }, []);

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    
    setIsUpdating(true);
    try {
      const payload = {
        id: editingItem.id,
        companyName: editingItem.companyName,
        logo: "string", // Static string for logo
        gstNumber: editingItem.gstNumber,
        registeredAddress: editingItem.registeredAddress,
        location: editingItem.location,
        pincode: editingItem.pincode,
        email: editingItem.email,
        website: editingItem.website,
        bankName: editingItem.bankName,
        accountNumber: editingItem.accountNumber,
        ifscCode: editingItem.ifscCode,
        branch: editingItem.branch,
        contactPersonName: editingItem.contactPersonName,
        contactNumber: editingItem.contactNumber,
        panNumber: editingItem.panNumber,
        tanNumber: editingItem.tanNumber,
        updatedBy: editingItem.updatedBy || editingItem.id,
        financialYearId: editingItem.financialYearId || editingItem.id,
      }
      const res = await SuperAdminMastersServices.updateCompanyMaster(payload);
      console.log("res :",res)
      
      // Better condition checking
      // if (res && (res.message === 'Company updated successfully' || res.status === 'success' || res.success === true)) {
      //   Toaster.success("Company updated successfully");
      // } else if (res && res.message) {
      //   Toaster.error(res.message);
      // } else {
      //   Toaster.error("Failed to update company");
      // }
      
      setShowEditModal(false);
      setEditingItem(null);
      await fetchCompanyMasterData();
    } catch (error) {
      console.error('Error updating company:', error);
      Toaster.error("Failed to update company");
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
        text: 'You want to delete this company?',
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
      });
  
      if (confirmed) {
        const response = await SuperAdminMastersServices.deleteMasterById(id);
        // setCompanyData(prevData => prevData.filter(item => item.id !== id));
        await fetchCompanyMasterData();
        SweetAlert.success('Deleted!', 'Company has been deleted.');
      }
      
    } catch (error) {
      console.error('Error deleting company:', error);
    }
  };

  const handleCreateCompany = () => {
    navigate(superAdminRouteMap.COMPANY_ADD.path);
  };

  const filteredData = companyData.filter(item =>
    item.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.contactPersonName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.gstNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.panNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startEntry = (currentPage - 1) * entriesPerPage + 1;
  const endEntry = Math.min(currentPage * entriesPerPage, totalEntries);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  return (
    <div className='masters-container'>
      <div className='masters-header'>
        <div className='d-flex justify-content-between align-items-center'>
          <div>
            <h1>Manage Companies</h1>
            <div className='breadcrumb'>
              Manage Company Master
            </div>
          </div>
          <Button 
            variant='primary' 
            size='lg'
            onClick={handleCreateCompany}
            className='create-company-btn'
          >
            <i className='fas fa-plus me-2'></i>
            Create Company
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
                placeholder='Search by company name, location, email, contact person, GST, or PAN...'
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
                <th>Company Name</th>
                <th>Location</th>
                <th>Contact Person</th>
                <th>Contact Number</th>
                <th>Email</th>
                <th>Website</th>
                <th>GST Number</th>
                <th>PAN Number</th>
                <th>TAN Number</th>
                <th>Bank Name</th>
                <th>Account Number</th>
                <th>IFSC Code</th>
                <th>Branch</th>
                <th>Pincode</th>
                <th>Registered Address</th>
                <th>Created Date</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={item.id}>
                  <td>{startEntry + index}</td>
                  <td>{item.companyName || '-'}</td>
                  <td>{item.location || '-'}</td>
                  <td>{item.contactPersonName || '-'}</td>
                  <td>{item.contactNumber || '-'}</td>
                  <td>{item.email || '-'}</td>
                  <td>{item.website || '-'}</td>
                  <td>{item.gstNumber || '-'}</td>
                  <td>{item.panNumber || '-'}</td>
                  <td>{item.tanNumber || '-'}</td>
                  <td>{item.bankName || '-'}</td>
                  <td>{item.accountNumber || '-'}</td>
                  <td>{item.ifscCode || '-'}</td>
                  <td>{item.branch || '-'}</td>
                  <td>{item.pincode || '-'}</td>
                  <td style={{ maxWidth: '200px', wordWrap: 'break-word' }}>
                    {item.registeredAddress || '-'}
                  </td>
                  <td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}</td>
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
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      {/* Table Summary and Pagination */}
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

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={handleCancelEdit} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Edit Company Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingItem && (
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Company Name</Form.Label>
                    <Form.Control
                      type='text'
                      value={editingItem.companyName || ''}
                      onChange={(e) => setEditingItem({...editingItem, companyName: e.target.value})}
                      placeholder='Enter company name'
                      disabled={isUpdating}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                      type='text'
                      value={editingItem.location || ''}
                      onChange={(e) => setEditingItem({...editingItem, location: e.target.value})}
                      placeholder='Enter location'
                      disabled={isUpdating}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Contact Person</Form.Label>
                    <Form.Control
                      type='text'
                      value={editingItem.contactPersonName || ''}
                      onChange={(e) => setEditingItem({...editingItem, contactPersonName: e.target.value})}
                      placeholder='Enter contact person name'
                      disabled={isUpdating}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Contact Number</Form.Label>
                    <Form.Control
                      type='text'
                      value={editingItem.contactNumber || ''}
                      onChange={(e) => setEditingItem({...editingItem, contactNumber: e.target.value})}
                      placeholder='Enter contact number'
                      disabled={isUpdating}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type='email'
                      value={editingItem.email || ''}
                      onChange={(e) => setEditingItem({...editingItem, email: e.target.value})}
                      placeholder='Enter email'
                      disabled={isUpdating}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Website</Form.Label>
                    <Form.Control
                      type='text'
                      value={editingItem.website || ''}
                      onChange={(e) => setEditingItem({...editingItem, website: e.target.value})}
                      placeholder='Enter website'
                      disabled={isUpdating}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>GST Number</Form.Label>
                    <Form.Control
                      type='text'
                      value={editingItem.gstNumber || ''}
                      onChange={(e) => setEditingItem({...editingItem, gstNumber: e.target.value})}
                      placeholder='Enter GST number'
                      disabled={isUpdating}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>PAN Number</Form.Label>
                    <Form.Control
                      type='text'
                      value={editingItem.panNumber || ''}
                      onChange={(e) => setEditingItem({...editingItem, panNumber: e.target.value})}
                      placeholder='Enter PAN number'
                      disabled={isUpdating}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>TAN Number</Form.Label>
                    <Form.Control
                      type='text'
                      value={editingItem.tanNumber || ''}
                      onChange={(e) => setEditingItem({...editingItem, tanNumber: e.target.value})}
                      placeholder='Enter TAN number'
                      disabled={isUpdating}
                    />
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
                    <Form.Label>Bank Name</Form.Label>
                    <Form.Control
                      type='text'
                      value={editingItem.bankName || ''}
                      onChange={(e) => setEditingItem({...editingItem, bankName: e.target.value})}
                      placeholder='Enter bank name'
                      disabled={isUpdating}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Account Number</Form.Label>
                    <Form.Control
                      type='text'
                      value={editingItem.accountNumber || ''}
                      onChange={(e) => setEditingItem({...editingItem, accountNumber: e.target.value})}
                      placeholder='Enter account number'
                      disabled={isUpdating}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>IFSC Code</Form.Label>
                    <Form.Control
                      type='text'
                      value={editingItem.ifscCode || ''}
                      onChange={(e) => setEditingItem({...editingItem, ifscCode: e.target.value})}
                      placeholder='Enter IFSC code'
                      disabled={isUpdating}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Branch</Form.Label>
                    <Form.Control
                      type='text'
                      value={editingItem.branch || ''}
                      onChange={(e) => setEditingItem({...editingItem, branch: e.target.value})}
                      placeholder='Enter branch'
                      disabled={isUpdating}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Registered Address</Form.Label>
                <Form.Control
                  as='textarea'
                  rows={3}
                  value={editingItem.registeredAddress || ''}
                  onChange={(e) => setEditingItem({...editingItem, registeredAddress: e.target.value})}
                  placeholder='Enter registered address'
                  disabled={isUpdating}
                />
              </Form.Group>
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

AdminCompany.displayName = 'AdminCompany';

export default AdminCompany;