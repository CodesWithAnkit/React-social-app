import React, { useEffect, useContext } from "react";
import { useImmerReducer } from "use-immer";
import Page from "./Page";
import axios from "axios";
import { useParams, Link, withRouter } from "react-router-dom";
import StateContext from "../StateContext.js";
import DispatchContext from "../DispatchContext.js";
import LoadingDotsIcons from "./LoadingDotsIcons";
import NotFound from "./NotFound";

const EditPost = (props) => {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const originalState = {
    title: {
      value: "",
      hasError: false,
      body: "",
    },
    body: {
      value: "",
      hasError: false,
      body: "",
    },
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
    notFound: false,
  };
  const ourReducer = (draft, action) => {
    switch (action.type) {
      case "fetchComplete":
        draft.title.value = action.value.title;
        draft.body.value = action.value.body;
        draft.isFetching = false;
        return;
      case "titleChange":
        draft.title.hasError = false;
        draft.title.value = action.value;
        return;
      case "bodyChange":
        draft.body.hasError = false;
        draft.body.value = action.value;
        return;
      case "submitRequest":
        if (!draft.title.hasError && !draft.body.hasError) {
          draft.sendCount++;
        }
        return;
      case "saveRequestStarted":
        draft.isSaving = true;
        return;
      case "saveRequestFinised":
        draft.isSaving = false;
        return;
      case "titleRules":
        if (!action.value.trim()) {
          draft.title.hasError = true;
          draft.title.message = "You  must provide a title.";
        }
        return;
      case "bodyRules":
        if (!action.value.trim()) {
          draft.body.hasError = true;
          draft.body.message = "You must provide body content";
        }
        return;
      case "notFound":
        draft.notFound = true;
        return;
    }
  };

  const [state, dispatch] = useImmerReducer(ourReducer, originalState);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch({ type: "titleRules", value: state.title.value });
    dispatch({ type: "bodyRules", value: state.body.value });
    dispatch({ type: "submitRequest" });
  };

  // Get request for the post
  useEffect(() => {
    const ourRequest = axios.CancelToken.source();
    try {
      async function fetchPost() {
        const res = await axios.get(`/post/${state.id}`, {
          cancelToken: ourRequest.token,
        });
        if (res.data) {
          dispatch({ type: "fetchComplete", value: res.data });

          if (appState.user.username != res.data.author.username) {
            appDispatch(
              {
                type: "flashMessage",
                value: "You don't have premission to edit other post",
              },
            );
            // Redirect to homepage
            props.history.push("/");
          }
        } else {
          dispatch({ type: "notFound" });
        }
      }

      fetchPost();
    } catch (error) {
      console.log("something wrong happen in ProfilePage");
    }
    return () => {
      ourRequest.cancel();
    };
  }, []);

  // Post request after saving
  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: "saveRequestStarted" });
      const ourRequest = axios.CancelToken.source();
      try {
        async function fetchPost() {
          const res = await axios.post(
            `/post/${state.id}/edit`,
            {
              title: state.title.value,
              body: state.body.value,
              token: appState.user.token,
            },
            {
              cancelToken: ourRequest.token,
            },
          );
          dispatch({ type: "saveRequestFinised" });
          appDispatch({ type: "flashMessage", value: "Post Updated" });
        }
        fetchPost();
      } catch (error) {
        console.log("something wrong happen in ProfilePage");
      }
      return () => {
        ourRequest.cancel();
      };
    }
  }, [state.sendCount]);

  if (state.notFound) {
    return (
      <NotFound />
    );
  }

  if (state.isFetching) {
    return (
      <Page title="<...>">
        <LoadingDotsIcons />
      </Page>
    );
  }

  return (
    <Page title="Edit Post">
      <Link className="font-weight-bold small" to={`/post/${state.id}`}>
        &laquo; Back to post permalink
      </Link>
      <form className="mt-3" onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            autoFocus
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
            value={state.title.value}
            onBlur={(e) =>
              dispatch({ type: "titleRules", value: e.target.value })}
            onChange={(e) =>
              dispatch({ type: "titleChange", value: e.target.value })}
          />
          {state.title.hasError &&
            <div className="alert alert-danger small liveValidateMessage">
              {state.title.message}
            </div>}
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"
            value={state.body.value}
            onBlur={(e) =>
              dispatch({ type: "bodyRules", value: e.target.value })}
            onChange={(e) =>
              dispatch({ type: "bodyChange", value: e.target.value })}
          />
          {state.body.hasError &&
            <div className="alert alert-danger small liveValidateMessage">
              {state.body.message}
            </div>}
        </div>

        <button className="btn btn-primary" disabled={state.isSaving}>
          {state.isSaving ? "Saving..." : "Save Post"}
        </button>
      </form>
    </Page>
  );
};

export default withRouter(EditPost);
