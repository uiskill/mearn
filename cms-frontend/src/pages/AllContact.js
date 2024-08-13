import React, { useContext, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";
import ToastContext from "../context/ToastContext";

const AllContact = () => {
  const { toast } = useContext(ToastContext);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState({});
  const [contacts, setContacts] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page

  useEffect(() => {
    setLoading(true);
    const fetchContacts = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/mycontacts`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const result = await res.json();
        if (!result.error) {
          setContacts(result.contacts);
          setLoading(false);
        } else {
          console.log(result);
          setLoading(false);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchContacts();
  }, []);

  const deleteContact = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        const res = await fetch(`http://localhost:8000/api/delete/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const result = await res.json();
        if (!result.error) {
          setContacts(result.myContacts);
          toast.success("Deleted contact");
          setShowModal(false);
        } else {
          toast.error(result.error);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const newSearchUser = contacts.filter((contact) =>
      contact.name.toLowerCase().includes(searchInput.toLowerCase())
    );
    setContacts(newSearchUser);
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentContacts = contacts.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div>
        <h3>Your Contacts List</h3>
        <div className="row my-2">
          <div className="col-sm-3">
            <a href="/mycontacts" className="btn btn-danger mx-2">
              Reload Contact
            </a>
            <button
              type="button"
              className="btn btn-primary position-relative"
            >
              Total Contacts{" "}
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">
                {contacts.length}
                <span className="visually-hidden">Your Total Contacts</span>
              </span>
            </button>
          </div>
        </div>

        <hr className="my-4" />
        {loading ? (
          <Spinner splash="Loading Contacts..." />
        ) : (
          <>
            {contacts.length === 0 ? (
              <h3>No contacts created yet</h3>
            ) : (
              <>
                <div className="row">
                  <form className="d-flex" onSubmit={handleSearchSubmit}>
                    <div className="col-sm-11">
                      <input
                        type="text"
                        name="searchInput"
                        id="searchInput"
                        className="form-control my-2"
                        placeholder="Search Contact"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                      />
                    </div>
                    <div className="col-sm-1">
                      <button
                        type="submit"
                        className="btn btn-info btn-md mx-2 my-2"
                      >
                        Search
                      </button>
                    </div>
                  </form>
                </div>
                <div className="row my-2">
                  <div className="col-sm-12">
                    <div className="table-responsive">
                      <table className="table table-hover table-bordered">
                        <thead>
                          <tr className="table-info">
                            <th scope="col">Name</th>
                            <th scope="col">Address</th>
                            <th scope="col">Email</th>
                            <th scope="col">Phone</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentContacts.map((contact) => (
                            <tr
                              key={contact._id}
                              onClick={() => {
                                setModalData(contact);
                                setShowModal(true);
                              }}
                            >
                              <td scope="row">{contact.name}</td>
                              <td>{contact.address}</td>
                              <td>{contact.email}</td>
                              <td><strong>+91 </strong>{contact.phone}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                {/* Pagination */}
                <nav>
                  <ul className="pagination justify-content-center">
                    {[...Array(Math.ceil(contacts.length / itemsPerPage)).keys()].map((number) => (
                      <li key={number} className="page-item">
                        <button onClick={() => paginate(number + 1)} className="page-link">
                          {number + 1}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </>
            )}
          </>
        )}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalData.name}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>
            <strong>Address</strong>: {modalData.address}
          </p>
          <hr />
          <p>
            <strong>Email</strong>: {modalData.email}
          </p>
          <hr />
          <p>
            <strong>Phone Number</strong>: {modalData.phone}
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Link className="btn btn-info" to={`/edit/${modalData._id}`}>
            Edit
          </Link>
          <button
            className="btn btn-danger"
            onClick={() => deleteContact(modalData._id)}
          >
            Delete
          </button>
          <button className="btn btn-success" onClick={() => setShowModal(false)}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AllContact;
