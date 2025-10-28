import CONFIG from "../config";

const ENDPOINTS = {
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,

  STORIES: `${CONFIG.BASE_URL}/stories`,
};

export async function setRegister(data) {
  try {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(ENDPOINTS.REGISTER, options);
    const responseJson = await response.json();

    showResponseMessage(responseJson.message);

    return { success: true, message: "Register successfully" };
  } catch (error) {
    showResponseMessage(error);
    return { success: true, message: "Register failed" };
  }
}

export async function setLogin(data) {
  try {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(ENDPOINTS.LOGIN, options);
    const responseJson = await response.json();

    if (responseJson.error) {
      showResponseMessage(responseJson.message);
      return { success: false, message: "Login failed" };
    }

    localStorage.setItem(
      "loginResult",
      JSON.stringify(responseJson.loginResult)
    );

    showResponseMessage(responseJson.message);

    return { success: true, message: "Login successfully" };
  } catch (error) {
    showResponseMessage(error);
    return { success: false, message: "Login failed" };
  }
}

export async function getStories() {
  try {
    const userData = JSON.parse(localStorage.getItem("loginResult"));
    const token = userData?.token;

    if (!userData) {
      return [];
    }

    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(ENDPOINTS.STORIES, options);
    const responseJson = await response.json();

    if (responseJson.error) {
      showResponseMessage(responseJson.message);
      return [];
    }

    return responseJson.listStory;
  } catch (error) {
    showResponseMessage(error);
  }
}

export async function getDetailStory(id) {
  try {
    const userData = JSON.parse(localStorage.getItem("loginResult"));
    const token = userData?.token;

    if (!userData) {
      return [];
    }

    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(`${ENDPOINTS.STORIES}/${id}`, options);
    const responseJson = await response.json();

    if (responseJson.error) {
      showResponseMessage(responseJson.message);
      return [];
    }

    return responseJson.story;
  } catch (error) {
    showResponseMessage(error);
  }
}

export async function setStory({ description, photo, lat, lon }) {
  try {
    const userData = JSON.parse(localStorage.getItem("loginResult"));
    const token = userData?.token;

    if (!userData) {
      return [];
    }

    const formData = new FormData();
    formData.append("description", description);
    formData.append("photo", photo);
    if (lat && lon) {
      formData.append("lat", lat);
      formData.append("lon", lon);
    }

    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    };

    const response = await fetch(ENDPOINTS.STORIES, options);
    const responseJson = await response.json();

    showResponseMessage(responseJson.message);
    return responseJson;
  } catch (error) {
    showResponseMessage(error.message || error);
  }
}

export async function getPlaceName(lat, lon) {
  const url = `https://api.maptiler.com/geocoding/${lon},${lat}.json?key=${CONFIG.MAP_SERVICE_API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data?.features?.length > 0) {
      return data.features[0].place_name;
    } else {
      return "Alamat tidak ditemukan";
    }
  } catch (err) {
    console.error("Error saat mengambil lokasi:", err);
    return null;
  }
}

const showResponseMessage = (message = "Check your internet connection") => {
  alert(message);
};
