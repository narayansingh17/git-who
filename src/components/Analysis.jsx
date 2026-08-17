export default function Analysis({ user, query }) {
  return (
    <main className="main-layout">
      <nav className="tabs">
        <div>Profile</div>
        <div>Repsitories</div>
        <div>Activity</div>
        <div>Summary</div>
      </nav>
      <div className="profile">
        <img src={user.avatar_url} className="profile-picture"></img>
        <div
          className="profile-details"
          style={{ display: "flex", flexDirection: "column", padding: "20px" }}
        >
          <span style={{ fontSize: "27px", fontWeight: "600" }}>
            {user.name}
          </span>
          <span style={{ color: "lightgrey" }}>@{user.login}</span>
          <span>{user.bio} </span>
        </div>
      </div>
      <div className="key-stats"></div>
    </main>
  );
}
