const API_URL = "http://localhost:5000/api";

// ==============================
// LOGIN
// ==============================

export const loginUser = async (userData) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};

// ==============================
// REGISTER USER
// ==============================

export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
};

// ==============================
// CREATE QUEUE TOKEN
// ==============================

export const createQueueToken = async (queueData) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/queue`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(queueData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create token"
    );
  }

  return data;
};

// ==============================
// GET ALL QUEUE
// ==============================

export const getQueue = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/queue`, {
    method: "GET",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to get queue"
    );
  }

  return data;
};

// ==============================
// GET MY TOKENS
// ==============================

export const getMyTokens = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/queue/my`, {
    method: "GET",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to get tokens"
    );
  }

  return data;
};

// ==============================
// UPDATE QUEUE STATUS - ADMIN
// ==============================

export const updateQueueStatus = async (id, status) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/queue/${id}/status`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        status,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update queue status"
    );
  }

  return data;
};