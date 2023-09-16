import { Link } from "react-router-dom";

import "./index.css";

const SubHeading = ({ description, link, link_description }) => {
  return (
    <div className="desc-style">
      {description}
      <Link to={link} className="text-primary hover:text-primary-focus">
        {link_description}
      </Link>
    </div>
  );
};

export default SubHeading;
