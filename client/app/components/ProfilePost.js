import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'

const ProfilePost = () => {
  const { username } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    try {
      async function fetchPosts() {
        const res = await axios.get(`/profile/${username}/posts`)
        setPosts(res.data)
        setIsLoading(false)
      }
      fetchPosts()
    } catch (error) {
      console.log('something wrong happen in ProfilePage')
    }
  }, [])

  if (isLoading) return <h1>Loading......</h1>
  return (
    <div className="list-group">
      {posts.map((post) => {
        const date = new Date(post.createdDate)
        const formatedDate = `${
          date.getMonth() + 1
        }/${date.getDay()}/${date.getFullYear()}`
        return (
          <Link
            key={post._id}
            to={`/post/${post._id}`}
            className="list-group-item list-group-item-action"
          >
            <img className="avatar-tiny" src={post.author.avatar} />
            <strong>{post.title}</strong>{' '}
            <span className="text-muted small">on {formatedDate} </span>
          </Link>
        )
      })}
    </div>
  )
}

export default ProfilePost
