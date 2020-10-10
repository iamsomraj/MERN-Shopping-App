import React from "react";
import { Toast, ToastBody, ToastHeader } from "reactstrap";

const MyAlert = ({ color, header, message }) => {
  if (message === "" && header === "" && color === "") {
    return null;
  }
  return (
    <div className={`bg-${color} mt-4 mb-4 p-4 rounded`}>
      <Toast>
        <ToastHeader icon={color}>{header}</ToastHeader>
        <ToastBody>{message}</ToastBody>
      </Toast>
    </div>
  );
};

export default MyAlert;
