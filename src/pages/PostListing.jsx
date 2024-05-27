import React, { useEffect, useState } from "react";
import PostCard from "../Posts/PostCard";
import "./postStyles.css";
import axios from "axios";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

const PostListing = () => {
  const [postData, setPostData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newPoster, setNewPoster] = useState();
  const [newAuthor, setNewAuthor] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddOpen = () => {
    setOpenAdd(true);
  };

  const handleAddClose = () => {
    setOpenAdd(false);
  };

  const handleAddSubmit = async () => {
    try {
      const newPost = {
        title: newTitle,
        content: newContent,
        poster: newPoster,
        author: newAuthor,
      };
      setLoading(true);
      const res = await axios.post("http://localhost:8000/api/create", newPost);
      setPostData([...postData, res.data]);
      handleAddClose();
      setLoading(false);
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  const buttonDisabled = () => {
    // return !newTitle.trim("") || !newContent.trim("") || !newAuthor.trim();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredPosts = postData.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const res = await axios.get(`http://localhost:8000/api/`);
      setPostData(res.data);
      setLoading(false);
    };
    fetchPosts();
  }, [searchTerm]);

  return (
    <>
      <div>
        <div className="navbar">
          <div className="create-post">
            <Button variant="contained" color="primary" onClick={handleAddOpen}>
              +
            </Button>
          </div>
          <div className="header-name">
            <h1>Management System</h1>
          </div>
          <div className="search-cont">
            <input
              type="text"
              placeholder="search"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
        <div className="posts-list">
          {loading ? (
            <h1>Loading...</h1>
          ) : (
           filteredPosts &&  filteredPosts.map((post) => (
              <div key={post._id}>
                <PostCard
                  post={post}
                  setPostData={setPostData}
                  postData={postData}
                  loading={loading}
                  setLoading={setLoading}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Post Modal */}
      {loading ? (
        <h1>Loading</h1>
      ) : (
        <Dialog open={openAdd} onClose={handleAddClose}>
          <DialogTitle>Add Post</DialogTitle>
          <DialogContent>
            <TextField
              required
              autoFocus
              margin="dense"
              label="Title"
              type="text"
              fullWidth
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <TextField
              required
              margin="dense"
              label="Content"
              type="text"
              fullWidth
              multiline
              rows={4}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
            <TextField
              margin="dense"
              //   label="Poster"
              type="file"
              fullWidth
              value={newPoster}
              onChange={(e) => setNewPoster(e.target.value)}
              accept="image/*"
            />
            <TextField
              required
              margin="dense"
              label="Author"
              type="text"
              fullWidth
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddClose}>Cancel</Button>
            <Button onClick={handleAddSubmit} >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default PostListing;
