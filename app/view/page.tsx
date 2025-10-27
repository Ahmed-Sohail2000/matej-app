export default function ViewPage({
  searchParams,
}: {
  searchParams?: { url1?: string; url2?: string; title1?: string; title2?: string };
}) {
  const raw1 = searchParams?.url1 || '';
  const raw2 = searchParams?.url2 || '';
  const url1 = raw1 ? decodeURIComponent(raw1) : '';
  const url2 = raw2 ? decodeURIComponent(raw2) : '';
  const title1 = searchParams?.title1 || 'Chart 1';
  const title2 = searchParams?.title2 || 'Chart 2';

  // Build the charts array first
  const charts = [
    url1 ? { url: url1, title: title1 } : null,
    url2 ? { url: url2, title: title2 } : null,
  ].filter(Boolean) as { url: string; title: string }[];

  // If you implemented the /api/image-proxy route, route through it
  const proxiedCharts = charts.map((c) => ({
    url: `/api/image-proxy?url=${encodeURIComponent(c.url)}`,
    title: c.title,
  }));

  // Choose which to render: proxied or direct
  const listToRender = proxiedCharts.length ? proxiedCharts : charts;

  return (
    <main style={{ minHeight: '100vh', padding: 24, background: '#fff', color: '#000' }}>
      <h1>Charts Viewer</h1>
      {listToRender.length === 0 ? (
        <p>No chart URLs provided. Go back and submit again.</p>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {listToRender.map((c, i) => (
            <figure key={i} style={{ margin: 0 }}>
              <img
                src={c.url}
                alt={c.title || `Chart ${i + 1}`}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: 8,
                  border: '1px solid #eee',
                  background: '#fff',
                }}
              />
              <figcaption style={{ fontSize: 14, color: '#555', wordBreak: 'break-all' }}>
                {c.title}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </main>
  );
}
