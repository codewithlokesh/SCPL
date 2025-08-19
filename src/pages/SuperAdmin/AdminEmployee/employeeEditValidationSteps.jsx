import * as Yup from "yup";

const num = (msg = "Enter a valid number") => Yup.number().typeError(msg);
const email = Yup.string().email("Invalid email");

export const editStepOrder = ["basic", "official", "contact", "address", "other"];

export const editStepSchemas = {
  basic: Yup.object({
    partyName: Yup.string().trim().required("Employee name is required"),
    gender: Yup.string().oneOf(["Male", "Female", "Other"]).nullable(),
    dob: Yup.string().nullable(),
  }),

  official: Yup.object({
    companyId: Yup.string().required("Company is required"),
    accountGroupHeadId: Yup.string().required("Account Group Head is required"),
    openingBalance: num().required("Opening balance is required"),
    openingBalanceType: Yup.string().oneOf(["credit", "debit"]).required("Type is required"),
    salary: num().required("Salary is required"),
    isTDSApplicable: Yup.boolean(),
    tdsSection: Yup.string().when("isTDSApplicable", {
      is: true,
      then: s => s.required("TDS section required"),
    }),
    tdsRate: Yup.number().when("isTDSApplicable", {
      is: true,
      then: s => s.typeError("Enter valid rate").required("TDS rate required"),
    }),
    doj: Yup.string().nullable(),
    doc: Yup.string().nullable(),
  }),

  contact: Yup.object({
    emailIdofficial: email.nullable(),
    emailIdPersonal: email.nullable(),
    mobileNumberofficial: Yup.string().trim().nullable(),
    mobileNumberPersonal: Yup.string().trim().nullable(),
    contactNumberPersonal: Yup.string().trim().nullable(),
    userId: Yup.string().trim().nullable(),
    userPassword: Yup.string().trim().nullable(),
  }),

  address: Yup.object({
    addressLine1: Yup.string().trim().nullable(),
    addressLine2: Yup.string().trim().nullable(),
    countryId: Yup.string().nullable(),
    stateId: Yup.string().nullable(),
    cityId: Yup.string().nullable(),
    pincode: Yup.string().trim().nullable(),
  }),

  other: Yup.object({
    pan: Yup.string().trim().nullable(),
    tan: Yup.string().trim().nullable(),
    aadharNo: Yup.string().trim().nullable(),
    isActive: Yup.boolean().nullable(),
  }),
};

export const getEditStepSchema = (key) => editStepSchemas[key] ?? editStepSchemas.basic;
