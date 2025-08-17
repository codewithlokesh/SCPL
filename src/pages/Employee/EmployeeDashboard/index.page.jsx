import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaUser, FaBuilding, FaSitemap, FaLayerGroup, FaIdBadge, FaLocationDot } from "react-icons/fa6";
import "./index.css"; // your CSS with .dashboard-box and gradient variants

/**
 * EmployeeDashboard → User Profile Dashboard
 * Shows a user's profile in attractive gradient boxes using your .dashboard-box CSS.
 * Fields: name, company, division, department, designation, address
 *
 * Usage:
 * <EmployeeDashboard profile={{
 *   name: "Rajah Sharma",
 *   company: "SCPL",
 *   division: "Enterprise",
 *   department: "Operations",
 *   designation: "Business Mentor",
 *   address: "D-12, Sector 45, Noida, Uttar Pradesh 201301"
 * }} />
 */

const defaultProfile = {
  name: "Alex Johnson",
  company: "SCPL",
  division: "Enterprise",
  department: "Product Engineering",
  designation: "Senior Software Engineer",
  address: "221B Baker Street, London NW1 6XE, UK",
};

function Box({ variant, icon, label, value }) {
  return (
    <div className={`dashboard-box ${variant}`}>
      <div>{icon}</div>
      <div className="mt-2 fw-bold fs-5 text-center px-3" style={{ lineHeight: 1.25 }}>
        {value || "—"}
      </div>
      <p className="mt-1 fw-semibold mb-0" style={{ opacity: 0.9 }}>{label}</p>
    </div>
  );
}

export default function EmployeeDashboard({ profile = defaultProfile }) {
  const { name, company, division, department, designation, address } = profile || {};

  return (
    <Container className="py-5">
      <h3 className="text-center fw-bold mb-4 text-primary">User Profile</h3>

      <Row className="g-4">
        <Col xs={12} md={4}>
          <Box
            variant="document" // purple gradient
            icon={<FaUser size={40} />}
            label="Name"
            value={name}
          />
        </Col>

        <Col xs={12} md={4}>
          <Box
            variant="brands" // orange gradient
            icon={<FaBuilding size={40} />}
            label="Company"
            value={company}
          />
        </Col>

        <Col xs={12} md={4}>
          <Box
            variant="division" // blue gradient
            icon={<FaSitemap size={40} />}
            label="Division"
            value={division}
          />
        </Col>

        <Col xs={12} md={4}>
          <Box
            variant="department" // green/blue gradient
            icon={<FaLayerGroup size={40} />}
            label="Department"
            value={department}
          />
        </Col>

        <Col xs={12} md={4}>
          <Box
            variant="designation" // yellow gradient
            icon={<FaIdBadge size={40} />}
            label="Designation"
            value={designation}
          />
        </Col>

        <Col xs={12} md={4}>
          <Box
            variant="machinery" // pink gradient
            icon={<FaLocationDot size={40} />}
            label="Address"
            value={address}
          />
        </Col>
      </Row>
    </Container>
  );
}
