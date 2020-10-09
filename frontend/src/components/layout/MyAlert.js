import React from "react";
import { useSelector } from "react-redux";
import { Toast, ToastBody, ToastHeader } from "reactstrap";

const MyAlert = () => {
  const header = useSelector((state) => state.alert.header);
  const message = useSelector((state) => state.alert.message);
  const color = useSelector((state) => state.alert.color);

  if (header === "" || message === "" || color === "") {
    return null;
  }

  return (
    <div className={`p-3 bg-${color} my-2 rounded`}>
      <Toast>
        <ToastHeader>{header}</ToastHeader>
        <ToastBody>{message}</ToastBody>
      </Toast>
    </div>
  );
};

export default MyAlert;
