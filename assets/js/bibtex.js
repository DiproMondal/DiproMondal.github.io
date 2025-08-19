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
        const v = kv
          .slice(1)
          .join("=")
          .replace(/[{}"]/g, "")
          .replace(/\\textbf{([^}]*)}/g, "$1") // remove \textbf{}
          .replace(/\\textit{([^}]*)}/g, "<em>$1</em>") // keep italics
          .trim();
        fields[k] = v;
      }
    });
    entries.push({ type, key, fields });
  }
  return entries;
}

function renderPublications(entries) {
  const container = document.getElementById("pub-list");
  container.innerHTML = "";
  entries
    .sort((a, b) => (b.fields.year || 0) - (a.fields.year || 0)) // newest first
    .forEach(e => {
      const f = e.fields;

      const authors = f.author || "";
      const title = f.title || "";
      const journal = f.journal || "";
      const year = f.year || "";
      const volume = f.volume ? ` ${f.volume}` : "";
      const number = f.number ? `(${f.number})` : "";
      const pages = f.pages ? `:${f.pages}` : "";
      const note = f.note ? f.note : "";

      let content = `<p><strong>${authors}</strong> (${year}).<br>`;

      // hyperlink only if url is present
      if (f.url) {
        content += `<a href="${f.url}" target="_blank">${title}</a>.`;
      } else {
        content += `${title}.`;
      }

      if (journal) {
        content += ` <em>${journal}</em>`;
        if (volume || number) content += volume + number;
        if (pages) content += pages;
        content += ".";
      }

      if (note) {
        content += ` ${note}`;
      }

      content += "</p>";

      const div = document.createElement("div");
      div.className = "pub-item";
      div.innerHTML = content;
      container.appendChild(div);
    });
}
