import * as Yup from "yup";
const LeaveRequestValidationSchema = Yup.object().shape({
    leaveType: Yup.string()
      .required('Leave type is required')
      .min(1, 'Please select a leave type'),
    
    startDate: Yup.date()
      .required('Start date is required')
      .min(
        new Date(new Date().setHours(0, 0, 0, 0)),
        'Start date cannot be in the past'
      ),
    
    endDate: Yup.date()
      .required('End date is required')
      .min(Yup.ref('startDate'), 'End date must be after start date'),
    
    reason: Yup.string()
      .required('Reason is required')
      .min(10, 'Reason must be at least 10 characters long')
      .max(500, 'Reason cannot exceed 500 characters'),
  });
  
  export default LeaveRequestValidationSchema;