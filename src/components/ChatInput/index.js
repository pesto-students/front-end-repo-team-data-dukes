import React, { useRef, useState } from "react";
import GifPicker from "gif-picker-react";
import EmojiPicker from "emoji-picker-react";

import { Input, Popover, Upload } from "antd";
import { connect } from "react-redux";

import { TbGif, TbPhoto, TbSend } from "react-icons/tb";
import { FiPaperclip } from "react-icons/fi";
import { BiSmile } from "react-icons/bi";
import { HiOutlineDocumentText } from "react-icons/hi";

import "./index.css";
import { getBase64, isGroup, showNotificationMessage } from "../../utils/common";
import { InsertIntoRoster, InsertNewMessage } from "../../store/actions/contactAction";
import { upload } from "../../api/fetch";
import { generate_id } from "../../stanza/utils";
const ChatInput = ({ connection, contact, manager, InsertNewMessage, InsertIntoRoster }) => {
  const [input, setInput] = useState("");
  const [inputSize, setInputSize] = useState(30);
  const inputTagRef = useRef(null);

  const onSendMessage = (input, type = "text") => {
    if (type == "text" && input.trim() !== "") {
      connection.message.send(contact.focus, isGroup(contact.focus) ? "groupchat" : "chat", type, input);
    } else {
      connection.message.send(contact.focus, isGroup(contact.focus) ? "groupchat" : "chat", type, input);
    }
  };

  const handleChange = (info, bin) => {
    getBase64(info.file.originFileObj, (url) => {
      const message_id = generate_id();
      upload(info, contact.focus, message_id)
        .then((response) => {
          const s3url = response["data"]["url"];
          connection.message.send(
            contact.focus,
            isGroup(contact.focus) ? "groupchat" : "chat",
            bin,
            { url: s3url, name: info.file.name, size: info.file.size },
            message_id
          );
        })
        .catch((err) => {
          console.log(err);
          showNotificationMessage("error", "Error Sending Docs !");
        });
    });
  };

  const handleKey = (e) => {
    if (e.key === "Enter") {
      if (input.trim() !== "") {
        // send message
        onSendMessage(input);
        setInput("");
      }
    }
  };

  const ImgDocSelector = () => {
    return (
      <>
        <div className="flex" style={{ gap: 10 }}>
          <Upload
            onChange={(info) => handleChange(info, "doc")}
            showUploadList={false}
            customRequest={() => {}}
            className="w-100 flex justify-center cursor-pointer"
          >
            <div
              className="flex justify-center align-center"
              style={{
                width: "50px",
                height: "50px",
                backgroundColor: "rgba(255, 96, 0, 0.1)",
                borderRadius: "10px",
              }}
            >
              <HiOutlineDocumentText size={28} color="#FF6000" />
            </div>
          </Upload>
          <Upload
            accept=".jpg,.jpeg,.png,.webp,.bmp,.tiff,.heic,.svg"
            onChange={(info) => handleChange(info, "img")}
            showUploadList={false}
            customRequest={() => {}}
            className="w-100 flex justify-center cursor-pointer"
          >
            <div
              className="flex justify-center align-center"
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "10px",
                backgroundColor: "rgba(0, 123, 255, 0.1)",
              }}
            >
              <TbPhoto size={30} color="#007bff" />
            </div>
          </Upload>
        </div>
      </>
    );
  };

  const InputPrefix = (
    <React.Fragment>
      <div className="flex align-center text-primary-content bg-base-100">
        <Popover
          content={<ImgDocSelector />}
          align={{ offset: [-10, -10] }}
          trigger="hover"
          showArrow={true}
          placement="topLeft"
        >
          <FiPaperclip className="cursor-pointer grey" style={{ marginInline: "7px" }} size={18} />
        </Popover>
        <div className="!bg-base-100">
        <Popover
          content={
            <div className="!bg-base-100">
            <GifPicker
              tenorApiKey={process.env.REACT_APP_TENOR_API_KEY}
              onGifClick={(ev) => {
                // send GIF message
                onSendMessage(ev["preview"], "gif");
              }}
            />
            </div>
          }
          align={{ offset: [-10, -10] }}
          trigger="hover"
          showArrow={true}
          placement="topLeft"
        >
          <TbGif className="cursor-pointer grey" style={{ marginInline: "7px", marginRight: "2px" }} size={24} />
        </Popover>
        </div>
        <div className="bg-base-100 !text-white">
        <Popover
          content={
            <div className="!text-primary-content">
            <EmojiPicker
              emojiStyle="google"
              onEmojiClick={(e) => {
                setInput((prev) => prev + e.emoji);
                inputTagRef.current?.focus();
              }}
              
              previewConfig={{ showPreview: false }}
              lazyLoadEmojis={true}
            />
            </div>
          }
          align={{ offset: [-10, -10] }}
          trigger="hover"
          showArrow={true}
          className="!text-gray"
          placement="topLeft"
        >
          <BiSmile className="cursor-pointer grey" style={{ marginInline: "7px" }} size={22} />
        </Popover>
        </div>
      </div>
    </React.Fragment>
  );

  return (
    <div
      className="flex"
      style={{
        alignItems: inputSize <= 40 ? "center" : "flex-end",
        padding: "10px",
      }}
    >
      {InputPrefix}
      <Input.TextArea
        id="input-chat-ta"
        ref={inputTagRef}
        onResize={(size) => {
          setInputSize(size.height);
        }}
        autoSize={{ maxRows: 5 }}
        className="send w-100 bg-base-200 text-base-content placeholder:!text-base-content border-none !rounded"
        placeholder="Send a message ..."
        size="large"
        value={input}
        onKeyUp={handleKey}
        onChange={(e) => {
          if (e.nativeEvent.inputType === "insertLineBreak") return;
          setInput(e.target.value);
        }}
        style={{
          width: "100%",
          alignSelf: "flex-end",
          justifySelf: "center",
          border: "none",
          borderRadius: "0px",
          padding: "10px",
          fontSize: "13px",
          boxShadow: "none",
          textAlign: "start",
        }}
      ></Input.TextArea>
      <div>
        <div
          className="flex align-center bg-primary"
          style={{
            padding: "8px",
            cursor: "pointer",
            borderRadius: "50%",
          }}
          onClick={() => {
            onSendMessage(input);
            setInput("");
          }}
        >
          <TbSend
            size={22}
            className="text-primary-content"
            style={{
              transform: "rotate(45deg)",
              marginTop: "1px",
              marginRight: "3px",
              marginBottom: "1px",
            }}
          />
        </div>
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  const { manager, contact } = state;
  return { manager, contact };
}

const mapDispatchToProps = {
  InsertNewMessage: InsertNewMessage,
  InsertIntoRoster: InsertIntoRoster,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatInput);
