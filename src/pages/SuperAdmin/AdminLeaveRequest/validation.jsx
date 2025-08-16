import * as Yup from "yup";

const LeaveRequestValidationSchema = Yup.object().shape({
  leaveType: Yup.string()
    .required('Leave type is required')
    .min(1, 'Please select a leave type'),
  
  designation: Yup.string()
    .min(1, 'Please select a designation'),
  
  employee: Yup.string()
    .required('Employee is required')
    .min(1, 'Please select an employee'),
  
  startDate: Yup.date()
    .required('Start date is required')
    .min(
      new Date(new Date().setHours(0, 0, 0, 0)),
      'Start date cannot be in the past'
    ),
  
  endDate: Yup.date()
    .required('End date is required')
    .min(Yup.ref('startDate'), 'End date must be after start date'),
});

export default LeaveRequestValidationSchema;
