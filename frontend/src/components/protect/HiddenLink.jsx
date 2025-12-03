import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../redux/features/auth/authSlice";


export const ShowOnLogIn = ({ children }) => {
  const isloggedIn = useSelector(selectIsLoggedIn);
  if (isloggedIn) {
    return <>{ children }</>;
  } else {
    return null;
  }
};
export const ShowOnLogOut = ({ children }) => {
  const isloggedIn = useSelector(selectIsLoggedIn);
  if (!isloggedIn) {
    return <>{ children }</>;
  } else {
    return null;
  }
};
