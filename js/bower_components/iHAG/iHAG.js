function tco(f) {// Flattens out recursion methods to save stack memory
  var value;
  var active = false;
  var accumulated = [];
  return function accumulator() {
    accumulated.push(arguments);
    if (!active) {
      active = true;
      while (accumulated.length) {
        value = f.apply(this, accumulated.shift());
      }
      active = false;
      return value;
    }
  }
}

Raphael.fn.createPath = function (obj1, obj2) {
  var bb1 = obj1.getBBox(),
      bb2 = obj2.getBBox(),
      p = [{x: bb1.x + bb1.width / 2, y: bb1.y - 1},
      {x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1},
      {x: bb1.x - 1, y: bb1.y + bb1.height / 2},
      {x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2},
      {x: bb2.x + bb2.width / 2, y: bb2.y - 1},
      {x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1},
      {x: bb2.x - 1, y: bb2.y + bb2.height / 2},
      {x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2}],
      d = {}, dis = [];
  for (var i = 0; i < 4; i++) {
    for (var j = 4; j < 8; j++) {
      var dx = Math.abs(p[i].x - p[j].x),
        dy = Math.abs(p[i].y - p[j].y);
      if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
        dis.push(dx + dy);
        d[dis[dis.length - 1]] = [i, j];
      }
    }
  }
  if (dis.length == 0) {
    var res = [0, 4];
  } else {
    res = d[Math.min.apply(Math, dis)];
  }
  var x1 = p[res[0]].x,
      y1 = p[res[0]].y,
      x4 = p[res[1]].x,
      y4 = p[res[1]].y;
  dx = Math.max(Math.abs(x1 - x4) / 2, 10);
  dy = Math.max(Math.abs(y1 - y4) / 2, 10);
  var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
      y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
      x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
      y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);
  var path = ["M", x1.toFixed(3), y1.toFixed(3), "C", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join(",");
  return path;
};

Raphael.fn.reconnection = function (connection, color) {
  var obj1 = connection.from,
      obj2 = connection.to;
  //Below is the Math for the path
  var path = this.createPath(obj1, obj2);
  connection.line.attr({path: path, stroke: color, fill: "none"});
};


Raphael.fn.connection = function (obj1, obj2, settings) {
  //Below is the Math for the path
  var path = this.createPath(obj1, obj2);
  return {
    line: this.path(path).attr({stroke: settings.lineColor, fill: "none"}).toBack(),
    from: obj1,
    to: obj2
  };
};

Raphael.fn.redrawPath = function (id, connections, color){
  var lines = [];
  var fromPath = tco(function(id, connections, lines){
    for(var i = 0; i < connections.length; ++i){
      if(id == connections[i].from.id){
        lines.push(connections[i]);
        fromPath(connections[i].to.id, connections, lines);
      }
    }
    return lines;
  });
  lines = fromPath(id, connections, lines);
  var toPath = tco(function(id, connections, lines){
    for(var i = 0; i < connections.length; ++i){
      if(id == connections[i].to.id){
        lines.push(connections[i]);
        toPath(connections[i].from.id, connections, lines);
      }
    }
    return lines;
  });
  lines = toPath(id, connections, lines);
  for (var i = lines.length; i--;) {
    this.reconnection(lines[i], color);
  }
};

function wrapString(string, wrap){
  var chars = string.split('');
  var newStr = '';
  var wrapCount = 0;
  $.each(chars, function(i, charact){
    if(wrapCount < wrap){
      newStr = newStr + charact;
      wrapCount++;
    }
    else if(wrapCount >= wrap && charact.match(/[\s-/]/)){
      if(charact == ' '){
        newStr = newStr + "\n";
      }
      else{
        newStr = newStr + charact + "\n";
      }
      wrapCount = 0;
    }
    else{
      newStr = newStr + charact;
      wrapCount++;
    }
  });
  return newStr;
};

function centric(levels, paperY) {
  for (var i = 0, ii = levels.length; i < ii; i++) {
    var y2 = levels[i][levels[i].length - 1].rec.getBBox().y2,
        y = levels[i][0].rec.getBBox().y,
        paperYCenter = paperY/2,
        yOffset = (paperYCenter - ((y2-y)/2))-y;
    $.each(levels[i],function(siblingNum, fam){
      fam.rec.attr({'y': fam.rec.attr().y + yOffset});
      fam.text.attr({'y': fam.text.attr().y + yOffset});
    });
  }
}

function drawHAG(json, settings) {
  settings = settings ? settings : {};
  var connections = [],
      levels = [],
      lastX = 0,
      totalastX = 0,
      totalY = 0;
  settings.titleColor             = settings.titleColor             ? settings.titleColor             : "#444";
  settings.titleText              = settings.titleText              ? settings.titleText              : "Horizontal acyclic graph";
  settings.titleFontFamily        = settings.titleFontFamily        ? settings.titleFontFamily        : "Tahoma,Verdana,Arial,Helvetica,sans-serif";
  settings.titleFontSize          = settings.titleFontSize          ? settings.titleFontSize          : "20";
  settings.titlePosX              = settings.titlePosX              ? settings.titlePosX              : "10";
  settings.titlePosY              = settings.titlePosY              ? settings.titlePosY              : "12";

  settings.lineColor              = settings.lineColor              ? settings.lineColor              : "#444";
  settings.highlightColor         = settings.highlightColor         ? settings.highlightColor         : "#B40000";
  settings.subjectRectFillColor   = settings.subjectRectFillColor   ? settings.subjectRectFillColor   : "#444";
  settings.subjectRectStrokeColor = settings.subjectRectStrokeColor ? settings.subjectRectStrokeColor : "#444";
  settings.subjectTextColor       = settings.subjectTextColor       ? settings.subjectTextColor       : "#000";
  settings.subjectActiveOpacity   = settings.subjectActiveOpacity   ? settings.subjectActiveOpacity   : 1;
  settings.subjectNormOpacity     = settings.subjectNormOpacity     ? settings.subjectNormOpacity     : .25;

  settings.defaultRectFillColor   = settings.defaultRectFillColor   ? settings.defaultRectFillColor   : "#444";
  settings.defaultRectStrokeColor = settings.defaultRectStrokeColor ? settings.defaultRectStrokeColor : "#444";
  settings.defaultTextColor       = settings.defaultTextColor       ? settings.defaultTextColor       : "#FFF";
  settings.defaultActiveOpacity   = settings.defaultActiveOpacity   ? settings.defaultActiveOpacity   : .25;
  settings.defaultNormOpacity     = settings.defaultNormOpacity     ? settings.defaultNormOpacity     : 1;

  settings.paperX                 = settings.minPaperX              ? settings.minPaperX              : 924;
  settings.paperY                 = settings.minPaperY              ? settings.minPaperY              : 1;
  settings.layout                 = settings.layout                 ? settings.layout                 : 'centric';//'topOrientated';
  settings.targetSubjectID        = settings.targetSubjectID        ? settings.targetSubjectID        : 0;
  settings.containerID            = settings.containerID            ? settings.containerID            : 'hag';
  settings.paperColor             = settings.paperColor             ? settings.paperColor             : '#F1F4F7';
  var r = Raphael(settings.containerID, settings.paperX, settings.paperY);
  r.canvas.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  r.canvas.style.backgroundColor = settings.paperColor;
  var title = r.text(settings.titlePosX, settings.titlePosY, settings.titleText).attr({
    "font-size":settings.titleFontSize,
    "font-family":settings.titleFontFamily,
    "font-weight":"800",
    "text-anchor":"start",
    "fill":settings.titleColor
  });

  var dragger = function () {
    // Original coords for main element
    r.forEach(function(el){
      if(el.type == 'rect'){
        var fillColor = el.id =='rec' + settings.targetSubjectID ? settings.subjectRectStrokeColor : settings.defaultRectStrokeColor;
        el.attr({"stroke": fillColor});
      }
    });
    var id = this.id;
    id = id.replace(/[a-z]+/i,"rec");
    settings.selectedID = id;
    this.ox = this.attr("x");
    this.oy = this.attr("y");
    var opacity = id == 'rec' + settings.targetSubjectID ? settings.subjectActiveOpacity : settings.defaultActiveOpacity;
    // Original coords for pair element
    this.pair.ox = this.pair.attr("x");
    this.pair.oy = this.pair.attr("y");
    if (this.type == "text"){
      this.pair.animate({"fill-opacity": opacity}, 500);
      this.pair.animate({"stroke": settings.highlightColor}, 500);
    }
    else if(this.type == "rect"){
      this.animate({"fill-opacity": opacity}, 500);
      this.animate({"stroke": settings.highlightColor}, 500);
    }
    r.redrawPath(id, connections, settings.highlightColor);
  };

  var move = function (dx, dy) {
    var id = this.id;
    id = id.replace(/[a-z]+/i,"rec");
    // Move main element
    var att = {x: this.ox + dx, y: this.oy + dy};
    this.attr(att);
    // Move paired element
    att = {x: this.pair.ox + dx, y: this.pair.oy + dy};
    this.pair.attr(att);
    r.redrawPath(id, connections, settings.highlightColor);
    r.safari();
  };

  var up = function () {
    var id = this.id;
    id = id.replace(/[a-z]+/i,"rec");
    var opacity = id == 'rec' + settings.targetSubjectID ? settings.subjectNormOpacity : settings.defaultNormOpacity;
    var stroke  = id == 'rec' + settings.targetSubjectID ? settings.subjectRectStrokeColor : settings.defaultRectStrokeColor;
    if (this.type == "text"){
      this.pair.animate({"fill-opacity": opacity}, 500);
      this.pair.animate({"stroke": stroke}, 500);
    }
    else if(this.type == "rect"){
      this.animate({"fill-opacity": opacity}, 500);
      this.animate({"stroke": stroke}, 500);
    }
    r.redrawPath(id, connections, settings.lineColor);
    r.safari();
  };

  $.each(json, function(levelNum, families) {
    //change width
    var x = lastX + 100,
        lastY = 0,
        level = [];
    if(levelNum == 0) x = 15;
    $.each(families,function(fam_num, family){
      var textColor   = settings.defaultTextColor,
          fillColor   = settings.defaultRectFillColor,
          strokeColor = settings.defaultRectStrokeColor
          fillOpacity = settings.defaultNormOpacity;
      if(settings.targetSubjectID == family.id){
        textColor   = settings.subjectTextColor;
        fillColor   = settings.subjectRectFillColor;
        strokeColor = settings.subjectRectStrokeColor;
        fillOpacity = settings.subjectNormOpacity;
      };
      //change height
      var y = lastY + 50;
      if(fam_num == 0) y = 50;
      var el = r.text(x, y, wrapString(family.name, 18)).attr({
        "font-size":"12",
        "font-family":"Luxi Sans,Helvetica,Arial,Geneva,sans-serif",
        "text-anchor":"start",
        "fill": textColor,
        "cursor": "move"
      }).drag(move, dragger, up);
      el.id = 'text'+family.id;
      el.node.id = 'text'+family.id;
      if(lastX < el.getBBox().x2){
        lastX = el.getBBox().x2;
      }
      if(lastY < el.getBBox().y2){
        lastY = el.getBBox().y2;
      }
      if( totalY < el.getBBox().y2 ){
        totalY = el.getBBox().y2
      };
      if( totalastX < el.getBBox().x2 ){
        totalastX = el.getBBox().x2;
      }
      var rec = r.rect(
        el.getBBox().x -2,
        el.getBBox().y -2.5,
        el.getBBox().width  +4,
        el.getBBox().height +5,
        2
      ).attr({
        "fill": fillColor,
        "stroke": strokeColor,
        "fill-opacity": fillOpacity,
        "stroke-width": 2,
        "cursor": "move"
      }).drag(move, dragger, up);
      rec.id = 'rec'+family.id;
      rec.node.id = 'rec'+family.id;
      rec.toBack();
      // Associate the elements
      rec.pair = el;
      el.pair = rec;
      level.push({"id":family.id, 'rec':rec, 'text':el});
    });
    levels.push(level);
  });

  if(totalastX+100 > settings.paperX){
    settings.paperX = totalastX+100;
  }
  if(totalY+100 > settings.paperY){
    settings.paperY = totalY+100;
  }
  
  r.setSize(settings.paperX, settings.paperY);
  
  if(settings.layout == 'centric') centric(levels, settings.paperY);

  $.each(json, function(level, families) {
    $.each(families,function(fam_num, family){
      $.each(family.link,function(linkIndex, link){
        if(link != family.id){
          connections.push(r.connection(r.getById('rec'+family.id), r.getById('rec'+link), settings));
        }
      });
    });
  });

  return levels;
};
