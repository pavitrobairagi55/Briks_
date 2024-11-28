import React, { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

const Modal = ({
  title,
  closeModal,
  type,
  saveFcn,
  cancelFcn,
  withCancel,
  children,
  isLoading,
  showSave,
}) => {
  return (
    <div
      className="fixed z-10 inset-0 overflow-y-auto "
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 " aria-hidden="true"></div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        {/*  <Draggable> */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-y-auto shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
          <div className="bg-[#DCC3B8] text-slate-700 p-4 flex justify-between px-4">
            <h2 className="text-2xl font-semibold bg-[#DCC3B8]">{title}</h2>
            <h2
              className="text-2xl font-bold bg-[#DCC3B8] cursor-pointer"
              onClick={closeModal}
            >
              X
            </h2>
          </div>
          <div className="p-4 overflow-y-auto">
            {children}
            <div className="flex items-center w-1/6 mx-auto justify-center mt-10 mb-8 flex gap-5 items-center">
              {showSave && (
                <button
                  disabled={isLoading}
                  className="bg-[#0133C3] px-6 py-2 text-white rounded-xl mr-2 flex items-center"
                  onClick={saveFcn}
                >
                  {isLoading && (
                    <CircularProgress
                      size={20}
                      style={{ color: "white", marginRight: 6 }}
                    />
                  )}{" "}
                  {type}
                </button>
              )}
              {withCancel && (
                <button
                  className="bg-[#FF0854] px-5 py-2 text-white rounded-lg"
                  onClick={cancelFcn}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
