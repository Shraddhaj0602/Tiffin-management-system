let loggedIn = false;
let loggedinUserName = "";
axios
  .post("http://localhost:8000/api/v1/users/users", {
    AccessToken: localStorage.getItem("Access token"),
  })
  .then((Response) => {
    console.log(Response);

    const loginLink = document.getElementById("login");
    loggedinUserName = Response.data.username;
    loginLink.innerHTML = `Hi, ${loggedinUserName}`;
    loginLink.setAttribute("href", "#");
    loggedIn = true;
  })
  .catch((err) => {
    console.log(err);
  });

function HandleCart({ name, description, category, price }) {
  if (loggedIn) {
    axios
      .post("http://localhost:8000/api/v1/users/addtoCart", {
        name,
        quantity: 1,
        username: loggedinUserName,
      })
      .then((Response) => {
        console.log(Response);
        alert("Items Added To Cart");
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    alert("Please Log In to Continue");
  }
}
