import * as Yup from "yup";

const AccountHeadValidationSchema = Yup.object().shape({
  partyName: Yup.string().required("Party name is required"),
  companyId: Yup.string().required("Company is required"),
  accountGroupHeadId: Yup.string().required("Account group head is required"),
  openingBalanceType: Yup.string().required("Opening balance type is required"),
  openingBalance: Yup.number()
    .typeError("Opening balance must be a number")
    .required("Opening balance is required"),
  isRegisteredUnderGST: Yup.boolean().required("Please specify if registered under GST"),
  isTDSApplicable: Yup.boolean().required("Please specify if TDS is applicable"),
  createdBy: Yup.string().required("Created by is required"),
});

export default AccountHeadValidationSchema;
