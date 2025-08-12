import { baseRoutes } from "../../helpers/baseRoutes";

const superAdminRouteMap = {
  LOGIN: { path: `${baseRoutes.superAdminBaseRoutes}/`},
  FORGOT: { path: `${baseRoutes.superAdminBaseRoutes}/forgot-password`},
  PROFILE: { path: `${baseRoutes.superAdminBaseRoutes}/my-profile`},
  NOTIFICATIONS: { path: `${baseRoutes.superAdminBaseRoutes}/notifications`},
  // Dashboard
  DASHBOARD: { path: `${baseRoutes.superAdminBaseRoutes}/dashboard`},
  MASTERS: { path: `${baseRoutes.superAdminBaseRoutes}/masters`},
  COMPANY: { path: `${baseRoutes.superAdminBaseRoutes}/company`},
  COMPANY_ADD: { path: `${baseRoutes.superAdminBaseRoutes}/company-add`},
  COUNTRY: { path: `${baseRoutes.superAdminBaseRoutes}/country`},
  STATE: { path: `${baseRoutes.superAdminBaseRoutes}/state`},
  CITY: { path: `${baseRoutes.superAdminBaseRoutes}/city`},
  FINANCIAL_YEAR: { path: `${baseRoutes.superAdminBaseRoutes}/financial-year`},
  ACCOUNT_GROUP_HEAD: { path: `${baseRoutes.superAdminBaseRoutes}/account-group-head`},
  ACCOUNT_HEAD: { path: `${baseRoutes.superAdminBaseRoutes}/account-head`},
  ACCOUNT_HEAD_ADD: { path: `${baseRoutes.superAdminBaseRoutes}/account-head-add`},
  ROLE: { path: `${baseRoutes.superAdminBaseRoutes}/role`},
  EMPLOYEE: { path: `${baseRoutes.superAdminBaseRoutes}/employee`},
  EMPLOYEE_ADD: { path: `${baseRoutes.superAdminBaseRoutes}/employee-add`},
  // Contracts Module
  ADMINCONTRACTLIST: { path: `${baseRoutes.superAdminBaseRoutes}/contract-list`},
  ADMINCONTRACTCREATE: { path: `${baseRoutes.superAdminBaseRoutes}/contract-create`},
  ADMINCONTRACTEDIT: { path: `${baseRoutes.superAdminBaseRoutes}/contract-edit`},
  ADMINCONTRACTDETAILS: { path: `${baseRoutes.superAdminBaseRoutes}/contract-details`},
  PAYMENTS: { path: `${baseRoutes.superAdminBaseRoutes}/payments`},
  // Payouts Module
  COACHEARNINGS : { path: `${baseRoutes.superAdminBaseRoutes}/coach-earnings`},
  COACHPAYOUT : { path: `${baseRoutes.superAdminBaseRoutes}/payout-transaction-history`},
  // Users Module
  ADMINUNIVERSITYLIST: { path: `${baseRoutes.superAdminBaseRoutes}/university-list`},
  ADMINUNIVERSITYDETAILS: { path: `${baseRoutes.superAdminBaseRoutes}/university-details`},
  COACHLIST: { path: `${baseRoutes.superAdminBaseRoutes}/coach-list`},
  COACHDETAILS: { path: `${baseRoutes.superAdminBaseRoutes}/coach-details`},
  STUDENT: { path: `${baseRoutes.superAdminBaseRoutes}/students`},
  STUDENTDETAILS: { path: `${baseRoutes.superAdminBaseRoutes}/student-details`},
  STAFFS: { path: `${baseRoutes.superAdminBaseRoutes}/staff`},
  STAFFDETAILS: { path: `${baseRoutes.superAdminBaseRoutes}/staff-details`},
  STAFFSROLEPERMISSIONS: { path: `${baseRoutes.superAdminBaseRoutes}/role-and-permissions`},
  // Predictive Pance Module
  STUDENT_SCORE: { path: `${baseRoutes.superAdminBaseRoutes}/student-score`},
  // SSR (Reports) Module
  DATA_PACKAGE: { path: `${baseRoutes.superAdminBaseRoutes}/data-package`},
  // DATA_PACKAGE_DETAILS: { path: `${baseRoutes.superAdminBaseRoutes}/data-package-details`},
  // Student Coaching Module
  COACH_ASSIGNMENT: { path: `${baseRoutes.superAdminBaseRoutes}/coach-assignment`},
  SESSIONS : { path: `${baseRoutes.superAdminBaseRoutes}/sessions`},
  SESSIONSDETAILS : { path: `${baseRoutes.superAdminBaseRoutes}/sessions-details`},
  ADDITIONAL_SESSIONS : { path: `${baseRoutes.superAdminBaseRoutes}/additional-sessions`},
  // Support Module
  SUPPORTLIST : { path: `${baseRoutes.superAdminBaseRoutes}/support-tickets-list`},
  SUPPORTDETAILS : { path: `${baseRoutes.superAdminBaseRoutes}/support-tickets-details`},
  // Content Management Module
  PAGES: { path: `${baseRoutes.superAdminBaseRoutes}/pages-list`},
  BLOGLIST : { path: `${baseRoutes.superAdminBaseRoutes}/blog-list`},
  BLOGADD : { path: `${baseRoutes.superAdminBaseRoutes}/add-blog`},
  BLOGEDIT : { path: `${baseRoutes.superAdminBaseRoutes}/edit-blog`},
  BLOGDETAILS : { path: `${baseRoutes.superAdminBaseRoutes}/blog-details`},
};
export default superAdminRouteMap;