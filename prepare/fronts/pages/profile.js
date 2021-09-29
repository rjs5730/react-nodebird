import Head from 'next/head';
import useSWR from 'swr';

import Router from 'next/router';
import { useSelector } from 'react-redux';

import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { backUrl } from '../config/config';
import AppLayout from '../components/AppLayout';
import NicknameEditForm from '../components/NicknameEditForm';
import FollowList from '../components/FollowList';

const fetcher = (url) => axios.get(url, { withCredentials: true }).then((result) => result.data);

const Profile = () => {
  const [followersLimit, setFollowersLimit] = useState(3);
  const [followingsLimit, setFollowingsLimit] = useState(3);
  const { me } = useSelector((state) => state.user);

  const { data: followersData, error: followerError } = useSWR(`${backUrl}/user/followers?limit=${followersLimit}`, fetcher);
  const { data: followingsData, error: followingError } = useSWR(`${backUrl}/user/followings?limit=${followingsLimit}`, fetcher);

  // useEffect(() => {
  //   dispatch({
  //     type: LOAD_FOLLOWERS_REQUEST,
  //   });
  //   dispatch({
  //     type: LOAD_FOLLOWINGS_REQUEST,
  //   });
  // }, []);

  useEffect(() => {
    if (!(me && me.id)) {
      Router.push('/');
    }
  }, [me && me.id]);

  const loadMoreFollowings = useCallback(() => {
    setFollowingsLimit((prev) => prev + 3);
  }, []);
  const loadMoreFollowers = useCallback(() => {
    setFollowersLimit((prev) => prev + 3);
  }, []);

  if (!me) {
    return null;
  }

  if (followerError || followingError) {
    console.error(followerError || followingError);
    return <div>팔로잉/팔로워 로딩 중 에러가 발생했습니다.</div>;
  }

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>Profile</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList header="팔로잉 목록" data={followingsData} onClickMore={loadMoreFollowings} loading={!followingsData && !followingError} />
        <FollowList header="팔로워 목록" data={followersData} onClickMore={loadMoreFollowers} loading={!followersData && !followerError} />
      </AppLayout>
    </>
  );
};

export default Profile;
