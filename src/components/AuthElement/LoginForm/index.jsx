import React, { useState } from "react";
import logo from "../../../../public/logo.png";
import bgImage from "../../../../public/img_667bef9991116.jpg";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import validation from "./validation";

export default function LoginForm({ onSubmit = () => {}, isSubmitting }) {
  return (
    <div
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        minHeight: "100vh",
      }}
    >
      <section className="h-100 gradient-form" style={{ opacity: 0.9 }}>
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-xl-10">
              <div className="card rounded-3 text-black">
                <div className="row g-0">
                  <div className="col-lg-6">
                    <div className="card-body p-md-5 mx-md-4">
                      <div className="text" style={{ textAlign: "center" }}>
                        <h1 className="mt-1 mb-5 pb-1">
                          <br />
                          ERP
                        </h1>
                      </div>
                      <p>Please login to your ERP account</p>
                      <Formik
                        initialValues={{ username: "", password: "" }}
                        validationSchema={validation}
                        onSubmit={onSubmit}
                      >
                        {({ isSubmitting }) => (
                          <Form>
                            <div className="form-outline mb-4">
                              <Field
                                type="text"
                                id="form2Example11"
                                className="form-control"
                                placeholder="Username"
                                name="username"
                              />
                              <label className="form-label" htmlFor="form2Example11">
                                Username
                              </label>
                              <ErrorMessage name="username" component="div" className="text-danger" />
                            </div>
                            <div className="form-outline mb-4">
                              <Field
                                type="password"
                                id="form2Example22"
                                className="form-control"
                                name="password"
                              />
                              <label className="form-label" htmlFor="form2Example22">
                                Password
                              </label>
                              <ErrorMessage name="password" component="div" className="text-danger" />
                            </div>
                            <div className="text-center pt-1 mb-5 pb-1">
                              <button
                                className="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3"
                                type="submit"
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? "Logging in..." : "Login"}
                              </button>
                              <br />
                              <a className="text-muted" href="#!">
                                Forgot password?
                              </a>
                            </div>
                          </Form>
                        )}
                      </Formik>
                    </div>
                  </div>
                  <div
                    className="col-lg-6 d-flex align-items-center gradient-custom-2"
                    style={{
                      background:
                        "linear-gradient(to right, #0b9749, #0b9749, #58b581, #bce0cc)",
                    }}
                  >
                    <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                      <h4
                        className="mb-4"
                        style={{
                          color: "white",
                          textAlign: "center",
                        }}
                      >
                        Welcome To <br />
                        SIDDHARTH CARBOCHEM PRODUCTS LTD.
                      </h4>
                      <p
                        className="small mb-0"
                        style={{ color: "black", textAlign: "center" }}
                      >
                        <img
                          src={logo}
                          style={{ width: 285, borderRadius: 10 }}
                          alt="logo"
                        />
                      </p>
                      <br />
                      <p className="small mb-0" style={{ color: "black" }}></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
