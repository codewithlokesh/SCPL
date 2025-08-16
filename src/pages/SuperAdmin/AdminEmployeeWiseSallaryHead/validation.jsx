import * as Yup from "yup";

const EmployeeWiseSallaryHeadValidationSchema = Yup.object().shape({
  employeeId: Yup.string()
    .required('Employee is required'),
  salaryHeadId: Yup.string()
    .required('Salary Head is required'),
  amount: Yup.number()
    .required('Amount is required')
    .min(0.01, 'Amount must be greater than 0')
    .typeError('Amount must be a valid number'),
});

export default EmployeeWiseSallaryHeadValidationSchema;
