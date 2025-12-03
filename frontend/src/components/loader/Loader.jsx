import loaderImg from "../../assets/loader.gif";
import { createPortal } from "react-dom";
import './Loader.scss'
const Loader = () => {
  return createPortal(
    <div className="wrapper">
      <div className="loader">
        <img src={loaderImg} alt="loading..." />
      </div>
    </div>,
    document.getElementById("loader")
  );
};

export const SpinnerImg = () => {
  return (
    <div className="--center-all">
      <img src={loaderImg} alt="loading..." />
    </div>
  );
};

export default Loader;
