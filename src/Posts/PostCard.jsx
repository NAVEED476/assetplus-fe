import React, { useState } from "react";
import Card from "@mui/material/Card";
import axios from "axios";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import "./postCard.css";

export default function PostCard({ post, setPostData, postData, loading , setLoading}) {
  // const [loading, setLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);
  const [editAuthor, setEditAuthor] = useState(post.content);

  const handleEditOpen = () => {
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
  };

  const handleDeleteOpen = () => {
    setOpenDelete(true);
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

  const handleEditSubmit = async () => {
    try {
        setLoading(true);
      const updatedPost = {
        title: editTitle,
        content: editContent,
        author:editAuthor
      };
      const res = await axios.put(
        `http://localhost:8000/api/update/${post._id}`,
        updatedPost
      );
      setPostData(postData.map((p) => (p._id === post._id ? res.data : p)));
      handleEditClose();
      setLoading(false)
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      setLoading(true)
      await axios.delete(`http://localhost:8000/api/delete/${post._id}`);
      setPostData(postData.filter((p) => p._id !== post._id));
      handleDeleteClose();
      setLoading(false)
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <Card className="post-card">
      <CardMedia
        component="img"
        alt="Post image"
        height="100"
        image={post.poster}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {post.content}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {post.author}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {new Date(post.createdAt).toLocaleString()}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={handleEditOpen}>
          Edit
        </Button>
        <Button size="small" onClick={handleDeleteOpen}>
          Delete
        </Button>
      </CardActions>

      {/* Edit Modal */}
      <Dialog open={openEdit} onClose={handleEditClose}>
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Content"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
            <TextField
            margin="dense"
            label="Author"
            type="text"
            fullWidth
            multiline
            rows={1}
            value={editAuthor}
            onChange={(e) => setEditAuthor(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSubmit}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={openDelete} onClose={handleDeleteClose}>
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this post?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Cancel</Button>
          <Button onClick={handleDeleteSubmit} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
