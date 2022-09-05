import React, { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import ReactMarkdown from "react-markdown";
import { useSelector, useDispatch } from "react-redux";
import { fetchPost } from "../redux/slices/posts";
import { selectIsAuth } from "../redux/slices/auth";

export const FullPost = () => {
  const dispatch = useDispatch();

  const { id } = useParams();
  const { item, load, commLoad, comments } = useSelector(
    (state) => state.posts.post
  );

  const userData = useSelector((state) => state.auth.data);

  const isAuth = useSelector(selectIsAuth);

  useEffect(() => {
    dispatch(fetchPost(id));
  }, []);

  if (!load) {
    return <Post isLoading={load} isFullPost />;
  }

  return (
    <>
      <Post
        id={item._id}
        title={item.title}
        image={item.image ? `http://localhost:4000${item.image}` : ""}
        user={item.user}
        createdAt={item.createdAt}
        viewsCount={item.viewsCount}
        commentsCount={item.comments?.length}
        tags={item.tags}
        isFullPost
        isEditable={item.user._id === userData?._id}
      >
        <ReactMarkdown children={item.text} />
      </Post>
      <CommentsBlock isLoading={commLoad} comments={comments}>
        {isAuth && <Index />}
      </CommentsBlock>
    </>
  );
};
