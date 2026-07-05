function StatsCard({
  title,
  value,
  icon,
  color = "blue"
}) {

  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-600",
    purple: "bg-purple-50 text-purple-600"
  };

  return (

    <div
      className="
        bg-white
        rounded-2xl
        shadow-md
        p-6
        hover:shadow-xl
        transition
        border
        border-gray-100
      "
    >

      <div
        className={`
          w-14
          h-14
          rounded-xl
          flex
          items-center
          justify-center
          text-2xl
          mb-4
          ${colors[color]}
        `}
      >
        {icon}
      </div>

      <p className="text-gray-500 text-sm">
        {title}
      </p>

      <h2 className="text-3xl font-bold text-gray-800 mt-2">
        {value}
      </h2>

    </div>

  );

}

export default StatsCard;