class Networking {
    constructor() { 
        this.log = []
        this.cotent = {} 

        window.addEventListener("beforeunload", 
            (event) => localStorage.setItem("hello", Date.now().toString()));
    }

    init() {
        this.load(); 
        window.addEventListener("beforeunload", () => saveCache());
    }

    loadCache() {
        const log = localStorage.getItem("log");
        if(log) {
            this.log = JSON.parse(log);
        }
        const content = localStorage.getItem("content");
        if(content) {
            this.content = JSON.parse(content);
        }
    }

    saveCache() {
        localStorage.setItem("log", JSON.stringify(this.log));
        localStorage.setItem("content", JSON.stringify(this.content)); 
    }

    sendAPIRequest(query) {
        let promise = new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.addEventListener("load", function (e) {
                var data = this.convertData(xhr.responseText);
                resolve(data);
            }.bind(this));
            xhr.open("GET", "http://crong.codesquad.kr:8080/ac/" + query);
            xhr.send();
        }); 

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