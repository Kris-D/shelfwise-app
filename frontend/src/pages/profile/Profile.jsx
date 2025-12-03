import React from "react";
import { useUserProfile } from "../../customHooks/useUserProfile";
import "./Profile.scss";
import { SpinnerImg } from "../../components/loader/Loader";
import Card from "../../components/card/Card";
import { Link } from "react-router-dom";
const Profile = () => {
  const { user = [], isPending } = useUserProfile();
  // console.log("user:",user);

  return (
    <div className="profile --my2">
      {isPending && <SpinnerImg />}
      <>
        {!isPending && user === null ? (
          <p>Something went wrong, please reload the page...</p>
        ) : (
          <Card cardClass={"card --flex-dir-column"}>
            <span className="profile-photo">
              <img src={user?.photo} alt="profilepic" />
            </span>
            <span className="profile-data">
              <p>
                <b>Name : </b> {user?.username}
              </p>
              <p>
                <b>
                  Email : <span className="--color-danger">{user?.email}</span>
                </b>
              </p>
              <p>
                <b>Phone : </b> {user?.phone}
              </p>
              <p>
                <b>Referral Code : </b> {user?.referralCode}
              </p>
              <p>
                <b>Bio : </b> {user?.bio}
              </p>
              <div>
                <Link to="/profile-update">
                  <button className="--btn --btn-primary">Edit Profile</button>
                </Link>
              </div>
            </span>
          </Card>
        )}
      </>
    </div>
  );
};

export default Profile;
