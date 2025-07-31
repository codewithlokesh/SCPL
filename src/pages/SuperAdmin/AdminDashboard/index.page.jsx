import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { CiBookmarkCheck } from "react-icons/ci";
import { FaRegRectangleList, FaBell } from "react-icons/fa6";
import { BsEnvelopePaper, BsPencilSquare, BsFillMegaphoneFill } from "react-icons/bs"
function AdminDashboard() {
  const boxStyle = {
    height: '150px',
    borderRadius: '15px',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s ease-in-out',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    cursor: 'pointer',
    color: 'white',
    transition: 'transform 0.3s ease-in-out'
  };

  return (
    <>
    <style>
                {`
          .dashboard-box:hover {
            transform: scale(1.05);
            background:red;
          }
        `}
            </style>
    <Container className="py-5">
      <h3 className="text-center fw-bold mb-4 text-primary">Dashboard</h3>
      <Row className="g-4">
        <Col xs={12} md={4} >
          <div
            className='dashboard-box'
            style={{ ...boxStyle, background: ' linear-gradient(to right, #43cea2, #185a9d)', }}>
            <CiBookmarkCheck size={40} />
            <p className="mt-2 fw-semibold mb-0">Department</p>
          </div>
        </Col>
        <Col xs={12} md={4}>
          <div
            className='dashboard-box'
            style={{ ...boxStyle, background: 'linear-gradient(to right, #36d1dc, #5b86e5)' }}>
            <FaRegRectangleList size={40} />
            <p className="mt-2 fw-semibold mb-0">Division</p>
          </div>
        </Col>
        <Col xs={12} md={4}>
          <div
            className='dashboard-box'
            style={{ ...boxStyle, background: 'linear-gradient(to right, #f7971e, #ffd200)' }}>
            <BsEnvelopePaper size={40} />
            <p className="mt-2 fw-semibold mb-0">Designation</p>
          </div>
        </Col>
        <Col xs={12} md={4}>
          <div
            className='dashboard-box'
            style={{ ...boxStyle, background: 'linear-gradient(to right, #f7971e, #ffd200)' }}>
            <FaBell size={40} />
            <p className="mt-2 fw-semibold mb-0">Brands</p>
          </div>
        </Col>
        <Col xs={12} md={4}>
          <div
            className='dashboard-box'
            style={{ ...boxStyle, background: 'linear-gradient(to right, #4a00e0, #8e2de2)' }}>
            <BsPencilSquare size={40} />
            <p className="mt-2 fw-semibold mb-0">Document</p>
          </div>
        </Col>
        <Col xs={12} md={4}>
          <div
            className='dashboard-box'
            style={{ ...boxStyle, background: 'linear-gradient(to right, #ec008c, #fc6767)' }}>
            <BsFillMegaphoneFill size={40} />
            <i class="bi bi-envelope-paper"></i>
            <p className="mt-2 fw-semibold mb-0">Machinery's</p>
          </div>
        </Col>
      </Row>
    </Container>
    </>
  );
}

export default AdminDashboard;
