function $(query) {
    return document.querySelector(query);
}

function Networking() {

}

Networking.prototype = {
    sendAPIRequest: function(query, callback) {
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("load", function(e) {
            var data = this.convertData(xhr.responseText); 
            callback(data);
        }.bind(this));
        xhr.open("GET", "http://crong.codesquad.kr:8080/ac/" + query);
        xhr.send();
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

function AutoComplete() {

}

AutoComplete.prototype = {
    init: function() {
        this.menuData = [];
        this.resultListDOM = $('.result_list');
        this.selectedIndex = -1;
    },
    show: function(word) {
        if(!this.menuData) {
            return;
        }
        this.resultListDOM.style.display = 'block';
        let html = "<ul>"
        this.menuData.forEach(function(data) {
            let specialWord = data.replace(word, "<span>" + word + "</span>");
            html += "<li>" + specialWord + "</li>"
        })
        this.resultListDOM.innerHTML = html + "</ul>"
    },
    close: function() {
        this.resultListDOM.style.display = 'none';
        this.selectedIndex = -1;
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
            listDOM[this.selectedIndex].classList.remove('selected');
        }
        this.selectedIndex++;
        listDOM[this.selectedIndex].classList.add('selected');
    }
}

function EventHandler(networking) {
    this.networking = networking; 
}

EventHandler.prototype = {
    init: function() {
        this.inputText = $('#input_box');
        this.searchButton = $('#search_button');

        this.inputText.addEventListener('keydown', this.onKeyDown.bind(this));
        this.inputText.addEventListener('keyup', this.onKeyUp.bind(this));
        this.searchButton.addEventListener('click', this.searchButtonEvent);
    },
    onKeyDown: function(event) {
        let key = event.keyCode;
        if (key === 38) {
            autoComplete.upKeyPressed();
        } else if(key === 40) {
            autoComplete.downKeyPress();
        } else if(key === 13) {
            this.inputText.value = autoComplete.enterPressed();
            autoComplete.close();
        }
    },
    onKeyUp: function(event) {
        let key = event.keyCode;
        this.networking.sendAPIRequest(this.inputText.value, function(data) {
            if(key === 38 || key === 40 || key === 13) {
                return;
            }
            if(data) {
                autoComplete.menuData = data;
            }
            autoComplete.show(this.inputText.value);
        }.bind(this));
        
    },
    searchButtonEvent: function() {
        autoComplete.close();
    }
}

var autoComplete = new AutoComplete(); 
autoComplete.init()

var eventHandler = new EventHandler(new Networking()); 
eventHandler.init()
