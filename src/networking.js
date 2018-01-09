class Networking {
    sendAPIRequest(query, callback) {
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("load", function (e) {
            var data = this.convertData(xhr.responseText);
            callback(data);
        }.bind(this));
        xhr.open("GET", "http://crong.codesquad.kr:8080/ac/" + query);
        xhr.send();
    }

    convertData(data) {
        let result = []
        let json = JSON.parse(data)
        if (!json[1]) {
            return
        }
        json[1].forEach(function (val) {
            result.push(val[0])
        })
        return result
    }
}

export default Networking