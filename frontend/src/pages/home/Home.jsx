import headerlogo from "../../assets/shelfapp.svg";
import { Link } from "react-router-dom";
import "./Home.scss";
import heroImg from "../../assets/inv-img.png";
import {
  ShowOnLogIn,
  ShowOnLogOut,
} from "../../components/protect/HiddenLink";
// import { useDispatch } from "react-redux";
// import { SET_LOGIN } from "../../redux/features/auth/authSlice";
import { useLoginStatus } from "../../customHooks/useLoginStatus";

const Home = () => {
  useLoginStatus();
  

  return (
    <div className="home">
      <nav className="container --flex-between">
        <div className="logo">
          <img src={headerlogo} alt="ShelfApp" />
        </div>
        <ul className="home-links">
          <ShowOnLogOut>
            <li>
              <Link to="/register">Register</Link>
            </li>

            <li>
              <button className="--btn --btn-primary">
                <Link to="/login">Login</Link>
              </button>
            </li>
          </ShowOnLogOut>
          <ShowOnLogIn>
            <li>
              <button className="--btn --btn-primary">
                <Link to="/dashboard">Dashboard</Link>
              </button>
            </li>
          </ShowOnLogIn>
        </ul>
      </nav>
      {/* HERO SECTION */}
      <section className="container hero">
        <div className="hero-text">
          <h2>Inventory & Stock Management Solution</h2>
          <p>
            ShelfApp is an inventory and stock management solution that helps
            you manage your inventory and stock effectively. It provides a
            platform for managing your products, categories, suppliers, and
            customers. It also provides a dashboard for monitoring your
            inventory levels and stock movements.
          </p>
          <div className="hero-buttons">
            <button className="--btn --btn-secondary">
              <Link to="/dashboard">Free Trial 1 Month</Link>
            </button>
          </div>
          <div className="--flex-start">
            <NumberText num="20k" text="Brand Owners" />
            <NumberText num="43k" text="Active Users" />
            <NumberText num="500+" text="Partners" />
          </div>
        </div>
        <div className="hero-image">
          <img src={heroImg} alt="shelf app" />
        </div>
      </section>
    </div>
  );
};

const NumberText = ({ num, text }) => {
  return (
    <div className="--mr">
      <h3 className="--color-white">{num}</h3>
      <p className="--color-white">{text}</p>
    </div>
  );
};
export default Home;
