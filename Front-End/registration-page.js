document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.querySelector("input[name='name']").value.trim();
    const username = document
      .querySelector("input[name='username']")
      .value.trim();

      
    const phone = document.querySelector("input[name='phone']").value.trim();
    const email = document.querySelector("input[name='email']").value.trim();
    const password = document
      .querySelector("input[name='password']")
      .value.trim();
    const address = document
      .querySelector("input[name='address']")
      .value.trim();

    // Regular expressions for validation
    const nameRegex = /^[a-zA-Z]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (name === "" || !nameRegex.test(name) || name.length < 6) {
      alert(
        "Please enter a valid name with alphabets only and length should be at least 6 characters."
      );
      return;
    }

    if (phone === "" || !phoneRegex.test(phone)) {
      alert("Please enter a valid phone number with exactly 10 digits.");
      return;
    }

    if (email === "" || !emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (password === "" || password.length < 6) {
      alert("Please enter a password with at least 6 characters.");
      return;
    }

    const formData = {
      FullName: name,
      username,
      password,
      email,
      address,
    };

    axios
      .post("http://localhost:8000/api/v1/users/register", formData)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
        alert("Form data collected successfully! you can Login Now");
      });
    console.log(formData);
  });
});
