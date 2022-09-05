import React from "react";

import { SideBlock } from "./SideBlock";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Clear";

import { useSelector, useDispatch } from "react-redux";
import { fetchComments, addLike, deleteComm } from "../redux/slices/posts";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { selectIsAuth } from "../redux/slices/auth";

export const CommentsBlock = ({ children, isLoading, comments }) => {
  const dispatch = useDispatch();

  const { id } = useParams();

  useEffect(() => {
    dispatch(fetchComments(id));
  }, [dispatch]);

  const isAuth = useSelector(selectIsAuth);

  const userId = useSelector((state) => state.auth.data?._id);

  const isloadLike = useSelector((state) => state.posts.post.likeLoad);

  const hundleAddLike = (id) => {
    dispatch(addLike(id));
  };
  const hundleDeleteComm = (id) => {
    dispatch(deleteComm(id));
  };
  return (
    <SideBlock title="Комментарии">
      <List>
        {(isLoading ? [...Array(5)] : comments)?.map((obj, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                {isLoading ? (
                  <Skeleton variant="circular" width={40} height={40} />
                ) : (
                  <Avatar alt={obj.user.fullName} src={obj.user.avatar} />
                )}
              </ListItemAvatar>
              {isLoading ? (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Skeleton variant="text" height={25} width={120} />
                  <Skeleton variant="text" height={18} width={230} />
                </div>
              ) : (
                <>
                  <ListItemText
                    primary={obj.user.fullName}
                    secondary={obj.text}
                  />
                  {isAuth &&
                    (isloadLike ? (
                      <div></div>
                    ) : (
                      <a
                        style={
                          obj.likes.includes(userId)
                            ? { color: "red", cursor: "pointer" }
                            : { color: "black", cursor: "pointer" }
                        }
                        role="button"
                        title="Нравится"
                        onClick={() => {
                          hundleAddLike(obj._id);
                        }}
                      >
                        {obj.likeCount}
                      </a>
                    ))}
                  {obj.user._id === userId && (
                    <IconButton
                      onClick={() => {
                        hundleDeleteComm(obj._id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </>
              )}
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
      {children}
    </SideBlock>
  );
};
