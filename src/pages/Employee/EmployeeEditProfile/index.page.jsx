import React, { useState, useEffect, useMemo } from "react";
import { Row, Col, Card, Form, Button, Alert, ProgressBar, Badge } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { getUserAuthData } from "../../../redux/AuthSlice/index.slice";
import { toast } from "react-toastify";

import { SuperAdminEmployeeServices } from "../../../services/SuperAdmin";
import { SuperAdminMastersServices } from "../../../services/SuperAdmin";
import { SuperAdminCountryServices } from "../../../services/SuperAdmin/Country/index.service";
import { SuperAdminAccountGroupHeadServices } from "../../../services/SuperAdmin/AccountGroupHead/index.service";

// --------------------------------------------------------
// Stepper helpers
// --------------------------------------------------------
const STEPS = [
  { key: "basic", label: "Basic Details" },
  { key: "official", label: "Official Details" },
  { key: "contact", label: "Contact Details" },
  { key: "address", label: "Address Details" },
  { key: "other", label: "Other Details" },
];

function StepHeader({ current }) {
  const progress = Math.round(((current + 1) / STEPS.length) * 100);
  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-2">
        {STEPS.map((s, i) => (
          <div key={s.key} className="text-center" style={{ width: `${100 / STEPS.length}%` }}>
            <Badge bg={i <= current ? "primary" : "secondary"}>{i + 1}</Badge>
            <div className={`small mt-1 ${i === current ? "fw-bold text-primary" : ""}`}>{s.label}</div>
          </div>
        ))}
      </div>
      <ProgressBar now={progress} label={`${progress}%`} />
    </div>
  );
}

// --------------------------------------------------------
// Main Component
// --------------------------------------------------------
export default function EditProfile() {
  const userData = useSelector(getUserAuthData);

  const [employeeData, setEmployeeData] = useState(null);
  const [formData, setFormData] = useState(null); // merged values across steps
  const [isLoading, setIsLoading] = useState(true);
  const [submitError, setSubmitError] = useState("");

  // Lists
  const [companies, setCompanies] = useState([]);
  const [groupHeads, setGroupHeads] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [divisions, setDivisions] = useState([]);

  // Location lists
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // Multi-company
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Wizard state
  const [step, setStep] = useState(0);
  const currentStep = STEPS[step].key;

  // --------------------------------------------------------
  // Data Fetch
  // --------------------------------------------------------
  const fetchEmployeeDataById = async () => {
    try {
      const res = await SuperAdminEmployeeServices.getEmployeeById(userData.id);
      const data = Array.isArray(res?.data) ? res.data[0] : res?.data || null;
      setEmployeeData(data);
      if (data?.multipleCompanyId && companies?.length) {
        const companyIds = data.multipleCompanyId.split(",").filter(Boolean);
        const selected = companies
          .filter(c => companyIds.includes(c.id))
          .map(c => ({ id: c.id, name: c.companyName }));
        setSelectedCompanies(selected);
      }
      return data;
    } catch (e) {
      console.error("Error fetching employee:", e);
      toast.error("Failed to fetch employee data");
      return null;
    }
  };

  const loadCountries = async () => {
    try {
      setLoadingCountries(true);
      const response = await SuperAdminCountryServices.getCountries();
      setCountries(response?.result?.data || []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load countries");
    } finally {
      setLoadingCountries(false);
    }
  };

  const loadStates = async (countryId) => {
    if (!countryId) return setStates([]);
    try {
      setLoadingStates(true);
      const response = await SuperAdminCountryServices.GetStatesByCountryId(countryId);
      setStates(response || []);
    } catch (e) {
      console.error(e);
      setStates([]);
      toast.error("Failed to load states");
    } finally {
      setLoadingStates(false);
    }
  };

  const loadCities = async (countryId, stateId) => {
    if (!countryId || !stateId) return setCities([]);
    try {
      setLoadingCities(true);
      const response = await SuperAdminCountryServices.GetCitiesByCountryIdandStateid(countryId, stateId);
      setCities(response?.data || []);
    } catch (e) {
      console.error(e);
      setCities([]);
      toast.error("Failed to load cities");
    } finally {
      setLoadingCities(false);
    }
  };

  const fetchMasterData = async () => {
    try {
      const [companiesRes, groupHeadsRes, divisionsRes, departmentsRes, designationsRes] = await Promise.all([
        SuperAdminMastersServices.getCompanyMasterData(),
        SuperAdminAccountGroupHeadServices.getAccountGroupHeads(),
        SuperAdminMastersServices.getMasterData({ queryParams: { Category: "Division" } }),
        SuperAdminMastersServices.getMasterData({ queryParams: { Category: "Department" } }),
        SuperAdminMastersServices.getMasterData({ queryParams: { Category: "Designation" } }),
      ]);

      if (Array.isArray(companiesRes?.data)) setCompanies(companiesRes.data);
      if (Array.isArray(groupHeadsRes?.data)) setGroupHeads(groupHeadsRes.data);
      if (Array.isArray(divisionsRes?.masters?.data)) setDivisions(divisionsRes.masters.data);
      if (Array.isArray(departmentsRes?.masters?.data)) setDepartments(departmentsRes.masters.data);
      if (Array.isArray(designationsRes?.masters?.data)) setDesignations(designationsRes.masters.data);

      await loadCountries();
    } catch (e) {
      console.error("Master data error:", e);
      toast.error("Failed to load master data");
    }
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await fetchMasterData();
      setIsLoading(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      // wait until companies & groupHeads are loaded to map selected companies
      if (companies.length || groupHeads.length) {
        setIsLoading(true);
        const data = await fetchEmployeeDataById();
        const init = buildInitialValues(data, userData);
        setFormData(init);
        // pre-load states/cities if present
        if (init.countryId) await loadStates(init.countryId);
        if (init.countryId && init.stateId) await loadCities(init.countryId, init.stateId);
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companies.length, groupHeads.length]);

  // --------------------------------------------------------
  // Utilities
  // --------------------------------------------------------
  const buildInitialValues = (employeeData, userData) => ({
    partyName: employeeData?.partyName || "",
    role: employeeData?.role || "ADMINS",
    employeeMachineID: employeeData?.employeeMachineID || "",
    companyId: employeeData?.companyId || "",
    accountGroupHeadId: employeeData?.accountGroupHeadId || "",
    openingBalance: employeeData?.openingBalance ?? "",
    openingBalanceType: (employeeData?.openingBalanceType || "Debit").toLowerCase(),
    divisionId: employeeData?.divisionId || "",
    departmentId: employeeData?.departmentId || "",
    designationId: employeeData?.designationId || "",
    doj: employeeData?.doj ? new Date(employeeData.doj).toISOString().split("T")[0] : "",
    doc: employeeData?.doc ? new Date(employeeData.doc).toISOString().split("T")[0] : "",
    userId: employeeData?.userId || "",
    userPassword: employeeData?.userPassword || "",

    gender: employeeData?.gender || "",
    dob: employeeData?.dob ? new Date(employeeData.dob).toISOString().split("T")[0] : "",

    addressLine1: employeeData?.addressLine1 || "",
    addressLine2: employeeData?.addressLine2 || "",
    countryId: employeeData?.countryId || "",
    stateId: employeeData?.stateId || "",
    cityId: employeeData?.cityId || "",
    pincode: employeeData?.pincode || "",

    mobileNumberofficial: employeeData?.mobileNumberofficial || "",
    emailIdofficial: employeeData?.emailIdofficial || "",
    mobileNumberPersonal: employeeData?.mobileNumberPersonal || "",
    emailIdPersonal: employeeData?.emailIdPersonal || "",
    contactNumberPersonal: employeeData?.contactNumberPersonal || "",

    isTDSApplicable: !!employeeData?.isTDSApplicable,
    tdsSection: employeeData?.tdsSection || "",
    tdsRate: employeeData?.tdsRate || "",
    salary: employeeData?.salary ?? 0,

    pan: employeeData?.pan || "",
    tan: employeeData?.tan || "",
    aadharNo: employeeData?.aadharNo || "",
    multipleCompanyId: employeeData?.multipleCompanyId || "",

    // static / audit
    locationId: employeeData?.locationId || "550e8400-e29b-41d4-a716-446655440002",
    premissionId: employeeData?.premissionId || "550e8400-e29b-41d4-a716-446655440006",
    createdBy: employeeData?.createdBy || userData?.id,
  });

  const saveAndNext = async (values, setSubmitting) => {
    setSubmitError("");
    try {
      // Merge into overall formData
      const merged = { ...formData, ...values };
      setFormData(merged);

      const payload = {
        ...merged,
        id: userData.id,
        openingBalance: parseFloat(merged.openingBalance) || 0,
        tdsRate: parseFloat(merged.tdsRate) || 0,
        salary: parseFloat(merged.salary) || 0,
        employeeMachineID: merged.employeeMachineID || "550e8400-e29b-41d4-a716-446655440001",
        locationId: merged.locationId || "550e8400-e29b-41d4-a716-446655440002",
        departmentId: merged.departmentId || "550e8400-e29b-41d4-a716-446655440003",
        designationId: merged.designationId || "550e8400-e29b-41d4-a716-446655440004",
        divisionId: merged.divisionId || "550e8400-e29b-41d4-a716-446655440005",
        premissionId: merged.premissionId || "550e8400-e29b-41d4-a716-446655440006",
        createdBy: merged.createdBy || userData.id,
        updatedBy: userData.id,
      };

      const response = await SuperAdminEmployeeServices.updateEmployee(payload);

      if (response && (response.message === "Record updated successfully." || response.status === "success")) {
        toast.success("Saved successfully");
        // next step
        setStep((s) => Math.min(s + 1, STEPS.length - 1));
      } else {
        setSubmitError(response?.message || "Failed to save");
        toast.error(response?.message || "Failed to save");
      }
    } catch (e) {
      console.error(e);
      setSubmitError("An error occurred while saving");
      toast.error("An error occurred while saving");
    } finally {
      setSubmitting(false);
    }
  };

  // Multi-company picker
  const handleCompanySelection = (companyId, companyName, setFieldValue) => {
    setSelectedCompanies((prev) => {
      const isSelected = prev.find((c) => c.id === companyId);
      let next = isSelected ? prev.filter((c) => c.id !== companyId) : [...prev, { id: companyId, name: companyName }];
      setFieldValue("multipleCompanyId", next.map((c) => c.id).join(","));
      return next;
    });
  };

  const toggleDropdown = () => setIsDropdownOpen((v) => !v);

  const handleCountryChange = async (e, setFieldValue) => {
    const countryId = e.target.value;
    setFieldValue("countryId", countryId);
    setFieldValue("stateId", "");
    setFieldValue("cityId", "");
    setCities([]);
    if (countryId) await loadStates(countryId);
    else setStates([]);
  };

  const handleStateChange = async (e, setFieldValue, countryId) => {
    const stateId = e.target.value;
    setFieldValue("stateId", stateId);
    setFieldValue("cityId", "");
    if (stateId) await loadCities(countryId, stateId);
    else setCities([]);
  };

  // --------------------------------------------------------
  // Validation Schemas (step specific)
  // --------------------------------------------------------
  const schemaBasic = Yup.object({
    partyName: Yup.string().trim().required("Name is required"),
    gender: Yup.string().oneOf(["Male", "Female", "Other"]).required("Gender is required"),
    dob: Yup.string().nullable(),
  });

  const schemaOfficial = Yup.object({
    companyId: Yup.string().required("Company is required"),
    accountGroupHeadId: Yup.string().required("Account Group Head is required"),
    divisionId: Yup.string().required("Division is required"),
    departmentId: Yup.string().required("Department is required"),
    designationId: Yup.string().required("Designation is required"),
    openingBalance: Yup.number().typeError("Enter a valid number").required("Opening balance is required"),
    openingBalanceType: Yup.string().oneOf(["credit", "debit"]).required("Type is required"),
    salary: Yup.number().typeError("Enter a valid number").required("Salary is required"),
    isTDSApplicable: Yup.boolean(),
    tdsSection: Yup.string().when("isTDSApplicable", {
      is: true,
      then: (s) => s.required("TDS section required"),
      otherwise: (s) => s.notRequired(),
    }),
    tdsRate: Yup.number().when("isTDSApplicable", {
      is: true,
      then: (s) => s.typeError("Enter valid rate").required("TDS rate required"),
      otherwise: (s) => s.notRequired(),
    }),
    userId: Yup.string().trim().required("User ID required"),
    userPassword: Yup.string().trim().required("Password required"),
  });

  const schemaContact = Yup.object({
    mobileNumberofficial: Yup.string().trim(),
    emailIdofficial: Yup.string().email("Invalid email").nullable(),
    mobileNumberPersonal: Yup.string().trim(),
    emailIdPersonal: Yup.string().email("Invalid email").nullable(),
    contactNumberPersonal: Yup.string().trim(),
  });

  const schemaAddress = Yup.object({
    addressLine1: Yup.string().trim(),
    addressLine2: Yup.string().trim(),
    countryId: Yup.string().nullable(),
    stateId: Yup.string().nullable(),
    cityId: Yup.string().nullable(),
    pincode: Yup.string().trim(),
  });

  const schemaOther = Yup.object({
    pan: Yup.string().trim(),
    tan: Yup.string().trim(),
    aadharNo: Yup.string().trim(),
    multipleCompanyId: Yup.string().trim(),
  });

  const currentSchema = useMemo(() => {
    switch (currentStep) {
      case "basic":
        return schemaBasic;
      case "official":
        return schemaOfficial;
      case "contact":
        return schemaContact;
      case "address":
        return schemaAddress;
      case "other":
        return schemaOther;
      default:
        return schemaBasic;
    }
  }, [currentStep]);

  // --------------------------------------------------------
  // Rendering states
  // --------------------------------------------------------
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 400 }}>
        <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
      </div>
    );
  }

  if (!employeeData || !formData) {
    return (
      <div className="text-center py-5">
        <h4 className="text-danger">Failed to load employee data</h4>
        <p>Please try refreshing the page or contact support.</p>
      </div>
    );
  }

  // --------------------------------------------------------
  // Step Forms
  // --------------------------------------------------------
  const renderBasic = (formik) => {
    const { values, handleChange, handleBlur, errors, touched } = formik;
    return (
      <>
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
                isInvalid={touched.partyName && !!errors.partyName}
                placeholder="Enter Employee name"
              />
              <Form.Control.Feedback type="invalid">{errors.partyName}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Role</Form.Label>
              <Form.Control type="text" name="role" value={values.role} disabled className="bg-light" />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Gender *</Form.Label>
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
              <Form.Control.Feedback type="invalid">{errors.gender}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                name="dob"
                value={values.dob}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.dob && !!errors.dob}
              />
              <Form.Control.Feedback type="invalid">{errors.dob}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
      </>
    );
  };

  const renderOfficial = (formik) => {
    const { values, handleChange, handleBlur, errors, touched, setFieldValue } = formik;
    return (
      <>
        <Row className="mb-4">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Company *</Form.Label>
              <Form.Select
                name="companyId"
                value={values.companyId}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.companyId && !!errors.companyId}
              >
                <option value="">Select Company</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>{c.companyName}</option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.companyId}</Form.Control.Feedback>
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
                isInvalid={touched.accountGroupHeadId && !!errors.accountGroupHeadId}
              >
                <option value="">Select Account Group Head</option>
                {groupHeads.map((g) => (
                  <option key={g.id} value={g.id}>{g.particular}</option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.accountGroupHeadId}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Division *</Form.Label>
              <Form.Select
                name="divisionId"
                value={values.divisionId}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.divisionId && !!errors.divisionId}
              >
                <option value="">Select Division</option>
                {divisions.map((d) => (
                  <option key={d.id} value={d.id}>{d.particular}</option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.divisionId}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Department *</Form.Label>
              <Form.Select
                name="departmentId"
                value={values.departmentId}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.departmentId && !!errors.departmentId}
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.particular}</option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.departmentId}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Designation *</Form.Label>
              <Form.Select
                name="designationId"
                value={values.designationId}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.designationId && !!errors.designationId}
              >
                <option value="">Select Designation</option>
                {designations.map((d) => (
                  <option key={d.id} value={d.id}>{d.particular}</option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.designationId}</Form.Control.Feedback>
            </Form.Group>
          </Col>
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
                isInvalid={touched.openingBalance && !!errors.openingBalance}
                step="0.01"
              />
              <Form.Control.Feedback type="invalid">{errors.openingBalance}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Opening Balance Type *</Form.Label>
              <Form.Select
                name="openingBalanceType"
                value={values.openingBalanceType || ""}
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
        </Row>

        <Row className="mb-4">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Date of Joining</Form.Label>
              <Form.Control type="date" name="doj" value={values.doj} onChange={handleChange} onBlur={handleBlur} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Date of Confirmation</Form.Label>
              <Form.Control type="date" name="doc" value={values.doc} onChange={handleChange} onBlur={handleBlur} />
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
                isInvalid={touched.salary && !!errors.salary}
                step="0.01"
              />
              <Form.Control.Feedback type="invalid">{errors.salary}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6} className="d-flex align-items-end">
            <Form.Group>
              <Form.Check
                type="checkbox"
                name="isTDSApplicable"
                checked={values.isTDSApplicable}
                onChange={(e) => setFieldValue("isTDSApplicable", e.target.checked)}
                label="TDS Applicable"
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
                  isInvalid={touched.tdsSection && !!errors.tdsSection}
                />
                <Form.Control.Feedback type="invalid">{errors.tdsSection}</Form.Control.Feedback>
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
                  isInvalid={touched.tdsRate && !!errors.tdsRate}
                  step="0.01"
                />
                <Form.Control.Feedback type="invalid">{errors.tdsRate}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        )}

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
                isInvalid={touched.userId && !!errors.userId}
              />
              <Form.Control.Feedback type="invalid">{errors.userId}</Form.Control.Feedback>
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
                isInvalid={touched.userPassword && !!errors.userPassword}
              />
              <Form.Control.Feedback type="invalid">{errors.userPassword}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
      </>
    );
  };

  const renderContact = (formik) => {
    const { values, handleChange, handleBlur, errors, touched } = formik;
    return (
      <>
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
                isInvalid={touched.mobileNumberofficial && !!errors.mobileNumberofficial}
              />
              <Form.Control.Feedback type="invalid">{errors.mobileNumberofficial}</Form.Control.Feedback>
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
                isInvalid={touched.emailIdofficial && !!errors.emailIdofficial}
              />
              <Form.Control.Feedback type="invalid">{errors.emailIdofficial}</Form.Control.Feedback>
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
                isInvalid={touched.mobileNumberPersonal && !!errors.mobileNumberPersonal}
              />
              <Form.Control.Feedback type="invalid">{errors.mobileNumberPersonal}</Form.Control.Feedback>
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
                isInvalid={touched.emailIdPersonal && !!errors.emailIdPersonal}
              />
              <Form.Control.Feedback type="invalid">{errors.emailIdPersonal}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-4">
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
      </>
    );
  };

  const renderAddress = (formik) => {
    const { values, handleChange, handleBlur, setFieldValue } = formik;
    return (
      <>
        <Row className="mb-4">
          <Col md={12}>
            <Form.Group>
              <Form.Label>Address Line 1</Form.Label>
              <Form.Control type="text" name="addressLine1" value={values.addressLine1} onChange={handleChange} onBlur={handleBlur} />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={12}>
            <Form.Group>
              <Form.Label>Address Line 2</Form.Label>
              <Form.Control type="text" name="addressLine2" value={values.addressLine2} onChange={handleChange} onBlur={handleBlur} />
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
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>{c.countryName}</option>
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
                {states.map((s) => (
                  <option key={s.id} value={s.id}>{s.stateName}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>City</Form.Label>
              <Form.Select name="cityId" value={values.cityId} onChange={handleChange} onBlur={handleBlur}>
                <option value="">Select City</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>{c.cityName}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Pincode</Form.Label>
              <Form.Control type="text" name="pincode" value={values.pincode} onChange={handleChange} onBlur={handleBlur} />
            </Form.Group>
          </Col>
        </Row>
      </>
    );
  };

  const renderOther = (formik) => {
    const { values, handleChange, handleBlur, setFieldValue } = formik;
    return (
      <>
        <Row className="mb-4">
          <Col md={4}>
            <Form.Group>
              <Form.Label>PAN Number</Form.Label>
              <Form.Control type="text" name="pan" value={values.pan} onChange={handleChange} onBlur={handleBlur} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>TAN Number</Form.Label>
              <Form.Control type="text" name="tan" value={values.tan} onChange={handleChange} onBlur={handleBlur} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Aadhar Number</Form.Label>
              <Form.Control type="text" name="aadharNo" value={values.aadharNo} onChange={handleChange} onBlur={handleBlur} />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-2">
          <Col md={12}>
            <Form.Group>
              <Form.Label>Working For (Multi-company)</Form.Label>
              <div className="position-relative">
                <Form.Control
                  as="div"
                  className="form-control"
                  style={{ minHeight: "38px", cursor: "pointer", backgroundColor: "#fff" }}
                  onClick={() => setIsDropdownOpen(true)}
                >
                  {selectedCompanies.length > 0 ? (
                    <div className="d-flex flex-wrap gap-1">
                      {selectedCompanies.map((company) => (
                        <span key={company.id} className="badge bg-primary me-1" style={{ fontSize: "0.75rem" }}>
                          {company.name}
                          <button
                            type="button"
                            className="btn-close btn-close-white ms-1"
                            style={{ fontSize: "0.5rem" }}
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
                      top: "100%",
                      left: 0,
                      zIndex: 1050,
                      maxHeight: "220px",
                      overflowY: "auto",
                      backgroundColor: "#fff",
                      border: "1px solid #ced4da",
                      borderRadius: "0.375rem",
                      boxShadow: "0 0.5rem 1rem rgba(0,0,0,.15)",
                    }}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    {companies.map((company) => {
                      const isSelected = selectedCompanies.find((c) => c.id === company.id);
                      return (
                        <div
                          key={company.id}
                          className={`dropdown-item d-flex align-items-center justify-content-between p-2 ${
                            isSelected ? "bg-light" : ""
                          }`}
                          style={{ cursor: "pointer" }}
                          onClick={() => handleCompanySelection(company.id, company.companyName, setFieldValue)}
                        >
                          <span>{company.companyName}</span>
                          {isSelected && <i className="fas fa-check text-success" />}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </Form.Group>
          </Col>
        </Row>
      </>
    );
  };

  const StepBody = (formik) => {
    switch (currentStep) {
      case "basic":
        return renderBasic(formik);
      case "official":
        return renderOfficial(formik);
      case "contact":
        return renderContact(formik);
      case "address":
        return renderAddress(formik);
      case "other":
        return renderOther(formik);
      default:
        return null;
    }
  };

  // --------------------------------------------------------
  // UI
  // --------------------------------------------------------
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

          <StepHeader current={step} />

          <Formik
            key={currentStep} // remount on step change for step-wise validation
            initialValues={formData}
            validationSchema={currentSchema}
            enableReinitialize
            validateOnChange
            validateOnBlur
            onSubmit={(values, { setSubmitting }) => saveAndNext(values, setSubmitting)}
          >
            {(formik) => (
              <Form onSubmit={formik.handleSubmit}>
                {StepBody(formik)}

                <Row>
                  <Col className="d-flex justify-content-between mt-4">
                    <Button
                      type="button"
                      variant="outline-secondary"
                      disabled={step === 0 || formik.isSubmitting}
                      onClick={() => setStep((s) => Math.max(s - 1, 0))}
                    >
                      Back
                    </Button>

                    {step < STEPS.length - 1 ? (
                      <Button type="submit" variant="primary" disabled={formik.isSubmitting || !formik.isValid}>
                        {formik.isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                            Saving...
                          </>
                        ) : (
                          "Save & Next"
                        )}
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        variant="success"
                        disabled={formik.isSubmitting || !formik.isValid}
                        onClick={async (e) => {
                          // On final step, save; after success show toast
                          e.preventDefault();
                          await formik.submitForm();
                          if (!submitError) toast.success("Profile completed!");
                        }}
                      >
                        {formik.isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                            Saving...
                          </>
                        ) : (
                          "Save & Finish"
                        )}
                      </Button>
                    )}
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
