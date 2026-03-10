import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import "./dashboard.css";
import ChatBox from "../components/ChatBox";
<<<<<<< HEAD
=======
import FoodMap from "../components/FoodMap";
import LocationPicker from "../components/LocationPicker";
>>>>>>> upstream/main
import logo from "../assets/logo.png";

function Dashboard() {
  const [foods, setFoods] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
<<<<<<< HEAD
  const [view, setView] = useState("list"); // list or post
  const [otpInput, setOtpInput] = useState("");
=======
  const [view, setView] = useState("list");
  const [otpInputs, setOtpInputs] = useState({});
  const [coords, setCoords] = useState(null);
  const [foodName, setFoodName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [userLocation, setUserLocation] = useState(null);
>>>>>>> upstream/main

  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role;
  const userId = user?.id;

  const socketRef = useRef(null);

  // ================= FETCH FOODS =================
  const fetchFoods = async () => {
<<<<<<< HEAD
    const res = await axios.get("http://localhost:5000/api/food");
    setFoods(res.data);
=======
    try {
      const res = await axios.get("http://localhost:5000/api/food");
      setFoods(res.data || []);
    } catch (err) {
      console.log("Fetch error:", err);
    }
>>>>>>> upstream/main
  };

  useEffect(() => {
    fetchFoods();
<<<<<<< HEAD
    socketRef.current = io("http://localhost:5000");

    socketRef.current.on("foodUpdated", fetchFoods);
=======

    socketRef.current = io("http://localhost:5000");
    socketRef.current.on("foodUpdated", fetchFoods);

    navigator.geolocation.getCurrentPosition((pos) => {
      setUserLocation({
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
      });
    });
>>>>>>> upstream/main

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

<<<<<<< HEAD
  // ================= REQUEST FOOD =================
  const requestFood = async (id) => {
    const res = await axios.post(
      `http://localhost:5000/api/food/request/${id}`,
      { userId }
    );

    alert("OTP: " + res.data.otp);
    fetchFoods();
  };

  // ================= VERIFY OTP =================
  const verifyOtp = async (id) => {
    await axios.post(
      `http://localhost:5000/api/food/collect/${id}`,
      { otp: otpInput }
    );

    alert("Food collected!");
    setOtpInput("");
    fetchFoods();
  };

  // ================= KM DISTANCE =================
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    return (R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))).toFixed(1);
  };

  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setUserLocation({
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
      });
    });
  }, []);

  return (
    <div className="dashboard-layout">
      
      {/* LEFT SIDEBAR */}
      <div className="sidebar">
        <img src={logo} alt="" className="sidebar-logo" />

        <button onClick={() => setView("list")}>Dashboard</button>
        <button onClick={() => setView("post")}>Post Food</button>
        <button onClick={() => setView("list")}>Food List</button>
        <button>Map</button>

=======
  // ================= POST FOOD =================
  const postFood = async (e) => {
    e.preventDefault();
    if (!coords) return alert("Select location on map");

    await axios.post("http://localhost:5000/api/food", {
      foodName,
      quantity,
      location,
      latitude: coords.lat,
      longitude: coords.lng,
      postedBy: userId,
    });

    setFoodName("");
    setQuantity("");
    setLocation("");
    setCoords(null);
    fetchFoods();
    setView("list");
  };

  // ================= REQUEST FOOD =================
  const requestFood = async (id) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/food/request/${id}`,
        { userId }
      );

      // Save OTP locally for instant display
      setOtpInputs((prev) => ({
        ...prev,
        [id]: res.data.otp,
      }));

      fetchFoods();
    } catch (err) {
      console.log(err);
    }
  };

  // ================= VERIFY OTP =================
  const verifyOtp = async (foodId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/food/collect/${foodId}`,
        { otp: otpInputs[foodId] }
      );

      alert("Food collected successfully");
      setOtpInputs((prev) => ({ ...prev, [foodId]: "" }));
      fetchFoods();
    } catch {
      alert("Wrong OTP");
    }
  };

  // ================= DISTANCE =================
  const getDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lat2) return null;

    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2;

    return (R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))).toFixed(1);
  };

  return (
    <div className="dashboard-layout">

      {/* ===== SIDEBAR ===== */}
      <div className="sidebar">
        <img src={logo} alt="" className="sidebar-logo" />

        <button onClick={() => setView("list")}>Dashboard</button>

        {userRole === "donor" && (
          <button onClick={() => setView("post")}>Post Food</button>
        )}

        {/* ✅ MAP FOR BOTH */}
        <button onClick={() => setView("map")}>Map</button>

>>>>>>> upstream/main
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </div>

<<<<<<< HEAD
      {/* MIDDLE */}
      <div className="main-content">

        <h2 className="welcome-text">
          Welcome, {user?.name}
        </h2>

        {/* ================= FOOD LIST ================= */}
        {view === "list" &&
          foods.map((food) => (
            <div className="food-card" key={food._id}>
              <h3>{food.foodName}</h3>
              <p>{food.location}</p>

              {/* KM only for receiver */}
{userRole === "receiver" && userLocation && (
  <p style={{ color: "#ff7a00", fontWeight: "500" }}>
    📍 {getDistance(
      userLocation.lat,
      userLocation.lon,
      food.latitude,
      food.longitude
    )} km away
  </p>
)}
              <span className="status">{food.status}</span>

{/* RECEIVER sees OTP */}
{/* RECEIVER sees OTP */}
{userRole === "receiver" && food.status === "requested" && food.otp && (
  <div style={{
    marginTop: "10px",
    padding: "8px",
    background: "#e8f7e8",
    borderRadius: "6px",
    fontWeight: "600",
    color: "green"
  }}>
    🔐 OTP: {food.otp}
  </div>
)}



{/* DONOR enters OTP */}
{userRole === "donor" && food.status === "requested" && (
  <div style={{ marginTop: "10px" }}>
    <input
      placeholder="Enter OTP"
      onChange={(e) => food.enteredOtp = e.target.value}
      style={{
        padding: "6px",
        marginRight: "8px",
        borderRadius: "6px",
        border: "1px solid #ccc"
      }}
    />

    <button
      onClick={async () => {
        try {
          await axios.post(
            `http://localhost:5000/api/food/collect/${food._id}`,
            { otp: food.enteredOtp }
          );

          alert("Food collected successfully");
          fetchFoods();
        } catch {
          alert("Wrong OTP");
        }
      }}
      style={{
        background: "#ff7a00",
        color: "white",
        border: "none",
        padding: "6px 12px",
        borderRadius: "6px"
      }}
    >
      Verify OTP
    </button>
  </div>
)}

              {/* RECEIVER REQUEST BUTTON */}
              {userRole === "receiver" && food.status === "available" && (
                <button
                  className="chat-btn"
                  onClick={() => requestFood(food._id)}
                >
                  Request
                </button>
              )}

              {/* OTP VERIFY */}
              {userRole === "receiver" &&
                food.status === "requested" &&
                food.requestedBy === userId && (
                  <div>
                    <input
                      placeholder="Enter OTP"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                    />
                    <button onClick={() => verifyOtp(food._id)}>
=======
      {/* ===== MAIN ===== */}
      <div className="main-content">
        <div className="welcome-wrapper">
  <div className="welcome-scroll">
    👋 Welcome {user?.name} ... Smart Food Share...
  </div>
</div>

        {/* ===== POST FOOD ===== */}
        {view === "post" && userRole === "donor" && (
          <div className="food-card">
            <h3>Post Food</h3>
            <form onSubmit={postFood}>
              <input
                placeholder="Food name"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
              />
              <input
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
              <input
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <LocationPicker setCoords={setCoords} />
              <button className="chat-btn">Post</button>
            </form>
          </div>
        )}

        {/* ===== MAP VIEW (FOR BOTH) ===== */}
        {view === "map" && (
          <FoodMap foods={foods} />
        )}

        {/* ===== FOOD LIST ===== */}
        {view === "list" &&
          foods.map((food) => (
            <div className="food-card" key={food?._id}>
              <h3>{food.foodName}</h3>
              <p>{food.location}</p>

              {userRole === "receiver" && userLocation && (
                <p style={{ color: "#ff7a00", fontWeight: "500" }}>
                  📍 {getDistance(
                    userLocation.lat,
                    userLocation.lon,
                    food.latitude,
                    food.longitude
                  )} km away
                </p>
              )}

              <span className="status">{food.status}</span>

              {/* RECEIVER REQUEST */}
              {userRole === "receiver" &&
                food.status === "available" && (
                  <button
                    className="chat-btn"
                    onClick={() => requestFood(food._id)}
                  >
                    Request
                  </button>
                )}

              {/* RECEIVER OTP */}
              {userRole === "receiver" &&
                food.status === "requested" &&
                (otpInputs[food._id] || food.otp) && (
                  <div className="otp-box">
                    🔐 OTP: {otpInputs[food._id] || food.otp}
                  </div>
                )}

              {/* DONOR VERIFY */}
              {userRole === "donor" &&
                food.status === "requested" && (
                  <div style={{ marginTop: "10px" }}>
                    <input
                      placeholder="Enter OTP"
                      value={otpInputs[food._id] || ""}
                      onChange={(e) =>
                        setOtpInputs({
                          ...otpInputs,
                          [food._id]: e.target.value,
                        })
                      }
                    />
                    <button
                      className="chat-btn"
                      onClick={() => verifyOtp(food._id)}
                    >
>>>>>>> upstream/main
                      Verify OTP
                    </button>
                  </div>
                )}

<<<<<<< HEAD
              {/* CHAT BUTTON */}
=======
              {/* CHAT */}
>>>>>>> upstream/main
              {(food.status === "requested" ||
                food.status === "collected") && (
                <button
                  className="chat-btn"
                  onClick={() => setActiveChat(food._id)}
                >
                  Open Chat
                </button>
              )}
            </div>
          ))}
      </div>

<<<<<<< HEAD
      {/* RIGHT CHAT */}
=======
      {/* ===== RIGHT CHAT ===== */}
>>>>>>> upstream/main
      <div className="right-chat">
        {activeChat ? (
          <ChatBox
            socket={socketRef.current}
            roomId={activeChat}
            userRole={userRole}
<<<<<<< HEAD
            food={foods.find((f) => f._id === activeChat)}
=======
            food={foods.find(f => f._id === activeChat)}
>>>>>>> upstream/main
          />
        ) : (
          <div className="empty-chat-ui">
            <img src={logo} alt="" className="empty-logo" />
            <h3>Messages</h3>
            <p>Select food → Open Chat</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;