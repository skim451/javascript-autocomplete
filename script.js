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
        this.autoComplete.close();
    }

}

function AutoComplete() {
    this.resultList = []
    this.resultListDOM = $('.result_list');

    this.show = function() {
        this.resultListDOM.style.display = 'block';
    }

    this.close = function() {
        this.resultListDOM.style.display = 'none';
    }

    this.update = function() {

    }

    this.changeTextColor = function() {

    }
}

var searchBar = new SearchBar();
