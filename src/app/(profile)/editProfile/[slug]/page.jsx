"use client";
import EditProfile from "../../../components/editProfile/EditProfile"
const Edit = ({ params }) => {
  const { slug } = params; // Access `slug` from dynamic route

  if (!slug) return <p>Invalid profile.</p>;

  return <EditProfile slug={slug} />;
};

export default Edit;
