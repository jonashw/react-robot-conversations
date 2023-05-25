import { UtteranceId } from "./Model";
let openRequest = indexedDB.open("voicess-store", 1);
openRequest.onupgradeneeded = function () {
  let db = openRequest.result;
  if (!db.objectStoreNames.contains("audioBlobs")) {
    db.createObjectStore("audioBlobs");
  }
};

openRequest.onerror = function () {
  console.error("Error", openRequest.error);
};

let db: IDBDatabase | undefined = undefined;
openRequest.onsuccess = function () {
  db = openRequest.result;
  console.log(db);
};

export default {
  getAudioBlob: (id: UtteranceId): Promise<Blob> =>
    new Promise<Blob>((resolve, reject) => {
      if (db === undefined) {
        reject();
        return;
      }
      let DB: IDBDatabase = db;
      let tx = db.transaction("audioBlobs", "readwrite");
      let audioBlobs = tx.objectStore("audioBlobs");
      let [voice, message] = id;
      let key = `${voice}:${message}`;
      let getRequest = audioBlobs.get(key);

      const cacheMiss = () => {
        console.log("cache MISS for " + key);

        let url = `https://us-west1-jonashw-dev-personal-website.cloudfunctions.net/jonashw-dev-speech-synthesis-proxy?voice=${voice}&msg=${message}`;
        fetch(url)
          .then((r) => r.blob())
          .then(
            (blob) => {
              console.log("adding blob to store", key, blob);
              let tx = DB.transaction("audioBlobs", "readwrite");
              let audioBlobs = tx.objectStore("audioBlobs");
              let addRequest = audioBlobs.add(blob, key);
              addRequest.onsuccess = (e) => {
                resolve(blob);
              };
              addRequest.onerror = (e) => {
                console.error(e);
                reject();
              };
              tx.commit();
            },
            (rejected) => {
              console.error(rejected);
              reject(rejected);
            }
          );
      };
      getRequest.onsuccess = (e) => {
        let blob: Blob = getRequest.result;
        if (!!blob) {
          console.log("cache HIT for " + key, getRequest.result);
          resolve(blob);
        } else {
          cacheMiss();
        }
      };
      getRequest.onerror = (e) => {
        e.stopPropagation();
        cacheMiss();
      };
    }),
};
