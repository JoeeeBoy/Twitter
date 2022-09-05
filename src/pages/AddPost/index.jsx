import React from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";
import { Link } from "react-router-dom";

import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import { selectIsAuth } from "../../redux/slices/auth";
import { useSelector } from "react-redux";
import { useNavigate, Navigate, useParams } from "react-router-dom";
import axios from "../../axios";

export const AddPost = () => {
  const { id } = useParams();

  const isAuth = useSelector(selectIsAuth);

  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState("");
  const [text, setText] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [image, setImage] = React.useState("");
  const inputFileRef = React.useRef(null);

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append("image", file);
      const { data } = await axios.post("/uploads", formData);
      setImage(data.url);
      console.log(data.url);
    } catch (err) {
      console.log(err);
      alert("Ошибка загрузки файла");
    }
  };

  const onClickRemoveImage = () => {
    setImage("");
  };

  const onChange = React.useCallback((text) => {
    setText(text);
  }, []);

  const addPost = async () => {
    try {
      setLoading(true);

      const fields = {
        title,
        text,
        tags,
        image,
      };

      const { data } = isEdit
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post("/posts", fields);

      const _id = isEdit ? id : data._id;

      navigate(`/posts/${_id}`);
    } catch (err) {
      console.warn(err);
      alert("Ошибка при создание статьи!");
    }
  };

  React.useEffect(() => {
    if (id) {
      axios
        .get(`/posts/${id}`)
        .then(({ data }) => {
          setTitle(data.title);
          setImage(data.image);
          setText(data.text);
          setTags(data.tags.join(" "));
        })
        .catch((err) => {
          console.warn(err);
          alert("Ошибка при получении статьи!");
        });
    }
  }, []);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Введите текст...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  if (!window.localStorage.getItem("token") && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button
        onClick={() => inputFileRef.current.click()}
        variant="outlined"
        size="large"
      >
        Загрузить превью
      </Button>
      <input
        ref={inputFileRef}
        type="file"
        onChange={handleChangeFile}
        hidden
      />
      {image && (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={onClickRemoveImage}
          >
            Удалить
          </Button>
          <img
            className={styles.image}
            src={`http://localhost:4000${image}`}
            alt="Uploaded"
          />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Тэги"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        fullWidth
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button onClick={addPost} size="large" variant="contained">
          {isEdit ? "Сохранить" : "Опубликовать"}
        </Button>
        <Link to="/">
          <Button size="large">Отмена</Button>
        </Link>
      </div>
    </Paper>
  );
};
