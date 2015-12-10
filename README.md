# hgnc-gene-family-mapper
## Introduction 
Draws an interactive horizontal acyclic graph that maps a hierarchy structure of a gene family stored within HGNC [genenames.org](http://www.genenames.org).

**For a live demo visit [http://hgnc.github.io/hgnc-gene-family-mapper](http://hgnc.github.io/hgnc-gene-family-mapper)**

## Install
To install iHAG the easiest way would be to install bower as described in the bower documentation and then simply run the following in your js directory:
```shell
$ bower install git://github.com/HGNC/hgnc-gene-family-mapper.git
```

## Dependencies
Javascript dependencies:
- [jQuery ~2.1.4](https://github.com/jquery/jquery)
- [Raphael ~2.1.4](https://github.com/DmitryBaranovskiy/raphael)
- [jquery.raphael.spinner](https://github.com/hunterae/jquery.raphael.spinner)
- [iHAG](https://github.com/HGNC/iHAG)

## Usage
Simply add a `<div id='YOUR-CHOICE-OF-ID' data-gf-id="GF ID"></div>` anywhere in your `<body>`.
Replace YOUR-CHOICE-OF-ID for a HTML ID of your choice and replace GF ID with a HGNC gene family ID. Then at the bottom of the `<body>` add your javascript dependencies:
```html
<script type="text/javascript" src="/js/bower_components/jquery/dist/jquery.min.js"></script>
<script type="text/javascript" src="/js/bower_components/raphael/raphael-min.js"></script>
<script type="text/javascript" src="/js/bower_components/jquery.raphael.spinner/jquery.raphael.spinner.js"></script>
<script type="text/javascript" src="/js/bower_components/qTip/jquery.qtip.min.js"></script>
<script type="text/javascript" src="/js/bower_components/iHAG/iHAG.js"></script>
<script type="text/javascript" src="/js/bower_components/hgnc-gene-family-mapper/hgnc-gene-family-mapper.js"></script>
```
Finally call the `drawGFMap('YOUR-CHOICE-OF-ID')` function beneth the script dependencies with a specific javascript object format:
```html
<script type="text/javascript">
  $(document).ready(function(){
    drawGFMap('YOUR-CHOICE-OF-ID', {
      titleColor: "#003366"
    });
  });
</script>
```
drawGFMap() has one required argument which is the id of the div to contain the map, and has one optional argument which is a settings object.

## drawGFMap settings
- **titleColor**: The hex code colour of the title in the map. Default = "#003366"
- **subjectNodeColor**: The hex code for the background colour of the subject node. Default = "#EF981B"
- **subjectNodeTextColor**: Hex code for the colour of the text within the subject node. Default = "#444"
- **defaultNodeColor**: The hex code for the background colour for nodes. Default = "#003366"
- **defaultNodeTextColor**: Hex code for the colour of the text within nodes. Default = "#FFF"
- **minWidth**: Minium number of pixels for the width of the map. Default = 924
- **minHeight**: Minium number of pixels for the height of the map. Default = 1
- **spinnerColor**: Hex code for the colour of the loading spinner. Default = "#003366"
- **qTipTextColor**: Hex code for the text within the tooltip. Default = "#003366"
- **qTipColor**: Hex code for the background of the tooltip. Default = "#F1F5F8"
- **fontFamily**: The font family for all the text within the map. Default = "Luxi Sans,Helvetica,Arial,Geneva,sans-serif"
