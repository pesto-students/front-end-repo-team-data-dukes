import { useContext, useState } from "react";
import { Button, Col, Input, Row, Form } from "antd";

import { showNotification } from "../../utils/common";
import { EMAIL_REGEX } from "../../utils/regex";
import { AuthLogin } from "../../api/auth";
import { connect } from "react-redux";
import { AuthorizeUI } from "../../store/actions/managerAction";

import Verify from "../Verify";
import SubHeading from "../../components/SubHeading";

import "./index.css";
import { ThemeProvider } from "../../store/context/ThemeProvider";

const Login = ({ AuthorizeUI, theme }) => {
  const [error, setError] = useState(null);
  const [mError, setMError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const { currentTheme } = useContext(ThemeProvider);
  const onLoginSuccess = (response, request) => {
    if (response.status === 200) {
      const data = response?.data;
      AuthorizeUI({ isAuthorized: true, token: data?.token, user: data });
      if (!data.first_name || !data.last_name) {
        AuthorizeUI({ isProfileCompleted: false });
      } else {
        AuthorizeUI({ isProfileCompleted: true });
      }
    } else {
      showNotification("error", "Oops ! Something went wrong...");
    }
  };

  const onLoginFailure = (response, request) => {
    if (response.status === 401 || response.status === 400) {
      showNotification("error", "Invalid Email ID / Password");
    } else {
      showNotification("error", "Oops ! Something went wrong...");
    }
  };

  const onFinish = (values) => {
    if (!values["mobile_no"] && !values["email_id"]) {
      setError("Mobile No or Email ID is required !");
      setMError(null);
      return;
    } else if (values["mobile_no"] && values["mobile_no"].length !== 10) {
      setMError("Invalid Mobile Number ! ex : ( 9876543210 )");
      setError(null);
      return;
    } else if (
      values["email_id"] &&
      values["email_id"] !== "pestoproject.com" &&
      !EMAIL_REGEX.test(values["email_id"])
    ) {
      setError(
        "Invalid Email ID ! ex : ( user@talktimeapp | user@talktimeapp.com )"
      );
      setMError(null);
      return;
    } else if (!values["password"] && values["email_id"]) {
      setError("Password is required !");
      setMError(null);
      return;
    } else {
      setError(null);
      setMError(null);
      if (values["email_id"]) {
        AuthLogin(values, onLoginSuccess, onLoginFailure, setLoading);
      } else if (values["mobile_no"]) {
        setShowVerify(true);
      }
    }
  };

  return (
    <>
      {showVerify && <Verify setShowVerify={setShowVerify} />}
      {!showVerify && (
        <>
          <div data-theme={currentTheme} className="h-full w-full flex">
            <div className="flex-1 flex justify-center items-center bg-base-200">
              <img src="./logo_talktime.png" alt="logo.png" />
            </div>
            <Form className=" flex-1 bg-base-100" onFinish={onFinish}>
              <Row className="parent-holder">
                <Row className="sub-parent-holder bg-base-100">
                  <Col
                    xs={24}
                    md={10}
                    className="form-holder bg-base-100 text-base-content"
                  >
                    <h1 className="form-header-style">Log in</h1>
                    <SubHeading
                      description="New to TalkTime ? "
                      link="/register"
                      link_description="Create an account"
                    />

                    <Form.Item className="w-100 m-0" name="email_id">
                      <Input
                        size="large"
                        placeholder="Email ID"
                        className="mbo-10 bg-base-200 text-base-content placeholder:!text-base-content border-none"
                      />
                    </Form.Item>

                    <Form.Item className="w-100 m-0" name="password">
                      <Input.Password
                        size="large"
                        placeholder="Password"
                        className="mbo-10 bg-base-200 text-base-content  border-none"
                        autoComplete="new-password"
                        classNames={{
                          input:
                            "bg-base-200 text-base-content placeholder:!text-base-content",
                        }}
                      />
                    </Form.Item>

                    {error && <div className="input-error-style">{error}</div>}
                    <Button
                      size="large"
                      className="w-100 mt-20 mw-100 fs-12 fw-600 bg-primary hover:bg-primary-focus hover:!text-primary-content border-none text-primary-content "
                      htmlType="submit"
                      loading={loading}
                    >
                      Log in
                    </Button>
                  </Col>
                </Row>
              </Row>
            </Form>
          </div>
        </>
      )}
    </>
  );
};

function mapStateToProps(state) {
  const { manager } = state;
  return { manager };
}

const mapDispatchToProps = {
  AuthorizeUI: AuthorizeUI,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
