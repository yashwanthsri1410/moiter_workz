// components/DashboardMain.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import sidebarPattern from "../assets/background.svg";
import axios from "axios";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import "../styles/border.css"
const DashboardMain = ({ username }) => {
    // State for Customers
    const [pendingCustomers, setPendingCustomers] = useState([]);
    const [recentCustomers, setRecentCustomers] = useState([]);
    const [newlyAddedCount, setNewlyAddedCount] = useState(0);
    const prevCustomersRef = useRef([]);
    // State for Employees
    const [pendingEmployees, setPendingEmployees] = useState(0);
    const [recentEmployees, setRecentEmployees] = useState([]);
    const [newlyAddedEmployeeCount, setNewlyAddedEmployeeCount] = useState(0);
    const prevEmployeesRef = useRef([]);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const role = localStorage.getItem("userType");
    // State for user types
    const [userTypes, setUserTypes] = useState(0);
    const [recentUserTypes, setRecentUserTypes] = useState([]);
    const [newlyAddedUserTypesCount, setNewlyAddedUserTypesCount] = useState(0);
    const prevUserTypesRef = useRef([]);


    const [productData, setProductData] = useState([]);
    useEffect(() => {
        fetchPendingCustomers();
        fetchPendingEmployees();
        fetchUserTypes();
        fetchProductData();
    }, []);
    const [topProductStats, setTopProductStats] = useState([]);

    const fetchProductData = async () => {
        try {
            const res = await axios.get( `${API_BASE_URL}/fes/api/Export/product_export`);
            const data = res.data || [];
            setProductData(data);

            // Count products by type
            const countMap = {};
            data.forEach((item) => {
                const type = item.productType || "Unknown";
                countMap[type] = (countMap[type] || 0) + 1;
            });

            // Convert to array, sort by count desc, get top 2
            const topTwo = Object.entries(countMap)
                .map(([type, count]) => {
                    const percent = Math.min((count / 50) * 100, 100); // cap at 100%
                    const color =
                        percent > 70 ? "bg-green-400" : percent > 40 ? "bg-yellow-400" : "bg-red-400";
                    return { type, count, percent, color };
                })
                .sort((a, b) => b.count - a.count)
                .slice(0, 2);

            setTopProductStats(topTwo);
        } catch (error) {
            console.error("Failed to fetch product data:", error);
        }
    };

    const productChartData = useMemo(() => {
        const countMap = {};
        productData.forEach((product) => {
            const type = product.productType || "Unknown";
            countMap[type] = (countMap[type] || 0) + 1;
        });

        return Object.entries(countMap).map(([type, count]) => ({
            name: type,
            count,
        }));
    }, [productData]);

    const fetchPendingCustomers = async () => {
        try {
            const res = await axios.get( `${API_BASE_URL}/fes/api/Export/pending-customers`);
            const newData = res.data || [];
            const prev = prevCustomersRef.current;
            const newlyAdded = newData.filter(item => !prev.some(p => p.id === item.id));
            setRecentCustomers(newlyAdded);
            setNewlyAddedCount(newlyAdded.length);
            setPendingCustomers(newData.length);

            // Update ref for next comparison
            prevCustomersRef.current = newData;
        } catch (error) {
            console.error("Failed to fetch pending customers:", error);
        }
    };

    const fetchPendingEmployees = async () => {
        try {
            const res = await axios.get( `${API_BASE_URL}/fes/api/Export/pending-employees`);
            const newData = res.data || [];
            const prev = prevEmployeesRef.current;
            const newlyAdded = newData.filter(item => !prev.some(p => p.id === item.id));
            setRecentEmployees(newlyAdded);
            setNewlyAddedEmployeeCount(newlyAdded.length);
            setPendingEmployees(newData.length);
            prevEmployeesRef.current = newData;
        } catch (error) {
            console.error("Failed to fetch pending employees:", error);
        }
    };

    const fetchUserTypes = async () => {
        try {
            const res = await axios.get( `${API_BASE_URL}/fes/api/Export/usertypes`);
            const newData = res.data || [];
            const prev = prevUserTypesRef.current;
            const newlyAdded = newData.filter(item => !prev.some(p => p.id === item.id));
            setRecentUserTypes(newlyAdded);
            setNewlyAddedUserTypesCount(newlyAdded.length);
            setUserTypes(newData.length);
            prevUserTypesRef.current = newData;
        } catch (error) {
            console.error("Failed to fetch user types:", error);
        }
    };
    const scrollToHeader = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // console.log(pendingCustomers)
    return (
        <main
            className="flex-1 mt-[100px] ml-[135px] mr-[20px] p-6  relative  text-white overflow-hidden relative "


        >
            {/* Glow Corners */}

          
            {role === "1" && (
                <>  {/* Dashboard Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                        {/* customers card */}
                        <div
                            className="p-4 border border-white/10 bg-[#0f2c26] shadow-lg relative border-l border-r border-white/10"
                            style={{
                                backgroundImage: `radial-gradient(circle, #091c18 20%, rgba(255, 255, 255, 0.075) 100%), url(${sidebarPattern})`,
                                backgroundRepeat: "repeat",
                                backgroundSize: "auto, auto",
                            }}
                        >
                            {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map((pos, i) => {
                                const isRight = pos.includes("right-0");
                                return (
                                    <div
                                        key={i}
                                        className={`glow-corner ${pos} ${isRight ? "glow-corner-right" : "glow-corner-left"}`}
                                    />
                                );
                            })}

                            <h4 className="text-sm text-white/70">Total Pending Customers</h4>
                            <div className="text-2xl font-bold">{pendingCustomers}</div>

                            <div className="text-green-400 text-sm mt-1 flex items-center gap-1">
                                <ArrowUp className="w-4 h-4" />
                                {newlyAddedCount}
                            </div>

                            <div className="mt-4 h-20 bg-[#00ffc3]/10 rounded overflow-auto p-2">
                                <div className="text-sm text-white/70">
                                    <h4 className="mb-2 font-semibold text-white">Recently Added:</h4>
                                    {recentCustomers.length === 0 ? (
                                        <p className="text-xs text-white/40">No new customers yet</p>
                                    ) : (
                                        <ul className="space-y-1">
                                            {recentCustomers.slice(0, 5).map((cust, index) => (
                                                <li key={cust.id || index} className="text-green-300 truncate" >
                                                    {cust.name || `Customer ID: ${cust.id}`}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* employee card */}
                        <div
                            className="p-4 border border-white/10 bg-[#0f2c26] shadow-lg relative border-l border-r border-white/10"
                            style={{
                                backgroundImage: `radial-gradient(circle, #091c18 20%, rgba(255, 255, 255, 0.075) 100%), url(${sidebarPattern})`,
                                backgroundRepeat: "repeat",
                                backgroundSize: "auto, auto",
                            }}
                        >
                            {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map((pos, i) => {
                                const isRight = pos.includes("right-0");
                                return (
                                    <div
                                        key={i}
                                        className={`glow-corner ${pos} ${isRight ? "glow-corner-right" : "glow-corner-left"}`}
                                    />
                                );
                            })}

                            <h4 className="text-sm text-white/70">Total Pending Employee</h4>
                            <div className="text-2xl font-bold">{pendingEmployees}</div>

                            <div className="text-green-400 text-sm mt-1 flex items-center gap-1">
                                <ArrowUp className="w-4 h-4" />
                                {newlyAddedEmployeeCount}
                            </div>

                            <div className="mt-4 h-20 bg-[#00ffc3]/10 rounded overflow-auto p-2">
                                <div className="text-sm text-white/70">
                                    <h4 className="mb-2 font-semibold text-white">Recently Added:</h4>
                                    {recentEmployees.length === 0 ? (
                                        <p className="text-xs text-white/40">No new employees yet</p>
                                    ) : (
                                        <ul className="space-y-1">
                                            {recentEmployees.slice(0, 5).map((cust, index) => (
                                                <li key={cust.id || index} className="text-green-300 truncate" >
                                                    {cust.name || `Customer ID: ${cust.id}`}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* user type card  */}
                        <div
                            className="p-4 border border-white/10 bg-[#0f2c26] shadow-lg relative border-l border-r border-white/10 
             transition-all duration-300 ease-in-out transform hover:scale-[1.02]  "
                            style={{
                                backgroundImage: `radial-gradient(circle, #091c18 20%, rgba(255, 255, 255, 0.075) 100%), url(${sidebarPattern})`,
                                backgroundRepeat: "repeat",
                                backgroundSize: "auto, auto",
                            }}
                        >
                            {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map((pos, i) => {
                                const isRight = pos.includes("right-0");
                                return (
                                    <div
                                        key={i}
                                        className={`glow-corner ${pos} ${isRight ? "glow-corner-right" : "glow-corner-left"}`}
                                    />
                                );
                            })}

                            <h4 className="text-sm text-white/70">Total User Types</h4>
                            <div className="text-2xl font-bold">{userTypes}</div>

                            <div className="text-green-400 text-sm mt-1 flex items-center gap-1">
                                <ArrowUp className="w-4 h-4" />
                                {newlyAddedUserTypesCount}
                            </div>

                            <div className="mt-4 h-20 bg-[#00ffc3]/10 rounded overflow-auto p-2">
                                <div className="text-sm text-white/70">
                                    <h4 className="mb-2 font-semibold text-white">Recently Added:</h4>
                                    {recentUserTypes.length === 0 ? (
                                        <p className="text-xs text-white/40">No new user types yet</p>
                                    ) : (
                                        <ul className="space-y-1">
                                            {recentUserTypes.slice(0, 5).map((userType, index) => (
                                                <li key={userType.id || index} className="text-green-300 truncate">
                                                    {userType.name || `User Type ID: ${userType.id}`}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>


                        {/* Card 3 */}
                        <div className="p-4  border border-white/10 bg-[#0f2c26] shadow-lg  relative border-l border-r border-white/10 " style={{
                            backgroundImage: `radial-gradient(circle, #091c18 20%, rgba(255, 255, 255, 0.075) 100%), url(${sidebarPattern})`,
                            backgroundRepeat: "repeat",
                            backgroundSize: "auto, auto",
                        }}>
                            {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map((pos, i) => {
                                const isRight = pos.includes("right-0");
                                return (
                                    <div
                                        key={i}
                                        className={`glow-corner ${pos} ${isRight ? "glow-corner-right" : "glow-corner-left"}`}
                                    />
                                );
                            })}


                            <h4 className="text-sm text-white/70">New Events</h4>
                            <div className="text-2xl font-bold">13,278</div>
                            <div className="text-green-400 text-sm mt-1 flex items-center gap-1">
                                <ArrowUp className="w-4 h-4" />
                                0.25%
                            </div>
                            <div className="mt-4 h-20 bg-[#00ffc3]/10 rounded"></div>
                        </div>

                        {/* Card 4 */}
                        <div className="p-4  border border-white/10 bg-[#0f2c26] shadow-lg  relative border-l border-r border-white/10 " style={{
                            backgroundImage: `radial-gradient(circle, #091c18 20%, rgba(255, 255, 255, 0.075) 100%), url(${sidebarPattern})`,
                            backgroundRepeat: "repeat",
                            backgroundSize: "auto, auto",
                        }}>
                            {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map((pos, i) => {
                                const isRight = pos.includes("right-0");
                                return (
                                    <div
                                        key={i}
                                        className={`glow-corner ${pos} ${isRight ? "glow-corner-right" : "glow-corner-left"}`}
                                    />
                                );
                            })}

                            <h4 className="text-sm text-white/70">New Events</h4>
                            <div className="text-2xl font-bold">13,278</div>
                            <div className="text-green-400 text-sm mt-1 flex items-center gap-1">
                                <ArrowUp className="w-4 h-4" />
                                0.25%
                            </div>
                            <div className="mt-4 h-20 bg-[#00ffc3]/10 rounded"></div>
                        </div>

                        {/* Distance Covered Card */}
                        <div className="col-span-1 md:col-span-2 xl:col-span-3 p-4  border border-white/10 bg-[#0f2c26]  relative border-l border-r border-white/10" style={{
                            backgroundImage: `radial-gradient(circle, #091c18 20%, rgba(255, 255, 255, 0.075) 100%), url(${sidebarPattern})`,
                            backgroundRepeat: "repeat",
                            backgroundSize: "auto, auto",
                        }}>
                            {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map((pos, i) => {
                                const isRight = pos.includes("right-0");
                                return (
                                    <div
                                        key={i}
                                        className={`glow-corner ${pos} ${isRight ? "glow-corner-right" : "glow-corner-left"}`}
                                    />
                                );
                            })}

                            <h3 className="text-lg font-semibold text-[#00ffc3] mb-2">Products graph</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {topProductStats.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="p-4 bg-[#0a1e1b] flex flex-col items-start gap-2 border border-white/10 relative"
                                    >
                                        {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map((pos, i) => {
                                            const isRight = pos.includes("right-0");
                                            return (
                                                <div
                                                    key={i}
                                                    className={`glow-corner ${pos} ${isRight ? "glow-corner-right" : "glow-corner-left"}`}
                                                />
                                            );
                                        })}

                                        <span className="text-sm text-white/60">{item.type}</span>
                                        <div className="text-2xl font-bold text-white">{item.count}</div>
                                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${item.color}`}
                                                style={{ width: `${item.percent}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>



                            {/* Fake Graph Area */}
                            <div className="mt-6 h-40 bg-[#00ffc3]/10 rounded p-2">
                                {productChartData.length === 0 ? (
                                    <p className="text-sm text-white/50 text-center pt-12">Loading graph...</p>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={productChartData}>
                                            <XAxis dataKey="name" stroke="#00ffc3" />
                                            <YAxis stroke="#00ffc3" />
                                            <Tooltip />
                                            <Bar dataKey="count">
                                                {productChartData.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={index % 2 === 0 ? "#00ffc3" : "#00e6aa"}
                                                    />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>

                    </div></>
            )}

        </main>

    );
};

export default DashboardMain;
