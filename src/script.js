import Networking from './networking.js'

function $(query) {
    return document.querySelector(query);
}

class AutoComplete {
    constructor(resultList) {
        this.menuData = [];
        this.resultListDOM = resultList;
        this.selectedIndex = -1;
        this.listDOM = this.resultListDOM.children[0];
    }

    show(word) {
        if (!this.menuData) {
            return;
        }
        this.selectedIndex = -1;
        this.resultListDOM.style.display = 'block';
        let html = ""
        this.menuData.forEach(function (data) {
            let specialWord = data.replace(word, `<span>${word}</span>`);
            html += `<li>${specialWord}</li>`;
        });
        this.listDOM.innerHTML = html;
    }

    close() {
        this.resultListDOM.style.display = 'none';
        this.selectedIndex = -1;
    }

    itemSelected() {
        var currData = this.menuData[this.selectedIndex];
        this.close();
        return currData;
    }

    upKeyPressed() {
        this.changeSelected(this.selectedIndex - 1);
    }

    downKeyPressed() {
        this.changeSelected(this.selectedIndex + 1);
    }

    changeSelected(index) {
        let list = this.listDOM.children;
        if (this.selectedIndex !== -1) {
            list[this.selectedIndex].classList.remove('selected')
        }
        if (index >= 0 && index < list.length) {
            this.selectedIndex = index;
            list[this.selectedIndex].classList.add('selected')
        }
    }

    mouseHovered(item) {
        let index = Array.prototype.indexOf.call(this.listDOM.children, item);

        this.changeSelected(index);
    }
}

class EventHandler {
    constructor(networking, autoComplete, inputBox, searchButton) {
        this.networking = networking;
        this.autoComplete = autoComplete
        this.inputText = inputBox;
        this.searchButton = searchButton;
    }

    init() {
        this.inputText.addEventListener('keydown', this.onKeyDown.bind(this));
        this.inputText.addEventListener('keyup', this.onKeyUp.bind(this));
        this.searchButton.addEventListener('click', this.onSearchButtonClick.bind(this));
        this.autoComplete.listDOM.addEventListener('mouseover', this.onMouseHover.bind(this));
        this.autoComplete.listDOM.addEventListener('click', this.onMouseClick.bind(this));
    }

    onKeyDown(event) {
        let key = event.keyCode;
        if (key === 38) {
            this.autoComplete.upKeyPressed();
        } else if (key === 40) {
            this.autoComplete.downKeyPressed();
        } else if (key === 13) {
            this.inputText.value = this.autoComplete.itemSelected();
        }
    }

    onKeyUp(event) {
        let key = event.keyCode;
        if (key === 38 || key === 40 || key === 13) {
            return;
        }

        let afterDataRevc = (data) => {
            if (data) {
                this.autoComplete.menuData = data;
                this.autoComplete.show(this.inputText.value);
            } else {
                this.autoComplete.close();
            }
        }

        this.networking.sendAPIRequest(this.inputText.value)
                        .then(afterDataRevc);
    }

    onSearchButtonClick() {
        this.autoComplete.close();
    }

    onMouseHover(event) {
        let hoveredItem = event.target;
        if (!hoveredItem || hoveredItem.nodeName !== "LI") {
            return;
        }
        this.autoComplete.mouseHovered(hoveredItem);
    }

    onMouseClick(event) {
        this.inputText.value = this.autoComplete.itemSelected();
    }

}

document.addEventListener('DOMContentLoaded', function () {
    var autoComplete = new AutoComplete($('.result_list'));

    var eventHandler = new EventHandler(new Networking(),
        autoComplete,
        $('#input_box'),
        $('#search_button'));
    eventHandler.init()
});
