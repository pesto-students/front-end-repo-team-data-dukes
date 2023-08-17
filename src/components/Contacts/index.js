import React, { useContext, useEffect, useState } from "react";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { IoCloseSharp } from "react-icons/io5";
import { TbRefresh } from "react-icons/tb";
import { Drawer, Empty, Input, List } from "antd";
import { BiSearch } from "react-icons/bi";
import { connect } from "react-redux";
import ContactCard from "../ContactCard";
import { setFocus } from "../../store/actions/contactAction";
import "./index.css";
import { ThemeProvider } from "../../store/context/ThemeProvider";
const Contacts = ({ manager, contact, visible, setVisible, setFocus }) => {
  const { width } = useWindowDimensions();
  const [refreshLoading, setRefreshLoading] = useState(false);
  useEffect(() => {
    // TODO ( Refresh Contacts from API )
  }, [refreshLoading]);
  const {currentTheme} = useContext(ThemeProvider)
  const onContactSelect = ({ jid }) => {
    setFocus(jid);
    setVisible(false);
  };

const themeColors={
  cupcake:'rgb(239, 234, 230) ',
  dark:'rgb(25, 30, 36) ',
  valentine:'rgb(230, 188, 218) ',
  light:'rgb(229, 231, 235) ',
  synthwave:'rgb(14, 9, 32) ',
  corporate:'rgb(237, 237, 237) ',
  coffee:'rgb(12, 8, 12) ',
  winter:'rgb(240, 246, 255) ',
  retro:'rgb(219, 201, 154) '
}

  return (
    <React.Fragment>
    <Drawer
      width={width < 700 ? width : 400}
      style={{backgroundColor:themeColors[currentTheme]}}
      title={
        <div data-theme={currentTheme} className="flex align-center cursor-pointer bg-transparent">
           <h1
            className="flex align-center !text-base-content"
            style={{
              flex: 1,
              fontSize: "30px",
              fontWeight: 800,
              justifyContent: "flex-start",
              paddingInline: "10px",
            }}
          >
            Contacts
          </h1>
          <TbRefresh
            className={`${refreshLoading ? "rotate" : ""} !text-primary`}
            size={22}
            style={{ marginTop: "2px" }}
            
            onClick={() => {
              setRefreshLoading(true);
              setTimeout(() => {
                setRefreshLoading(false);
              }, 3000);
            }}
          />
        </div>
      }
      placement="right"
      closable={true}
      onClose={() => setVisible(false)}
      closeIcon={<IoCloseSharp size={22} className='!text-red-500'/>}
      open={visible}
      key={"contacts"}
      contentWrapperStyle={{ borderRadius: width < 800 && 0 }}
    >
      <div data-theme={currentTheme} className="w-100 bg-transparent ">
        <Input
          prefixCls="search"
          placeholder="Search Contacts"
          className="!bg-base-200 !text-base-content placeholder:!text-base-content border-none"
          classNames={{input:'!bg-base-200 !text-base-content placeholder:!text-base-content'}}
          style={{ borderRadius: "20px", padding: "10px" }}
          prefix={<BiSearch color="grey" size={18} />}
          onChange={(e) => {}}
        />
      </div>

      {Object.keys(contact.details)?.length > 0 && (
        <List
          className="contact-list"
          style={{ marginBlock: "10px" }}
          itemLayout="horizontal"
          dataSource={Object.keys(contact.details)}
          renderItem={(jid, index) => {
            // Ignoring Current User Details in Contacts
            if (manager.user?.jid !== jid) {
              return (
                <ContactCard
                  onContactSelect={onContactSelect}
                  avatarUrl={contact.details[jid]["avatar_url"]}
                  firstName={contact.details[jid]["first_name"]}
                  lastName={contact.details[jid]["last_name"]}
                  emailId={contact.details[jid]["email_id"]}
                  mobileNo={contact.details[jid]["mobile_no"]}
                  jid={jid}
                />
              );
            }
          }}
        />
      )}

      {Object.keys(contact.details)?.length == 0 && (
        <div className="flex align-center justify-center" style={{ height: "90%" }}>
          <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{
              height: 70,
            }}
            description={
              <span style={{ color: "grey", fontSize: "12px", marginTop: "10px" }}>No Contacts Available</span>
            }
          />
        </div>
      )}
    </Drawer>
    </React.Fragment>
  );
};

function mapStateToProps(state) {
  const { manager, contact } = state;
  return { manager, contact };
}

const mapDispatchToProps = {
  setFocus: setFocus,
};

export default connect(mapStateToProps, mapDispatchToProps)(Contacts);
