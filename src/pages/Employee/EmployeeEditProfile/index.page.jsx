import React, { useState, useEffect } from "react";
import { Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { Formik } from "formik";
import { SuperAdminEmployeeServices } from "../../../services/SuperAdmin";
import { SuperAdminMastersServices } from "../../../services/SuperAdmin";
import { SuperAdminCountryServices } from "../../../services/SuperAdmin/Country/index.service";
import { SuperAdminAccountGroupHeadServices } from "../../../services/SuperAdmin/AccountGroupHead/index.service";
import { useSelector } from "react-redux";
import { getUserAuthData } from "../../../redux/AuthSlice/index.slice";
import { toast } from "react-toastify";
import FileUpload from "../../../components/CommonElement/FileUpload";
import validationSchema from "./validation";
import * as Yup from "yup";

export default function EditProfile() {
  const userData = useSelector(getUserAuthData);
  const [employeeData, setEmployeeData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Master data states
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [groupHeads, setGroupHeads] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [divisions, setDivisions] = useState([]);

  // Working for companies state
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Validation schema


  // Fetch employee data by ID
  const fetchEmployeeDataById = async () => {
    try {
      setIsLoading(true);
      const res = await SuperAdminEmployeeServices.getEmployeeById(userData.id);
      console.log(": 11111", res);
      if (res && res.data?.length > 0) {
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        setEmployeeData(data);
        if (data.multipleCompanyId) {
          const companyIds = data.multipleCompanyId.split(',').filter(id => id.trim());
          const selectedComps = companies.filter(comp => companyIds.includes(comp.id));
          setSelectedCompanies(selectedComps);
        }
      } else {
        setEmployeeData(null);
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
      toast.error("Failed to fetch employee data");
      setEmployeeData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch master data
  const fetchMasterData = async () => {
    try {
      // Fetch companies
      const companiesRes = await SuperAdminMastersServices.getCompanyMasterData();
      if (companiesRes && Array.isArray(companiesRes?.data)) {
        setCompanies(companiesRes.data);
      }

      // Fetch account group heads
      const groupHeadsRes = await SuperAdminAccountGroupHeadServices.getAccountGroupHeads();
      if (groupHeadsRes && Array.isArray(groupHeadsRes?.data)) {
        setGroupHeads(groupHeadsRes.data);
      }

      // Fetch divisions
      const divisionsRes = await SuperAdminMastersServices.getMasterData({
        queryParams: { Category: 'Division' }
      });
      if (divisionsRes && Array.isArray(divisionsRes?.masters?.data)) {
        setDivisions(divisionsRes.masters.data);
      }

      // Fetch departments
      const departmentsRes = await SuperAdminMastersServices.getMasterData({
        queryParams: { Category: 'Department' }
      });
      if (departmentsRes && Array.isArray(departmentsRes?.masters?.data)) {
        setDepartments(departmentsRes.masters.data);
      }

      // Fetch designations
      const designationsRes = await SuperAdminMastersServices.getMasterData({
        queryParams: { Category: 'Designation' }
      });
      if (designationsRes && Array.isArray(designationsRes?.masters?.data)) {
        setDesignations(designationsRes.masters.data);
      }

      // Load countries
      await loadCountries();
    } catch (error) {
      console.error("Error fetching master data:", error);
      toast.error("Failed to load master data");
    }
  };

  // Load countries
  const loadCountries = async () => {
    try {
      setLoadingCountries(true);
      const response = await SuperAdminCountryServices.getCountries();
      console.log(": 22222", response);
      setCountries(response?.result?.data || []);
    } catch (error) {
      console.error("Error loading countries:", error);
      toast.error("Failed to load countries");
    } finally {
      setLoadingCountries(false);
    }
  };

  // Load states
  const loadStates = async (countryId) => {
    try {
      setLoadingStates(true);
      const response = await SuperAdminCountryServices.GetStatesByCountryId(countryId);
      console.log(": 33333", response);
      setStates(response || []);
    } catch (error) {
      console.error("Error loading states:", error);
      setStates([]);
      toast.error("Failed to load states");
    } finally {
      setLoadingStates(false);
    }
  };

  // Load cities
  const loadCities = async (countryId, stateId) => {
    try {
      setLoadingCities(true);
      const response = await SuperAdminCountryServices.GetCitiesByCountryIdandStateid(countryId, stateId);
      console.log(": 55555", response);
      setCities(response?.data || []);
    } catch (error) {
      console.error("Error loading cities:", error);
      setCities([]);
      toast.error("Failed to load cities");
    } finally {
      setLoadingCities(false);
    }
  };

  // Handle company selection for working for section
  const handleCompanySelection = (companyId, companyName, setFieldValue) => {
    setSelectedCompanies(prev => {
      const isSelected = prev.find(comp => comp.id === companyId);
      let newSelection;

      if (isSelected) {
        newSelection = prev.filter(comp => comp.id !== companyId);
      } else {
        newSelection = [...prev, { id: companyId, name: companyName }];
      }

      const companyIds = newSelection.map(comp => comp.id).join(',');
      setFieldValue('multipleCompanyId', companyIds);

      return newSelection;
    });
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const payload = {
        ...values,
        id: userData.id, // Include employee ID for update
        openingBalance: parseFloat(values.openingBalance) || 0,
        tdsRate: parseFloat(values.tdsRate) || 0,
        salary: parseFloat(values.salary) || 0,
        // Include static GUIDs as required by API
        employeeMachineID: values.employeeMachineID || '550e8400-e29b-41d4-a716-446655440001',
        locationId: values.locationId || '550e8400-e29b-41d4-a716-446655440002',
        departmentId: values.departmentId || '550e8400-e29b-41d4-a716-446655440003',
        designationId: values.designationId || '550e8400-e29b-41d4-a716-446655440004',
        divisionId: values.divisionId || '550e8400-e29b-41d4-a716-446655440005',
        premissionId: values.premissionId || '550e8400-e29b-41d4-a716-446655440006',
        createdBy: values.createdBy || userData.id,
        updatedBy: userData.id,
      };

      const response = await SuperAdminEmployeeServices.updateEmployee(payload);
      console.log(": 6666666", response);
      if (response && (response.message === "Record updated successfully." || response.status === "success")) {
        toast.success("Profile updated successfully!");
        await fetchEmployeeDataById(); // Refresh data
      } else {
        setSubmitError(response?.message || "Failed to update profile");
        toast.error(response?.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setSubmitError("An error occurred while updating the profile");
      toast.error("An error occurred while updating the profile");
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  // Initialize data
  useEffect(() => {
    fetchMasterData();
  }, []);

  useEffect(() => {
    if (companies.length > 0 && groupHeads.length > 0) {
      fetchEmployeeDataById();
    }
  }, [companies, groupHeads]);

  // Handle country change
  const handleCountryChange = (e, setFieldValue) => {
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
  const handleStateChange = (e, setFieldValue, countryId) => {
    const stateId = e.target.value;
    setFieldValue('stateId', stateId);
    setFieldValue('cityId', '');

    if (stateId) {
      loadCities(countryId, stateId);
    } else {
      setCities([]);
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!employeeData) {
    return (
      <div className="text-center py-5">
        <h4 className="text-danger">Failed to load employee data</h4>
        <p>Please try refreshing the page or contact support.</p>
      </div>
    );
  }

  // Prepare initial values
  const initialValues = {
    partyName: employeeData.partyName || "",
    role: employeeData.role || "ADMINS",
    employeeMachineID: employeeData.employeeMachineID || "",
    companyId: employeeData.companyId || "",
    accountGroupHeadId: employeeData.accountGroupHeadId || "",
    openingBalance: employeeData.openingBalance || "",
    openingBalanceType: employeeData.openingBalanceType || "Debit",
    division: employeeData.division || "",
    divisionId: employeeData.divisionId || "",
    department: employeeData.department || "",
    departmentId: employeeData.departmentId || "",
    designation: employeeData.designation || "",
    designationId: employeeData.designationId || "",
    partyLogo: employeeData.partyLogo || "",
    doj: employeeData.doj ? new Date(employeeData.doj).toISOString().split('T')[0] : "",
    doc: employeeData.doc ? new Date(employeeData.doc).toISOString().split('T')[0] : "",
    userId: employeeData.userId || "",
    userPassword: employeeData.userPassword || "",
    addressLine1: employeeData.addressLine1 || "",
    addressLine2: employeeData.addressLine2 || "",
    country: employeeData.country || "India",
    countryId: employeeData.countryId || "",
    state: employeeData.state || "Andhra Pradesh",
    stateId: employeeData.stateId || "",
    cityId: employeeData.cityId || "",
    pincode: employeeData.pincode || "",
    gender: employeeData.gender || "",
    dob: employeeData.dob ? new Date(employeeData.dob).toISOString().split('T')[0] : "",
    pan: employeeData.pan || "",
    tan: employeeData.tan || "",
    aadharNo: employeeData.aadharNo || "",
    isTDSApplicable: employeeData.isTDSApplicable || false,
    tdsSection: employeeData.tdsSection || "",
    tdsRate: employeeData.tdsRate || "",
    mobileNumberofficial: employeeData.mobileNumberofficial || "",
    emailIdofficial: employeeData.emailIdofficial || "",
    mobileNumberPersonal: employeeData.mobileNumberPersonal || "",
    emailIdPersonal: employeeData.emailIdPersonal || "",
    salary: employeeData.salary || 0, // Change from "" to 0
    contactNumberPersonal: employeeData.contactNumberPersonal || "",
    multipleCompanyId: employeeData.multipleCompanyId || "",
    // Static GUIDs
    locationId: employeeData.locationId || '550e8400-e29b-41d4-a716-446655440002',
    premissionId: employeeData.premissionId || '550e8400-e29b-41d4-a716-446655440006',
    createdBy: employeeData.createdBy || userData.id,
  };

  return (
    <div className="container-fluid">
      <h3 className="text-center fw-bold mb-4 text-primary">Edit Profile</h3>

      <Card className="shadow">
        <Card.Body className="p-4">
          {submitError && (
            <Alert variant="danger" className="mb-3">
              {submitError}
            </Alert>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            validateOnChange={true}
            validateOnBlur={true}
            enableReinitialize={true}
          >
            {({ values, handleChange, handleBlur, handleSubmit, isSubmitting, errors, touched, setFieldValue, isValid }) => (
              <Form onSubmit={handleSubmit}>
                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>M/s Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="partyName"
                        value={values.partyName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.partyName && errors.partyName}
                        placeholder="Enter Employee name"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.partyName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Role</Form.Label>
                      <Form.Control
                        type="text"
                        name="role"
                        value={values.role}
                        disabled
                        className="bg-light"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Employee Machine ID</Form.Label>
                      <Form.Control
                        type="text"
                        name="employeeMachineID"
                        value={values.employeeMachineID}
                        onChange={handleChange}
                        placeholder="Enter machine ID"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Gender *</Form.Label>
                      <Form.Select
                        name="gender"
                        value={values.gender}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.gender && errors.gender}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.gender}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Date of Birth</Form.Label>
                      <Form.Control
                        type="date"
                        name="dob"
                        value={values.dob}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.dob && errors.dob}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.dob}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Personal Contact Number</Form.Label>
                      <Form.Control
                        type="tel"
                        name="contactNumberPersonal"
                        value={values.contactNumberPersonal}
                        onChange={handleChange}
                        placeholder="Enter personal contact number"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Company *</Form.Label>
                      <Form.Select
                        name="companyId"
                        value={values.companyId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.companyId && errors.companyId}
                      >
                        <option value="">Select Company</option>
                        {companies.map((company) => (
                          <option key={company.id} value={company.id}>
                            {company.companyName}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.companyId}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Account Group Head *</Form.Label>
                      <Form.Select
                        name="accountGroupHeadId"
                        value={values.accountGroupHeadId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.accountGroupHeadId && errors.accountGroupHeadId}
                      >
                        <option value="">Select Account Group Head</option>
                        {groupHeads.map((head) => (
                          <option key={head.id} value={head.id}>
                            {head.particular}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.accountGroupHeadId}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Opening Balance *</Form.Label>
                      <Form.Control
                        type="number"
                        name="openingBalance"
                        value={values.openingBalance}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.openingBalance && errors.openingBalance}
                        placeholder="Enter opening balance"
                        step="0.01"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.openingBalance}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Opening Balance Type *</Form.Label>
                      <Form.Select
                        name="openingBalanceType"
                        value={values.openingBalanceType || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.openingBalanceType && errors.openingBalanceType}
                      >
                        <option value="">Select Type</option>
                        <option value="credit">Credit</option>
                        <option value="debit">Debit</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.openingBalanceType}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Division *</Form.Label>
                      <Form.Select
                        name="divisionId"
                        value={values.divisionId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.divisionId && errors.divisionId}
                      >
                        <option value="">Select Division</option>
                        {divisions.map((division) => (
                          <option key={division.id} value={division.id}>
                            {division.particular}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.divisionId}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Department *</Form.Label>
                      <Form.Select
                        name="departmentId"
                        value={values.departmentId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.departmentId && errors.departmentId}
                      >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.particular}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.departmentId}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Designation *</Form.Label>
                      <Form.Select
                        name="designationId"
                        value={values.designationId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.designationId && errors.designationId}
                      >
                        <option value="">Select Designation</option>
                        {designations.map((designation) => (
                          <option key={designation.id} value={designation.id}>
                            {designation.particular}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.designationId}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Date of Joining</Form.Label>
                      <Form.Control
                        type="date"
                        name="doj"
                        value={values.doj}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.doj && errors.doj}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.doj}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Date of Confirmation</Form.Label>
                      <Form.Control
                        type="date"
                        name="doc"
                        value={values.doc}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.doc && errors.doc}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.doc}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Salary *</Form.Label>
                      <Form.Control
                        type="number"
                        name="salary"
                        value={values.salary}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.salary && errors.salary}
                        placeholder="Enter salary"
                        step="0.01"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.salary}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>TDS Applicable</Form.Label>
                      <Form.Check
                        type="checkbox"
                        name="isTDSApplicable"
                        checked={values.isTDSApplicable}
                        onChange={(e) => setFieldValue('isTDSApplicable', e.target.checked)}
                        label="Check if TDS is applicable"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {values.isTDSApplicable && (
                  <Row className="mb-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>TDS Section *</Form.Label>
                        <Form.Control
                          type="text"
                          name="tdsSection"
                          value={values.tdsSection}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.tdsSection && errors.tdsSection}
                          placeholder="Enter TDS section"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.tdsSection}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>TDS Rate (%) *</Form.Label>
                        <Form.Control
                          type="number"
                          name="tdsRate"
                          value={values.tdsRate}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.tdsRate && errors.tdsRate}
                          placeholder="Enter TDS rate"
                          step="0.01"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.tdsRate}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                )}

                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Official Mobile Number</Form.Label>
                      <Form.Control
                        type="tel"
                        name="mobileNumberofficial"
                        value={values.mobileNumberofficial}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.mobileNumberofficial && errors.mobileNumberofficial}
                        placeholder="Enter official mobile number"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.mobileNumberofficial}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Official Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="emailIdofficial"
                        value={values.emailIdofficial}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.emailIdofficial && errors.emailIdofficial}
                        placeholder="Enter official email"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.emailIdofficial}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Personal Mobile Number</Form.Label>
                      <Form.Control
                        type="tel"
                        name="mobileNumberPersonal"
                        value={values.mobileNumberPersonal}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.mobileNumberPersonal && errors.mobileNumberPersonal}
                        placeholder="Enter personal mobile number"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.mobileNumberPersonal}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Personal Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="emailIdPersonal"
                        value={values.emailIdPersonal}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.emailIdPersonal && errors.emailIdPersonal}
                        placeholder="Enter personal email"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.emailIdPersonal}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Address Line 1</Form.Label>
                      <Form.Control
                        type="text"
                        name="addressLine1"
                        value={values.addressLine1}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.addressLine1 && errors.addressLine1}
                        placeholder="Enter address line 1"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.addressLine1}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Address Line 2</Form.Label>
                      <Form.Control
                        type="text"
                        name="addressLine2"
                        value={values.addressLine2}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.addressLine2 && errors.addressLine2}
                        placeholder="Enter address line 2"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.addressLine2}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Country</Form.Label>
                      <Form.Select
                        name="countryId"
                        value={values.countryId}
                        onChange={(e) => handleCountryChange(e, setFieldValue)}
                        onBlur={handleBlur}
                      >
                        <option value="">Select Country</option>
                        {countries.map((country) => (
                          <option key={country.id} value={country.id}>
                            {country.countryName}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>State</Form.Label>
                      <Form.Select
                        name="stateId"
                        value={values.stateId}
                        onChange={(e) => handleStateChange(e, setFieldValue, values.countryId)}
                        onBlur={handleBlur}
                      >
                        <option value="">Select State</option>
                        {states.map((state) => (
                          <option key={state.id} value={state.id}>
                            {state.stateName}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>City</Form.Label>
                      <Form.Select
                        name="cityId"
                        value={values.cityId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <option value="">Select City</option>
                        {cities.map((city) => (
                          <option key={city.id} value={city.id}>
                            {city.cityName}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Pincode</Form.Label>
                      <Form.Control
                        type="text"
                        name="pincode"
                        value={values.pincode}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.pincode && errors.pincode}
                        placeholder="Enter pincode"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.pincode}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>PAN Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="pan"
                        value={values.pan}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.pan && errors.pan}
                        placeholder="Enter PAN number"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.pan}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>TAN Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="tan"
                        value={values.tan}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.tan && errors.tan}
                        placeholder="Enter TAN number"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.tan}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Aadhar Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="aadharNo"
                        value={values.aadharNo}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.aadharNo && errors.aadharNo}
                        placeholder="Enter Aadhar number"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.aadharNo}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>User ID *</Form.Label>
                      <Form.Control
                        type="text"
                        name="userId"
                        value={values.userId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.userId && errors.userId}
                        placeholder="Enter user ID"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.userId}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Password *</Form.Label>
                      <Form.Control
                        type="password"
                        name="userPassword"
                        value={values.userPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.userPassword && errors.userPassword}
                        placeholder="Enter password"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.userPassword}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Working For</Form.Label>
                      <div className="position-relative">
                        <Form.Control
                          as="div"
                          className="form-control"
                          style={{
                            minHeight: '38px',
                            cursor: 'pointer',
                            backgroundColor: '#fff'
                          }}
                          onClick={toggleDropdown}
                        >
                          {selectedCompanies.length > 0 ? (
                            <div className="d-flex flex-wrap gap-1">
                              {selectedCompanies.map(company => (
                                <span
                                  key={company.id}
                                  className="badge bg-primary me-1"
                                  style={{ fontSize: '0.75rem' }}
                                >
                                  {company.name}
                                  <button
                                    type="button"
                                    className="btn-close btn-close-white ms-1"
                                    style={{ fontSize: '0.5rem' }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCompanySelection(company.id, company.name, setFieldValue);
                                    }}
                                  />
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted">Select companies...</span>
                          )}
                        </Form.Control>

                        {isDropdownOpen && (
                          <div
                            className="custom-dropdown position-absolute w-100"
                            style={{
                              top: '100%',
                              left: 0,
                              zIndex: 1050,
                              maxHeight: '200px',
                              overflowY: 'auto',
                              backgroundColor: '#fff',
                              border: '1px solid #ced4da',
                              borderRadius: '0.375rem',
                              boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)'
                            }}
                          >
                            {companies.map((company) => {
                              const isSelected = selectedCompanies.find(comp => comp.id === company.id);
                              return (
                                <div
                                  key={company.id}
                                  className={`dropdown-item d-flex align-items-center justify-content-between p-2 ${isSelected ? 'bg-light' : ''}`}
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => handleCompanySelection(company.id, company.companyName, setFieldValue)}
                                >
                                  <span>{company.companyName}</span>
                                  {isSelected && (
                                    <i className="fas fa-check text-success"></i>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col md={12} className="text-center">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={isSubmitting || !isValid}
                      className="px-5"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Updating...
                        </>
                      ) : (
                        'Update Profile'
                      )}
                    </Button>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>
    </div>
  );
}
