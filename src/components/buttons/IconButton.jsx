import { IconButton } from "@mui/material";

const IButton = ({ content, handleOpenModal, className }) => {
  return (
    <IconButton onClick={handleOpenModal} className={className}>
      {content}
    </IconButton>
  );
};

export default IButton;
