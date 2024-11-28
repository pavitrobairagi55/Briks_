import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";
import Modal from "../../../components/Modal";
import BasicSelect from "../../../components/filters/components/Select";
import useFetch from "../../../shared/useFetch";

export default function AddPrivilegeModal({
  title,
  closeModal,
  saveFcn,
  type,
  cancelFcn,
  withCancel,
  roles,
}) {
  const auth = useContext(AuthContext);
  const [page, setPage] = useState();
  const [error, setError] = useState();

  const [isLoading, setIsLoading] = useState();

  const [role, setRole] = useState();
  const { data: menuList } = useFetch("menus");

  const menuOption = menuList?.map((elem) => ({
    id: elem.id,
    value: elem.name,
  }));

  const saveData = async () => {
    if (!page || !role) {
      setError("Please fullfill all the requested infomation");
      return;
    }
    setIsLoading(true);
    try {
      const input = {
        roleId: role?.toString(),
        menuId: page?.toString(),
      };

      await axios.post(`api/UserPrivileges`, input, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      saveFcn();
    } catch (error) {
      console.log("🚀 ~ saveData ~ error:", error);
      setIsLoading(false);

      setError(error.response?.data);
    }
  };

  return (
    <>
      <Modal
        showSave={true}
        title={title}
        closeModal={closeModal}
        type={type}
        saveFcn={saveData}
        cancelFcn={cancelFcn}
        withCancel={withCancel}
        isLoading={isLoading}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Page Name</label>
            <BasicSelect
              value={page}
              handleChange={(val) => setPage(val.target.value)}
              options={menuOption || []}
            />
          </div>
          <div>
            <label className="block mb-2">Role</label>
            <BasicSelect
              value={role}
              handleChange={(val) => setRole(val.target.value)}
              options={roles || []}
            />
          </div>
        </div>
        <span className="font-semibold text-red-500">{error} </span>
      </Modal>
    </>
  );
}
