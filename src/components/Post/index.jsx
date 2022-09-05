import React from "react";
import clsx from "clsx";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import EyeIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import CommentIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import { Link, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import styles from "./Post.module.scss";
import { UserInfo } from "../UserInfo";
import { PostSkeleton } from "./Skeleton";
import { fetchPosts, fetchRemovePost } from "../../redux/slices/posts";
import { useState } from "react";

export const Post = ({
  id,
  title,
  createdAt,
  image,
  user,
  viewsCount,
  commentsCount,
  tags,
  children,
  isFullPost,
  isLoading,
  isEditable,
}) => {
  const [isDelete, setDelete] = useState(false);
  const dispatch = useDispatch();
  if (isLoading) {
    return <PostSkeleton />;
  }

  const onClickRemove = () => {
    if (window.confirm("Вы действительно хотите удалить статью?")) {
      setDelete(true);
      dispatch(fetchRemovePost(id));
    }
  };

  if (isDelete) {
    dispatch(fetchPosts());
    return <Navigate to="/" />;
  }

  return (
    <div className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
      {isEditable && (
        <div className={styles.editButtons}>
          <Link to={`/posts/${id}/edit`}>
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton onClick={onClickRemove} color="secondary">
            <DeleteIcon />
          </IconButton>
        </div>
      )}
      {image && (
        <img
          className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
          src={image}
          alt={title}
        />
      )}
      <div className={styles.wrapper}>
        <UserInfo {...user} additionalText={createdAt} />
        <div className={styles.indention}>
          <h2
            className={clsx(styles.title, { [styles.titleFull]: isFullPost })}
          >
            {isFullPost ? title : <Link to={`/posts/${id}`}>{title}</Link>}
          </h2>
          <ul className={styles.tags}>
            {/* {tags.map((name) => (
              <li key={name}>
                <Link to={`/tag/${name}`}>#{name}</Link>
              </li>
            ))} */}
          </ul>
          {children && <div className={styles.content}>{children}</div>}
          <ul className={styles.postDetails}>
            <li>
              <EyeIcon />
              <span>{viewsCount}</span>
            </li>
            <li>
              <CommentIcon />
              <span>{commentsCount}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
