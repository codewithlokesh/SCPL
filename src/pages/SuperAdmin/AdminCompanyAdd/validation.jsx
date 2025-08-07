import * as Yup from "yup";

const CompanyValidationSchema = Yup.object().shape({
    companyName: Yup.string()
      .required('Company name is required')
      .min(2, 'Company name must be at least 2 characters')
      .max(100, 'Company name must not exceed 100 characters'),
    logo: Yup.mixed()
      .required('Logo is required')
      .test('fileSize', 'File size must be less than 5MB', (value) => {
        if (!value) return true;
        return value && value.size <= 5 * 1024 * 1024;
      })
      .test('fileType', 'Please select a valid image file', (value) => {
        if (!value) return true;
        return value && ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'].includes(value.type);
      }),
    // Country, State, City validation
    countryId: Yup.string()
      .required('Country is required'),
    stateId: Yup.string()
      .required('State is required'),
    cityId: Yup.string()
      .required('City is required'),
    gstNumber: Yup.string()
      .required('GST number is required')
      .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GST number format'),
    registeredAddress: Yup.string()
      .required('Registered address is required')
      .min(10, 'Address must be at least 10 characters'),
    location: Yup.string()
      .required('Location is required'),
    pincode: Yup.string()
      .required('Pincode is required')
      .matches(/^[1-9][0-9]{5}$/, 'Invalid pincode format'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    website: Yup.string()
      .url('Invalid website URL')
      .required('Website is required'),
    bankName: Yup.string()
      .required('Bank name is required'),
    accountNumber: Yup.string()
      .required('Account number is required')
      .matches(/^[0-9]{9,18}$/, 'Invalid account number'),
    ifscCode: Yup.string()
      .required('IFSC code is required')
      .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code format'),
    branch: Yup.string()
      .required('Branch is required'),
    contactPersonName: Yup.string()
      .required('Contact person name is required')
      .min(2, 'Contact person name must be at least 2 characters'),
    contactNumber: Yup.string()
      .required('Contact number is required')
      .matches(/^[6-9]\d{9}$/, 'Invalid contact number format'),
    panNumber: Yup.string()
      .required('PAN number is required')
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN number format'),
    tanNumber: Yup.string()
      .required('TAN number is required')
      .matches(/^[A-Z]{4}[0-9]{5}[A-Z]{1}$/, 'Invalid TAN number format'),
    createdBy: Yup.string()
      .required('Created by is required'),
    financialYearId: Yup.string()
      .required('Financial year ID is required'),
  });

export default CompanyValidationSchema;