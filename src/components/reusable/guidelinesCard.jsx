const GuidelinesCard = ({ title, guidelines }) => {
  return (
    <div className="guidelines-card">
      {/* Title */}
      <h3 className="user-title mb-4">{title}</h3>

      {/* Guidelines in grid */}
      <div className="mb-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
        {guidelines.map((item, index) => (
          <div key={index}>
            <span className="guidelines-title">
              {item.icon} {item.title} : &nbsp;
            </span>
            <span className="guidelines-desc">{item.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuidelinesCard;
