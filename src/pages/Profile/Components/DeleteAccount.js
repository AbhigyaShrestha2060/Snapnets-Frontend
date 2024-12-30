import React from 'react';
import { Form, Button, Card } from 'react-bootstrap';

const DeleteAccount = () => {
  return (
    <Card className="p-4 shadow rounded" style={{ maxWidth: '600px', margin: 'auto' }}>
      <h3 className="text-center mb-4">Delete Account</h3>
      <p className="text-center text-muted">
        By deleting your account, all of your data will be permanently lost and cannot
        be recovered. Once confirmed, we will remove your data from our systems within
        <strong> 90 business days</strong>. This process is final, so if you wish to use
        our service again, you will need to create a new account. For further assistance,
        please contact <strong>[email@gmail.com]</strong>.
      </p>

      <Form>
        {/* Password Input */}
        <Form.Group controlId="password" className="mb-4">
          <Form.Label>
            Enter your password to delete your account permanently
          </Form.Label>
          <Form.Control type="password" placeholder="Enter your password" />
        </Form.Group>

        {/* Delete Button */}
        <div className="d-flex justify-content-end">
          <Button variant="danger" type="submit">
            DELETE ACCOUNT
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default DeleteAccount;
