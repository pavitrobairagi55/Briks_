import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import QRCode from "react-qr-code";
import Modal from "../../../components/Modal";
import { formatDate } from "../../../utils";
import { APP_URL } from "../../../envirement";
import useFetch from "../../../shared/useFetch";

class ComponentToPrint extends React.Component {
  render() {
    return (
      <div
        className="flex justify-center items-center mt-20"
        style={{ width: "90%", margin: "auto" }}
      >
        <div className="mr-10">
          <QRCode
            value={this.props.data ? JSON.stringify(this.props.data) : ""}
          />
        </div>
        {this.props.data && (
          <div className="font-semibold mt-10">
            <table className="border-collapse border" style={{ width: "100%" }}>
              <tbody>
                <tr>
                  <td className="border p-2">serialNumber:</td>
                  <td className="border p-2">{this.props.data.serialNumber}</td>
                </tr>
                <tr>
                  <td className="border p-2">mirNumber:</td>
                  <td className="border p-2">{this.props.data.mirNumber}</td>
                </tr>
                <tr>
                  <td className="border p-2">sourceLocation:</td>
                  <td className="border p-2">
                    {this.props.data.sourceLocation}
                  </td>
                </tr>
                <tr>
                  <td className="border p-2">batchNumber:</td>
                  <td className="border p-2">{this.props.data.batchNumber}</td>
                </tr>
                <tr>
                  <td className="border p-2">approvedQuantity:</td>
                  <td className="border p-2">
                    {this.props.data.approvedQuantity}
                  </td>
                </tr>
                <tr>
                  <td className="border p-2">dateSubmitted:</td>
                  <td className="border p-2">
                    {formatDate(this.props.data.dateSubmitted)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }
}

export default function QrCodeModal({
  title,
  closeModal,
  saveFcn,
  type,
  cancelFcn,
  withCancel,
  data,
}) {
  const { data: qrData } = useFetch(`AthelWoodClassificationMIR/${data.id}`);

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
        <ComponentToPrint ref={componentRef} data={qrData} />
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
