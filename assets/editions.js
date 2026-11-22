// MetaCRiSP editions: the year switcher in the navbar, the archive banner on old editions, and the editions overview on the homepage.
//
// Each page declares its edition with <body data-edition="2027"> and loads this script and editions.css.
// To start a new edition: copy the current index.html/program.html into a folder named after their year, set `dir` for that year below, and add the new edition at the top of the list (with dir: ""). Every page of an older edition then shows the archive banner automatically.

const MC_EDITIONS = [
    {
        year: 2027,
        ordinal: "2nd",
        venue: "IEEE S&P 2027",
        place: "Montreal, Canada",
        date: "May 20, 2027",
        dir: "",
        links: [["Call for papers", "index.html#cfp"]],
    },
    {
        year: 2026,
        ordinal: "1st",
        venue: "IEEE S&P 2026",
        place: "San Francisco, USA",
        date: "May 21, 2026",
        dir: "2026/",
        links: [
            ["Program & slides", "program.html#program"],
            ["Workshop report", "metacrisp2026-report.pdf"],
            ["Call for papers", "index.html#cfp"],
        ],
    },
];

(function () {
    // The site root, derived from this script's own address (assets/editions.js), so links work from any folder and on any host.
    const root = new URL("../", document.currentScript.src);
    const latest = MC_EDITIONS[0];
    const current = MC_EDITIONS.find((e) => String(e.year) === document.body.dataset.edition) || latest;
    const archived = current !== latest;

    const url = (edition, page) => new URL(edition.dir + (page || "index.html"), root).href;
    const el = (html) => {
        const t = document.createElement("template");
        t.innerHTML = html.trim();
        return t.content.firstElementChild;
    };
    const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

    // Year switcher: the year next to the brand opens a short list of editions
    const brand = document.querySelector(".navbar-brand");
    if (brand) {
        brand.textContent = "MetaCRiSP";
        const items = MC_EDITIONS.map((e) => `
            <li>
                <a class="dropdown-item${e === current ? " active" : ""}" href="${url(e)}"${e === current ? ' aria-current="page"' : ""}>
                    <span class="mc-ed-year">${e.year}</span>
                    <span class="mc-ed-meta">${esc(e.place)}${e === latest ? " &middot; current" : ""}</span>
                </a>
            </li>`).join("");
        brand.after(el(`
            <div class="dropdown mc-edition">
                <button class="mc-edition-toggle dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" aria-label="Switch MetaCRiSP edition">${current.year}</button>
                <ul class="dropdown-menu mc-edition-menu">${items}</ul>
            </div>`));
    }

    // Archive note on old editions
    if (archived) {
        document.body.classList.add("mc-archived");
        const hero = document.querySelector(".bg-image");
        if (hero) {
            const note = el(`
                <div class="mc-archive-note" role="note">
                    <div class="container">This is the archived website of MetaCRiSP ${current.year}. The current edition is <a href="${url(latest)}">MetaCRiSP ${latest.year}</a> (${esc(latest.place)}, ${esc(latest.date)}).</div>
                </div>`);
            hero.before(note);
            // Start the note right below the fixed navbar, whatever its height
            const nav = document.querySelector(".fixed-top");
            const placeNote = () => {
                note.style.marginTop = "0px";
                const overlap = nav ? nav.offsetHeight - note.offsetTop : 0;
                note.style.marginTop = Math.max(0, overlap) + "px";
            };
            placeNote();
            window.addEventListener("resize", placeNote);
        }
    }

    // Editions overview (homepage)
    document.querySelectorAll("[data-mc-editions]").forEach((target) => {
        target.innerHTML = `<ul class="mc-ed-list">${MC_EDITIONS.map((e) => `
            <li>
                <strong>MetaCRiSP ${e.year}</strong>, ${e.ordinal} edition, co-located with ${esc(e.venue)}, ${esc(e.place)}, ${esc(e.date)}${e === current ? ' <span class="mc-ed-this">(this edition)</span>' : `<br>
                <span class="mc-ed-links"><a href="${url(e)}">Website</a>${e.links.map(([label, page]) => ` &middot; <a href="${url(e, page)}">${esc(label)}</a>`).join("")}</span>`}
            </li>`).join("")}</ul>`;
    });
})();
