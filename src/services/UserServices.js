import axios from "./customize-axios";
const fetchAllUser = (page) => {
  return axios.get(`/users?page=${page}`);
};

const postNewUser = (name, job) => {
  return axios.post("/users", { name, job });
};

const putUpdateUser = (name, job) => {
  return axios.put("/users/2", { name, job });
};

const deleteUser = (id) => {
  return axios.delete(`/users/${id}`);
};

const loginApi = (email, password) => {
  return axios.post("/login", { email, password });
};

export { fetchAllUser, postNewUser, putUpdateUser, deleteUser, loginApi };
