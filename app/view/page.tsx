// app/view/page.tsx

// Define the props type
type ViewPageProps = {
  searchParams?: Promise<{ 
    url1?: string; 
    url2?: string; 
    title1?: string; 
    title2?: string 
  }>;
};

export default async function ViewPage({ searchParams }: ViewPageProps) {
  // Await the Promise to get the actual params
  const params = await searchParams;
  
  const raw1 = params?.url1 || '';
  const raw2 = params?.url2 || '';
  
  // Decode the URLs (they were encoded in the upload page)
  const url1 = raw1 ? decodeURIComponent(raw1) : '';
  const url2 = raw2 ? decodeURIComponent(raw2) : '';
  const title1 = params?.title1 || 'Chart 1';
  const title2 = params?.title2 || 'Chart 2';

  const charts = [
    url1 ? { url: url1, title: title1 } : null,
    url2 ? { url: url2, title: title2 } : null,
  ].filter(Boolean) as { url: string; title: string }[];

  return (
    <main style={{ minHeight: '100vh', padding: 24, background: '#fff', color: '#000' }}>
      <h1>Charts Viewer</h1>
      {charts.length === 0 ? (
        <p>No chart URLs provided. Go back and submit again.</p>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {charts.map((c, i) => (
            <figure key={i} style={{ margin: 0 }}>
              <img
                src={c.url}
                alt={c.title}
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
