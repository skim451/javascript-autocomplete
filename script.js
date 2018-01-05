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
    selectedIndex: -1,

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

    },
    upKeyPressed: function() {
        $(".result_list ul").children[this.selectedIndex].classList.add('selected');
        if (this.selectedIndex <= this.menuData.length - 1) {
            return;
        }
        this.selectedIndex--;
        // if (this.selectedIndex >= this.menuData.length - 1) {
        //     return;
        // }
        // this.selectedIndex++;
        // $(".result_list ul").children[selectedIndex].classList.add('selected');
    },
    downKeyPress: function() {
        if (this.selectedIndex >= this.menuData.length - 1) {
            return;
        }
        this.selectedIndex++;
        // $(".result_list ul").children[selectedIndex].classList.add('selected');
        // if (this.selectedIndex <= this.menuData.length - 1) {
        //     return;
        // }
        // this.selectedIndex--;
    }
}

var eventHandler = {
    inputText: $('#input_box'),
    autoComplete: autoComplete,

    pressKeyEvent: function(event) {
        var key = event.keyCode;

        if (key === 38) {
            this.autoComplete.upKeyPressed()
        } else if(key === 40) {

        } else if(key === 13) {
            // autoComplete.close();
        } else {
            this.autoComplete.menuData = networking.sendAPIRequest(this.inputText.value);
            this.autoComplete.show(this.inputText.value);
        }
    },
    searchButtonEvent: function() {
        this.autoComplete.close();
    }
}
