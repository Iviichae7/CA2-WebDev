document.addEventListener("DOMContentLoaded", () => {
  const welcomeScreen = document.getElementById("welcome-screen");
  const mainContent = document.getElementById("main-content");
  const signInContent = document.getElementById("sign-in-content");
  const welcomeText = document.getElementById("welcome-text");
  const signInLink = document.getElementById("sign-in-link");
  const backToMainLink = document.getElementById("back-to-main-link");

  const text = welcomeText.textContent;
  /*
  Splits the text into characters and wraps each in a span element
  Each span gets classes for styling and animation making them initially invisible and animating their appearance
  The animation delay is by 0.1s for each character
  */
  const showMainContent = () => {
    welcomeScreen.classList.add("hidden");
    mainContent.classList.remove("hidden");
    mainContent.classList.add("animate-fadeInForm");
  };

  if (!sessionStorage.getItem("welcomeShown")) {
    welcomeText.innerHTML = text
      .split("")
      .map((char, index) => {
        const delay = index * 0.1;
        return `<span class="inline-block opacity-0 animate-fadeInChar" style="animation-delay: ${delay}s;">${
          char === " " ? "&nbsp;" : char
        }</span>`;
      })
      .join("");

    // A timeout to hide the welcome screen and show the main content with a fade in animation
    setTimeout(() => {
      showMainContent();
      sessionStorage.setItem("welcomeShown", "true");
    }, 5200);
  } else {
    showMainContent();
  }

  // Switching to sign-in form
  signInLink.addEventListener("click", (event) => {
    event.preventDefault();
    mainContent.classList.add("hidden");
    signInContent.classList.remove("hidden");
    signInContent.classList.add("animate-fadeInForm");
  });

  // Switching back to the main form
  backToMainLink.addEventListener("click", (event) => {
    event.preventDefault();
    signInContent.classList.add("hidden");
    mainContent.classList.remove("hidden");
    mainContent.classList.add("animate-fadeInForm");
  });
  // Check if showSignInForm flag is set and display the correct form
  const showSignInForm =
    document.body.getAttribute("data-show-sign-in-form") === "true";
  if (showSignInForm) {
    mainContent.classList.add("hidden");
    signInContent.classList.remove("hidden");
    signInContent.classList.add("animate-fadeInForm");
  }
});
