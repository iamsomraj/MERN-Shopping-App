import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toast, ToastBody, ToastHeader } from "reactstrap";
import { delAlert } from "../../redux/alert/alertActions";

const MyAlert = () => {
  const message = useSelector((state) => state.alert.message);
  const header = useSelector((state) => state.alert.header);
  const color = useSelector((state) => state.alert.color);

  const dispatch = useDispatch();

  if (message === "" && header === "" && color === "") {
    return null;
  }

  const toggle = () => {
    dispatch(delAlert());
  };

  return (
    <div className={`bg-${color} mt-4 mb-4 p-4 rounded`}>
      <Toast isOpen={!!(message && header && color)}>
        <ToastHeader toggle={toggle} icon={color}>
          {header}
        </ToastHeader>
        <ToastBody>{message}</ToastBody>
      </Toast>
    </div>
  );
};

export default MyAlert;
