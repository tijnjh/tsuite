import { isBrowser } from "../helpers";

if (isBrowser() && typeof customElements !== "undefined") {
  class TsuiteToast extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot!.innerHTML = `
        <style>
          :host { z-index:9999; pointer-events:none; }
          .toast {
            box-sizing:border-box;
            position:fixed;
            left:50%;
            transform:translateX(-50%);
            top:1rem;
            background:white;
            padding:1rem 1.5rem;
            border-radius:1rem;
            box-shadow:0 2px 12px rgba(0,0,0,0.2);
            font-family:system-ui;
            cursor:pointer;
            max-width:calc(100% - 2rem);
            overflow:hidden;
            overflow-wrap:break-word;
            transition:opacity .256s ease, transform .256s ease;
            opacity:0;
            transform:translateY(-6rem);
          }
          .toast.animate-in {
            opacity:1;
            transform:translateY(0);
          }
          .toast.animate-out {
            opacity:0;
            transform:translateY(-6rem);
          }
          @media (prefers-color-scheme: dark) {
            .toast { background:#222; color:#fff; }
          }
        </style>
      `;
    }

    show(message?: any) {
      const toastEl = document.createElement("div");
      toastEl.className = "toast";
      toastEl.textContent =
        typeof message === "object" ? JSON.stringify(message) : message ?? "";
      this.shadowRoot!.append(toastEl);

      // Trigger the "animate-in" transition
      requestAnimationFrame(() => toastEl.classList.add("animate-in"));

      setTimeout(() => {
        toastEl.classList.add("animate-out");
        toastEl.addEventListener("transitionend", () => toastEl.remove(), {
          once: true,
        });
      }, 2560);
    }
  }

  customElements.define("internal__tsuite-toast", TsuiteToast);
}

interface ToastElement extends HTMLElement {
  show?(message?: any): void;
}

/**
 * Instruct the browser to display a toast with a message.
 *
 * @param message A string or object to display.
 */
export default function toast(message?: any): void {
  if (!isBrowser() || typeof document === "undefined") {
    // Fallback on server or non-browser
    console.log(
      "toast message:",
      typeof message === "object" ? JSON.stringify(message) : message
    );
    return;
  }

  let toastEl = document.querySelector(
    "internal__tsuite-toast"
  ) as ToastElement | null;

  if (!toastEl) {
    toastEl = document.createElement("internal__tsuite-toast") as ToastElement;
    document.body.append(toastEl);
  }

  toastEl.show?.(message);
}
