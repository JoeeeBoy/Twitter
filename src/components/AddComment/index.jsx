import React from "react";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { postComments } from "../../redux/slices/posts";

export const Index = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const { data } = useSelector((state) => state.auth);

  const [text, setText] = React.useState("");

  const handleAddComm = async () => {
    try {
      const fields = {
        id,
        text,
      };
      dispatch(postComments(fields));
      setText("");
    } catch (err) {
      console.warn(err);
    }
  };

  const handleChange = (e) => setText(e.target.value);

  return (
    <>
      <div className={styles.root}>
        <Avatar
          classes={{ root: styles.avatar }}
          src={data.avatar}
          alt={data.fullName}
        />
        <div className={styles.form}>
          <TextField
            label="Написать комментарий"
            variant="outlined"
            maxRows={10}
            multiline
            value={text}
            onChange={handleChange}
            fullWidth
          />
          <Button
            className={styles.button}
            disabled={!text}
            onClick={handleAddComm}
            variant="contained"
          >
            Отправить
          </Button>
        </div>
      </div>
    </>
  );
};
