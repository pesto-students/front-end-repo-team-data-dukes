import { useContext, useState } from "react";
import { Button, Col, Divider, Input, Row, Form, Result } from "antd";
import { Link, useNavigate } from "react-router-dom";

import { EMAIL_REGEX } from "../../utils/regex";
import { showNotification } from "../../utils/common";
import { AuthRegister } from "../../api/auth";

import Verify from "../Verify";
import SubHeading from "../../components/SubHeading";

import "../Login/index.css";
import { ThemeProvider } from "../../store/context/ThemeProvider";

const Register = () => {
  const [error, setError] = useState(null);
  const [mError, setMError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showVerify, setShowVerify] = useState(false);

  const [registerSuccess, setRegisterSuccess] = useState(null);
  const [data, setData] = useState(null);
  const {currentTheme} = useContext(ThemeProvider);
  const navigate = useNavigate();

  const onRegisterSuccess = (response, request, data) => {
    if (response.status === 200) {
      setRegisterSuccess(true);
      setData(data);
    } else {
      showNotification("error", "Oops ! Something went wrong...");
    }
  };

  const onRegisterFailure = (response, request, data) => {
    if (response.status === 401 || response.status === 400) {
      showNotification("error", "Invalid Request");
    } else if (response.status === 403) {
      showNotification("info", "User Already Registered !");
    } else if (response.status === 503) {
      showNotification("error", "Service Unavailable");
    } else {
      showNotification("error", "Oops ! Something went wrong...");
    }
  };

  const onFinish = (values) => {
    if (!values["mobile_no"] && !values["email_id"]) {
      setError("Mobile No or Email ID is required !");
      return;
    } else if (values["mobile_no"] && values["mobile_no"].length != 10) {
      setMError("Invalid Mobile Number ! ex : ( 9876543210 )");
      setError(null);
      return;
    } else if (values["email_id"] && !EMAIL_REGEX.test(values["email_id"])) {
      setError(
        "Invalid Email ID ! ex : ( user@localhost | user@localhost.com )"
      );
      setMError(null);
      return;
    } else if (!values["password"] && values["email_id"]) {
      setError("Password is required !");
      setMError(null);
      return;
    } else if (
      values["password"] &&
      values["password"] != values["confirm_password"]
    ) {
      setError("Passwords does not match !");
      setMError(null);
    } else {
      setError(null);
      setMError(null);
      if (values["email_id"]) {
        delete values["confirm_password"];
        AuthRegister(values, onRegisterSuccess, onRegisterFailure, setLoading);
      } else if (values["mobile_no"]) {
        setShowVerify(true);
      }
    }
  };

  return (
    <>
      {showVerify && <Verify setShowVerify={setShowVerify} />}
      {!showVerify && (
        <div data-theme={currentTheme} className="flex h-full w-full">
           <div className="flex-1 flex justify-center items-center bg-base-200">
          <img src="./logo_talktime.png"  alt="logo.png"/>
        </div>
        <Form className="flex-1 bg-base-100" onFinish={onFinish}>
          <Row className="parent-holder">
            <Row className="sub-parent-holder bg-base-100">
              <Col xs={24} md={10} className="form-holder bg-base-100 text-base-content">
                {registerSuccess && (
                  <Result
                    style={{ paddingInline: 0 }}
                    status="success"
                    title={
                      <h1 style={{ fontSize: "24px" }} className="text-base-content">
                        Registered Successfully !
                      </h1>
                    }
                    subTitle={
                      <div className="fw-600 fs-12 text-base-content">
                        <span >{`An account has been created using ${
                          data.email_id ? data.email_id : data.mobile_no
                        }`}</span>
                        <br /> Click here to{" "}
                        <Link to="/login" style={{ color: "#007bff" }}>
                          Login
                        </Link>
                      </div>
                    }
                  />
                )}

                {!registerSuccess && (
                  <>
                    <h1 className="form-header-style">Create an account</h1>

                    <SubHeading
                      description="Already have an account ? "
                      link="/login"
                      link_description="Login"
                    />
                    {mError && (
                      <div className="input-error-style">{mError}</div>
                    )}

                    <Form.Item name="email_id" className="m-0 w-100">
                      <Input
                        size="large"
                        placeholder="Email ID"
                        className="mbo-10 bg-base-200 text-base-content placeholder:!text-base-content border-none"
                        autoComplete="new-password"
                      />
                    </Form.Item>

                    <Form.Item name="password" className="m-0 w-100">
                      <Input.Password
                        size="large"
                        placeholder="Password"
                        autoComplete="new-password"
                        className="mbo-10 bg-base-200 text-base-content placeholder:!text-base-content border-none"
                        classNames={{input:'bg-base-200 text-base-content placeholder:!text-base-content'}}
                      />
                    </Form.Item>

                    <Form.Item name="confirm_password" className="m-0 w-100">
                      <Input.Password
                        size="large"
                        autoComplete="new-password"
                        placeholder="Confirm Password"
                        className="mbo-10 bg-base-200 text-secondary-content  border-none"
                        classNames={{input:'bg-base-200 text-base-content placeholder:!text-base-content'}}
                      />
                    </Form.Item>

                    {error && <div className="input-error-style">{error}</div>}

                    <Button
                      type="primary"
                      size="large"
                      className="w-100 mt-20 mw-100 fs-12 fw-600 bg-primary hover:!bg-primary-focus hover:!text-primary-content border-none text-primary-content"
                      htmlType="submit"
                      loading={loading}
                    >
                      Register
                    </Button>
                  </>
                )}
              </Col>
            </Row>
          </Row>
        </Form>
        </div>
      )}
    </>
  );
};

export default Register;
