function $(ele) {
	return document.querySelector(ele);
}

class DomContainer {
	constructor() {
		this.appBar = $('.app-bar');
		this.searchButton = $('.search-button');
		this.searchBar = $('.search-bar');
		this.searchField = $('#search-field');
		this.autoCompleteList = $('.auto-complete-list');
	}

	getHoveredItem() {
		return $('.hover');
	}
}

class AppBarRenderer {
	constructor(domContainer) {
		this.domContainer = domContainer;
	}

	updateRendering(keyword, autoComplete) {
        const listDom = this.domContainer.autoCompleteList;
        if(!autoComplete){
        	listDom.innerHTML = ""
        	return false
        }

        let listDomHTML = "";
		autoComplete.forEach((item) => {
			const itemHTML = item[0].replace(keyword, "<span>" + keyword + "</span>");
			let itemDom = "<li data-name='" +item[0] + "'>" + itemHTML + "</li>";
            listDomHTML += itemDom;
		});

        listDom.innerHTML = listDomHTML;
	}

	highlightListItem(index) {
		const listDom = this.domContainer.autoCompleteList;	
	}
}

class MainpageRenderer {
	constructor(domContainer) {
		this.domContainer = domContainer;
	}

	init() {
		// this.domContainer.appBar.innerHTML =
	}
}

class SearchWindow {
	constructor(apiUrl, domContainer, appBarRenderer) {
		this.apiUrl = apiUrl;
		this.domContainer = domContainer;
		this.appBarRenderer = appBarRenderer;
		this.memo = {};
		this.memoLog = [];
		this.memoSize = 100;
	}

	init() {
		this.setFocusOutListener();
		this.setKeyboardListener();
		this.setSearchButtonListener();
		this.setSearchTextChangeListener();
		this.setAutoCompleteClickListener(); 
		this.setAutoCompleteHoverListener();
	}

	requestApi(word, callback) {
		const url = this.apiUrl + word;
		AjaxRequest.getData(url, function (returnData) {
			const key = word;
			const value = returnData[1];

			this.memo[key] = value;
			if (!this.memoLog.includes(key)) {
				this.memoLog.push(key);
			}

			callback();
		}.bind(this));
	}

	getAutoCompleteList(word, callback) {
		if (!this.memo.hasOwnProperty(word)) {
			if (this.memoLog.length > this.memoSize) {
				let key = this.memoLog.shift();
				delete this.memo[key];
			}

			this.requestApi(word, function() {
				callback(this.memo[word]);
			}.bind(this));
		} else {
			callback(this.memo[word]);
		}
	}

	launchSearchEvent(keyword) {
		window.location.reload();
	}

	setFocusOutListener() {
		const searchField = this.domContainer.searchField;

		searchField.addEventListener('focusout', function(e) {
			this.domContainer.autoCompleteList.innerHTML = '';
		}.bind(this));
	}

	setKeyboardListener() {
		const searchField = this.domContainer.searchField; 

		searchField.addEventListener('keydown', function(e) {
			let currHoveredItem = this.domContainer.getHoveredItem(); 

			switch(e.keyCode){
				case 38: //ArrowUp 
					if(!currHoveredItem) {
						return;
					}
					
					if(currHoveredItem.previousElementSibling) {
						currHoveredItem.previousElementSibling.classList.add('hover'); 
						currHoveredItem.classList.remove('hover');
					}
					break;

				case 40: //ArrowDown 
					if(!currHoveredItem) {
						const autoCompleteList = this.domContainer.autoCompleteList; 
						if(autoCompleteList.childNodes) {
							autoCompleteList.childNodes[0].classList.add('hover')
						}
						return;
					}

					if(currHoveredItem.nextElementSibling) {
						currHoveredItem.nextElementSibling.classList.add('hover');
						currHoveredItem.classList.remove('hover');
					}
					break; 

				case 13: //Enter
					if(!currHoveredItem) {
						this.launchSearchEvent(); 
						return; 
					}
					
					this.putSelectedItemToField(currHoveredItem.dataset.name);
			}
		}.bind(this)); 
	}

	setAutoCompleteHoverListener() {
		const autoCompleteList = this.domContainer.autoCompleteList; 

		autoCompleteList.addEventListener('mouseover', function(e) {
			let listItem = e.target; 

			if(!listItem || listItem.nodeName !== 'LI') {
				return; 
			}

			let currHoveredItem = this.domContainer.getHoveredItem();

			if(currHoveredItem) {
				currHoveredItem.classList.remove('hover');
			}
			
			listItem.classList.add('hover');	
		}.bind(this));
	}

	setAutoCompleteClickListener() {
		const autoCompleteList = this.domContainer.autoCompleteList; 

		autoCompleteList.addEventListener('click', function(e) {
			let listItem = e.target; 

			if(!listItem || listItem.nodeName !== 'LI') {
				return; 
			}

			this.putSelectedItemToField(listItem.dataset.name); 
		}.bind(this));
	}

	setSearchButtonListener() {
		const searchButton = this.domContainer.searchButton; 

		searchButton.addEventListener('click', function(e) {

			this.launchSearchEvent(); 
		}.bind(this));
	}

	setSearchTextChangeListener() {
		this.domContainer.searchField.addEventListener('input', function(e) {
			const keyword = e.target.value;
			this.getAutoCompleteList(keyword, function(autoComplete) {
				this.appBarRenderer.updateRendering(keyword, autoComplete);
			}.bind(this));
		}.bind(this));
	}

	putSelectedItemToField(word) {
		const searchField = this.domContainer.searchField; 
		searchField.value = word; 

		this.domContainer.autoCompleteList.innerHTML = ''; 
	}
}

class AjaxRequest {
	constructor() {

	}

	static getData(url, callback) {
		var openRequest = new XMLHttpRequest();
		openRequest.addEventListener("load", function (e) {
			var data = JSON.parse(openRequest.responseText);
			callback(data);
		}.bind(this));
		openRequest.open("GET", url);
		openRequest.send();
	}
}

document.addEventListener('DOMContentLoaded', function () {
	const baseApiUrl = "http://crong.codesquad.kr:8080/ac/";

	const domContainer = new DomContainer();
	const appBarRenderer = new AppBarRenderer(domContainer);

	const searchWindow = new SearchWindow(baseApiUrl, domContainer, appBarRenderer);
	searchWindow.init();
});