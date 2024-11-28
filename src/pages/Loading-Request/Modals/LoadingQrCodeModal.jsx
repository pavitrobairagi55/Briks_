import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import QRCode from "react-qr-code";
import Modal from "../../../components/Modal";
import { formatDate } from "../../../utils";
import { APP_URL } from "../../../envirement";

// Create a new component for the content you want to print
class ComponentToPrint extends React.Component {
  render() {
    return (
      <div className="flex justify-center items-center mt-20">
        <div className="mr-40">
          <QRCode value={this.props.datalog} />
        </div>
        <div className="font-semibold">
          <div className="pb-3">Trip Number: {this.props.data.id}</div>
          <div className="pb-3">
            Customer Order Number: {this.props.data.customerOrderId}
          </div>
          <div className="pb-3">
            Driver Name: {this.props.data.driver?.name}
          </div>
          <div className="pb-3">
            Trip Date: {formatDate(this.props.data.approvalDateTime)}
          </div>
          <div className="pb-3">
            Vehicle Plate Number: {this.props.data.vehicle.plateNumber}
          </div>
        </div>
      </div>
    );
  }
}

export default function LoadingQrCodeModal({
  title,
  closeModal,
  saveFcn,
  type,
  cancelFcn,
  withCancel,
  data,
}) {
  const datalog = `${APP_URL}/gate-pass-jubila/EnterCustomer/${data.id}`;

  // Create a reference to the component you want to print
  const componentRef = useRef();

  return (
    <>
      <Modal
        title={title}
        closeModal={closeModal}
        type={type}
        saveFcn={saveFcn}
        cancelFcn={cancelFcn}
        withCancel={withCancel}
      >
        <ComponentToPrint ref={componentRef} datalog={datalog} data={data} />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          <div className="flex justify-center items-center bg-[#0133C3] px-6 py-2 text-white rounded-xl mr-2 w-20">
            <ReactToPrint
              trigger={() => <button>Print</button>}
              content={() => componentRef.current}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
