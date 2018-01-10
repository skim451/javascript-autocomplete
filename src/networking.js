class Cache {
    constructor()  {
        this.networkCache = {};
        this.recentCache = [];
        this.init();
    }
    init() {
        this.loadStorage();
        window.addEventListener("beforeunload", () => this.saveCache());
    }
    loadStorage() {
        // const log = localStorage.getItem("log");
        // if(log) {
        //     this.log = JSON.parse(log);
        // }
        const networkCache = window.localStorage.getItem("networkCache");
        if(networkCache) {
            this.networkCache = JSON.parse(networkCache);
        }

        const recentCache = window.localStorage.getItem("recentCache");
        if(recentCache) {
            this.recentCache = JSON.parse(recentCache);
        }
    }

    saveCache() {
        //localStorage.setItem("log", JSON.stringify(this.log));
        window.localStorage.setItem("networkCache", JSON.stringify(this.networkCache));
        window.localStorage.setItem("recentCache", JSON.stringify(this.recentCache));

    }
}

class Networking {
    constructor(storage) {
        //this.log = []
        this.cache = storage.networkCache;
    }

    insertCacheData(query, data) {
        const time = Date.now();
        const value = { "data" : data,
                        "time" : time };

        this.cache[query] = value;
    }

    isCacheInvalid(query) {
        if(!this.cache[query]) return true;

        const timeNow = Date.now();
        const timeCache = this.cache[query]["time"];

        //6시간 이상 차이났을때를 위한 부분이다.(친철한 톤)
        const timeDiff = (timeNow - timeCache)/1000/60/60/6;

        return timeDiff >= 1
    }

    sendAPIRequest(query) {
        let promise;

        if(this.isCacheInvalid(query)) {
            console.log("miss!!");
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
            console.log("hit!!!");
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

export {Networking, Cache}
