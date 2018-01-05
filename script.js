function $(query) {
    return document.querySelector(query);
}

function SearchBar() {
    this.inputText = $('#input_box').value;
    this.autoComplete = new AutoComplete();

    this.sendAPIRequest = function(query) {

    }

    this.checkKeyType = function() {

    }

    this.searchButtonClickEvent = function() {

    }

}

function AutoComplete() {
    this.resultList = []

    this.show = function() {

    }

    this.close = function() {

    }

    this.update = function() {

    }

    this.changeTextColor = function() {

    }
}
