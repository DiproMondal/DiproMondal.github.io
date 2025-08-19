function parseBibTeX(text) {
  const entries = [];
  const regex = /@(\w+)\s*{\s*([^,]+),([\s\S]*?)}/g;
  let match;
  while ((match = regex.exec(text))) {
    const [, type, key, fieldsBlock] = match;
    const fields = {};
    fieldsBlock.split(/\n/).forEach(line => {
      const kv = line.split("=");
      if (kv.length >= 2) {
        const k = kv[0].trim().toLowerCase();
        let v = kv.slice(1).join("=").trim();

        // strip braces/quotes
        v = v.replace(/[{}"]/g, "");

        // LaTeX cleanup
        v = v.replace(/\\textbf\s*{([^}]*)}/g, "$1");
        v = v.replace(/\\textit\s*{([^}]*)}/g, "<em>$1</em>");

        // collapse multiple spaces
        v = v.replace(/\s+/g, " ");

        fields[k] = v;
      }
    });
    entries.push({ type: type.toLowerCase(), key, fields });
  }
  return entries;
}

function renderPublications(entries) {
  const container = document.getElementById("pub-list");
  container.innerHTML = "";
  entries
    .sort((a, b) => (b.fields.year || 0) - (a.fields.year || 0)) // newest last
    .reverse() // newest first
    .forEach(e => {
      const f = e.fields;
      if (!f.author && !f.title) return; // skip broken entries

      const authors = f.author || "";
      const title = f.title || "";
      const journal = f.journal || "";
      const year = f.year || "";
      const volume = f.volume ? ` ${f.volume}` : "";
      const number = f.number ? `(${f.number})` : "";
      const pages = f.pages ? `:${f.pages}` : "";
      const note = f.note || "";

      // Special handling for unpublished / under review
      let yearLabel = year ? `(${year})` : "";
      if (e.type === "unpublished" || /under review/i.test(note)) {
        yearLabel = year ? `(Under Review, ${year})` : `(Under Review)`;
      }

      // hyperlink only if url is present
      let titleHtml = title;
      if (f.url) {
        titleHtml = `<a href="${f.url}" target="_blank">${title}</a>`;
      }

      let html = `<p><strong>${authors}</strong> ${yearLabel}. ${titleHtml}.`;

      if (journal) {
        html += ` <em>${journal}</em>`;
        if (volume || number) html += volume + number;
        if (pages) html += pages;
        html += ".";
      }

      if (note) {
        html += ` ${note}`;
      }

      html += "</p>";

      const div = document.createElement("div");
      div.className = "pub-item";
      div.innerHTML = html;
      container.appendChild(div);
    });
}
