document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("enquiryForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (name === "" || email === "" || message === "") {
      alert("Please fill all fields.");
      return;
    }

    // NO POPUP — DIRECT REDIRECT 👍
    window.location.href = "thankyou.html";
  });

});
