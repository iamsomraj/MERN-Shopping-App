import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const UserOrderPageContainer = ({ history }) => {
  const userLogin = useSelector((state) => state.userLogin);
  const { user } = userLogin;

  useEffect(() => {
    if (!user) {
      history.push("/login");
    }
  }, [history, user]);

  return <div>UserProfileOrderPageContainer</div>;
};

export default UserOrderPageContainer;
