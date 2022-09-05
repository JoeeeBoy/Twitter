import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const { data } = await axios.get("/posts");
  return data;
});

export const fetchPost = createAsyncThunk("posts/fetchPost", async (id) => {
  const { data } = await axios.get(`/posts/${id}`);
  return data;
});

export const fetchRemovePost = createAsyncThunk(
  "posts/fetchRemovePost",
  async (id) => {
    await axios.delete(`/posts/${id}`);
  }
);

export const fetchComments = createAsyncThunk(
  "posts/fetchComments",
  async (id) => {
    const { data } = await axios.get(`/posts/${id}/comments`);
    return data;
  }
);

export const addLike = createAsyncThunk("posts/addLike", async (id) => {
  const data = await axios.patch(`/comments/${id}/addlike`);
  return data;
});

export const postComments = createAsyncThunk(
  "posts/postComments",
  async (fields) => {
    const { data } = await axios.post(`/posts/${fields.id}/comments`, fields);
    return data;
  }
);

export const deleteComm = createAsyncThunk("posts/deleteComm", async (id) => {
  const data = await axios.delete(`/comments/${id}`);
  return data;
});

export const fetchTags = createAsyncThunk("posts/tags", async () => {
  const { data } = await axios.get("/tags");
  return data;
});

const initialState = {
  posts: {
    items: [],
    status: "Loading",
  },
  tags: {
    items: [],
    status: "Loading",
  },
  post: {
    item: null,
    status: "Loading",
    load: false,
    comments: null,
    commLoad: true,
    likeLoad: false,
  },
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducer: {},
  extraReducers: {
    // Получение статьей
    [fetchPosts.pending]: (state) => {
      state.posts.status = "loading";
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = "loaded";
    },
    [fetchPosts.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = "error";
    },
    // Получение одной статьи
    [fetchPost.pending]: (state) => {
      state.post.status = "loading";
    },
    [fetchPost.fulfilled]: (state, action) => {
      state.post.item = action.payload;
      state.post.load = true;
      state.post.status = "loaded";
    },
    [fetchPost.rejected]: (state) => {
      state.post.item = null;
      state.post.status = "error";
    },
    // Получение комментариев
    [fetchComments.pending]: (state) => {
      state.post.commLoad = true;
    },
    [fetchComments.fulfilled]: (state, action) => {
      state.post.comments = action.payload;
      state.post.commLoad = false;
    },
    //
    [addLike.pending]: (state) => {
      state.post.likeLoad = true;
    },
    [addLike.fulfilled]: (state, action) => {
      state.post.comments = action.payload.data;
      state.post.likeLoad = false;
    },
    // del
    [deleteComm.fulfilled]: (state, action) => {
      state.post.comments = action.payload.data;
    },
    // Добавление комментария и обновления списка
    [postComments.fulfilled]: (state, action) => {
      state.post.comments = action.payload;
    },
    // Получение тегов
    [fetchTags.pending]: (state) => {
      state.tags.status = "loading";
    },
    [fetchTags.fulfilled]: (state, action) => {
      state.tags.items = action.payload;
      state.tags.status = "loaded";
    },
    [fetchTags.rejected]: (state) => {
      state.tags.items = [];
      state.tags.status = "error";
    },
    // Удаление статьи
    [fetchRemovePost.pending]: (state, action) => {
      state.posts.items = state.posts.items.filter(
        (obj) => obj._id !== action.meta.arg
      );
    },
  },
});

export const postsReducer = postsSlice.reducer;
