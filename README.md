# 배민찬 자동완성 기능 설계도

## 클래스 종류
- SearchBar
- AutoComplete

## SearchBar 구성
- 메소드
    - sendAPIRequest()
        - setResultList()
    - checkKeyType()
    - searchButtonClickEvent

- 프로퍼티
    - inputText (String)
    - autoComplete (AutoComplete)

## AutoComplete 구성
- 메소드
    - show()
    - close()
    - update()
    - changeTextColor()

- 프로퍼티
    - resultList (Array)
