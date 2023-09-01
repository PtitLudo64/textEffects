# Split Text effect

usage :

`code`
```sh
<p data-split='{"dur": "1000", "del": 2000, "cut": 0.6, "onScroll": false}' id='yourId'>Your text</p>
```

where :
**data-split** is the flag the script expects to process the row,
**"dur"** is the key to indicate the animation duration, followed by the duration in ms,
**"del"** is the key to indicate the animation delay, followed by the delay in ms,
**"cut"** adjusts the height at which the line should be cut (between 0 and 1). Default value 0.5, or 50%.
**onScroll** Not yet implemented.