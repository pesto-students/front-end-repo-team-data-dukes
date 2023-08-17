import { Select } from "antd";
import { useEffect, useState } from "react";

import "./index.css";
import { HiChevronDown } from "react-icons/hi";

const StatusChanger = () => {
  const items = [
    { value: "Available", label: "Available" },
    { value: "Busy", label: "Busy" },
    { value: "Not Available", label: "Not Available" },
  ];
  const [status, setStatus] = useState("Available");
  const [statusOption, setStatusOption] = useState(items);

  useEffect(() => {
    if (status) {
      window.dispatchEvent(new CustomEvent("update-user-status", { detail: { status } }));
      const new_items = [];
      items.forEach((d) => {
        if (d.value != status) {
          new_items.push(d);
        }
      });
      setStatusOption(new_items);
    }
  }, [status]);

  return (
    <Select
      value={status}
      popupClassName="!text-primary !bg-base-100"
      bordered={false}
      className="!text-primary"
      dropdownStyle={{ minWidth: "120px"}}
      nam
      options={statusOption}
      suffixIcon={<HiChevronDown size={15}/>}
      onSelect={setStatus}
    />
  );
};
export default StatusChanger;
