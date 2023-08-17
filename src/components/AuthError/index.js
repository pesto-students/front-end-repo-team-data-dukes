import { Button, Result } from "antd";
import React, { useContext } from "react";

import "./index.css";
import { connect } from "react-redux";
import { ResetUI } from "../../store/actions/managerAction";
import { ResetState } from "../../store/actions/contactAction";
import { ThemeProvider } from "../../store/context/ThemeProvider";

const AuthError = ({ ResetUI, ResetState }) => {
  const {currentTheme} = useContext(ThemeProvider);
 
  return (
    <div data-theme={currentTheme} className="flex h-100 justify-center bg-base-100 text-base-content align-center">
      <Result
        status="error"
        title={<h3 className="text-base-content">Authentication Failed</h3>}
        subTitle={
          <div style={{ maxWidth: "70%", fontSize: "12px" }} className="text-base-content">
            Please check and modify the credentials before resubmitting.
          </div>
        }
        extra={[
          <Button
            key={"back"}
            style={{ minWidth: "100px" }}
            type="primary"
            size="large"
            className="fs-12 fw-600 bg-primary hover:!bg-primary-focus hover:!text-primary-content border-none text-primary-content"
            htmlType="submit"
            onClick={() => {
              ResetUI();
              ResetState();
            }}
          >
            Back to Login
          </Button>,
        ]}
      ></Result>
    </div>
  );
};

function mapStateToProps(state) {
  const { manager } = state;
  return { manager };
}

const mapDispatchToProps = {
  ResetUI: ResetUI,
  ResetState: ResetState,
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthError);
