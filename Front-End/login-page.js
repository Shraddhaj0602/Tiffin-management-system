document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document
      .querySelector("input[name='username']")
      .value.trim();
    const password = document
      .querySelector("input[name='password']")
      .value.trim();

    const formData = {
      username,
      password,
    };

    axios
      .post("http://localhost:8000/api/v1/users/login", formData, {
        withCredentials: true,
      })
      .then(function (response) {
        console.log(response.data.message.accessToken);
        alert("Welcome To Our Site");
        window.location.href = "/";
        localStorage.setItem("Access token", response.data.message.accessToken);
        localStorage.setItem(
          "Refresh token",
          response.data.message.accessToken
        );
      })
      .catch(function (error) {
        console.log(error);
        alert("PassWord is Wrong");
      })
      .finally(function () {});
  });
});
