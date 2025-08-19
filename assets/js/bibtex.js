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
        const v = kv.slice(1).join("=").replace(/[{}"]/g, "").trim();
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
    .sort((a, b) => (b.fields.year || 0) - (a.fields.year || 0))
    .reverse() // show latest first
    .forEach(e => {
      const title = e.fields.title || "Untitled";
      const authors = e.fields.author || "";
      const year = e.fields.year || "";
      const venue = e.fields.journal || e.fields.booktitle || "";
      const doi = e.fields.doi
        ? `https://doi.org/${e.fields.doi.replace(/^https?:\/\/(dx\.)?doi.org\//, "")}`
        : null;

      const div = document.createElement("div");
      div.className = "pub-item";
      div.innerHTML = `
        <h3>${title}</h3>
        <p><strong>${authors}</strong> (${year})</p>
        <p><em>${venue}</em></p>
        ${doi ? `<p><a href="${doi}" target="_blank">DOI Link</a></p>` : ""}
      `;
      container.appendChild(div);
    });
}
