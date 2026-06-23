document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll('a[href*="abcheckout.nutriliacastro.com"]');
    const webhookUrl = "https://n8n.srv1125248.hstgr.cloud/webhook/53942450-a02b-4748-99d6-e5d5fc3b83bd";
    // const targetUrlA = "https://nutri-lia-castro.mycartpanda.com/checkout/204712538:1"; // Removed as per request
    const targetUrlB = "https://abcheckout.nutriliacastro.com/";

    // Helper to get cookie by name
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
        return null;
    }

    // Helper to get URL parameter
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
        var results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    buttons.forEach((btn) => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();

            // 1. Determine Destination (100% to Option B)
            // const isOptionB = Math.random() < 0.8; 
            let destinationBase = targetUrlB;

            // 2. Capture Parameters
            const currentSearch = window.location.search;
            let destinationUrl = destinationBase;

            // Append existing parameters to the new destination
            if (currentSearch) {
                const separator = destinationBase.includes("?") ? "&" : "?";
                destinationUrl += separator + currentSearch.substring(1);
            }

            // 3. Extract Tracking Data
            // Priority: URL param > Cookie
            let fbc = getUrlParameter("fbclid");
            if (!fbc) {
                const fbcCookie = getCookie("_fbc");
                if (fbcCookie) {
                    fbc = fbcCookie;
                }
            }

            const fbp = getCookie("_fbp");

            // 4. Send Webhook
            const payload = {
                fbc: fbc || null,
                fbp: fbp || null,
                destination_url: destinationUrl,
                timestamp: new Date().toISOString(),
                user_agent: navigator.userAgent,
            };

            // Use fetch with keepalive which is standard for this.
            fetch(webhookUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
                keepalive: true,
            }).catch((err) => console.error("Webhook failed", err));

            // 5. Redirect
            window.location.href = destinationUrl;
        });
    });
});
