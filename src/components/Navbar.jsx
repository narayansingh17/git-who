import logo from "../assets/logo.png";
import title from "../assets/title.png";
export default function Navbar() {
  return (
    <nav className="main-nav">
      <Logo />
      <Name />
      <RightSec />
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo-area">
      <img src={logo} className="logo"></img>
      <img
        src={title}
        className="name"
      ></img>
    </div>
  );
}
function RightSec() {
  return (
    <div className="right-section">
      <a href="https://github.com/narayansingh17/git-who/blob/main/how-it-works.md" target="_blank" style={{ color: "white" }}>How it works?</a>
      <a href="https://github.com/narayansingh17/git-who" target="_blank" style={{ color: "white" }}>GitHub↗</a>
    </div>
  );
}
function Name() {
  return <></>;
}
