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
  } catch (error) {
    showResponseMessage(error);
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

    localStorage.setItem("loginResult", JSON.stringify(response.loginResult));

    showResponseMessage(responseJson.message);
  } catch (error) {
    showResponseMessage(error);
  }
}

export async function getStories() {
  try {
    const userData = JSON.parse(localStorage.getItem("loginResult"));
    const token = userData.token;
    const options = {
      method: "POST",
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
    const token = userData.token;
    const options = {
      method: "POST",
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

export async function setStory(data) {
  try {
    const userData = JSON.parse(localStorage.getItem("loginResult"));
    const token = userData.token;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(ENDPOINTS.STORIES, options);
    const responseJson = await response.json();
    showResponseMessage(responseJson.message);
  } catch (error) {
    showResponseMessage(error);
  }
}

const showResponseMessage = (message = "Check your internet connection") => {
  alert(message);
};
