import * as Yup from "yup";

const GroupHeadValidationSchema = Yup.object().shape({
  accountMasterCategory: Yup.string()
    .required('Account master category is required')
    .min(2, 'Category must be at least 2 characters')
    .max(50, 'Category must not exceed 50 characters'),
  accountGroupHeadName: Yup.string()
    .required('Group head name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  // accountGroupHeadCode: Yup.string()
  //   .required('Group head code is required')
  //   .min(1, 'Code must be at least 1 character')
  //   .max(20, 'Code must not exceed 20 characters')
  //   .nullable(),
  // accountGroupHeadDescription: Yup.string()
  //   .max(500, 'Description must not exceed 500 characters')
  //   .nullable(),
});

export default GroupHeadValidationSchema;
