import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { fetchAllUser } from "../services/UserServices";
import ReactPaginate from "react-paginate";
import ModalAddNew from "./ModalAddNew";
import ModalEditUser from "./ModalEditUser";
import ModalConfirm from "./ModalConfirm";
import _ from "lodash";
import { debounce } from "lodash";
import "./TableUser.scss";
import { CSVLink, CSVDownload } from "react-csv";
import Papa from "papaparse";
import { toast } from "react-toastify";

const TableUser = () => {
  const [listUser, setListUser] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isShowModalAddNew, setIsShowModalAddNew] = useState(false);
  const [isShowModalEdit, setIsShowModalEdit] = useState(false);
  const [isShowDeleteModal, setIsShowModalDelete] = useState(false);
  const [dataUserEdit, setDataUserEdit] = useState([]);
  const [dataUserDelete, setDataUserDelete] = useState([]);
  const [sortBy, setSortBy] = useState("asc");
  const [sortField, setSortField] = useState("id");
  const [dataExport, setDataExport] = useState([]);

  const handleClose = () => {
    setIsShowModalAddNew(false);
    setIsShowModalEdit(false);
    setIsShowModalDelete(false);
  };

  const handleUpdateUser = (user) => {
    setListUser([user, ...listUser]);
  };

  useEffect(() => {
    //call apis
    getAllUsers(1);
  }, []);
  const getAllUsers = async (page) => {
    let res = await fetchAllUser(page);
    if (res && res.data) {
      setListUser(res.data);
      setTotalUsers(res.total);
      setTotalPages(res.total_pages);
    }
    console.log(listUser);
  };

  const handlePageClick = (event) => {
    getAllUsers(+event.selected + 1);
  };

  const handleEditUser = (user) => {
    setIsShowModalEdit(true);
    setDataUserEdit(user);
  };

  const handleEditUserFromModal = (user) => {
    let cloneListUser = _.cloneDeep(listUser);
    let index = listUser.findIndex((item) => item.id === user.id);
    cloneListUser[index].first_name = user.first_name;
    setListUser(cloneListUser);
  };

  const handleDeleteUser = (user) => {
    setIsShowModalDelete(true);
    setDataUserDelete(user);
  };

  const handleDeleteUserFromModal = (user) => {
    let cloneListUser = _.cloneDeep(listUser);
    cloneListUser = cloneListUser.filter((item) => item.id !== user.id);
    setListUser(cloneListUser);
  };

  const handleSort = (sortBy, sortField) => {
    setSortBy(sortBy);
    setSortField(sortField);
    let cloneListUser = _.cloneDeep(listUser);
    cloneListUser = _.orderBy(cloneListUser, [sortField], [sortBy]);
    setListUser(cloneListUser);
  };

  const handleSearch = debounce((ev) => {
    let term = ev.target.value;
    if (term) {
      let cloneListUser = _.cloneDeep(listUser);
      cloneListUser = cloneListUser.filter((item) => item.email.includes(term));
      setListUser(cloneListUser);
    } else {
      getAllUsers(1);
    }
  }, 500);

  const getUserExport = (event, done) => {
    let result = [];
    if (listUser && listUser.length > 0) {
      result.push(["Id", "Email", "First_Name", "Last_Name"]);
      listUser.map((item, index) => {
        let arr = [];
        arr[0] = item.id;
        arr[1] = item.email;
        arr[2] = item.first_name;
        arr[3] = item.last_name;
        result.push(arr);
      });
      console.log(result);
      setDataExport(result);
      done();
    }
  };

  const handleImportCSV = (ev) => {
    if (ev.target && ev.target.files && ev.target.files[0]) {
      let file = ev.target.files[0];
      if (file.type !== "text/csv") {
        toast.error("Only accept file csv...");
      } else {
        Papa.parse(file, {
          // header: true,
          complete: function (result) {
            let rawCSV = result.data;
            if (rawCSV.length > 0) {
              if (rawCSV[0] && rawCSV[0].length === 3) {
                if (
                  rawCSV[0][0] !== "email" ||
                  rawCSV[0][1] !== "first_Name" ||
                  rawCSV[0][2] !== "last_Name"
                ) {
                  toast.error("Wrong format header CSV file!!");
                } else {
                  let result = [];
                  rawCSV.map((item, index) => {
                    if (index > 0 && item.length === 3) {
                      let obj = {};
                      obj.email = item[0];
                      obj.first_name = item[1];
                      obj.last_name = item[2];
                      result.push(obj);
                    }
                  });
                  setListUser(result);
                }
              } else {
                toast.error("Wrong format CSV file!");
              }
            } else {
              toast.error("Can not find data");
            }
          },
        });
      }
    }
  };
  return (
    <>
      <div className="my-3 add-new">
        <span>
          <b>List Users:</b>
        </span>
        <div>
          <label htmlFor="import-users" className="btn btn-warning">
            <i className="fa-solid fa-file-import"></i>
            <span className="mx-3">Import</span>
          </label>
          <input
            id="import-users"
            type="file"
            hidden
            onChange={(ev) => handleImportCSV(ev)}
          />
          <CSVLink
            data={dataExport}
            className="btn btn-primary mx-3"
            filename="data_user.csv"
            asyncOnClick={true}
            onClick={getUserExport}
          >
            <i className="fa-solid fa-file-arrow-down"></i>
            <span className="mx-3">Export</span>
          </CSVLink>
          <button
            className="btn btn-success "
            onClick={() => {
              setIsShowModalAddNew(true);
            }}
          >
            <i className="fa-solid fa-user-plus"></i>
            <span className="mx-2">Add new</span>
          </button>
        </div>
      </div>
      <div className="filter-user col-12 col-sm-4 my-3">
        <input
          type="text"
          placeholder="Search email user..."
          className="form-control"
          onChange={(ev) => handleSearch(ev)}
        />
      </div>
      <div className="customize-table">
        <Table striped bordered hover className="customize-table">
          <thead>
            <tr>
              <th>
                <div className="sort-header">
                  <span>ID</span>
                  <span>
                    <i
                      className="fa-solid fa-arrow-down"
                      onClick={() => handleSort("desc", "id")}
                    ></i>
                    <i
                      className="fa-solid fa-arrow-up"
                      onClick={() => handleSort("asc", "id")}
                    ></i>
                  </span>
                </div>
              </th>
              <th className="sort-header">Email</th>
              <th>
                <div className="sort-header">
                  <span>First Name</span>
                  <span>
                    <i
                      className="fa-solid fa-arrow-down"
                      onClick={() => handleSort("desc", "first_name")}
                    ></i>
                    <i
                      className="fa-solid fa-arrow-up"
                      onClick={() => handleSort("asc", "first_name")}
                    ></i>
                  </span>
                </div>
              </th>
              <th className="sort-header">Last Name</th>
              <th className="sort-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listUser &&
              listUser.length > 0 &&
              listUser.map((user, index) => {
                return (
                  <tr key={`user-${index}`}>
                    <td>{user.id}</td>
                    <td>{user.email}</td>
                    <td>{user.first_name}</td>
                    <td>{user.last_name}</td>
                    <td>
                      <button
                        className="btn btn-warning mx-3"
                        onClick={() => {
                          handleEditUser(user);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteUser(user)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </div>
      <ReactPaginate
        className="pagination"
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={totalPages}
        previousLabel="< previous"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
      />
      <ModalAddNew
        show={isShowModalAddNew}
        handleClose={handleClose}
        handleUpdateUser={handleUpdateUser}
      />
      <ModalEditUser
        show={isShowModalEdit}
        dataUserEdit={dataUserEdit}
        handleClose={handleClose}
        handleEditUserFromModal={handleEditUserFromModal}
      />
      <ModalConfirm
        show={isShowDeleteModal}
        handleClose={handleClose}
        dataUserDelete={dataUserDelete}
        handleDeleteUserFromModal={handleDeleteUserFromModal}
      />
    </>
  );
};

export default TableUser;
