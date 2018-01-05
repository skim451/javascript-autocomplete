function $(ele) {
	return document.querySelector(ele);
}

class DomContainer {
	constructor() {
		this.searchBar = $('.search-bar');
		this.searchField = $('#search-field');
	}
}

class AppbarRenderer {
	constructor() {

	}

	updateRendering(autoComplete) {
		// console.log(autoComplete);

	}

	highlightListItem(index) {

	}

	highlightWords(keyword) {

	}
}

class MainpageRenderer {
	constructor() {

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
		this.setKeyboardListener();
		this.setSearchButtonListener();
		this.setSearchTextChangeListener();
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
			console.log('cache!!!!!!!!!!!!!!');
		}
	}

	launchSearchEvent() {

	}

	setKeyboardListener() {

	}

	setSearchButtonListener() {

	}

	setSearchTextChangeListener() {
		this.domContainer.searchField.addEventListener('input', function(e) {
			const keyword = e.target.value;
			this.getAutoCompleteList(keyword, function(autoComplete) {
				this.appBarRenderer.updateRendering(autoComplete);
				console.log(this.memo);
			}.bind(this));
		}.bind(this));
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

	const domCotainer = new DomContainer();
	const appbarRenderer = new AppbarRenderer();

	const searchWindow = new SearchWindow(baseApiUrl, domCotainer, appbarRenderer);
	searchWindow.init();
});