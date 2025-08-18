// src/pages/.../EditProfile/validation.js
import * as Yup from "yup";

// Reusable bits
const email = Yup.string().email("Invalid email");
const numeric = (msg = "Enter a valid number") => Yup.number().typeError(msg);

export const stepSchemas = {
  basic: Yup.object({
    partyName: Yup.string().trim().required("Name is required"),
    gender: Yup.string().oneOf(["Male", "Female", "Other"]).required("Gender is required"),
    dob: Yup.string().nullable(),
    role: Yup.string().nullable(),
  }),

  official: Yup.object({
    companyId: Yup.string().required("Company is required"),
    accountGroupHeadId: Yup.string().required("Account Group Head is required"),
    divisionId: Yup.string().required("Division is required"),
    departmentId: Yup.string().required("Department is required"),
    designationId: Yup.string().required("Designation is required"),

    openingBalance: numeric().required("Opening balance is required"),
    openingBalanceType: Yup.string().oneOf(["credit", "debit"]).required("Type is required"),

    salary: numeric().required("Salary is required"),

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
    employeeMachineID: Yup.string().nullable(),
    doj: Yup.string().nullable(),
    doc: Yup.string().nullable(),
  }),

  contact: Yup.object({
    mobileNumberofficial: Yup.string().trim(),
    emailIdofficial: email.nullable(),
    mobileNumberPersonal: Yup.string().trim(),
    emailIdPersonal: email.nullable(),
    contactNumberPersonal: Yup.string().trim(),
  }),

  address: Yup.object({
    addressLine1: Yup.string().trim(),
    addressLine2: Yup.string().trim(),
    countryId: Yup.string().nullable(),
    stateId: Yup.string().nullable(),
    cityId: Yup.string().nullable(),
    pincode: Yup.string().trim(),
  }),

  other: Yup.object({
    pan: Yup.string().trim(),
    tan: Yup.string().trim(),
    aadharNo: Yup.string().trim(),
    multipleCompanyId: Yup.string().trim(),
  }),
};

// Helper to fetch by key safely
export const getStepSchema = (stepKey) => stepSchemas[stepKey] ?? stepSchemas.basic;
