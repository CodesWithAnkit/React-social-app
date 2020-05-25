import React, { useState, useEffect } from 'react'
import Page from './Page'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'
import LoadingDotsIcons from './LoadingDotsIcons'
import ReactMarkdown from 'react-markdown'
import ReactTooltip from 'react-tooltip'

const ViewSinglePost = () => {
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [post, setPost] = useState()

  useEffect(() => {
    const ourRequest = axios.CancelToken.source()
    try {
      async function fetchPost() {
        const res = await axios.get(`/post/${id}`, {
          cancelToken: ourRequest.token,
        })
        setPost(res.data)
        console.log(res.data)
        setIsLoading(false)
      }
      fetchPost()
    } catch (error) {
      console.log('something wrong happen in ProfilePage')
    }
    return () => {
      ourRequest.cancel()
    }
  }, [])

  if (isLoading)
    return (
      <Page title="<...>">
        <LoadingDotsIcons />
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
          <a
            href="#"
            data-tip="Edit"
            data-for="edit"
            className="text-primary mr-2"
          >
            <i className="fas fa-edit"></i>
          </a>
          <ReactTooltip id="edit" className="custom-tooltip" />{' '}
          <a
            className="delete-post-button text-danger"
            data-tip="Delete"
            data-for="delete"
          >
            <i className="fas fa-trash"></i>
          </a>
          <ReactTooltip id="delete" className="custom-tooltip" />
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

      <div className="body-content">
        <ReactMarkdown
          source={post.body}
          // allowedTypes={[
          //   'paragraph',
          //   'heading',
          //   'list',
          //   'listItem',
          //   'strong',
          //   'emphasis',
          // ]}
          // Allowed Type is not working right now
        />
      </div>
    </Page>
  )
}

export default ViewSinglePost
