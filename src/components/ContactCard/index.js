import { Row } from "antd";
import React, { useContext } from "react";
import { capitalizeFirstLetter, isGroup } from "../../utils/common";
import { MdGroups } from "react-icons/md";
import { ThemeProvider } from "../../store/context/ThemeProvider";

const ContactCard = ({
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
      <div  className="flex" style={{ marginTop: "4.33px" }}>
        {!isGroup(jid) && avatarUrl && (
          <img src={avatarUrl} className="cursor-pointer flex justify-center align-center profile-img-style" />
        )}
        {!isGroup(jid) && !avatarUrl && firstName && lastName && (
          <div className="cursor-pointer flex justify-center align-center profile-img-style !bg-primary !text-base-content-focus">
            <span className="fw-800 profile-txt-style ">
              {firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        {isGroup(jid) && (
          <div className="cursor-pointer flex justify-center align-center profile-img-style  profile-img-style !bg-primary !text-base-content-focus">
            <MdGroups color="#ffffff" size={28} style={{ marginTop: "-5px" }} />
          </div>
        )}
      </div>
    );
  };

  const ContentViewSelector = () => {
    return (
<>
      {firstName && (
        <div className="h-100 flex flex-1 flex-column align-start !text-base-content">
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

export default ContactCard;
