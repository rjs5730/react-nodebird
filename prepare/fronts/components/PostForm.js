import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Form, Input, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { backUrl } from '../config/config';

import { ADD_POST_REQUEST, UPLOAD_IMAGES_REQUEST, REMOVE_IMAGE } from '../reducers/post';

const PostForm = () => {
  const dispatch = useDispatch();
  const [postText, setPostText] = useState('');
  const { imagePaths, addPostLoading, addPostDone } = useSelector((state) => state.post);

  useEffect(() => {
    if (addPostDone) {
      setPostText('');
    }
  }, [addPostDone]);

  const onSubmitForm = useCallback(() => {
    const formData = new FormData();
    imagePaths.forEach((p) => {
      formData.append('image', p);
    });
    formData.append('content', postText);
    dispatch({
      type: ADD_POST_REQUEST,
      data: formData,
    });
  }, [postText, imagePaths]);

  const onChangePostText = useCallback((e) => {
    setPostText(e.target.value);
    console.log('setText', postText);
  }, [postText]);

  const imageInput = useRef();
  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const onChangeImages = useCallback((e) => {
    console.log('images', e.target.files);
    const imageFormData = new FormData();
    [].forEach.call(e.target.files, (f) => {
      imageFormData.append('image', f);
    });
    dispatch({
      type: UPLOAD_IMAGES_REQUEST,
      data: imageFormData,
    });
  });

  const onRemoveImage = useCallback((index) => () => {
    dispatch({
      type: REMOVE_IMAGE,
      data: index,
    });
  });

  return (
    <Form style={{ margin: '10px 0 20px' }} encType="multipart/form-data" onFinish={onSubmitForm}>
      <Input.TextArea maxLength={140} placeholder="어떤 신기한 일이 있었나요?" value={postText} onChange={onChangePostText} />
      <div>
        <input type="file" name="image" multiple hidden ref={imageInput} onChange={onChangeImages} />
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <Button type="primary" style={{ float: 'right' }} htmlType="submit" loading={addPostLoading}>짹짹</Button>
      </div>
      <div>
        {imagePaths.map((v, i) => (
          <div key={v} style={{ display: 'inline-block' }}>
            <img src={`${backUrl}/${v}`} style={{ width: '200px' }} alt={v} />
            <div>
              <Button onClick={onRemoveImage(i)}>제거</Button>
            </div>
          </div>
        ))}
      </div>
    </Form>
  );
};

export default PostForm;
