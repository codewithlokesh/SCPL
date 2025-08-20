import * as Yup from "yup";

const num = (msg = "Enter a valid number") => Yup.number().typeError(msg);
const email = Yup.string().email("Invalid email");

export const stepSchemas = {
  basic: Yup.object({
    partyName: Yup.string().trim().required("Employee name is required"),
    gender: Yup.string().oneOf(["male", "female", "other"]).required("Gender is required"),
    dob: Yup.string().nullable(),
  }),

  official: Yup.object({
    companyId: Yup.string().required("Company is required"),
    accountGroupHeadId: Yup.string().required("Account Group Head is required"),
    multipleCompanyId: Yup.string().nullable(),

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
    mobileNumberofficial: Yup.string().trim(),
    mobileNumberPersonal: Yup.string().trim(),
    contactNumberPersonal: Yup.string().trim(),
    userId: Yup.string().trim().nullable(),
    userPassword: Yup.string().trim().nullable(),
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
  }),
};

export const stepOrder = ["basic", "official", "contact", "address", "other"];

export const getStepSchema = (key) => stepSchemas[key] ?? stepSchemas.basic;
