const Card = ({ children, className = '', header }) => (
  <div className={`bg-white rounded-lg shadow-[0_0_4px_0_rgba(0,0,0,0.2)] p-6 ${className}`}>
    {header && <h1 className="text-gray-800 font-semibold text-xl">{header}</h1>}
    {children}
  </div>
);

  export default Card;