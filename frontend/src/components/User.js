import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const User = (props) => {
  const { user } = props;

  return (
    <Card className="my-3 p-3 rounded">
      <Card.Header>
        <small>{user._id}</small>
      </Card.Header>
      <Card.Body>
        <Link to={`/admin/users/${user._id}`}>
          <Card.Title>
            <strong>{user.name}</strong>
          </Card.Title>
        </Link>
        <Card.Text>{user.email}</Card.Text>
      </Card.Body>
      <Card.Footer>{user.isAdmin ? "Admin" : "User"}</Card.Footer>
    </Card>
  );
};

export default User;
