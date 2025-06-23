import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import backgroundImg from "../assets/background.jpeg";
import logo from "../assets/favicon.png";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    age: "",
    email: "",
    password: "",
    usertype: "1",
  });

  const [emailValid, setEmailValid] = useState(true);
  const [ageError, setAgeError] = useState("");
  const [passwordValid, setPasswordValid] = useState(true);
  const [usernameValid, setUsernameValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      const isGmail = value.endsWith("@gmail.com");
      setEmailValid(isGmail);
    }

    if (name === "username") {
      const isAlpha = /^[A-Za-z]+$/.test(value);
      setUsernameValid(isAlpha || value === "");
    }

    if (name === "password") {
      const strongPasswordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
      setPasswordValid(strongPasswordRegex.test(value));
    }

    if (name === "age") {
      if (/^\d*$/.test(value)) {
        const age = parseInt(value, 10);
        if (!value) {
          setAgeError("Age is required.");
        } else if (age < 18 || age > 60) {
          setAgeError("Enter valid age between 18 - 60");
        } else {
          setAgeError("");
        }
        setForm({ ...form, age: value });
      }
      return;
    }

    setForm({ ...form, [name]: value });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const age = parseInt(form.age, 10);

  //   if (!emailValid) {
  //     alert("Email must end with '@gmail.com'.");
  //     return;
  //   }

  //   if (!usernameValid) {
  //     alert("Username should contain only alphabets.");
  //     return;
  //   }

  //   if (!passwordValid) {
  //     alert(
  //       "Password must be at least 8 characters with uppercase, lowercase, number, and symbol."
  //     );
  //     return;
  //   }

  //   if (ageError) {
  //     alert("Please correct the age field.");
  //     return;
  //   }

  //   try {
  //     const response = await axios.post(
  //       "http://192.168.22.247/User/register",
  //       form
  //     );

  //     if (response.status === 200 || response.status === 201) {
  //       // Send audit trail log after successful registration
  //       try {
  //         await axios.post("http://192.168.22.247/api/Department/log", {
  //           userId: form.username,
  //           action: "User Registered",
  //           timestamp: new Date().toISOString(),
  //           details: `User ${form.username} registered with email ${form.email}`,
  //         });
  //         console.log("Audit log sent successfully");
  //       } catch (logError) {
  //         console.error("Failed to send audit log", logError);
  //       }

  //       alert("User registered!");
  //       navigate("/login");
  //     } else {
  //       alert("Registration failed. Please try again.");
  //     }
  //   } catch (error) {
  //     if (error.response?.data?.message) {
  //       alert(`Registration failed: ${error.response.data.message}`);
  //     } else {
  //       alert("Registration failed: Something went wrong.");
  //     }
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!emailValid) {
    alert("Email must end with '@gmail.com'.");
    return;
  }

  if (!usernameValid) {
    alert("Name should contain only alphabets.");
    return;
  }

  if (!passwordValid) {
    alert(
      "Password must be at least 8 characters with uppercase, lowercase, number, and symbol."
    );
    return;
  }

  if (ageError) {
    alert("Please correct the age field.");
    return;
  }

  if (!form.usertype) {
    alert("Please select a user type.");
    return;
  }

  const payload = {
    name: form.name.trim(),
    age: parseInt(form.age, 10),
    email: form.email.trim(),
    password: form.password,
    usertype: userTypeMap[form.usertype],
  };

  try {
    const response = await axios.post(
      "http://192.168.22.247/api/Department/create-super-user",
      payload
    );

    // Log request payload and response status to logging API
    await axios.post("http://192.168.22.247/api/Department/log", {
      EntityName: "User",
      EntityId: response.data?.userId || "", // Adjust based on your API response
      Action: "Create",
      ChangedBy: form.email.trim(),
      ChangedOn: new Date().toISOString(),
      OldValues: "",
      NewValues: JSON.stringify(payload),
      ChangedColumns: Object.keys(payload).join(","),
      SourceIP: "", // Optional - if available, send it here
    });

    if (response.status === 200 || response.status === 201) {
      alert("User registered!");
      navigate("/login");
    } else {
      alert("Registration failed. Please try again.");
    }
  } catch (error) {
    // Log error info as well
    await axios.post("http://192.168.22.247/api/Department/log", {
      action: "User Signup",
      requestData: payload,
      errorMessage: error.response?.data?.message || error.message,
      timestamp: new Date().toISOString(),
    }).catch(() => {
      // ignore logging errors
    });

    alert(
      error.response?.data?.message
        ? `Registration failed: ${error.response.data.message}`
        : "Registration failed: Something went wrong."
    );
  }
};


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://192.168.22.247/User/usertypes");
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const jsonData = await response.json();
        setUsers(jsonData);
      } catch (err) {
        setApiError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start bg-cover bg-center relative p-6"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-0" />
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl p-8 mb-6">
        <div className="flex items-start justify-center p-4 z-[99] rounded-full">
          <img src={logo} alt="Logo" className="w-12 h-12 rounded-full" />
        </div>
        <h2 className="text-2xl font-semibold text-center mb-2">Sign up</h2>
        <p className="text-sm text-center text-gray-500 mb-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer"
          >
            Log in
          </span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="username"
            placeholder="Username"
            maxLength="15"
            value={form.username}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md ${
              usernameValid ? "border-gray-300" : "border-red-500"
            }`}
            required
          />
          {!usernameValid && (
            <p className="text-sm text-red-600 mt-1">
              Username should contain only alphabets.
            </p>
          )}

          <input
            type="number"
            name="age"
            placeholder="Age"
            value={form.age}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md ${
              ageError ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {ageError && (
            <p className="text-sm text-red-600 mt-1">{ageError}</p>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md ${
              emailValid ? "border-gray-300" : "border-red-500"
            }`}
            required
          />
          {!emailValid && (
            <p className="text-sm text-red-600 mt-1">
              Email must end with "@gmail.com".
            </p>
          )}

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md pr-12 ${
                passwordValid ? "border-gray-300" : "border-red-500"
              }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-sm text-gray-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {!passwordValid && (
            <p className="text-sm text-red-600 mt-1">
              Password must be 8+ characters and include uppercase, lowercase,
              number, and special character.
            </p>
          )}

          <select
            name="usertype"
            onChange={handleChange}
            value={form.usertype}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="1">Admin</option>
            <option value="2">User</option>
            <option value="3">Editor</option>
            <option value="4">Viewer</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>

        <button
          onClick={() => setShowModal(true)}
          className="mt-4 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
        >
          Show Registered Users
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-lg"
            >
              ✖
            </button>
            <h3 className="text-xl font-semibold mb-4 text-center">
              Registered Users
            </h3>
            {loading ? (
              <p className="text-center">Loading...</p>
            ) : apiError ? (
              <p className="text-center text-red-600">Error: {apiError}</p>
            ) : users.length === 0 ? (
              <p className="text-center">No users found.</p>
            ) : (
              <div className="overflow-y-auto max-h-[60vh]">
                <table className="min-w-full text-sm text-left border">
                  <thead className="bg-gray-200 text-gray-700 sticky top-0">
                    <tr>
                      <th className="py-2 px-4 border">Name</th>
                      <th className="py-2 px-4 border">Age</th>
                      <th className="py-2 px-4 border">User Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="py-2 px-4 border">{user.username}</td>
                        <td className="py-2 px-4 border">{user.age}</td>
                        <td className="py-2 px-4 border">{user.userTypeName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
