import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "axios";
import Loader from "../Components/Loader";
import "../Styles/Articles.css";

const ArticleDetails = () => {
  const user = useSelector((state) => state.user);
  const isAdmin = user?.User.userType === "admin";

  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedContent, setUpdatedContent] = useState("");

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/articles/${id}`,
          { withCredentials: true }
        );

        setArticle(response.data._doc);
        setUpdatedTitle(response.data.title);
        setUpdatedContent(response.data.content);
      } catch (error) {
        console.error("Error fetching article:", error);
        setError("Failed to load article.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/articles/delete/${id}`,
        {
          withCredentials: true,
        }
      );
      navigate(-1);
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedInfo = { id, title: updatedTitle, content: updatedContent };
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/articles/update/${id}`,
        updatedInfo,
        { withCredentials: true }
      );
      setArticle((prev) => ({
        ...prev,
        title: updatedTitle,
        content: updatedContent,
      }));
      setIsUpdate(false);
    } catch (error) {
      console.error("Error updating article:", error);
    }
  };

  if (loading) {
    return (
      <div>
        {/* <img src={bg} className="absolute h-full w-full" /> */}
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <>
      {isUpdate && (
        <div className="fixed top-0 left-0 w-full h-full  bg-opacity-80 flex justify-center items-center z-50">
          <div className="bg-purple-500 rounded-2xl p-6 w-full max-w-lg">
            <h1 className="text-black mb-4">Updating this article</h1>
            <form onSubmit={handleUpdate}>
              <label className="block text-white">Update Title</label>
              <input
                type="text"
                className="border-1 m-3 rounded-md p-2 w-full"
                placeholder="Title"
                onChange={(e) => setUpdatedTitle(e.target.value)}
                value={updatedTitle}
              />
              <label className="block text-white">Update Content</label>
              <textarea
                className="border-1 m-3 rounded-md p-2 w-full h-24"
                placeholder="Content"
                onChange={(e) => setUpdatedContent(e.target.value)}
                value={updatedContent}
              />
              <button
                type="submit"
                className="!bg-purple-950 p-2 rounded-2xl text-white mt-4"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between  z-30 ">
        <button
          className="text-5xl bg-white p-2 rounded-md fixed top-3 ml-5 shadow z-50"
          onClick={() => navigate(-1)}
        >
          <p className="back-navigate-btn">&larr;</p>
        </button>

        {isAdmin && (
          <div>
            <button
              className="text-2xl mr-3 !text-black !bg-white p-2 rounded-md"
              onClick={handleDelete}
            >
              ❌ Delete
            </button>
            <button
              className="text-2xl !text-black !bg-white p-2 rounded-md"
              onClick={() => setIsUpdate(!isUpdate)}
            >
              🪄 Update
            </button>
          </div>
        )}
      </div>

      <div className="max-w-4xl h-screen overflow-y-auto mx-auto my-8 px-8 py-12 bg-purple-200 rounded-lg shadow-lg">
        <div className="h-svh overflow-y-auto">
          {article?.image ? (
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-96 rounded-lg mb-6"
            />
          ) : (
            <div className="w-full h-96 bg-gray-200 rounded-lg mb-6">
              No image available
            </div>
          )}

          <h1 className="text-3xl font-semibold text-gray-900 mb-4 break-words ">
            {article?.title || "Untitled Article"}
          </h1>

          <p className="text-gray-700 text-lg break-words mb-6">
            {article?.content || "No content available"}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {article?.category?.map((category, index) => (
              <span
                key={index}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-md"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticleDetails;
