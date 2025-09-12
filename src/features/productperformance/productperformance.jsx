import React, { useEffect, useState } from "react";
import "../../styles/styles.css";
import { Users, UserPlus, Clock, Shield, TimerIcon, Clock1, Clock10, AlertTriangle, UserCheck, FileText, Box, CardSimIcon, CreditCard, TrendingUp, DollarSign } from "lucide-react";
// import KYCReviewQueue from "./KYCReviewQueue";

// import "./All.css";

const Productperformance = () => {
    const [data, setData] = useState(null);
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
    useEffect(() => {
        fetch(`${API_BASE_URL}/fes/api/Export/user-wallet-cards`)
            .then((res) => res.json())
            .then((json) => {
                if (json.length > 0) {
                    setData(json); // Take the first item (serialNo: 1)
                }
            })
            .catch((err) => console.error("Failed to fetch dashboard data:", err));
    }, []);

    if (!data) return <p>Loading...</p>;

    //   const { total_customers, active_customers, active_percentage } =
    //     data.customerSummary;
    console.log(data)

    return (
        <div className="dashboard-container-dx91u">
            {/* Row 1 */}

            <div className="dashboard-row1-dx91u">
                {/* Gift Cards */}
                <div className="stat-card-dx91u total-customers-dx91u corner-box">
                    <span></span>
                    <div className="card-top-dx91u">
                        <div className="card-header-dx91u">
                            <h3> {data[3]?.walletCategory}</h3>
                            <Box className="w-4 h-4 text-[#00d4aa]" />
                        </div>
                    </div>


                    <div>
                        <p className="  text-[#00d4aa] text-[25px]">
                            {data[3]?.activeWallets}
                        </p>
                        <span className="text-[#94a3b8] text-[13px]">Active wallets</span>
                    </div>
                </div>

                {/* Fleet Cards*/}
                <div className="stat-card-dx91u customer-today-dx91u corner-box">
                    <span></span>
                    <div className="card-header-dx91u">
                        <h3> {data[1]?.walletCategory}</h3>
                        <CreditCard className="w-4 h-4 text-[#00d4aa]" />
                    </div>
                   <div>
                        <p className=" text-[#00d4aa] text-[25px]">
                            {data[1]?.activeWallets}
                        </p>
                        <span className="text-[#94a3b8] text-[13px]">Active wallets</span>
                    </div>

                </div>

                {/* Prepaid Cards */}
                <div className="stat-card-dx91u kyc-pending-dx91u corner-box">
                    <span></span>
                    <div className="card-header-dx91u">
                        <h3> {data[4]?.walletCategory}</h3>
                        <TrendingUp className="w-4 h-4  text-[#00ff00fa]" />
                    </div>
                    <div>
                        <p className="text-[#00ff00fa] text-[25px]">
                            {data[4]?.activeWallets}
                        </p>
                        <span className="text-[#94a3b8] text-[13px]">Active wallets</span>
                    </div>
                </div>

                {/* Corporate Cards */}
                <div className="stat-card-dx91u high-risk-dx91u corner-box">
                    <span></span>
                    <div className="card-header-dx91u">
                        <h3>  {data[2]?.walletCategory}</h3>
                        <DollarSign className="w-4 h-4   text-[#ffeb00]" />
                    </div>
                    <div>
                        <p className="text-[#ffeb00] text-[25px]">
                            {data[2]?.activeWallets}
                        </p>
                        <span className="text-[#94a3b8] text-[13px]">Active wallets</span>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Productperformance;
