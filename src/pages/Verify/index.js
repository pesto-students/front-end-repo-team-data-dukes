import { useEffect, useState } from "react";
import { Button, Col, Divider, Input, Row, Statistic } from "antd";
import { IoChevronBack } from "react-icons/io5";
import { connect } from "react-redux";
import OtpInput from "react-otp-input";

import { AuthorizeUI } from "../../store/actions/managerAction";

import "../Login/index.css";
import "./index.css";

const { Countdown } = Statistic;

const Verify = ({ AuthorizeUI, manager, setShowVerify }) => {
  const [otp, setOtp] = useState("");
  const [expired, setExpired] = useState(false);
  const [error, setError] = useState(null);
  const [btnDisabled, setBtnDisabled] = useState(true);

  useEffect(() => {
    if (otp.length === 4) {
      setBtnDisabled(false);
      if (otp == 6379) {
        AuthorizeUI({ key: "isAuthorized", value: true });
      } else {
        setError("Invalid OTP. Please try again !");
      }
    } else {
      if (!btnDisabled) {
        setBtnDisabled(true);
      }
      setError(null);
    }
  }, [otp]);

  return (
    <>
      <Row className="parent-holder">
        <Row className="sub-parent-holder">
          <Col span={14} xs={0} md={14}>
            <div className="flex">
              {/* <Lottie
                animationData={FlyingLogin}
                loop={true}
                className="lottie-holder"
              /> */}
              <div className="divider-holder">
                <Divider type="vertical" className="divider-style" />
              </div>
            </div>
          </Col>

          <Col xs={24} md={10} className="form-holder">
            <div className="desc-style" onClick={() => setShowVerify(false)}>
              <div className="flex justify-center align-center cursor-pointer color-primary">
                <IoChevronBack
                  className="mr-5"
                  size={12}
                  style={{ marginTop: "0.7px" }}
                />
                Go Back
              </div>
            </div>

            <h1 className="form-header-style">Verify OTP</h1>
            <div className="desc-style grey">OTP sent to 7204056164</div>

            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={4}
              containerStyle={{
                gap: "40px",
                marginBlock: "15px",
                marginTop: "30px",
              }}
              renderInput={(props) => (
                <Input
                  {...props}
                  style={{ display: "flex", flex: 1, textAlign: "center" }}
                />
              )}
              inputType="number"
              shouldAutoFocus={true}
            />

            {error && (
              <div className="input-error-style text-center w-100 mi-0">
                {error}
              </div>
            )}

            <div style={{ marginBlock: "20px" }}>
              {!expired ? (
                <div className="desc-style grey fs-11">
                  Didn't receive the OTP ? Retry in{" "}
                  <Countdown
                    style={{ display: "inline-flex" }}
                    valueStyle={{ fontSize: "11px", color: "grey" }}
                    value={Date.now() + 60 * 1000}
                    format="mm:ss"
                    onFinish={() => setExpired(true)}
                  />
                </div>
              ) : (
                <div
                  className="desc-style fs-12"
                  style={{ color: "#007bff", cursor: "pointer" }}
                  onClick={() => setExpired(false)}
                >
                  Resend OTP
                </div>
              )}
            </div>

            <Button
              type="primary"
              size="large"
              className="w-100 "
              disabled={btnDisabled}
            >
              <div className="fs-12 fw-600">Proceed</div>
            </Button>
          </Col>
        </Row>
      </Row>
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

export default connect(mapStateToProps, mapDispatchToProps)(Verify);
