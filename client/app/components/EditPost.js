import React, { useEffect, useContext } from 'react'
import { useImmerReducer } from 'use-immer'
import Page from './Page'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'
import StateContext from '../StateContext.js'
import DispatchContext from '../DispatchContext.js'
import LoadingDotsIcons from './LoadingDotsIcons'

const ViewSinglePost = () => {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const originalState = {
    title: {
      value: '',
      hasError: false,
      body: '',
    },
    body: {
      value: '',
      hasError: false,
      body: '',
    },
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
  }
  const ourReducer = (draft, action) => {
    switch (action.type) {
      case 'fetchComplete':
        draft.title.value = action.value.title
        draft.body.value = action.value.body
        draft.isFetching = false
        return
      case 'titleChange':
        draft.title.value = action.value
        return
      case 'bodyChange':
        draft.body.value = action.value
        return
      case 'submitRequest':
        draft.sendCount++
        return
      case 'saveRequestStarted':
        draft.isSaving = true
        return
      case 'saveRequestFinised':
        draft.isSaving = false
        return
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, originalState)

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch({ type: 'submitRequest' })
  }

  // Get request for the post
  useEffect(() => {
    const ourRequest = axios.CancelToken.source()
    try {
      async function fetchPost() {
        const res = await axios.get(`/post/${state.id}`, {
          cancelToken: ourRequest.token,
        })
        dispatch({ type: 'fetchComplete', value: res.data })
      }
      fetchPost()
    } catch (error) {
      console.log('something wrong happen in ProfilePage')
    }
    return () => {
      ourRequest.cancel()
    }
  }, [])

  // Post request after saving
  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: 'saveRequestStarted' })
      const ourRequest = axios.CancelToken.source()
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
            }
          )
          dispatch({ type: 'saveRequestFinised' })
          appDispatch({ type: 'flashMessage', value: 'Post Updated' })
        }
        fetchPost()
      } catch (error) {
        console.log('something wrong happen in ProfilePage')
      }
      return () => {
        ourRequest.cancel()
      }
    }
  }, [state.sendCount])

  if (state.isFetching)
    return (
      <Page title="<...>">
        <LoadingDotsIcons />
      </Page>
    )

  return (
    <Page title="Edit Post">
      <form onSubmit={submitHandler}>
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
            onChange={(e) =>
              dispatch({ type: 'titleChange', value: e.target.value })
            }
          />
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
            onChange={(e) =>
              dispatch({ type: 'bodyChange', value: e.target.value })
            }
          />
        </div>

        <button className="btn btn-primary" disabled={state.isSaving}>
          {state.isSaving ? 'Saving...' : 'Save Post'}
        </button>
      </form>
    </Page>
  )
}

export default ViewSinglePost
