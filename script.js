function $(query) {
    return document.querySelector(query);
}

var networking = {
    sendAPIRequest: function(query) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://crong.codesquad.kr:8080/ac/" + query, false);
        xhr.send();
        let data = this.convertData(xhr.response);
        return data
    },
    convertData: function(data) {
        let result = []
        let json = JSON.parse(data)
        for(let i=0; i < json[1].length; i++) {
            result.push(json[1][i][0])
        }
        return result
    }
}

var autoComplete = {
    menuData: [],
    resultListDOM: $('.result_list'),

    show: function(word) {
        this.resultListDOM.style.display = 'block';
        let html = "<ul>"
        for(let i=0; i < this.menuData.length; i++) {
            let specialWord = this.menuData[i].replace(word, "<span>" + word + "</span>");
            html += "<li>" + specialWord + "</li>"
        }
        this.resultListDOM.innerHTML = html + "</ul>"
    },
    close: function() {
        this.resultListDOM.style.display = 'none';
    },
    update: function() {

    }
}

var searchBar = {
    inputText: $('#input_box'),
    autoComplete: autoComplete,

    checkKeyType: function(event) {
        var key = event.keyCode;

        if(key === 38 || key === 40) {

        } else if(key === 13) {
            // autoComplete.close();
        } else {
            this.autoComplete.menuData = networking.sendAPIRequest(this.inputText.value);
            this.autoComplete.show(this.inputText.value);
        }
    },
    searchButtonClickEvent: function() {
        this.autoComplete.close();
    }
}
