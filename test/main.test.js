const assert = chai.assert;

describe('Networking Test', function(){
	it('오징, shoul equal', function(done) {
		const ohJingExpected = ["오징어볶음"
			,"마른오징어"
			,"오징어무국"
			,"반건조오징어"
			,"군산오징어"
			,"오징어짬뽕"
			,"총알오징어"
			,"대왕오징어"
			,"오징어집"];
		var networking = new Networking();

		networking.sendAPIRequest("오징", function(data) {
			assert.deepEqual(data, ohJingExpected);
			done();
		});
	});

	it('된장, should equal', function(done) {
		const dwenJangExpected = ["된장소스 방풍나물"
			,"구수한 된장시래기"
			,"얼갈이된장무침"
			,"차돌박이 된장찌개"
			,"시금치 된장국"
			,"강된장"];

		var networking = new Networking();

		networking.sendAPIRequest("된장", function(data) {
			assert.deepEqual(data, dwenJangExpected);
			done();
		});
	});

	it('오징, should not equal', function(done) {
		const ohJingExpected = ["오징어볶음"
			,"젖은오징어"
			,"오징어무국"
			,"반건조오징어"
			,"군산오징어"
			,"오징어짬뽕"
			,"총알오징어"
			,"대왕오징어"
			,"오징어"];

		var networking = new Networking();

		var func = function(data) {
			assert.notDeepEqual(data, ohJingExpected);
			done();
		};

		networking.sendAPIRequest("오징", func);
	});

});

describe('EventHandler', function(){
    var mockAuto = {
		result: "",
		upKeyPressed: function() {
			this.result = "upkey";
		},
		downKeyPressed: function() {
			this.result = "downkey";
		},
		enterPressed: function() {
			this.result = "enter";
			return "enter";
		}
	};

	var mockInput = {
		value: ""
	}

	var eventHandler = new EventHandler(new Networking(), mockAuto, mockInput, "");

	it('onKeyDown upkey Event Test', function() {
		var event = new Event("keydown");
		event.keyCode = 38;

		eventHandler.onKeyDown(event);

		assert.equal(mockAuto.result, "upkey");
	});

	it('onKeyDown downkey Event Test', function() {
		var event = new Event("keydown");
		event.keyCode = 40;

		eventHandler.onKeyDown(event);

		assert.equal(mockAuto.result, "downkey");
	});

	it('onKeyDown enter Event Test', function() {
		var event = new Event("keydown");
		event.keyCode = 13;

		eventHandler.onKeyDown(event);

		assert.equal(mockAuto.result, "enter");
		assert.equal(mockInput.value, "enter");
	});

});

describe('auto', function(){
    var resultListDom = document.createElement("div");
    resultListDom.classList.add('result_list');

    var auto = new AutoComplete(resultListDom);
    auto.menuData.push("오징어볶음"
        ,"젖은오징어"
        ,"오징어무국"
        ,"반건조오징어"
        ,"군산오징어"
        ,"오징어짬뽕"
        ,"총알오징어"
        ,"대왕오징어"
        ,"오징어");

    it('show test', function(){
        auto.show('오징')
        var childList = resultListDom.childNodes[0].childNodes;
        assert.equal(resultListDom.style.display, "block");
        assert.equal(childList.length, auto.menuData.length);
        assert.include(childList[0].innerHTML, "<span>오징</span>");
    });

    it('close test', function() {
    	auto.close();

    	assert.equal(auto.selectedIndex, -1);
    	assert.equal(auto.resultListDOM.style.display, 'none');
    });

	it('enter pressed test', function() {
		auto.selectedIndex = 3;
		var retval = auto.enterPressed();

		assert.equal(auto.menuData[3], retval);
	});

	it('upkey pressed test', function() {
		auto.show();
		auto.selectedIndex = 3;
		var childList = resultListDom.childNodes[0].children;
		childList[3].classList.add('selected');
		auto.upKeyPressed();

		assert.equal(auto.selectedIndex, 2);
		assert.notInclude(childList[3].className, "selected");
		assert.include(childList[2].className, "selected");
	});

	it('downkey pressed test', function() {
		auto.show();
		auto.selectedIndex = 4;
		var childList = resultListDom.childNodes[0].children;
		childList[4].classList.add('selected');
		auto.downKeyPressed();

		assert.equal(auto.selectedIndex, 5);
		assert.notInclude(childList[4].className, "selected");
		assert.include(childList[5].className, "selected");
	});
});
