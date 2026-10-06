/**
 * Whether this browser has already been through the usage guide.
 * Shared by the banner, the boot sequence and the window manager, so it lives
 * apart from all three.
 */
const GUIDE_SEEN_KEY = "zunos.guide.seen";

export function guideSeen() {
  try {
    return localStorage.getItem(GUIDE_SEEN_KEY) === "1";
  } catch {
    return false; // storage blocked — showing it again is the safe side
  }
}

export function markGuideSeen() {
  try {
    localStorage.setItem(GUIDE_SEEN_KEY, "1");
  } catch {
    /* storage blocked — it will simply show again next visit */
  }
}
