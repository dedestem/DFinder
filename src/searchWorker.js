// searchWorker.js
self.onmessage = async function(event) {
    const { path, query, invoke } = event.data;
    try {
      const result = await eval(`(${invoke})`)('search', { path, query });
      self.postMessage({ result });
    } catch (error) {
      self.postMessage({ error: error.message });
    }
  };
  