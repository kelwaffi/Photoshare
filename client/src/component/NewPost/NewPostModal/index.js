import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './style.scss';
import * as Routes from '../../routes';
import { showModal, hideModal } from '../../../redux/modal/modalActions';
import { useHistory } from 'react-router-dom';
import { createPostFunc } from '../../../redux/Actions/postActions';

import * as Icon from 'react-feather';
import cogoToast from 'cogo-toast';

// modal
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';

import ImageFilter from 'react-image-filter';

const NewPostModal = ({ file }) => {
  const modalIsOpen = useSelector(({ modal }) => modal.showModal);
  const dispatch = useDispatch();
  const history = useHistory();
  const [previewImage, setPreviewImage] = useState(undefined);
  const [caption, setCaption] = useState('');

  // console.log(file)

  useEffect(() => {
    dispatch(showModal());
    return () => null;
  }, []);

  useEffect(() => {
    if (file.type == 'image/jpeg' || file.type == 'image/png') {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        setPreviewImage(event.target.result);
      };
    } else {
      //
    }
    return () => null;
  }, [file]);

  const closeModal = async () => {
    dispatch(hideModal());
    history.push(Routes.Dashboard);
  };

  const handlePost = async (e) => {
    e.preventDefault();
    try {

      const data = await new FormData();
      data.append('postfile', file);
      data.append('caption', caption);
      console.log(data.get('postfile'), data.get('caption'));
      await dispatch(createPostFunc(data, history));
      history.push(Routes.Dashboard);
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="modal__wrapper">
      <Modal
        open={modalIsOpen}
        onClose={closeModal}
        className="modal"
        overlayClassName="overlay"
        showCloseIcon={false}
        blockScroll
        focusTrapped

        classNames={
          {
            overlay: 'newPostoverlay',
            modal: 'newPostModal',
          }
        }
      >
        <div className="modal__header">
          <button className="goback__btn" onClick={closeModal}>
            <Icon.ArrowLeft />
          </button>
          <button className="share__btn" type="submit" onClick={handlePost}>
            {' '}
            Share
          </button>
        </div>
        <small> New Post</small>
        {/* caption */}
        <input
          placeholder=" write a Caption"
          className="caption__box"
          name="caption"
          id="caption"
          type="text"
          style={{ resize: 'none' }}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        {/* preview image */}

        {previewImage && (
          <>
            <div className="preview__wrapper">
              <figure className="aden">
                <img src={previewImage} className="preview" alt="image" />
              </figure>
            </div>

            <ImageFilter
              image={previewImage}
              // filter={'sepia'} // see docs beneath
              colorOne={[40, 250, 250]}
              colorTwo={[250, 150, 30]}

            />
          </>
        )}
      </Modal>
    </div>
  );
};

export default NewPostModal;
