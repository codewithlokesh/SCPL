import * as Yup from "yup";

const EmployeeValidationSchema = Yup.object().shape({
  // Mandatory fields
  partyName: Yup.string()
    .required('Employee name is required')
    .min(2, 'Employee name must be at least 2 characters')
    .max(100, 'Employee name must not exceed 100 characters'),
  
  openingBalance: Yup.number()
    .required('Opening balance is required')
    .min(0, 'Opening balance must be non-negative'),
  
  openingBalanceType: Yup.string()
    .required('Opening balance type is required')
    .oneOf(['credit', 'debit'], 'Invalid balance type'),
  
  companyId: Yup.string()
    .required('Company is required'),
  
  accountGroupHeadId: Yup.string()
    .required('Account group head is required'),
  
  isTDSApplicable: Yup.boolean()
    .required('TDS applicable status is required'),
  
  gender: Yup.string()
    .required('Gender is required')
    .oneOf(['male', 'female', 'other'], 'Invalid gender'),
  
  salary: Yup.number()
    .required('Salary is required')
    .min(0, 'Salary must be non-negative'),

  // Optional fields with conditional validation
  addressLine1: Yup.string()
    .max(200, 'Address line 1 must not exceed 200 characters'),
  
  addressLine2: Yup.string()
    .max(200, 'Address line 2 must not exceed 200 characters'),
  
  cityId: Yup.string(),
  stateId: Yup.string(),
  
  pincode: Yup.string()
    .test('pincode-format', 'Invalid pincode format', function(value) {
      if (!value) return true; // Allow empty
      return /^[1-9][0-9]{5}$/.test(value);
    }),
  
  countryId: Yup.string(),
  
  pan: Yup.string()
    .test('pan-format', 'Invalid PAN number format', function(value) {
      if (!value) return true; // Allow empty
      return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value);
    }),
  
  tan: Yup.string()
    .test('tan-format', 'Invalid TAN number format', function(value) {
      if (!value) return true; // Allow empty
      return /^[A-Z]{4}[0-9]{5}[A-Z]{1}$/.test(value);
    }),
  
  aadharNo: Yup.string()
    .test('aadhar-format', 'Invalid Aadhar number format', function(value) {
      if (!value) return true; // Allow empty
      return /^[0-9]{12}$/.test(value);
    }),
  
  doj: Yup.date()
    .test('future-date', 'Date of joining cannot be in the future', function(value) {
      if (!value) return true; // Allow empty
      return new Date(value) <= new Date();
    }),
  
  doc: Yup.date()
    .test('future-date', 'Date of confirmation cannot be in the future', function(value) {
      if (!value) return true; // Allow empty
      return new Date(value) <= new Date();
    }),
  
  mobileNumberofficial: Yup.string()
    .test('mobile-format', 'Invalid official mobile number format', function(value) {
      if (!value) return true; // Allow empty
      return /^[6-9]\d{9}$/.test(value);
    }),
  
  emailIdofficial: Yup.string()
    .test('email-format', 'Invalid official email format', function(value) {
      if (!value) return true; // Allow empty
      return Yup.string().email().isValidSync(value);
    }),
  
  dob: Yup.date()
    .test('future-date', 'Date of birth cannot be in the future', function(value) {
      if (!value) return true; // Allow empty
      return new Date(value) <= new Date();
    }),
  
  mobileNumberPersonal: Yup.string()
    .test('mobile-format', 'Invalid personal mobile number format', function(value) {
      if (!value) return true; // Allow empty
      return /^[6-9]\d{9}$/.test(value);
    }),
  
  contactNumberPersonal: Yup.string()
    .test('contact-format', 'Invalid contact number format', function(value) {
      if (!value) return true; // Allow empty
      return /^[0-9+\-\s()]{10,15}$/.test(value);
    }),
  
  userId: Yup.string()
    .max(50, 'User ID must not exceed 50 characters'),
  
  userPassword: Yup.string()
    .test('password-strength', 'Password must be at least 6 characters', function(value) {
      if (!value) return true; // Allow empty
      return value.length >= 6;
    }),
  
  emailIdPersonal: Yup.string()
    .test('email-format', 'Invalid personal email format', function(value) {
      if (!value) return true; // Allow empty
      return Yup.string().email().isValidSync(value);
    }),
  
  multipleCompanyId: Yup.string(),
  
  tdsSection: Yup.string()
    .test('tds-section', 'TDS section is required when TDS is applicable', function(value) {
      const { isTDSApplicable } = this.parent;
      if (isTDSApplicable && !value) {
        return this.createError({ message: 'TDS section is required when TDS is applicable' });
      }
      return true;
    }),
  
  tdsRate: Yup.number()
    .test('tds-rate', 'TDS rate is required when TDS is applicable', function(value) {
      const { isTDSApplicable } = this.parent;
      if (isTDSApplicable && (value === undefined || value === null || value === '')) {
        return this.createError({ message: 'TDS rate is required when TDS is applicable' });
      }
      if (isTDSApplicable && value !== undefined && value !== null && value !== '') {
        return Yup.number().min(0, 'TDS rate must be non-negative').max(100, 'TDS rate cannot exceed 100%').isValidSync(value);
      }
      return true;
    }),
});

export default EmployeeValidationSchema;