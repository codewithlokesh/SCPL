import * as Yup from "yup";

const RoleMasterValidationSchema = Yup.object().shape({
  roleName: Yup.string()
    .required('Role name is required')
    .min(2, 'Role name must be at least 2 characters')
    .max(50, 'Role name must not exceed 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Role name can only contain letters and spaces'),
  roleDescription: Yup.string()
    .max(200, 'Role description must not exceed 200 characters')
    .nullable(),
});

export default RoleMasterValidationSchema;
