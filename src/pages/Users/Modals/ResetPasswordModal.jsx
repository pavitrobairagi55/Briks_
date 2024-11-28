import { useContext, useEffect, useState } from "react";

import Modal from "../../../components/Modal";
import { AuthContext } from "../../../shared/authContext";

export default function ResetPasswordModal({
  title,
  closeModal,
  saveFcn,
  type,
  cancelFcn,
  withCancel,
}) {
  const auth = useContext(AuthContext);
  const [paassword, setPassword] = useState();

  return (
    <>
      <Modal
        showSave={true}
        title={title}
        closeModal={closeModal}
        type={type}
        saveFcn={saveFcn}
        cancelFcn={cancelFcn}
        withCancel={withCancel}
      >
        <div className="grid grid-cols-1 md:grid-cols-1 mx-20 ">
          <div className="my-6">
            User Name:{" "}
            <span className="font-semibold">
              {auth.userData.firstName + " " + auth.userData.lastName}{" "}
            </span>
          </div>
          <div className="my-6">
            <label className="block mb-2">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={auth.userData.email}
              disabled
            />
          </div>
          <div className="my-6">
            <label className="block mb-2">New Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={paassword}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
