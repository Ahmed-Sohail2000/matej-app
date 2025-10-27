async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setLoading(true);
  setError(null);
  setMessage(null);
  setCharts([]);

  if (!webhookUrl) {
    setError('Missing NEXT_PUBLIC_N8N_WEBHOOK_URL');
    setLoading(false);
    return;
  }

  const form = e.currentTarget;
  const formData = new FormData(form);

  try {
    const res = await fetch(webhookUrl as string, {
      method: 'POST',
      body: formData,
    });

    const contentType = res.headers.get('content-type') || '';

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`HTTP ${res.status}: ${txt || 'No response body'}`);
    }

    if (contentType.includes('application/json')) {
      const data = await res.json();
      console.log('n8n response:', data);

      // ✅ FIX: Handle array response from n8n
      const payload = Array.isArray(data) ? data[0] : data;
      
      setMessage(payload?.message ?? 'Success');
      const list = Array.isArray(payload?.charts) ? payload.charts : [];
      setCharts(list);

      // Encode URLs for navigation
      const url1 = list?.[0]?.url || '';
      const url2 = list?.[1]?.url || '';
      const title1 = list?.[0]?.title || '';
      const title2 = list?.[1]?.title || '';

      const search = new URLSearchParams();
      if (url1) {
        search.set('url1', encodeURIComponent(url1));
        if (title1) search.set('title1', title1);
      }
      if (url2) {
        search.set('url2', encodeURIComponent(url2));
        if (title2) search.set('title2', title2);
      }

      router.push(`/view?${search.toString()}`);
    } else {
      const text = await res.text();
      setMessage(text || 'Submitted successfully (non-JSON response)');
    }
  } catch (err: any) {
    setError(err?.message || 'Failed to fetch (network/CORS/URL issue)');
  } finally {
    setLoading(false);
  }
}
