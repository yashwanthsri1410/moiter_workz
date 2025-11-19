import { Eye, EyeOff, CalculatorIcon } from "lucide-react";

const MerchantHeader = ({ formOpen, setFormOpen, setIsEditing }) => {
  return (
    <div className="card-header flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 p-2 sm:p-4">
      <div className="card-header-left flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2">
        <div className="flex items-center gap-2">
          <div className="header-icon-box">
            <CalculatorIcon className="primary-color w-4 h-4" />
          </div>
        </div>
        <div>
          <h1 className="user-title">Merchant Management</h1>
          <p className="user-subtitle">
            Onboard and manage merchants with complete business and payment
            configurations
          </p>
        </div>
      </div>

      <div className="card-header-right flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <button
          className="btn-outline"
          onClick={() => {
            setFormOpen((prev) => !prev);
            setIsEditing(false);
          }}
        >
          {formOpen ? (
            <>
              <span className="btn-icon">
                <EyeOff className="w-4 h-4" />
              </span>
              Hide Form
            </>
          ) : (
            <>
              {" "}
              <span className="btn-icon">
                <Eye className="w-4 h-4" />
              </span>{" "}
              Show Form
            </>
          )}
        </button>
        <div className="portal-info text-center sm:text-left">
          <p className="portal-label text-xs sm:text-sm">Content Creation</p>
          <p className="portal-link text-xs sm:text-sm font-medium text-center sm:text-right">
            Maker Portal
          </p>
        </div>
      </div>
    </div>
  );
};

export default MerchantHeader;
