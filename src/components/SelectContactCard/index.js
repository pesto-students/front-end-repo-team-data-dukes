import { Checkbox, Row } from "antd";
import React, { useContext } from "react";
import { capitalizeFirstLetter } from "../../utils/common";
import "./index.css";
import { ThemeProvider } from "../../store/context/ThemeProvider";
const SelectContactCard = ({
  selected,
  avatarUrl = null,
  firstName = "",
  lastName = "",
  emailId = "",
  mobileNo = "",
  jid = "",
  onContactSelect = () => { },
}) => {
  const {currentTheme} = useContext(ThemeProvider)
  const AvatarViewSelector = () => {
    return (
      <>
      {(firstName && lastName && (
        <div className="flex align-center" style={{ marginTop: "4.33px", gap: 10 }}>
        <Checkbox checked={selected.includes(jid)}></Checkbox>
        {avatarUrl && (
          <img src={avatarUrl} className="cursor-pointer flex justify-center align-center profile-img-style" />
        )}
        {!avatarUrl && (
          <div className="cursor-pointer flex justify-center align-center profile-img-style !bg-primary !text-base-content-focus">
            <span className="fw-800 profile-txt-style ">
              {firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      ))}
      
      </>
    );
  };

  const ContentViewSelector = () => {
    return (
      <>
        {firstName && lastName && (
          <div className="h-100 flex flex-1 flex-column align-start text-base-content">
            <div className="fw-600 cursor-pointer fs-14" style={{ marginLeft: "-1px" }}>
              {capitalizeFirstLetter(firstName) + " " + capitalizeFirstLetter(lastName)}
            </div>
            <div className="fs-10 flex align-center">
              {emailId && emailId}
              {mobileNo && ` | ${mobileNo}`}
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <Row
      className={`w-100 highlight`}
      style={{
        position: "relative",
        alignItems: "center",
        gap: 10,
        color: "#000",
        padding: "10px",
      }}
      onClick={() => {
        onContactSelect({ jid });
      }}
    >
      <div
      data-theme={currentTheme}
        className="flex align-center w-100 bg-transparent"
        style={{
          gap: 20,
        }}
      >
        <AvatarViewSelector />
        <ContentViewSelector />
      </div>
    </Row>
  );
};

export default SelectContactCard;
