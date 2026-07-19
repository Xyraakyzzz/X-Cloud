let currentChannelData = null;

document.addEventListener("DOMContentLoaded", () => {
    const postUrlInput = document.getElementById("postUrl");
    const channelLoading = document.getElementById("channelLoading");
    const channelPreview = document.getElementById("channelPreview");
    const channelImg = document.getElementById("channelImg");
    const channelName = document.getElementById("channelName");
    const channelFollowers = document.getElementById("channelFollowers");
    const channelVerified = document.querySelector(".channel-preview-verified");

    channelPreview.style.display = "none";
    channelLoading.style.display = "none";

    let debounceTimeout;

    postUrlInput.addEventListener("input", () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            const url = postUrlInput.value.trim();
            if (!url) {
                channelPreview.style.display = "none";
                return;
            }
            const channelRegex =
                /^https:\/\/whatsapp\.com\/channel\/([a-zA-Z0-9]+)(\/[1-9][0-9]*)?$/;
            if (!url.match(channelRegex)) {
                console.warn("URL tidak valid");
                channelPreview.style.display = "none";
                return;
            }
            fetchChannelData(url);

        }, 1000);
    });

    const apiModal = document.getElementById("apiModal");
    const openApiModal = document.getElementById("openApiModal");
    const closeApiModal = document.getElementById("closeApiModal");
    const saveApi = document.getElementById("saveApi");
    const userApiKey = document.getElementById("userApiKey");
    const userAuth = document.getElementById("userAuth");
    userApiKey.value = localStorage.getItem("vip_apikey") || "";
    userAuth.value = localStorage.getItem("vip_auth") || "";
    openApiModal.addEventListener("click", () => {
        apiModal.style.display = "flex";
    });

    closeApiModal.addEventListener("click", () => {
        apiModal.style.display = "none";
    });

    apiModal.addEventListener("click", (e) => {
        if (e.target === apiModal) {
            apiModal.style.display = "none";
        }
    });

    saveApi.addEventListener("click", () => {
        const apiKey = userApiKey.value.trim();
        const auth = userAuth.value.trim();
        if (!apiKey || !auth) {
            alert("API Key dan Auth wajib diisi");
            return;
        }
        localStorage.setItem("vip_apikey", apiKey);
        localStorage.setItem("vip_auth", auth);

        showAlert(
            '<i class="fa-solid fa-check"></i> API credentials berhasil disimpan',
            "success"
        );

        apiModal.style.display = "none";
    });

    async function fetchChannelData(url) {
        channelLoading.style.display = "flex";
        channelPreview.style.display = "none";

        try {
            const apiUrl =
                `https://zyzzkylin2.vercel.app/api/tools/cekch?url=${encodeURIComponent(url)}`;

            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error("API error");
            }

            const data = await response.json();

            if (data.status && data.result) {

                const result = data.result;

                currentChannelData = result;

                const autoVerifiedChannel = "0029VbCWwrR3gvWdm7Cizm3N";

                const matchId =
                    url.match(/whatsapp\.com\/channel\/([a-zA-Z0-9]+)/);

                const isAutoVerified =
                    matchId && matchId[1] === autoVerifiedChannel;
                let followers = (result.pengikut || "")
                    .toString()
                    .replace(/[^\d]/g, "");

                if (!followers) followers = "0";
                channelImg.src = result.photo || "";
                let name = result.name || "Unknown Channel";
                name = name
                    .split(":")[0]
                    .split("\n")[0]
                    .trim();
                channelFollowers.textContent = followers;
                if (result.verified === "Verified" || isAutoVerified) {
                    channelName.innerHTML = `
            <span style="display:inline-flex;align-items:center;gap:4px;">
              ${name}

              <svg width="18" height="18" viewBox="0 0 24 24" style="flex:none;">
                <path
                  fill="#0095F6"
                  d="M12 2.5l2.2 1.6 2.7-.4 1.1 2.5 2.5 1.1-.4 2.7 1.6 2.2-1.6 2.2.4 2.7-2.5 1.1-1.1 2.5-2.7-.4L12 21.5l-2.2-1.6-2.7.4-1.1-2.5-2.5-1.1.4-2.7L2.3 12l1.6-2.2-.4-2.7 2.5-1.1 1.1-2.5 2.7.4L12 2.5z"
                />
                <path
                  d="M8 12.5l2.5 2.5L16.5 9"
                  stroke="white"
                  stroke-width="2.6"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
          `;

                } else {
                    channelName.textContent = name;
                }
                channelLoading.style.display = "none";
                channelPreview.style.display = "flex";
            } else {
                throw new Error("Channel tidak ditemukan");
            }

        } catch (err) {
            channelLoading.style.display = "none";
            channelPreview.style.display = "none";
            console.error(err);
        }
    }

    document.getElementById("emojiInput").placeholder = "\uf118 \uf118";
    const MAX_EMOJI = 5;
    async function checkServiceStatus() {
        try {
            const response =
                await fetch("https://reaction.zone.id/api/status");
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const result = await response.json();
            console.log(result)
            const data = result.data;
            const overlay = document.getElementById("serviceClosed");
            const badge = document.getElementById("statusBadge");
            const cards = document.querySelectorAll(".card");
            const btnGroups = document.querySelectorAll(".btn-group");
            const extras = document.querySelectorAll(
                ".request-card, .admin-stats, .tab-content"
            );

            const isOpen =
                data?.success &&
                (
                    data.isOpen === true ||
                    String(data.isOpen).trim().toLowerCase() === "true"
                );

            if (!isOpen) {

                overlay.style.display = "block";

                cards.forEach(el => {
                    if (el.id !== "serviceClosed") {
                        el.style.display = "none";
                    }
                });

                btnGroups.forEach(el => {
                    el.style.display = "none";
                });

                extras.forEach(el => {
                    el.style.display = "none";
                });

                badge.innerHTML =
                    '<i class="fa-solid fa-xmark"></i> Layanan Tutup';

                badge.className = "status-badge";
                badge.style.background = "var(--pink)";

            } else {

                overlay.style.display = "none";

                cards.forEach(el => {
                    if (el.id !== "serviceClosed") {
                        el.style.display = "";
                    }
                });

                btnGroups.forEach(el => {
                    el.style.display = "";
                });

                extras.forEach(el => {
                    el.style.display = "";
                });

                badge.innerHTML =
                    '<i class="fa-solid fa-server"></i> Server Online';

                badge.className = "status-badge online";
                badge.style.background = "";
            }

        } catch (error) {
            console.error("Error checking service status:", error);
        }
    }

    checkServiceStatus();

    setInterval(checkServiceStatus, 60 * 1000);


    function generateFingerprint() {

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        ctx.textBaseline = "top";
        ctx.font = "14px Arial";
        ctx.fillText("fingerprint", 2, 2);

        const canvasData = canvas.toDataURL();

        const fp = {
            screen: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled,
            canvas: canvasData.slice(-50),
            timestamp: Date.now()
        };

        return btoa(JSON.stringify(fp));
    }

    function parseEmojis(input) {

        input = input.trim();

        let emojis = [];

        if (input.includes(",")) {

            emojis = input
                .split(",")
                .map(e => e.trim())
                .filter(Boolean);

        } else {

            if (typeof Intl !== "undefined" && Intl.Segmenter) {

                try {

                    const segmenter =
                        new Intl.Segmenter("en", {
                            granularity: "grapheme"
                        });

                    const segments = [...segmenter.segment(input)];

                    emojis = segments
                        .map(s => s.segment.trim())
                        .filter(e =>
                            e.length &&
                            /\p{Emoji}/u.test(e)
                        );

                } catch (e) {
                    console.warn("Segmenter failed:", e);
                }
            }

            if (!emojis.length) {

                const emojiRegex =
                    /\p{Emoji}(\p{Emoji_Modifier}|\u200D\p{Emoji})*/gu;

                emojis = input.match(emojiRegex) || [];
            }
        }

        return [...new Set(emojis)];
    }

    function isValidWhatsAppChannelUrl(url) {

        try {

            const parsed = new URL(url);

            if (
                !["whatsapp.com", "www.whatsapp.com"]
                .includes(parsed.hostname)
            ) {
                return {
                    valid: false,
                    message: "Link harus dari whatsapp.com"
                };
            }

            const pathParts =
                parsed.pathname.split("/").filter(Boolean);

            if (
                pathParts.length < 3 ||
                pathParts[0] !== "channel"
            ) {
                return {
                    valid: false,
                    message: "Format harus /channel/ID_CHANNEL/ID_POST"
                };
            }

            const channelId = pathParts[1];
            const postId = pathParts[2];

            if (!/^[A-Za-z0-9]{20,}$/.test(channelId)) {
                return {
                    valid: false,
                    message: "ID Channel tidak valid"
                };
            }

            if (!/^\d+$/.test(postId)) {
                return {
                    valid: false,
                    message: "ID Post harus angka"
                };
            }

            return {
                valid: true,
                channelId,
                postId
            };

        } catch {

            return {
                valid: false,
                message: "URL tidak valid"
            };
        }
    }

    function showAlert(message, type, autoHide = true) {

        const alertEl = document.getElementById("alert");

        alertEl.innerHTML = message;
        alertEl.className = `alert alert-${type} show`;

        if (autoHide) {
            setTimeout(() => {
                alertEl.classList.remove("show");
            }, 5000);
        }
    }

    document
        .getElementById("emojiInput")
        .addEventListener("input", (e) => {

            const emojis = parseEmojis(e.target.value);
            const count = emojis.length;

            const counterEl =
                document.getElementById("emojiCount");

            counterEl.textContent = count;

            counterEl.style.color =
                count > MAX_EMOJI ?
                "var(--error)" :
                count > 0 ?
                "var(--success)" :
                "inherit";
        });

    document
        .getElementById("reactionForm")
        .addEventListener("submit", async (e) => {

            e.preventDefault();

            const postUrl =
                document.getElementById("postUrl").value.trim();

            const emojiInput =
                document.getElementById("emojiInput").value.trim();

            const honeypot =
                document.getElementById("honeypot").value;

            const submitBtn =
                document.getElementById("submitBtn");

            const btnText =
                document.getElementById("btnText");

            const btnSpinner =
                document.getElementById("btnSpinner");

            if (honeypot) {
                showAlert(
                    '<i class="fa-solid fa-xmark"></i> Bot detected',
                    "error"
                );
                return;
            }

            const emojis = parseEmojis(emojiInput);

            if (!postUrl) {
                return showAlert(
                    "Please enter the post URL",
                    "error"
                );
            }

            if (!emojis.length) {
                return showAlert(
                    "Please enter at least one emoji",
                    "error"
                );
            }

            if (emojis.length > MAX_EMOJI) {
                return showAlert(
                    `Maximum ${MAX_EMOJI} emojis allowed for Free users`,
                    "error"
                );
            }

            const validation =
                isValidWhatsAppChannelUrl(postUrl);

            if (!validation.valid) {
                return showAlert(
                    `<i class="fa-solid fa-xmark"></i> ${validation.message}`,
                    "error"
                );
            }

            submitBtn.disabled = true;
            btnText.textContent = "Sending...";
            btnSpinner.style.display = "block";

            let result;

            try {

                const PASS =
                    localStorage.getItem("vip_apikey") || "Hm";

                const NAME =
                    localStorage.getItem("vip_auth") || "Hm";

                const response = await fetch("https://reaction.zone.id/api/vip/send",
  {
    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      id: "req_" + Date.now(),

      postUrl,

      reactions: emojis,

      channel: currentChannelData
        ? {
            id: currentChannelData.id || null,
            jid: currentChannelData.jid || null,
            name: currentChannelData.name || "Unknown Channel",
            description: currentChannelData.description || "",
            followers: currentChannelData.pengikut || "0",
            verified: currentChannelData.verified || "Unknown",
            photo: currentChannelData.photo || "",
            invite: currentChannelData.invite || "",
            creation: currentChannelData.creation || null
          }
        : null,
        
     auth: {
      	name: localStorage.getItem("vip_auth"),
          password: localStorage.getItem("vip_apikey")
          
     	},

      request: {
        totalEmoji: emojis.length,
        emojiString: emojis.join(""),
        createdAt: new Date().toISOString(),
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        timezone: Intl.DateTimeFormat()
          .resolvedOptions()
          .timeZone,
        fingerprint: generateFingerprint().slice(0, 32)
      }
    })
  }
);

                result = await response.json();

                if (!response.ok || !result.status) {

                    showAlert(
                        `<i class="fa-solid fa-xmark"></i> ${
              result.message || "Gagal kirim request"
            }`,
                        "error"
                    );

                    return;
                }

                showAlert(
                    `<i class="fa-solid fa-check"></i> ${result.result.message || 'Request berhasil dikirim!'}`,
                    "success"
                );

            } catch (error) {

                console.error(error);

                showAlert(
                    `<i class="fa-solid fa-xmark"></i> ${
            result?.message ||
            result?.result?.message ||
            error.message ||
            "Gagal kirim request"
          }`,
                    "error"
                );

            } finally {

                submitBtn.disabled = false;
                btnText.textContent = "Send Reaction";
                btnSpinner.style.display = "none";
            }
        });

    const kyys = localStorage.getItem("theme");

    if (kyys === "light") {
        document.documentElement.setAttribute(
            "data-theme",
            "light"
        );
    }

    function toggleTheme() {

        const dm =
            document.documentElement.getAttribute("data-theme");

        const md =
            dm === "light" ?
            "dark" :
            "light";

        if (md === "dark") {
            document.documentElement.removeAttribute("data-theme");
        } else {
            document.documentElement.setAttribute(
                "data-theme",
                "light"
            );
        }

        localStorage.setItem("theme", md);

        updateToggleIcon();
    }

    function updateToggleIcon() {

        const el =
            document.getElementById("themeToggle");

        if (!el) return;

        const isDark =
            document.documentElement
            .getAttribute("data-theme") !== "light";

        el.innerHTML = isDark ?
            '<i class="fa-solid fa-moon"></i>' :
            '<i class="fa-solid fa-sun"></i>';

        el.title = isDark ?
            "Mode Terang" :
            "Mode Gelap";
    }

    updateToggleIcon();

    function kyysz() {
        window.location.href =
            "https://whatsapp.com/channel/0029Vb8MmlM1dAw6uiljFA3Y";
    }

    document.addEventListener(
        "contextmenu",
        e => e.preventDefault()
    );

    document.addEventListener("keydown", e => {

        if (
            e.ctrlKey &&
            (e.key === "u" || e.key === "s")
        ) {
            e.preventDefault();
        }
    });
});