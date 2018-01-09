class Networking {
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