import { STORAGE_STATUS_ENUM } from "../enums";
import PropTypes from "prop-types";

export const StatusComponent = ({ status }) => {
  let className;
  switch (status) {
    case STORAGE_STATUS_ENUM.APPROVED:
      className = "py-4 px-2  rounded-lg text-green-600 font-bold";
      break;
    case STORAGE_STATUS_ENUM.PENDING:
      className = "py-4 px-2  rounded-lg text-orange-600 font-bold";
      break;
    case STORAGE_STATUS_ENUM.REJECTED:
      className = "py-4 px-2  rounded-lg text-bg-red-600 font-bold";
      break;

    default:
      className = "py-4 px-2  rounded-lg ";
      break;
  }

  return <div className={className}>{status}</div>;
};

StatusComponent.propTypes = {
  status: PropTypes.string,
};
