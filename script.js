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
        if(!json[1]) {
            return
        }
        json[1].forEach(function(val) {
            result.push(val[0])
        })
        return result
    }
}

var autoComplete = {
    menuData: [],
    resultListDOM: $('.result_list'),
    selectedIndex: -1,

    show: function(word) {
        if(!this.menuData) {
            return;
        }
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
    enterPressed: function() {

        return this.menuData[this.selectedIndex];

    },
    upKeyPressed: function() {
        let listDOM = $(".result_list ul").children
        if (this.selectedIndex == -1) {
            return;
        }
        listDOM[this.selectedIndex].classList.remove('selected')
        this.selectedIndex--;
        if(this.selectedIndex >= 0) {
            listDOM[this.selectedIndex].classList.add('selected')
        }
    },
    downKeyPress: function() {
        let listDOM = $(".result_list ul").children
        if (this.selectedIndex >= this.menuData.length - 1) {
            return;
        }
        if(this.selectedIndex > -1) {
            listDOM[this.selectedIndex].classList.remove('selected')
        }
        this.selectedIndex++;
        listDOM[this.selectedIndex].classList.add('selected')
    }
}

var eventHandler = {
    inputText: $('#input_box'),
    autoComplete: autoComplete,

    onKeyDown: function(event) {
        let key = event.keyCode
        if (key === 38) {
            this.autoComplete.upKeyPressed()
        } else if(key === 40) {
            this.autoComplete.downKeyPress()
        } else if(key === 13) {
            this.inputText.value = this.autoComplete.enterPressed();
            this.autoComplete.close();
        }
    },
    onKeyUp: function(event) {
        let key = event.keyCode
        if(key === 38 || key === 40 || key === 13) {
            return;
        }
        this.autoComplete.menuData = networking.sendAPIRequest(this.inputText.value);
        this.autoComplete.show(this.inputText.value);
    },
    searchButtonEvent: function() {
        this.autoComplete.close();
    }
}
