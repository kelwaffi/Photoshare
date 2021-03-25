import React, { useState, Fragment } from 'react';
import './style.scss';
import cogoToast from 'cogo-toast';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Avatar from '../../assets/default-avatar.png';
import * as Routes from '../routes';
import Loader from '../Loader';



function ChangePasswordForm() {
  const user = useSelector(({ user }) => user.currentUser);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true)
      await cogoToast.info('button has been clicked')
      setIsLoading(false)
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="form__container">
      <form action="" onSubmit={handleSubmit} className="newPassword__form">
        <div className="profile__header">
          <img src={user ? user.avatar : Avatar} alt="" />

          <div className="profile__avatar__wrapper">
            <h4> {user && user.username}</h4>
          </div>

        </div>
        <input
          type="text"
          name="oldPassword"
          placeholder="old password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />

        <input
          type="text"
          name="newPassword"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="text"
          name="confirmNewPassword"
          placeholder="Confirm New Password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />
        <button type="submit">
          Change password
        {isLoading && <Loader />}
        </button>
        {/*  <Link className="forgot__pasword__link">Forgot Password?</Link> */}
      </form>
    </div>
  );
}

export default ChangePasswordForm;