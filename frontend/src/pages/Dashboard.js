import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import "./dashboard.css";
import ChatBox from "../components/ChatBox";
import FoodMap from "../components/FoodMap";
import LocationPicker from "../components/LocationPicker";
import logo from "../assets/logo.png";

function Dashboard() {
  const [foods, setFoods] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [view, setView] = useState("list");

  const [otpInputs, setOtpInputs] = useState({});
  const [coords, setCoords] = useState(null);
  const [foodName, setFoodName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [userLocation, setUserLocation] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role;
  const userId = user?.id;

  const socketRef = useRef(null);

  const fetchFoods = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/food");
      setFoods(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchFoods();

    socketRef.current = io("http://localhost:5000");
    socketRef.current.on("foodUpdated", fetchFoods);

    navigator.geolocation.getCurrentPosition((pos) => {
      setUserLocation({
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
      });
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  // POST FOOD
  const postFood = async (e) => {
    e.preventDefault();

    if (!coords) return alert("Select location");

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

  // REQUEST FOOD
  const requestFood = async (id) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/food/request/${id}`,
        { userId }
      );

      setOtpInputs((prev) => ({
        ...prev,
        [id]: res.data.otp,
      }));

      fetchFoods();
    } catch (err) {
      console.log(err);
    }
  };

  // VERIFY OTP
  const verifyOtp = async (foodId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/food/collect/${foodId}`,
        { otp: otpInputs[foodId] }
      );

      alert("Food collected");
      setOtpInputs((prev) => ({ ...prev, [foodId]: "" }));
      fetchFoods();
    } catch {
      alert("Wrong OTP");
    }
  };

  // DISTANCE
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

      {/* SIDEBAR */}
      <div className="sidebar">
        <img src={logo} alt="" className="sidebar-logo" />

        <button onClick={() => setView("list")}>Dashboard</button>

        {userRole === "donor" && (
          <button onClick={() => setView("post")}>Post Food</button>
        )}

        <button onClick={() => setView("map")}>Map</button>

        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">

        <div className="welcome-wrapper">
          <div className="welcome-scroll">
            👋 Welcome {user?.name} ... Smart Food Share...
          </div>
        </div>

        {/* POST FOOD */}
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

        {/* MAP */}
        {view === "map" && (
          <FoodMap foods={foods} />
        )}

        {/* FOOD LIST */}
        {view === "list" &&
          foods.map((food) => (
            <div className="food-card" key={food._id}>
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

              {userRole === "receiver" && food.status === "available" && (
                <button
                  className="chat-btn"
                  onClick={() => requestFood(food._id)}
                >
                  Request
                </button>
              )}

              {userRole === "receiver" &&
                food.status === "requested" &&
                (otpInputs[food._id] || food.otp) && (
                  <div className="otp-box">
                    🔐 OTP: {otpInputs[food._id] || food.otp}
                  </div>
                )}

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
                      Verify OTP
                    </button>
                  </div>
                )}

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

      {/* RIGHT CHAT */}
      <div className="right-chat">
        {activeChat ? (
          <ChatBox
            socket={socketRef.current}
            roomId={activeChat}
            userRole={userRole}
            food={foods.find((f) => f._id === activeChat)}
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