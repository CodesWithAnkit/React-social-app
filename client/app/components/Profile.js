import React, { useEffect, useContext, useState } from 'react'
import Page from './Page'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import StateContext from '../StateContext'
import ProfilePost from './ProfilePost'

const Profile = () => {
  const { username } = useParams()
  const appState = useContext(StateContext)
  const [profileDate, setProfileData] = useState({
    profileUsername: '...',
    profileAvatar: 'https://gravatar.com/avatar/placeholder?s=128',
    isFollowing: false,
    counts: { followerCount: '', followingCount: '', postCount: '' },
  })

  useEffect(() => {
    //Using async-await inside the useEffect because we cannot use it on useEffect hook.
    async function fetchData() {
      try {
        const res = await axios.post(`/profile/${username}`, {
          token: appState.user.token,
        })
        setProfileData(res.data)
      } catch (error) {
        console.log('There is a error on Profile component')
      }
    }
    fetchData()
  }, [])

  return (
    <Page title="Profile Screen">
      <h2>
        <img className="avatar-small" src={profileDate.profileAvatar} />
        {profileDate.profileUsername}
        <button className="btn btn-primary btn-sm ml-2">
          Follow <i className="fas fa-user-plus"></i>
        </button>
      </h2>
      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <a href="#" className="active nav-item nav-link">
          Posts: {profileDate.counts.postCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Followers: {profileDate.counts.followerCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Following: {profileDate.counts.followingCount}
        </a>
      </div>
      <ProfilePost />
    </Page>
  )
}

export default Profile
