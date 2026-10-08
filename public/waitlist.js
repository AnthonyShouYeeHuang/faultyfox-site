document.querySelectorAll(".waitlist").forEach((form) => {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = form.querySelector(".msg");
    const button = form.querySelector("button");
    button.disabled = true;
    msg.textContent = "Adding you…";
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email.value, game: form.dataset.game }),
      });
      if (!res.ok) throw new Error();
      msg.textContent = "You're on the list. We'll email you when it's ready.";
      form.email.value = "";
    } catch {
      msg.textContent = "Something went wrong. Please try again.";
    } finally {
      button.disabled = false;
    }
  });
});
