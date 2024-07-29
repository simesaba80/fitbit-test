"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const [steps, setSteps] = useState(null);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      const fetchSteps = async () => {
        try {
          const response = await axios.get(
            "https://api.fitbit.com/1/user/-/activities/steps/date/today/1d.json",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setSteps(response.data["activities-steps"][0].value);
        } catch (error) {
          console.error("Error fetching steps data:", error);
        }
      };
      fetchSteps();
    }
  }, [token]);

  const handleLogin = () => {
    window.location.href = "/api/auth/fitbit";
  };

  return (
    <div className="p-4">
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Sign in with Fitbit
      </button>
      {token && (
        <div>
          <p>Access Token: {token}</p>
          {steps !== null && <p>Today's steps: {steps}</p>}
        </div>
      )}
    </div>
  );
}
