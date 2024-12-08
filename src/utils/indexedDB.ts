export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('eventsDB', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('events')) {
        db.createObjectStore('events', { keyPath: 'id' });
      }
    };
  });
};

export const saveEvents = async (events: any[]) => {
  const db: any = await initDB();
  const tx = db.transaction('events', 'readwrite');
  const store = tx.objectStore('events');
  
  // Clear existing events
  await store.clear();
  
  // Add all events
  events.forEach((event: any) => {
    store.add(event);
  });

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
};

export const getEvents = async () => {
  const db: any = await initDB();
  const tx = db.transaction('events', 'readonly');
  const store = tx.objectStore('events');
  const request = store.getAll();

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}; 