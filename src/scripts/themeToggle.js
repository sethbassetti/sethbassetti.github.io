
const getTheme = () => {
  const localStorageTheme = localStorage?.getItem("theme") ?? "";
  if (["dark", "light"].includes(localStorageTheme)) {
    return localStorageTheme;
  }
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
};

const setTheme = (theme) => {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}
const handleToggleClick = () => {
  const element = document.documentElement;
  element.classList.toggle("dark");

  const isDark = element.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
};

const update = () => {
  const theme = getTheme();
  localStorage.setItem("theme", theme);
  setTheme(theme);

  // Attach the event listener to all theme toggle buttons.
  document.querySelectorAll(".theme-toggle").forEach(btn => {
    btn.removeEventListener("click", handleToggleClick); // Avoid duplicate bindings.
    btn.addEventListener("click", handleToggleClick);
  });
}

update();

document.addEventListener("astro:after-swap", update);
