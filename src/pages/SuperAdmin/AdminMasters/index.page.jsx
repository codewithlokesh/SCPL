import React, { useEffect, useState, memo } from 'react';
import { Row, Col, Card, Table, Button, Form,  Modal } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './AdminMasters.css';
import { SuperAdminMastersServices } from '../../../services/SuperAdmin';

const AdminMasters = memo(() => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [masterType, setMasterType] = useState('');
  const [masterData, setMasterData] = useState([]);
  const [newParticular, setNewParticular] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editParticular, setEditParticular] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const type = searchParams.get('type');

  const fetchData = async () => {
    if (type) {
      try {
        const payload = {
          queryParams: { Category: type }
        };
        const res = await SuperAdminMastersServices.getMasterData(payload);
        setMasterType(type);
        setMasterData(res.masters);
      } catch (error) {
        console.error('Error fetching master data:', error);
      }
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newParticular.trim()) {
      const newEntry = {
        id: masterData.length + 1,
        srNo: masterData.length + 1,
        date: new Date().toLocaleString(),
        particular: newParticular,
        status: 'Active'
      };
      setMasterData([...masterData, newEntry]);
      setNewParticular('');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setEditParticular(item);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editParticular.trim() || !editingItem) return;
    
    setIsUpdating(true);
    try {
      const payload = {
        id : editingItem.id,
        particular : editParticular.trim(),
        updatedBy : editingItem.id,
        category : editingItem.category
      }
      
      const response = await SuperAdminMastersServices.updateMaster(payload);
      setMasterData(prevData => 
        prevData.map(item => 
          item.id === editingItem.id 
            ? { ...item, particular: editParticular.trim() }
            : item
        )
      );
      
      setShowEditModal(false);
      setEditingItem(null);
      setEditParticular('');
      
      await fetchData();
      
    } catch (error) {
      console.error('Error updating master:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingItem(null);
    setEditParticular('');
  };

  const handleDelete = async (id) => {
    try {
      const response = await SuperAdminMastersServices.deleteMasterById(id);
      setMasterData(prevData => prevData.filter(item => item.id !== id));
      await fetchData();
    } catch (error) {
      console.error('Error deleting master:', error);
    }
  };

  const filteredData = masterData.filter(item =>
    item.particular.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startEntry = (currentPage - 1) * entriesPerPage + 1;
  const endEntry = Math.min(currentPage * entriesPerPage, totalEntries);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  if (!type) {
    return (
      <div className='container-fluid'>
        <Row>
          <Col>
            <h1>Masters</h1>
            <p>Please select a master type from the sidebar.</p>
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <div className='masters-container'>
      <div className='masters-header'>
        <h1>Manage Masters</h1>
        <div className='breadcrumb'>
          Manage Document Master masters
        </div>
      </div>

      {/* Add New Entry Section */}
      <div className='add-entry-section'>
        <Form onSubmit={handleSubmit}>
          <Row className='align-items-end'>
            <Col md={4}>
              <Form.Label className='form-label'>Enter Particular</Form.Label>
              <Form.Control
                type='text'
                value={newParticular}
                onChange={(e) => setNewParticular(e.target.value)}
                placeholder='Enter particular'
                className='form-input'
              />
            </Col>
            <Col md={2}>
              <Button 
                type='submit' 
                className='submit-btn'
                disabled={!newParticular.trim()}
              >
                Submit →
              </Button>
            </Col>
          </Row>
        </Form>
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
                placeholder='Search...'
                className='search-input'
              />
            </div>
          </Col>
        </Row>
      </div>

      {/* Data Table */}
      <div className='table-container'>
        <Table className='masters-table'>
          <thead>
            <tr>
              <th>Sr No</th>
              <th>Date</th>
              <th>Particular</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}</td>
                <td>{item.particular}</td>
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
      <Modal show={showEditModal} onHide={handleCancelEdit} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Master</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Particular</Form.Label>
              <Form.Control
                type='text'
                value={editParticular?.particular}
                onChange={(e) => setEditParticular(e.target.value)}
                placeholder='Enter particular'
                disabled={isUpdating}
              />
            </Form.Group>
          </Form>
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
          >
            {isUpdating ? 'Saving...' : 'Save'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
});

AdminMasters.displayName = 'AdminMasters';

export default AdminMasters;