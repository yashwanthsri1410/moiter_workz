const StatCards = ({ stats }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(
          (
            { title, value, subValue, desc, icon: Icon, color, subColor },
            i
          ) => (
            <div
              key={i}
              className="stat-card-dx91u corner-box p-4 shadow-md rounded-lg"
            >
              <div className="card-header-dx91u flex items-center justify-between mb-2">
                <h3 className="submenu-card-label">{title}</h3>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <div className="[line-height:23px]">
                <p className="submenu-card-value" style={{ color }}>
                  {value?.toLocaleString("en-IN")}
                </p>
                <span className="text-[11px]" style={{ color: subColor }}>
                  {subValue}
                </span>
                <span className="text-[#94a3b8] text-[11px]"> {desc}</span>
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default StatCards;
