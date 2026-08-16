export default function Navbar() {
  return (
    <nav>
      <Logo />
      <Name />
      <RightSec />
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo-area">
      <img src="src\assets\GitWho-logo.png" className="logo"></img>
      <img
        src="src\assets\Gemini_Generated_Image_ldyne7ldyne7ldyn-removebg-preview.png"
        className="name"
      ></img>
    </div>
  );
}
function RightSec() {
  return (
    <div className="right-section">
      <p>How it works?</p>
      <p>GitHub↗</p>
    </div>
  );
}
function Name() {
  return <></>;
}
