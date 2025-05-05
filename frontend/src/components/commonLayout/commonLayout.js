import Header from "../header";

const CommonLayout = ({ children }) => {
  return (
    <div>
      {/* Header Component */}
      <Header />
      {/* Header Component */}

      {/* Main Component */}
      {children}
      {/* Main Component */}
    </div>
  );
};

export default CommonLayout;
