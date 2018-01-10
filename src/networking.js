class Networking {
    constructor() { 
        //this.log = []
        this.cache = {} 

        this.init(); 
    }

    init() {
        this.loadCache(); 
        window.addEventListener("beforeunload", () => this.saveCache());
    }

    loadCache() {
        // const log = localStorage.getItem("log");
        // if(log) {
        //     this.log = JSON.parse(log);
        // }
        const cache = window.localStorage.getItem("cache");
        if(cache) {
            this.cache = JSON.parse(cache);
        }
    }

    saveCache() {
        //localStorage.setItem("log", JSON.stringify(this.log));
        window.localStorage.setItem("cache", JSON.stringify(this.cache));
    }

    insertCacheData(query, data) {
        const time = Date.now(); 
        const value = { "data" : data, 
                        "time" : time };

        this.cache[query] = value;
    }

    sendAPIRequest(query) {
        let promise; 

        if(!this.cache[query]) {
            console.log("miss!!")
            promise = new Promise((resolve) => {
                var xhr = new XMLHttpRequest();
                xhr.addEventListener("load", (e) => {
                    var data = this.convertData(xhr.responseText);
                    this.insertCacheData(query, data);
                    resolve(data);
                });
                xhr.open("GET", "http://crong.codesquad.kr:8080/ac/" + query);
                xhr.send();
            }); 
        } else {
            console.log("hit!!!")
            promise = new Promise((resolve) => {
                resolve(this.cache[query]["data"]);
            }); 
        }     

        return promise; 
    }

    convertData(data) {
        let result = [];
        let json = JSON.parse(data);
        if (!json[1]) {
            return
        }
        json[1].forEach(function (val) {
            result.push(val[0])
        });
        return result;
    }
}

export default Networking