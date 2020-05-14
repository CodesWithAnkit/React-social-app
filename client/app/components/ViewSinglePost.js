import React, { useState, useEffect } from 'react'
import Page from './Page'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'

const ViewSinglePost = () => {
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [post, setPost] = useState()

  useEffect(() => {
    try {
      async function fetchPost() {
        const res = await axios.get(`/post/${id}`)
        setPost(res.data)
        console.log(res.data)
        setIsLoading(false)
      }
      fetchPost()
    } catch (error) {
      console.log('something wrong happen in ProfilePage')
    }
  }, [])

  if (isLoading)
    return (
      <Page title="<...>">
        <div>Loading...</div>
      </Page>
    )

  // // Date formated
  const date = new Date(post.createdDate)
  const formatedDate = `${
    date.getMonth() + 1
  }/${date.getDay()}/${date.getFullYear()}`

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        <span className="pt-2">
          <a href="#" className="text-primary mr-2" title="Edit">
            <i className="fas fa-edit"></i>
          </a>
          <a className="delete-post-button text-danger" title="Delete">
            <i className="fas fa-trash"></i>
          </a>
        </span>
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by
        <Link to={`/profile/${post.author.username}`}>
          {post.author.username}
        </Link>
        on {formatedDate}
      </p>

      <div className="body-content">{post.body}</div>
    </Page>
  )
}

export default ViewSinglePost
