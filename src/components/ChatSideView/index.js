import React, { useEffect, useState } from "react";
import { Button, Empty, Input, List, Row } from "antd";
import { connect } from "react-redux";

import ChatSideHeader from "../ChatSideHeader";

import { BiSearch } from "react-icons/bi";
import { RiMessage3Fill } from "react-icons/ri";

import "./index.css";
import NoChat from "../NoChat";
import ChatUser from "../ChatUser";
import FlipMove from "react-flip-move";

const ChatSideView = ({ contact, setContactsVisible }) => {
  const [searchJid, setSearchJid] = useState(null);

  const roster = [...contact.roster];
  roster.sort((a, b) => {
    const dateA = new Date(contact.message[a]?.at(-1)?.datetime);
    const dateB = new Date(contact.message[b]?.at(-1)?.datetime);
    return dateB - dateA;
  });

  return (
    <Row className="h-100 bg-base-200 text-base-content" style={{ color: "#000", paddingInline: "10px" }}>
      <div
        className="flex align-center w-100 text-base-content"
        style={{
          fontSize: "30px",
          fontWeight: 800,
        }}
      >
        <ChatSideHeader />
      </div>
      <h1
        className="flex align-center text-base-content"
        style={{
          flex: 1,
          fontSize: "30px",
          fontWeight: 800,
          justifyContent: "flex-start",
          paddingInline: "10px",
          marginTop: "20px",
        }}
      >
        Chat
      </h1>
      <div className="w-100" style={{ paddingInline: "10px" }}>
        <Input
          prefixCls="search"
          placeholder="Search Chats"
          className="bg-base-200 text-base-content placeholder:!text-base-content border-base-content hover:!border-base-content"
          classNames={{input:'bg-base-200 placeholder:!text-base-content text-base-content'}}
          style={{ marginBlock: "15px", borderRadius: "20px", padding: "10px" }}
          prefix={<BiSearch color="grey" size={18} />}
          onChange={(e) => {
            const filtered_list = [];
            if (e.target.value != "") {
              contact.roster?.forEach((jid) => {
                const full_name =
                  contact.details[jid]?.first_name.toLowerCase() + " " + contact.details[jid]?.last_name.toLowerCase();
                if (full_name.trim().includes(e.target.value.toLowerCase().trim())) {
                  filtered_list.push(jid);
                }
              });
              setSearchJid(filtered_list);
            } else {
              setSearchJid(null);
            }
          }}
        />
      </div>
      <div className="h-100 contact w-100" style={{ overflowY: "scroll" }}>
        <div style={{ position: "absolute", bottom: "20px", right: "20px" }}>
          <Button
            size="large"
            type="primary"
            className="flex align-center justify-center fw-600 fs-12 bg-primary text-primary-content hover:!bg-primary-focus"
            onClick={() => {
              setContactsVisible(true);
            }}
          >
            <RiMessage3Fill size={20} className="mr-5" />
            New Chat
          </Button>
        </div>
        {roster?.length === 0 ? (
          <NoChat />
        ) : (
          <FlipMove>
            {searchJid
              ? searchJid.map((jid) => (
                  <div key={jid}>
                    <ChatUser jid={jid} key={jid} />
                  </div>
                ))
              : roster.map((jid) => (
                  <div key={jid}>
                    <ChatUser jid={jid} key={jid} />
                  </div>
                ))}
          </FlipMove>
        
        )}
      </div>
    </Row>
  );
};

function mapStateToProps(state) {
  const { contact } = state;
  return { contact };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ChatSideView);
