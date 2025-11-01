import { Store } from "lucide-react";

const Header = () => {
  return (
    <div className="card-header flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 p-2 sm:p-4">
      <div className="card-header-left flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2">
        <div className="flex items-center gap-2">
          <div className="header-icon-box">
            <Store className="primary-color w-5 h-5" />
          </div>
        </div>
        <div>
          <h1 className="user-title">Create Merchant</h1>
          <p className="user-subtitle">
            Onboard new merchants, assign categories, and configure payment
            setup
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;
