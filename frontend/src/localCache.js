const caches = {
}

export async function fetchAndSaveToCache(url, name) {
  if (caches[name]) return caches[name];

  const res = await fetch(url)
  const blob = await res.blob();
  // await storeInIndexedDB(blob);
  caches[name] = URL.createObjectURL(blob);
  return caches[name];
}

export function getCached(name) {
  return caches[name]
}

// // Open IndexedDB
// const request = indexedDB.open('images', 1);

// request.onupgradeneeded = event => {
//   const db = event.target.result;

//   // Create an object store
//   db.createObjectStore('files', { autoIncrement: true });
// };

// function storeInIndexedDB(blob) {
//   const transaction = db.transaction(['files'], 'readwrite');
//   const objectStore = transaction.objectStore('files');

//   const chunkSize = 1024 * 1024; // 1MB chunk size
//   let offset = 0;

//   function storeNextChunk() {
//     const chunk = blob.slice(offset, offset + chunkSize);
//     offset += chunkSize;

//     if (chunk.size > 0) {
//       objectStore.add(chunk);
//       storeNextChunk();
//     }
//   }

//   storeNextChunk();
// }

// export const loadFromDb = async () => {
//   const transaction = db.transaction(['files'], 'readonly');
//   const objectStore = transaction.objectStore('files');
//   const chunks = [];

//   return new Promise((resolve) => {
//     objectStore.openCursor().onsuccess = event => {
//       const cursor = event.target.result;

//       if (cursor) {
//         chunks.push(cursor.value);
//         cursor.continue();
//       } else {
//         const combinedBlob = new Blob(chunks, { type: 'image/jpeg' });
//         const imageUrl = URL.createObjectURL(combinedBlob);
//         resolve(imageUrl);
//       }
//     };
//   })
// }

