import { RiCheckDoubleFill, RiCheckFill } from "react-icons/ri";

export const getReceipt = (receipt) => {
  if (receipt === 1) {
    return <RiCheckDoubleFill size={14} />;
  } else if (receipt === 2) {
    return <RiCheckDoubleFill size={14} style={{ color: "#51ff0d" }} />;
  } else {
    return <RiCheckFill size={14} />;
  }
};
