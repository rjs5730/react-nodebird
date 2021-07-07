import Head from "next/head";
import AppLayout from "../components/AppLayout";
import NicknameEditForm from "../components/NicknameEditForm";
import FollowList from "../components/FollowList";

const Profile = () => {
  const followingList = [
    { nickname: "livedata" },
    { nickname: "livedata" },
    { nickname: "livedata" },
  ];
  const followerList = [
    { nickname: "livedata" },
    { nickname: "livedata" },
    { nickname: "livedata" },
  ];

  return (
    <>
      <Head>
        <meta charSet="utf-8"></meta>
        <title>Profile</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList header={"팔로잉 목록"} data={followingList} />
        <FollowList header={"팔로워 목록"} data={followerList} />
      </AppLayout>
    </>
  );
};

export default Profile;
