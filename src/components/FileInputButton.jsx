import React from "react";

const FileInputButton = ({ setImage, setNewProfileImage }) => {
  const fileInput = React.createRef();

  const handleClick = () => {
    fileInput.current.click();
  };

  const pickedHandler = (event) => {
    let pickedFile = event.target.files[0];
    setImage(URL.createObjectURL(event.currentTarget.files[0]));

    setNewProfileImage(pickedFile);
  };

  return (
    <div className="relative">
      <button
        className="bg-[#3279B7] hover:bg-blue-200 text-white font-bold py-4 px-6 rounded"
        onClick={handleClick}
      >
        <i className="fa fa-upload"></i> select image
      </button>
      <input
        type="file"
        id="fileInput"
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
        ref={fileInput}
        onChange={pickedHandler}
      />
    </div>
  );
};

export default FileInputButton;
