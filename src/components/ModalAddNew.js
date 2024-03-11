import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { postNewUser } from "../services/UserServices";
import { toast } from "react-toastify";

function ModalAddNew(props) {
  const { show, handleClose, handleUpdateUser } = props;
  const [name, setName] = useState("");
  const [job, setJob] = useState("");

  const handleSave = async () => {
    let res = await postNewUser(name, job);
    if (res && res.id) {
      handleClose();
      setName("");
      setJob("");
      toast.success("Create succeeds");
      handleUpdateUser({ first_name: name, id: res.id });
    } else {
      toast.error("An error...");
    }
  };
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="body-add-new">
            <div class="form-group">
              <label className="form-label">Name:</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(ev) => setName(ev.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Job:</label>
              <input
                type="text"
                className="form-control"
                value={job}
                onChange={(ev) => setJob(ev.target.value)}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleSave()}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalAddNew;
