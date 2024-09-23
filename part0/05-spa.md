```mermaid
sequenceDiagram;
    participant browser
    participant server

    browser->>server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/spa
    server-->>browser: return HTML-code
    browser->>server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/main.css
    server-->>browser: return main.css
    browser->>server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/spa.js
    server-->>browser: return spa.js
    Note over browser: Browser executes js-code which requests data JSON from server
    browser->>server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/data.json
    server-->>browser: return data.json
    Note over browser: Browser executes event handler to render notes to display
    browser->>server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/favicon.ico
    server-->>browser: 404 Not Found!
```