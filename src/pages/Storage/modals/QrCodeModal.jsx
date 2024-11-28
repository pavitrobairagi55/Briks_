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
                  <td className="border p-2">AddedDat:</td>
                  <td className="border p-2">{this.props.data.addedDate}</td>
                </tr>
                <tr>
                  <td className="border p-2">DaysOfFermentation:</td>
                  <td className="border p-2">
                    {this.props.data.daysOfFermentation}
                  </td>
                </tr>
                <tr>
                  <td className="border p-2">FermentationNo:</td>
                  <td className="border p-2">
                    {this.props.data.fermentationNo}
                  </td>
                </tr>
                <tr>
                  <td className="border p-2">MixDesgin:</td>
                  <td className="border p-2">{this.props.data.mixDesgin}</td>
                </tr>
                <tr>
                  <td className="border p-2">RedClayPercentage:</td>
                  <td className="border p-2">
                    {this.props.data.redClayPercentage}
                  </td>
                </tr>
                <tr>
                  <td className="border p-2">soilSource:</td>
                  <td className="border p-2">{this.props.data.soilSource}</td>
                </tr>
                <tr>
                  <td className="border p-2">SoilStorageNo:</td>
                  <td className="border p-2">
                    {this.props.data.soilStorageNo}
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
  const { data: qrData } = useFetch(`Approval/palette/${data.id}`);

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
