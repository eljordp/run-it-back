const dmLink = document.querySelector("#dmLink");
const eventType = document.querySelector("#eventType");
const eventDate = document.querySelector("#eventDate");
const eventLocation = document.querySelector("#eventLocation");
const eventNotes = document.querySelector("#eventNotes");
const copyStatus = document.querySelector("#copyStatus");

function buildInquiry() {
  return [
    `Hi Ruchika, I want to inquire about ${eventType.value}.`,
    eventDate.value ? `Date: ${eventDate.value}.` : "",
    eventLocation.value ? `Location: ${eventLocation.value}.` : "",
    eventNotes.value ? `Notes: ${eventNotes.value}.` : ""
  ].filter(Boolean).join(" ");
}

function updateDmLink() {
  dmLink.href = "https://www.instagram.com/ruchikamakeover";
}

[eventType, eventDate, eventLocation, eventNotes].forEach((field) => {
  field.addEventListener("input", updateDmLink);
});

dmLink.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(buildInquiry());
    copyStatus.textContent = "Inquiry copied. Paste it into Instagram DM.";
  } catch {
    copyStatus.textContent = "Instagram opened. Copy your event details before sending a DM.";
  }
});

updateDmLink();

const soundButtons = document.querySelectorAll("[data-sound-toggle]");

soundButtons.forEach((button) => {
  const mediaCard = button.closest(".hero-post, .hero-feature-card, .insta-card");
  const video = mediaCard?.querySelector("video");

  if (!video) return;

  button.addEventListener("click", () => {
    const shouldUnmute = video.muted;

    document.querySelectorAll("video").forEach((item) => {
      item.muted = true;
    });

    document.querySelectorAll("[data-sound-toggle]").forEach((item) => {
      item.classList.remove("is-on");
      item.textContent = "Sound";
      item.setAttribute("aria-label", "Turn sound on");
    });

    video.muted = !shouldUnmute;
    button.classList.toggle("is-on", shouldUnmute);
    button.textContent = shouldUnmute ? "Mute" : "Sound";
    button.setAttribute("aria-label", shouldUnmute ? "Mute video" : "Turn sound on");
    video.play().catch(() => {});
  });
});
