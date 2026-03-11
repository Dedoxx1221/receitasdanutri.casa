(function(w, d, k, c, s) {
    w[k] = w[k] || {
        b: [],
        s: s
    };
    w[k].b.push(c);
    if (!w[k].l) {
        var t = d.createElement('script');
        t.src = s;
        d.head.appendChild(t);
    } else {
        w[k].ld();
    }
})(window, document, 'cpd', {
    "sticky": true,
    "theme": "default light",
    "url": "https://orders.cartpanda.com",
    "brandName": "Cartpanda",
    "brand": "cartpanda",
    "position": "bottom-left",
    "dialog-headline": "Cartpanda is the reseller of this product.",
    "dialog-text": "You can order in confidence, knowing that Cartpanda\u2019s customer support is here to help you along the way if needed.",
    "secure-label": "Secure Order",
    "footer-layout": "default",
    "footer": new Date().getFullYear() + " \u00a9 Cartpanda Inc. (United States) Inc. and\/or its licensors. Review legal terms of use <a href='https://cartpanda.com/buyers-seller-terms' target='_blank' onclick=\" window.open('https://cartpanda.com/buyers-seller-terms', '_blank', 'width=800,height=600,scrollbars=yes,status=yes,resizable=yes,screenx=0,screeny=0');; return false;\">here<\/a> and privacy policy <a href='https://cartpanda.com/privacy-policy' target='_blank' onclick=\" window.open('https://cartpanda.com/privacy-policy', '_blank', 'width=800,height=600,scrollbars=yes,status=yes,resizable=yes,screenx=0,screeny=0');; return false;\">here<\/a>. Contact us <a href='https://orders.cartpanda.com' target='_blank' onclick=\" window.open('https://orders.cartpanda.com', '_blank', 'width=800,height=600,scrollbars=yes,status=yes,resizable=yes,screenx=0,screeny=0');; return false;\">here<\/a>. <div id='cp-de-legal-links'></div>",
    "impl": "cpc"
}, 'https://assets.mycartpanda.com/cartx-ecomm-ui-assets/js/loader.js');
document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const afid = urlParams.get("afid");
    const country_code = urlParams.get("debug_country") || null; // For testing purposes only
    if (afid) {
        document.querySelectorAll("a").forEach(link => {
            if (link.href) {
                const linkUrl = new URL(link.href, window.location.origin);
                linkUrl.searchParams.set("afid", afid);
                link.href = linkUrl.toString();
            }
        });
    }

    const visitToken = localStorage.getItem('visit_token') || crypto.randomUUID();
    var sessionToken = localStorage.getItem('session_token') || crypto.randomUUID();
    localStorage.setItem('visit_token', visitToken);
    localStorage.setItem('session_token', sessionToken);
    const now = Date.now();
    const lastActive = parseInt(localStorage.getItem('last_active_at')) || 0;
    const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 minutes

    if (now - lastActive > INACTIVITY_LIMIT) {
        localStorage.setItem('last_active_at', now);
        sessionToken = crypto.randomUUID();
        localStorage.setItem('session_token', sessionToken);
    }

    const matchingLinks = new Set();
    document.querySelectorAll("a").forEach(link => {
        const href = link.href;
        if (href.includes('/checkout') || href.includes('/ckt')) {
            matchingLinks.add(href);
        }
    });
    matchingLinks.forEach(matchingLink => {
        fetch('https://orders.cartpanda.com/api/track-visit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                page_id: window.location.href,
                page_type: 'sales',
                visit_token: visitToken,
                cartpanda_link: matchingLink,
                session_token: sessionToken
            })
        });
    });
    var debugCountryParam = country_code ? '?debug_country=' + country_code : '';
    function waitForLegalDiv(callback) {
        const el = document.getElementById("cp-de-legal-links");
        if (el) return callback(el);
        setTimeout(() => waitForLegalDiv(callback), 200); // check again after 200ms
    }

    fetch('https://orders.cartpanda.com/api/get-country-details' + debugCountryParam, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {   
        console.log('✅ Country details fetched:', data);
        if (data.cf_ipcountry === "DE") {
            waitForLegalDiv(el => {
                el.innerHTML = `
                    <a target='_blank' href='https://cartpanda.com/impressum-5-tmg'>Impressum</a> &nbsp;
                    <a target='_blank' href='https://cartpanda.com/widerrufsbelehrung-(bgb)'>Widerruf</a> &nbsp;
                    <a target='_blank' href='https://cartpanda.com/datenschutzerkl%C3%A4rung-(dsgvo)'>Datenschutz</a> &nbsp;
                    <a target='_blank' href='https://cartpanda.com/allgemeine-gesch%C3%A4ftsbedingungen'>AGB</a>
                `;
            });
        }
    })
    .catch(error => console.error('❌ Fetch error:', error));
});