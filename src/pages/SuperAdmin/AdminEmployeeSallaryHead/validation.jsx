import * as Yup from "yup";

const EmployeeWiseSallaryHeadValidationSchema = Yup.object().shape({
  transactionType: Yup.string()
    .required('Transaction Type is required'),
  salaryHeadName: Yup.string()
    .required('Salary Head is required'),
});

export default EmployeeWiseSallaryHeadValidationSchema;
