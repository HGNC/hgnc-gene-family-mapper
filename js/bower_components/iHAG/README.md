# iHAG - Interactive Horizontal Acyclic Grapher 

## Introduction
Draws acyclic graphs based on data within a javascript object from left to right. The graphs are interactive in that a user can click and hold on a box (node) which will highlight the path through the graph or the user can click and drag the box (node) to another area of the graph.

**For a live demo visit http://hgnc.github.io/iHAG/**

## Install
To install iHAG the easiest way would be to install [bower](http://bower.io) as described in the bower documentation and then simply run the following in your js directory:
```sh
$ bower install git://github.com/HGNC/iHAG.git
```
## Dependencies
Javascript dependencies:
- [Raphael ~2.1.4](https://github.com/DmitryBaranovskiy/raphael)
- [jQuery ~2.1.4](https://github.com/jquery/jquery)

## Usage
Simply add a `<div id='YOUR-CHOICE-OF-ID'></div>` anywhere in your `<body>`.
Then at the bottom of the `<body>` add your javascript dependencies:
```html
<script type="text/javascript" src="/js/bower_components/jquery/dist/jquery.min.js"></script>
<script type="text/javascript" src="/js/bower_components/raphael/raphael-min.js"></script>
<script type="text/javascript" src="/js/bower_components/iHAG/iHAG.js"></script>
```
Finally call the `drawHAG()` function beneth the script dependencies with a specific javascript object format:
```html
<script type="text/javascript">
  $(document).ready(function(){
    var json = [
      [
        {
          link: [
            "1"
          ],
          name: "Box A",
          id: "1"
        }
      ],
      [
        {
          link: [
            "1"
          ],
          name: "Box 1B",
          id: "2"
        },
        {
          link: [
            "1"
          ],
          name: "Box 2B",
          id: "3"
        },
      ],
      [
        {
          link: [
            "2",
            "3"
          ],
          name: "Box C",
          id: "4"
        }
      ],
      [
        {
          link: [
            "4"
          ],
          name: "Box 1D",
          id: "5"
        },
        {
          link: [
            "4"
          ],
          name: "Box 2D",
          id: "6"
        }
      ]
    ];
    drawHAG(json, {
      containerID: 'YOUR-CHOICE-OF-ID',
      targetSubjectID: 6  //choose a subject node ID
    });
  });
</script>
```
The object (`json` in the example above) that is passed to the drawHAG() function should be an array that contains an array for each
level/column in the graph. The "column" arrays hold objects that represents the nodes/boxes that are in the column. The objects contain
the following:

`name` = The node label.

`id` = A unique numerical ID that represents the node.

`link` = An array of node IDs to which the current node should link to (create an edge) in the previous column.

The node objects that would appear in the first column must have their node ID within the `link` array as though they link to themselves. The following javascript data structure produces the image of the graph below:
```javascript
var json = [
  [
    {
      link: [
        "1"
      ],
      name: "Box 1A",
      id: "1"
    },
    {
      link: [
        "10"
      ],
      name: "Box 2A",
      id: "10"
    }
  ],
  [
    {
      link: [
        "1",
        "10"
      ],
      name: "Box 1B",
      id: "2"
    },
    {
      link: [
        "1"
      ],
      name: "Box 2B",
      id: "3"
    },
  ],
  [
    {
      link: [
        "2",
        "3"
      ],
      name: "Box C",
      id: "4"
    }
  ],
  [
    {
      link: [
        "4"
      ],
      name: "Box 1D",
      id: "5"
    },
    {
      link: [
        "4"
      ],
      name: "Box 2D",
      id: "6"
    }
  ]
];
```
![iHAG example](https://cloud.githubusercontent.com/assets/9589542/11692076/c3be13fe-9e95-11e5-94df-5a36294cb499.png)

## drawHAG settings
Many of the settings of iHAG have defaults but these defaults can be changed to give the graph your own look and feel:
- **titleColor**: The hex code colour of the title in the graph. Default = "#444"
- **titleText**: The graph title. Default = "Horizontal acyclic graph"
- **titleFontFamily**: Fon families to use. Default = "Tahoma,Verdana,Arial,Helvetica,sans-serif"
- **titleFontSize**: Font size. Default = "20"
- **titlePosX**: Horizontal pixel position to start the title. Default = "10"
- **titlePosY**: Vertical pixel position to start the title. Default = "12"
- **lineColor**: The hex code colour for the connections/edges, Default = "#444"
- **highlightColor**: The hex code colour for highlighting the path through the graph when a node is selected. Default = "#B40000"
- **subjectRectFillColor**: The hex code for the background colour of the subject node. Default = "#444"
- **subjectRectStrokeColor**: Hex code for the border colour of the subject node. Default = "#444"
- **subjectTextColor**: Hex code for the colour of the text within the subject node. Default = "#000"
- **subjectActiveOpacity**: Opacity of the subject node background when selected. Default = 1
- **subjectNormOpacity**: Opacity of the subject node background. Default = .25
- **defaultRectFillColor**: The hex code for the background colour of the nodes. Default = "#444"
- **defaultRectStrokeColor**: Hex code for the border colour of the nodes. Default = "#444"
- **defaultTextColor**: Hex code for the colour of the text within the nodes. Default = "#FFF"
- **defaultActiveOpacity**: Opacity of the node background when selected. Default = .25
- **defaultNormOpacity**: Opacity of the node backgrounds. Default = 1
- **minPaperX**: Minium number of pixels for the width of the graph. Default = 924
- **minPaperY**: Minium number of pixels for the height of the graph. Default = 1
- **layout**: The graph can either be centred ('centric') or the graph can start drawing the graph from the top left corner ('topOrientated'). Default = 'centric'
- **targetSubjectID**: The ID of the subject node to highlight. Default = 0
- **containerID**: The div container ID. Default = 'hag'
- **paperColor**: Background colour of the graph. Default = '#F1F4F7'
