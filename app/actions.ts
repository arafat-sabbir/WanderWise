import axios from "axios";

const getAllPosts = async ({ page = 1, limit = 3, searchTerm }:{page:number,limit:number,searchTerm?:string}) => {
  const res = await axios.get(`http://localhost:5000/api/v1/posts?page=${page}&limit=${limit}&searchTerm=${searchTerm}`);
  return res.data;
};
export default getAllPosts;

