const DB_NAME = 'GaneshSamitiFilesDB';
const STORE_NAME = 'files';
const DB_VERSION = 1;

/**
 * Initialize IndexedDB
 */
function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Error opening IndexedDB');
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

/**
 * Save a file (Base64 string) to IndexedDB permanently
 * @param base64Data The image data in Base64 format
 * @returns A unique string ID for the file
 */
export async function saveFile(base64Data: string): Promise<string> {
  const db = await initDB();
  const id = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const request = store.put({ id, data: base64Data, timestamp: Date.now() });
    
    request.onsuccess = () => resolve(id);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get a file by its ID
 * @param id The unique string ID
 * @returns The Base64 string of the image, or null if not found
 */
export async function getFile(id: string): Promise<string | null> {
  if (!id) return null;
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    
    const request = store.get(id);
    
    request.onsuccess = () => {
      if (request.result) {
        resolve(request.result.data);
      } else {
        resolve(null);
      }
    };
    
    request.onerror = () => reject(request.error);
  });
}

/**
 * Delete a file by its ID
 * @param id The unique string ID
 */
export async function deleteFile(id: string): Promise<void> {
  if (!id) return;
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const request = store.delete(id);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
