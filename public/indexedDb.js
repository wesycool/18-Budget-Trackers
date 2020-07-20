// Save Data to IndexedDb when Offline
function saveRecord(object) {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open("budget", 1);

        request.onupgradeneeded = ({target:{result}}) => {
            result.createObjectStore("pending", {autoIncrement: true});
        }

        request.onerror = () => {console.log("There was an error")}
    
        request.onsuccess = ({target:{result}}) => {
            let tx = result.transaction(["pending"], "readwrite")
            let store = tx.objectStore("pending")
    
            result.onerror = () => {console.log("error")}
            tx.oncomplete = () => {result.close()}
            store.put(object)
        }
    })
}


// Load Data from IndexedDb
function loadRecord() {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open("budget", 1)

        request.onupgradeneeded = ({target:{result}}) => {
            result.createObjectStore("pending", {autoIncrement: true});
        }
    
        request.onerror = () => {console.log("There was an error")}
    
        request.onsuccess = ({target:{result}}) =>  {
            let tx = result.transaction(["pending"], "readwrite")
            let load = tx.objectStore("pending").getAll()

            tx.oncomplete = () => {result.close()}
            load.onsuccess = ({target:{result}}) => {resolve(result)}
        }
    })
}

// Delete Data from IndexedDb
function deleteRecord() {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open("budget", 1)

        request.onupgradeneeded = ({target:{result}}) => {
            result.createObjectStore("pending", {autoIncrement: true});
        }
    
        request.onerror = () => {console.log("There was an error")}
    
        request.onsuccess = ({target:{result}}) =>  {
            let tx = result.transaction(["pending"], "readwrite")
            let store = tx.objectStore("pending")
    
            result.onerror = () => {console.log("error")}
            tx.oncomplete = () => {result.close()}
            store.clear()
        }
    })
}