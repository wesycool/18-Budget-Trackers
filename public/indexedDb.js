function checkForIndexedDb() {
    if (!window.indexedDB) {
      console.log("Your browser doesn't support a stable version of IndexedDB.");
      return false;
    }
    return true;
}

function saveRecord(object) {
    console.log('testing')
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open("budget", 1);
      let db, tx, store;
    
      console.log(request)

      request.onupgradeneeded = function(e) {
        db = request.result;
        console.log(db)
        db.createObjectStore("pending", { autoIncrement: true});
      };

      request.onerror = function(e) {
        console.log("There was an error");
      };
  
      request.onsuccess = function(e) {
        db = request.result;
        tx = db.transaction(["pending"], "readwrite");
        store = tx.objectStore("pending");
  
        db.onerror = function(e) {
          console.log("error");
        };
        if (method === "put") {
          store.put(object);
        } else if (method === "get") {
          const all = store.getAll();
          all.onsuccess = function() {
            resolve(all.result);
          };
        } else if (method === "delete") {
          store.delete(object._id);
        }
        tx.oncomplete = function() {
          db.close();
        };
      };
    });
}


  