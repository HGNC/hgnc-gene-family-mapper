jQuery.browser = {};
(function () {
  jQuery.browser.msie = false;
  jQuery.browser.version = 0;
  if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
    jQuery.browser.msie = true;
    jQuery.browser.version = RegExp.$1;
  }
})();

function drawGFMap(id, settings){
  settings                      = settings                      ? settings                      : {};
  settings.titleColor           = settings.titleColor           ? settings.titleColor           : "#003366";
  settings.subjectNodeColor     = settings.subjectNodeColor     ? settings.subjectNodeColor     : "#EF981B";
  settings.subjectNodeTextColor = settings.subjectNodeTextColor ? settings.subjectNodeTextColor : "#444";
  settings.defaultNodeColor     = settings.defaultNodeColor     ? settings.defaultNodeColor     : "#003366";
  settings.defaultNodeTextColor = settings.defaultNodeTextColor ? settings.defaultNodeTextColor : "#FFF";
  settings.minWidth             = settings.minWidth             ? settings.minWidth             : 924;
  settings.minHeight            = settings.minHeight            ? settings.minHeight            : 1;
  settings.spinnerColor         = settings.spinnerColor         ? settings.spinnerColor         : '#003366';
  settings.qTipTextColor        = settings.qTipTextColor        ? settings.qTipTextColor        : "#003366";
  settings.qTipColor            = settings.qTipColor            ? settings.qTipColor            : "#F1F5F8";
  settings.fontFamily           = settings.fontFamily           ? settings.fontFamily           : 'Luxi Sans,Helvetica,Arial,Geneva,sans-serif';

  $('<div>').attr({id: id+'-setmap-spinner'}).css({margin: '0 auto', width: '10%'}).appendTo($('div#'+id));
  $("#"+id+"-setmap-spinner").spinner({dashes: 120, innerRadius: 10, outerRadius: 15, color: settings.spinnerColor});

  $.fn.qtip.styles.hgnc = {
    'font-size': '100%',
    padding: 5,
    width: 'auto',
    color: settings.qTipTextColor,
    border: {
      width: 1,
      radius: 2,
      color: settings.qTipTextColor
    },
    tip: {
      corner: 'topMiddle',
      size: {
        x: 12,
        y: 8,
      }
    },
  };

  var setID = $('div#'+id).attr('data-gf-id');
  
  var jqxhr = $.getJSON( "https://www.genenames.org/cgi-bin/genegroup/connections?id=" + setID, function(json) {
    var levels = drawHAG(json, {
      titleColor             : settings.titleColor,
      titleText              : "Gene family hierarchy map",
      titleFontFamily        : settings.fontFamily,
      titleFontSize          : "19.2",
      lineColor              : "#444",
      highlightColor         : "#B40000",
      subjectRectFillColor   : settings.subjectNodeColor,
      subjectRectStrokeColor : settings.subjectNodeColor,
      subjectTextColor       : settings.subjectNodeTextColor,
      subjectActiveOpacity   : .25,
      subjectNormOpacity     : 1,
      defaultRectFillColor   : settings.defaultNodeColor,
      defaultRectStrokeColor : settings.defaultNodeColor,
      defaultTextColor       : settings.defaultNodeTextColor,
      defaultActiveOpacity   : .25,
      defaultNormOpacity     : 1,
      minPaperX              : settings.minWidth,
      minPaperY              : settings.minHeight,
      layout                 : 'centric',
      targetSubjectID        : setID,
      containerID            : id
    });
    $.each(levels, function(levelNum, level){
      $.each(level, function(famNum, fam){
        var qTipSettings = {
          content: '<div style="margin-top:5px"><a href="https://www.genenames.org/data/genegroup/#!/group/'+fam.id+'" style="color:#003366;">View gene family at HGNC</a></div>',
          show: {when: {event: 'mouseover'}},
          hide: { when: {event: 'mouseout'}, fixed: true, delay: 1000 },
          style: {
            fontFamily: settings.fontFamily,
            fontSize: 14,
            width: 185,
            padding: 5,
            background: settings.qTipColor,
            color: settings.qTipTextColor,
            textAlign: "left",
            border: {
              radius: 3,
              color: settings.qTipTextColor
            },
            tip: "bottomLeft",
          },
          position: {
             corner: {
                target: 'topMiddle',
                tooltip: 'bottomLeft'
             }
          }
        }
        $('#text'+fam.id ).qtip(qTipSettings);
      });
    });
    $('div#'+id+'-setmap-spinner').remove();
  });
  
}
