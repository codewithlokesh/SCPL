import React, { useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import { Formik, Form as FormikForm } from "formik";
import { TabNav } from "./ui/TabNav.page";
import { TableGrid, TwoColRow, RowCell, FormikField } from "./ui/TableGrid.page";
import "./index.css";
import EmployeeValidationSchema from "./validations";
import { useSelector } from "react-redux";
import { getUserAuthData } from "../../../redux/AuthSlice/index.slice";
import { formatDate } from "../../../utils/common.utils";

/** Tabs */
const TABS = [
  { key: "basic", label: "Basic Info" },
  { key: "official", label: "Official Details" },
  { key: "contact", label: "Contact Details" },
  { key: "address", label: "Address Details" },
  { key: "other", label: "Other Details" },
];

export default function EmployeeDetailsTabs() {
  const [active, setActive] = useState("basic"); // open “Official” to mirror screenshot
  const [editing, setEditing] = useState(true);     // official tab shows inputs in screenshot
  const currentTab = useMemo(() => active, [active]);
  const userData = useSelector(getUserAuthData);  

  const initialValues={
    ...userData,
    dob: userData.dob ? formatDate(userData.dob) : "",
  }

  return (
    <div className="masters-container">
      {/* Panel */}
      <section className="panel">
        <div className="panel-titlebar">
          <div className="title">Employee Details</div>
        </div>

        <TabNav tabs={TABS} active={active} onChange={setActive} />

        <div className="card-body">
          <Formik
            initialValues={initialValues}
            validationSchema={EmployeeValidationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              // TODO: integrate your API here
              await new Promise((r) => setTimeout(r, 400));
              setSubmitting(false);
            }}
          >
            {({ values, isSubmitting, resetForm }) => (
              <FormikForm>

                {/* --- BASIC TAB (read or edit as you like) --- */}
                {currentTab === "basic" && (
                  <TableGrid>
                    <RowCell label="M/s Name:"><FormikField name="partyName" readOnly={editing} /> </RowCell>
                    <RowCell label="Gender:"><FormikField name="gender" type="select" options={["Male", "Female", "Other"]} readOnly={editing} /></RowCell>
                    <RowCell label="DOB: (DD/MM/YYYY)"><FormikField name="dob" placeholder="DD/MM/YYYY" readOnly={editing} /></RowCell>
                    <RowCell label="Aadhar:"><FormikField name="aadharNo" placeholder="12 digits" readOnly={editing} /></RowCell>
                    <RowCell label="Employee Machine ID:"><FormikField name="employeeMachineID" readOnly={editing} /></RowCell>
                    <div className="grid-2col">
                      <div className="grid-row actions-row">
                        <div className="cell label"></div>
                        <div className="cell input">
                          {editing ? (
                            <Button
                              type="button"
                              variant="primary"
                              size="sm"
                              className="me-2"
                              onClick={() => setEditing(false)}
                            >
                              Edit
                            </Button>
                          ) : (
                            <Button
                              type="submit"
                              variant="primary"
                              size="sm"
                              className="me-2"
                              disabled={isSubmitting}
                              onClick={() => setEditing(true)}
                            >
                              {isSubmitting ? "Saving..." : "Save"}
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              resetForm();
                              setEditing(true);
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TableGrid>
                )}

                {/* --- OFFICIAL TAB (table-like layout) --- */}
                {currentTab === "official" && (
                  <TableGrid>
                    <TwoColRow
                      left={{ label: "Company:", children: <FormikField name="company" /> }}
                      right={{ label: "Location:", children: <FormikField name="location" /> }}
                    />
                    <TwoColRow
                      left={{ label: "Department:", children: <FormikField name="department" /> }}
                      right={{ label: "Designation:", children: <FormikField name="designation" /> }}
                    />
                    <TwoColRow
                      left={{ label: "DOJ:", children: <FormikField name="doj" placeholder="DD/MM/YYYY" /> }}
                      right={{ label: "DOC:", children: <FormikField name="doc" placeholder="DD/MM/YYYY" /> }}
                    />
                    <TwoColRow
                      left={{ label: "Division:", children: <FormikField name="division" /> }}
                      right={{
                        label: "User ID:",
                        children: <input className="form-control readonly" value={values.userId} readOnly />,
                      }}
                    />

                    {/* Password row + buttons on the same line */}
                    <div className="grid-2col">
                      <RowCell label="Password:">
                        <FormikField name="password" />
                      </RowCell>

                      <div className="grid-row actions-row">
                        <div className="cell label"></div>
                        <div className="cell input">
                          <Button type="submit" variant="primary" size="sm" className="me-2" disabled={isSubmitting}>
                            {isSubmitting ? "Updating..." : "Update"}
                          </Button>
                          <Button
                            type="button"
                            variant="danger"
                            size="sm"
                            onClick={() => resetForm()}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TableGrid>
                )}

                {/* CONTACT / ADDRESS / OTHER tabs can be filled similarly */}
              </FormikForm>
            )}
          </Formik>
        </div>
      </section>

      {/* Bottom panel */}
      <section className="panel">
        <div className="panel-titlebar">
          <div className="title">Leave Request Information</div>
        </div>
        <div className="mini-tabs">
          <button type="button" className="mini-tab">My Leave Requests</button>
          <button type="button" className="mini-tab">Leave Pending Approvals</button>
          <button type="button" className="mini-tab">Approve / Reject History</button>
        </div>
        <div className="placeholder-block">
          <p className="muted">Select a leave tab to view content.</p>
        </div>
      </section>
    </div>
  );
}
