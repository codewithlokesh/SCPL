import React from "react";
import { Field, ErrorMessage } from "formik";

// A table-like, two-column grid:  [Label | Value]  +  [Label | Value]
export function TableGrid({ children }) {
  return <div className="table-like">{children}</div>;
}

export function TwoColRow({ left, right }) {
  return (
    <div className="grid-2col">
      <RowCell label={left.label}>{left.children}</RowCell>
      <RowCell label={right.label}>{right.children}</RowCell>
    </div>
  );
}

export function RowCell({ label, children }) {
  return (
    <div className="grid-row">
      <div className="cell label">{label}</div>
      <div className="cell input">{children}</div>
    </div>
  );
}

// Formik-aware value cell (input/select/textarea). Keeps look consistent
export function FormikField({
  name,
  type = "text",
  options = [],
  placeholder,
  readOnly = false,
}) {
  if (readOnly) {
    return <Field type={type} name={name} className="form-control" placeholder={placeholder} readOnly />;
  }

  return (
    <>
      {type === "select" ? (
        <Field as="select" name={name} className="form-control">
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </Field>
      ) : type === "textarea" ? (
        <Field as="textarea" name={name} rows={4} className="form-control" placeholder={placeholder} />
      ) : (
        <Field type={type} name={name} className="form-control" placeholder={placeholder} />
      )}
      <ErrorMessage name={name} component="div" className="error" />
    </>
  );
}
