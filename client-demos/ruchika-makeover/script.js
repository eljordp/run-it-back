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
