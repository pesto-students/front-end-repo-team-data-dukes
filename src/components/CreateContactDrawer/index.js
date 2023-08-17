import React, { useState } from "react";
import useEventHandler from "../../hooks/useEventHandler";
import { Button, Checkbox, Col, Drawer, Form, Input, Modal, Row } from "antd";
import useWindowDimensions from "../../hooks/useWindowDimensions";

import "./index.css";
import { IoCloseSharp } from "react-icons/io5";

const CreateContactDrawer = () => {
  const { width } = useWindowDimensions();
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(null);
  const [form] = Form.useForm();

  const onShowCreateContactDrawer = () => {
    setVisible(true);
  };

  useEventHandler("show-create-contact-drawer", onShowCreateContactDrawer);

  const onFinish = (values) => {
    console.log(values);
  };
  return (
    <React.Fragment>
      <Drawer
        width={width < 700 ? width : 400}
        open={visible}
        closeIcon={<IoCloseSharp size={22} color="#000" />}
        onClose={() => {
          setVisible(false);
        }}
        contentWrapperStyle={{ borderRadius: width < 800 && 0 }}
        title={
          <h1
            className="flex align-center"
            style={{
              flex: 1,
              fontSize: "23px",
              fontWeight: 800,
              justifyContent: "flex-start",
              paddingInline: "10px",
            }}
          >
            {"Add Contact's"}
          </h1>
        }
      >
        <Form className="h-100" onFinish={onFinish} form={form}>
          <Row className="parent-holder-c">
            <Col xs={24} className="form-holder">
              {/* <h2 className="mbo-10" style={{ fontSize: "20px" }}>
                Add Contact
              </h2> */}

              {/* <div
                className="mt-10"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  gap: "10px",
                }}
              > */}
              <Form.Item name="first_name" className="w-100 m-0">
                <Input size="large" placeholder="First Name" style={{ marginBottom: "10px" }} />
              </Form.Item>

              <Form.Item name="last_name" className="w-100 m-0">
                <Input size="large" placeholder="Last Name" className="mbo-10" />
              </Form.Item>
              {/* </div> */}

              <Form.Item name="email_id" className="w-100 m-0">
                <Input size="large" placeholder="Email ID" className="mbo-10" />
              </Form.Item>

              <Form.Item name="mobile_no" className="w-100 m-0">
                <Input size="large" placeholder="Mobile No" className="mbo-10" />
              </Form.Item>

              <Form.Item
                name="add_as_global"
                valuePropName="checked"
                className="w-100 m-0 flex"
                style={{ justifyContent: "end" }}
              >
                <Checkbox className="mbo-10 fs-12 fw-600">Add as Global </Checkbox>
              </Form.Item>

              {error && <div className="input-error-style">{error}</div>}

              <div className="w-100 flex" style={{ justifyContent: "flex-end", gap: 10 }}>
                <Button type="default" size="large" className=" mt-20 fs-12 fw-600" htmlType="submit">
                  Reset
                </Button>
                <Button type="primary" size="large" className=" mt-20 fs-12 fw-600" htmlType="submit">
                  Add Contact
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </React.Fragment>
  );
};

export default CreateContactDrawer;
