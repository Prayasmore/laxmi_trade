const SHEET_URL = import.meta.env.VITE_GOOGLE_SHEET_URL;

// Handles quoted values so commas inside quotes don't break parsing
function parseLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  values.push(current.trim());
  return values;
}

export async function fetchProducts() {
  const res = await fetch(SHEET_URL);
  if (!res.ok) throw new Error(`Failed to fetch products (${res.status})`);

  const text = await res.text();
  const lines = text.trim().split(/\r?\n/);
  const headers = parseLine(lines[0]);

  return lines
    .slice(1)
    .map((line, index) => {
      const values = parseLine(line);
      const row = {};
      headers.forEach((header, i) => {
        row[header.trim()] = values[i] ?? '';
      });
      return { ...row, id: index };
    })
    .filter((row) => row.is_active?.trim() === 'TRUE')
    .map((row) => ({
      ...row,
      category: row.category?.trim().toLowerCase() || '',
      brand: row.brand?.trim().toLowerCase() || '',
      mrp: parseFloat(row.mrp) || 0,
      stock: parseInt(row.stock, 10) || 0,
      media: row.media?.trim()
        ? row.media.split(',').map((url) => url.trim()).filter(Boolean)
        : [row.image_url].filter(Boolean),
    }));
}
