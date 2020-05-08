import React, { useState } from 'react'
import Page from './Page'
import axios from 'axios'

const CreatePost = () => {
  const [title, setTitle] = useState()
  const [body, setBody] = useState()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/create-post', {
        title,
        body,
        token: localStorage.getItem('complexappToken'),
      })
      console.log('New Post Created')
    } catch (error) {
      console.log('Unaccepted error happen during create post')
    }
  }
  return (
    <Page title="Create Post">
      <form onSubmit={handleSubmit}>
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
            autocomplete="off"
            onChange={(e) => setTitle(e.target.value)}
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
            onChange={(e) => setBody(e.target.value)}
            type="text"
          ></textarea>
        </div>

        <button className="btn btn-primary">Save New Post</button>
      </form>
    </Page>
  )
}

export default CreatePost
