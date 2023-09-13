import { useContext, useEffect, useState } from "react";
import { Form, Button, Col, Divider, Input, Row, Upload } from "antd";
import { useNavigate } from "react-router-dom";
import { AiOutlineUser } from "react-icons/ai";
import { MdModeEditOutline } from "react-icons/md";

import { EMAIL_REGEX } from "../../utils/regex";

import "../Login/index.css";
import "./index.css";
import { connect } from "react-redux";
import { upload_to_s3 } from "../../api/gateway";
import { showNotification } from "../../utils/common";
import { TbLogout } from "react-icons/tb";
import { AuthorizeUI, ResetUI } from "../../store/actions/managerAction";
import { updateUserProfile } from "../../api/fetch";
import { ThemeProvider } from "../../store/context/ThemeProvider";

const Profile = ({
  manager,
  AuthorizeUI,
  ResetUI
}) => {
  const [image, setImage] = useState(null);
  const [imageInfo, setImageInfo] = useState(null);

  const [error, setError] = useState(null);
  const [emailDisabled, setEmailDisabled] = useState(false);
  const [mobileDisabled, setMobileDisabled] = useState(false);
  const [profileSubmitBtnLoading, setProfileSubmitBtnLoading] = useState(false);
  const {currentTheme} = useContext(ThemeProvider);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (manager.isProfileCompleted) {
      navigate("/");
    }
  }, [manager.isProfileCompleted]);

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const handleChange = (info) => {
    setImageInfo(info);
    let b = getBase64(info.file.originFileObj, (url) => {
      setImage(url);
    });
  };

  const updateProfileAPI = (values) => {
    updateUserProfile(values)
      .then((res) => {
        if (res.status === 200) {
          AuthorizeUI({ isProfileCompleted: true, isAuthorized: manager.isAuthorized, token: manager.token, user: {...manager.user, ...values} });
        }
      })
      .catch((err) => {
        console.log(err);
        showNotification(
          "error",
          "Error Updating Profile",
          "Please check the details & try again !"
        );
      })
      .finally(() => {
        setProfileSubmitBtnLoading(false);
      });
  };

  const updateProfile = (values) => {
    setProfileSubmitBtnLoading(true);
    if (image) {
      const s3url = upload_to_s3(imageInfo, manager.user?.jid, "set-profile");
      s3url
        .then((response) => {
          values["avatar_url"] = response["data"]["url"];
          updateProfileAPI(values);
        })
        .catch((err) => {
          console.log(err);
          setProfileSubmitBtnLoading(false);
          showNotification(
            "error",
            "Error Updating Profile",
            "Failed to set Profile Picture. Please try again !"
          );
        });
    } else {
      updateProfileAPI(values);
    }
  };

  const onFinish = (values) => {
    if (!values["first_name"]) {
      setError("First Name is Required !");
    } else if (!values["last_name"]) {
      setError("Last Name is Required !");
    } else if (values["email_id"] && !EMAIL_REGEX.test(values["email_id"])) {
      setError(
        "Invalid Email ID ! ex : ( user@localhost | user@localhost.com )"
      );
    } else if (values["mobile_no"] && values["mobile_no"].length != 10) {
      setError("Invalid Mobile Number ! ex : ( 9876543210 )");
    } else {
      setError(null);
      updateProfile(values);
    }
  };

  useEffect(() => {
    if (manager.user.email_id) {
      form.setFieldValue("email_id", manager.user.email_id);
      setEmailDisabled(true);
    } else if (manager.user.mobile_no) {
      form.setFieldValue("mobile_no", manager.user.mobile_no);
      setMobileDisabled(true);
    }
  }, []);

  return (
    <>
      <div data-theme={currentTheme} className="flex h-screen w-screen">
      <div className="flex-1 flex justify-center items-center bg-slate-800">
          <img src="./logo_talktime.png" className="text-green-400" alt="logo.png"/>
        </div>
      <Form className="flex-1" onFinish={onFinish} form={form}>
        <Row className="parent-holder ">
          <Row className="sub-parent-holder bg-base-100">
            

            <Col xs={24} md={10} className="form-holder ">
              <div
                className="fs-12 w-100 fw-600 cursor-pointer color-danger flex align-center justify-end"
                onClick={() => {
                  ResetUI();
                }}
              >
                Logout{" "}
                <TbLogout style={{ marginLeft: "5px", marginTop: "1px" }} />
              </div>
              <h1 className="form-header-style text-base-content">Almost There !</h1>

              <div className="desc-style grey">
                Please complete your profile to proceed.
              </div>

              <Upload
                listType="picture-circle"
                onChange={handleChange}
                showUploadList={false}
                customRequest={() => {}}
                className="w-100 flex justify-center"
              >
                <div className="relative rounded-full w-24 h-24 overflow-hidden">
                  {image ? (
                    <img
                      src={image}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ):
                  (<>
                       <div
                    className="flex justify-center align-center"
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <AiOutlineUser
                      size={60}
                      style={{ marginTop: "-4px", color: "grey" }}
                    />
                  </div>
                  <div className="text-overlay">
                    <MdModeEditOutline size={17} />
                  </div>
                  </>)
                  }

             
                </div>
              </Upload>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  gap: "10px",
                }}
              >
                <Form.Item name="first_name" className="w-100 m-0">
                  <Input
                    size="large"
                    placeholder="First Name"
                    style={{ marginBottom: "10px" }}
                    className="mbo-10 bg-base-200 text-base-content placeholder:!text-base-content border-none"
                    classNames={{input:'bg-base-200 text-base-content placeholder:!text-base-content'}}
                  />
                </Form.Item>

                <Form.Item name="last_name" className="w-100 m-0">
                  <Input
                    size="large"
                    placeholder="Last Name"
                    style={{ marginBottom: "10px" }}
                    className="mbo-10 bg-base-200 text-base-content placeholder:!text-base-content border-none"
                    classNames={{input:'bg-base-200 text-base-content placeholder:!text-base-content'}}
                  />
                </Form.Item>
              </div>

              <Form.Item name="email_id" className="w-100 m-0">
                <Input
                  size="large"
                  placeholder="Email ID"
                  disabled={emailDisabled}
                  className="mbo-10 bg-base-200 text-base-content border-none"
                  classNames={{input:'bg-base-200 !text-base-content placeholder:!text-base-content'}}
                />
              </Form.Item>


              {error && <div className="input-error-style">{error}</div>}

              <Button
                type="primary"
                size="large"
                className="w-100 mt-20 mw-100 fs-12 fw-600 bg-primary hover:!bg-primary-focus hover:!text-primary-content border-none text-primary-content "
                htmlType="submit"
                loading={profileSubmitBtnLoading}
              >
                Complete Profile
              </Button>
            </Col>
          </Row>
        </Row>
      </Form>
      </div>
    </>
  );
};

function mapStateToProps(state) {
  const { manager } = state;
  return { manager };
}

const mapDispatchToProps = {
  AuthorizeUI: AuthorizeUI,
  ResetUI: ResetUI
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
