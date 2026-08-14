const header = document.querySelector("[data-header]");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 16);
};

const closeMenu = () => {
  if (!menuButton || !navigation) return;
  menuButton.classList.remove("is-open");
  navigation.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
};

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.classList.toggle("is-open", !isOpen);
  navigation?.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 920) closeMenu();
});
updateHeader();

const copyButton = document.querySelector("[data-copy-button]");
const copyLabel = document.querySelector("[data-copy-label]");
const bibtex = document.querySelector("#bibtex code");
const contactCopyButton = document.querySelector("[data-copy-contact]");
const contactCopyLabel = document.querySelector("[data-contact-copy-label]");

const copyText = async (text) => {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall back for local files and browsers that restrict Clipboard API access.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";
  document.body.append(textarea);
  textarea.focus();
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();

  if (!copied) throw new Error("Copy failed");
};

copyButton?.addEventListener("click", async () => {
  if (!bibtex || !copyLabel) return;

  try {
    await copyText(bibtex.textContent.trim());
    copyLabel.textContent = "Copied";
    window.setTimeout(() => {
      copyLabel.textContent = "Copy BibTeX";
    }, 1800);
  } catch {
    copyLabel.textContent = "Select text to copy";
  }
});

let contactResetTimer;

contactCopyButton?.addEventListener("click", async () => {
  const email = contactCopyButton.dataset.email;
  if (!email || !contactCopyLabel) return;

  window.clearTimeout(contactResetTimer);

  try {
    await copyText(email);
    contactCopyLabel.textContent = "Copied!";
  } catch {
    contactCopyLabel.textContent = "Copy failed";
  }

  contactResetTimer = window.setTimeout(() => {
    contactCopyLabel.textContent = "Copy";
  }, 1800);
});
