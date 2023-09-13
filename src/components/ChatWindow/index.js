import React, { useContext, useState } from "react";
import { connect } from "react-redux";
import { List, Spin } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";

import InfoMessage from "../Message/InfoMessage";
import DateMessage from "../Message/DateMessage";
import TextMessage from "../Message/TextMessage";
import ImageMessage from "../Message/ImageMessage";

import "./index.css";
import DocMessage from "../Message/DocMessage";
import useEventHandler from "../../hooks/useEventHandler";

const ChatWindow = ({ contact }) => {
  let prevDate = null;
  const [loadMore, setLoadMore] = useState(false);

  // Can you use this to prevent autoscroll on message
  const [currentScrollHeight, setCurrentScrollHeight] = useState(0);
  const onQueryHistoryMessageLoaded = () => {
    setLoadMore(false);
  };

  const execute_scroll = () => {
    setTimeout(() => {
      const classes = document.getElementsByClassName("chat-window-footer");
      for (const elem of classes) {
        elem?.scrollIntoView({
          block: "end",
          behavior: "smooth",
          inline: "end",
        });
      }
    }, 100);
  };

  const onOutgoingMessageScroll = () => {
    // Timeout to scroll for a smooth scroll
    execute_scroll();
  };

  const onIncomingMessageScroll = () => {
    if (currentScrollHeight > -400) {
      execute_scroll();
    }
  };

  useEventHandler("fetch-user-history-loaded", onQueryHistoryMessageLoaded);
  useEventHandler("out-chat-message", onOutgoingMessageScroll);
  useEventHandler("out-groupchat-message", onOutgoingMessageScroll);
  useEventHandler("new-chat-message", onIncomingMessageScroll);

  const fetchHistory = () => {
    console.log(`FETCH MAM QUERY ${contact.focus}`);
    setLoadMore(true);
    window.dispatchEvent(
      new CustomEvent("fetch-user-history-message", {
        detail: { _with: contact.focus, lastId: contact.message[contact.focus].at(0)["id"], max: 5 },
      })
    );
  };

  function displayBatchForDate(message) {
    const currDate = new Date(message["datetime"]).toLocaleDateString();
    
    if (prevDate !== currDate) {
      // Display your batch or perform any action here for the new date
      prevDate = currDate;
      return true
      // Update prevDate to the current date to avoid displaying it again
    } else {
      // Date has not changed, do nothing or handle repeated dates if needed
      return false
    }
  }
  return (
    <React.Fragment>
      <div
        id="scrollContainer"
        className="w-100 chat bg-base-100"
        style={{
          overflowY: "auto",
          flexDirection: "column-reverse",
          display: "flex",
        }}
      >
        <InfiniteScroll
          className="infi-scroll !bg-base-100"
          dataLength={contact.message[contact.focus]?.length ? contact.message[contact.focus]?.length : 0}
          next={fetchHistory}
          style={{ display: "flex", flexDirection: "column-reverse" }} //To put endMessage and loader to the top.
          inverse={true} //
          hasMore={true}
          scrollableTarget="scrollContainer"
          scrollThreshold={300}
          onScroll={(e) => {
            setCurrentScrollHeight(e.target.scrollTop);
          }}
        >
          <List
            style={{ minHeight: "100%" }}
            dataSource={contact.message[contact.focus]}
            rowKey={(r) => {
              return r["id"];
            }}
            renderItem={(message, index) => {
              const showDate = displayBatchForDate(message)
              if (message["messageType"] === "info") {
                return (
                  <React.Fragment key={message["id"]}>
                    {showDate && <DateMessage datetime={message["datetime"]} />}
                    <InfoMessage content={message["content"]} />
                  </React.Fragment>
                );
              } else if (message["messageType"] === "text") {
                return (
                  <React.Fragment key={message["id"]}>
                    {showDate && <DateMessage datetime={message["datetime"]} />}

                    <TextMessage
                      from={message["from"]}
                      content={message["content"]}
                      datetime={message["datetime"]}
                      receipt={message["receipt"]}
                      type={message["type"]}
                      user={message["user"]}
                    />
                  </React.Fragment>
                );
              } else if (message["messageType"] === "gif" || message["messageType"] === "img") {
                return (
                  <React.Fragment key={message["id"]}>
                    {showDate && <DateMessage datetime={message["datetime"]} />}
                    <ImageMessage
                      from={message["from"]}
                      content={message["content"]}
                      datetime={message["datetime"]}
                      messageType={message["messageType"]}
                      receipt={message["receipt"]}
                      type={message["type"]}
                      user={message["user"]}
                    />
                  </React.Fragment>
                );
              } else if (message["messageType"] === "doc") {
                return (
                  <React.Fragment key={message["id"]}>
                    {showDate && <DateMessage datetime={message["datetime"]} />}
                    <DocMessage
                      from={message["from"]}
                      content={message["content"]}
                      datetime={message["datetime"]}
                      receipt={message["receipt"]}
                      type={message["type"]}
                      user={message["user"]}
                    />
                  </React.Fragment>
                );
              }
            }}
            footer={<div id="last-message"></div>}
            prefixCls="chat-window"
          />
          {loadMore && <Spin size="small" style={{ paddingTop: "20px" }} />}
        </InfiniteScroll>
      </div>
    </React.Fragment>
  );
};

function mapStateToProps(state) {
  const { contact } = state;
  return { contact };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ChatWindow);
