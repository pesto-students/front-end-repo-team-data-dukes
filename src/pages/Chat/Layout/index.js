import React, { useContext, useEffect, useState } from "react";
import { Layout } from "antd";
import { connect } from "react-redux";

import useWindowDimensions from "../../../hooks/useWindowDimensions";

import { siderStyle, headerStyle, contentStyle, footerStyle } from "./index.styles";

import EmptyChat from "../../../components/EmptyChat";
import ChatHeader from "../../../components/ChatHeader";
import ChatWindow from "../../../components/ChatWindow";
import ChatSideView from "../../../components/ChatSideView";
import ChatInput from "../../../components/ChatInput";
import Contacts from "../../../components/Contacts";

import CreateGroupDrawer from "../../../components/CreateGroupDrawer";
import GroupOptionDrawer from "../../../components/GroupOptionDrawer";
import CreateContactDrawer from "../../../components/CreateContactDrawer";
import { ThemeProvider } from "../../../store/context/ThemeProvider";

const { Header, Footer, Sider, Content } = Layout;

const ChatLayout = ({ contact, connection }) => {
  const { width } = useWindowDimensions();
  const [siderWidth, setSiderWidth] = useState(400);
  const [contactsVisible, setContactsVisible] = useState(false);
  const {currentTheme} = useContext(ThemeProvider)
  useEffect(() => {
    if (width > 800) {
      setSiderWidth(400);
    } else {
      if (contact.focus) {
        setSiderWidth(0);
      } else {
        setSiderWidth(width);
      }
    }
  }, [width, contact.focus]);

  return (
      <div data-theme={currentTheme} className="h-100 bg-base-100">
        <Layout className="h-100 overflow-hidden bg-base-100" hasSider={true}>
          <Sider style={siderStyle} width={siderWidth}>
            <ChatSideView setContactsVisible={setContactsVisible} />
          </Sider>
          <Layout>
            {contact.focus ? (
              <React.Fragment>
                <Header className = "!bg-base-100 !text-base-content" style={headerStyle}>
                <ChatHeader connection={connection}/>
                </Header>
                <Content className="!bg-base-100 !text-base-content" style={contentStyle}>
                  <ChatWindow />
                </Content>
                <Footer className="!bg-base-100 !text-base-content" style={footerStyle}>
                  <ChatInput connection={connection} />
                </Footer>
              </React.Fragment>
            ) : (
              width > 800 && <EmptyChat />
            )}
          </Layout>
          <Contacts visible={contactsVisible} setVisible={setContactsVisible} />
        </Layout>
        <CreateGroupDrawer connection={connection} />
        <GroupOptionDrawer connection={connection} />
        <CreateContactDrawer />
      </div>
  );
};

function mapStateToProps(state) {
  const { contact } = state;
  return { contact };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ChatLayout);
