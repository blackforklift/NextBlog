"use client"
import Profile from '../../../components/profile/Profile';

const ProfilePage = ({ params }) => {
  const { slug } = params;

  if (!slug) {
    return null;
  }

  return <Profile slug={slug} />;
};

export default ProfilePage;
