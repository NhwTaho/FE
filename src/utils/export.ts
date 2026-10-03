export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  headers?: { key: keyof T; label: string }[]
) {
  if (!data || !data.length) {
    alert('Không có dữ liệu để xuất file.');
    return;
  }

  // UTF-8 BOM so Excel opens Vietnamese characters correctly without encoding issues
  let csvContent = '\uFEFF';

  if (headers && headers.length > 0) {
    csvContent += headers.map((h) => `"${String(h.label).replace(/"/g, '""')}"`).join(',') + '\r\n';
    data.forEach((row) => {
      const line = headers
        .map((h) => {
          const val = row[h.key];
          const text = val === null || val === undefined ? '' : String(val);
          return `"${text.replace(/"/g, '""')}"`;
        })
        .join(',');
      csvContent += line + '\r\n';
    });
  } else {
    const keys = Object.keys(data[0]);
    csvContent += keys.map((k) => `"${k.replace(/"/g, '""')}"`).join(',') + '\r\n';
    data.forEach((row) => {
      const line = keys
        .map((k) => {
          const val = row[k];
          const text = val === null || val === undefined ? '' : String(val);
          return `"${text.replace(/"/g, '""')}"`;
        })
        .join(',');
      csvContent += line + '\r\n';
    });
  }

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
