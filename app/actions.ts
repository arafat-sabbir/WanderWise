"use server";
const getAllPosts = async ({ page = 1, limit = 3 }) => {
  const res = await fetch(
    `http://localhost:5000/api/v1/posts?&page=${page}&limit=${limit}`
  );
  const data = await res.json();
  return data;
};
export default getAllPosts;
