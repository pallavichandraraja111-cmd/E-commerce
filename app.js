document.addEventListener("DOMContentLoaded", () => {
  
  const form = document.getElementById("enquiryForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Simple validation
    if (
      document.getElementById("name").value.trim() === "" ||
      document.getElementById("email").value.trim() === "" ||
      document.getElementById("message").value.trim() === ""
    ) {
      alert("Please fill in all fields.");
      return;
    }

    // Redirect to thank you page
    window.location.href = "thankyou.html";
  });

});
