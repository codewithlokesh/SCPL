import * as Yup from "yup";

const EmployeeValidationSchema = Yup.object({
  name: Yup.string().required("Required"),

  gender: Yup.string()
    .oneOf(["Male", "Female", "Other"])
    .required("Required"),

  dob: Yup.string()
    .matches(/^\d{2}\/\d{2}\/\d{4}$/, "Use DD/MM/YYYY")
    .nullable(true),

  aadhar: Yup.string()
    .matches(/^\d{12}$/, "12 digits")
    .nullable(true),

  machineId: Yup.string().required("Required"),

  // Official
  doj: Yup.string().nullable(true),
  doc: Yup.string().nullable(true),

  // Contact
  email: Yup.string()
    .email("Invalid email")
    .nullable(true),

  phone: Yup.string()
    .matches(/^\d{10}$/, "10 digits")
    .nullable(true),

  // Other
  notes: Yup.string()
    .max(500, "Max 500 chars")
    .nullable(true),
});

export default EmployeeValidationSchema;
