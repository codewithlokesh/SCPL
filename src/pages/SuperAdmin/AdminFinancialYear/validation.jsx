import * as Yup from "yup";

const FinancialYearValidationSchema = Yup.object().shape({
  financialYearName: Yup.string()
    .required('Financial year name is required')
    .min(2, 'Financial year name must be at least 2 characters')
    .max(50, 'Financial year name must not exceed 50 characters'),
  startDate: Yup.date()
    .required('Start date is required')
    .typeError('Please enter a valid start date'),
  endDate: Yup.date()
    .required('End date is required')
    .typeError('Please enter a valid end date')
    .min(Yup.ref('startDate'), 'End date must be after start date'),
  // closedDate: Yup.date()
  //   .required('Closed date is required')
  //   .typeError('Please enter a valid closed date')
  //   .min(Yup.ref('startDate'), 'Closed date must be after start date')
  //   .max(Yup.ref('endDate'), 'Closed date must be before or equal to end date'),
  // financialYearDescription: Yup.string()
  //   .required('Financial year description is required')
  //   .min(10, 'Description must be at least 10 characters')
  //   .max(500, 'Description must not exceed 500 characters'),
  // createdBy: Yup.string()
  //   .required('Created by is required'),
});

export default FinancialYearValidationSchema;
