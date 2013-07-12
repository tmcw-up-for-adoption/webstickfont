var fs = require('fs'),
    cheerio = require('cheerio');

var svgStr = fs.readFileSync('1CamBam_Stick_1.svg', 'utf8');

$ = cheerio.load(svgStr);

function tokenize(x) {
    var pts = [], type, num = '', nums = [], segment = [];
    for (var i = 0; i < x.length; i++) {
      if (x[i].match(/[A-Za-z]/)) {
        nums.push(num);
        if (x[i].toLowerCase() == 'z') {
            segment.push(segment[0]);
            pts.push(segment);
            segment = [];
        } else if (type) {
            segment.push([type, nums.map(floatit)]);
        }
        type = x[i];
        nums = [];
        num = '';
      } else if (x[i] == ' ') {
        nums.push(num);
        num = '';
      } else {
        num += x[i];
      }
    }
    pts.push(segment);
    return pts;
}

function floatit(n) {
  return parseFloat(n);
}

function relative(a, b) {
    return [
        a[0] + b[0],
        a[1] + b[1],
    ];
}

function resolve(t) {
    var pts = [];
    for (var i = 0; i < t.length; i++) {
        var seg = [], last;
        if (t[i][0]) {
            last = t[i][0][1];
        }
        for (var j = 0; j < t[i].length; j++) {
            var rel;
            if (t[i][j][0] == 'M') {
                seg.push(t[i][j][1]);
                last = t[i][j][1];
            } else if (t[i][j][0] == 'q') {
                rel = relative(last, [t[i][j][1][2], t[i][j][1][3]]);
                seg.push(rel);
                last = rel;
            } else if (t[i][j][0] == 't') {
                rel = relative(last, [t[i][j][1][0], t[i][j][1][1]]);
                seg.push(rel);
                last = rel;
            } else if (t[i][j][0] == 'l') {
                rel = relative(last, [t[i][j][1][0], t[i][j][1][1]]);
                seg.push(rel);
                last = rel;
            } else if (t[i][j][0] == 'v') {
                // rel = relative(last, [last[0], t[i][j][1][0]]);
                rel = relative(last, [0, t[i][j][1][0]]);
                seg.push(rel);
                last = rel;
            } else if (t[i][j][0] == 'h') {
                // rel = relative(last, [t[i][j][1][0], last[1]]);
                rel = relative(last, [t[i][j][1][0], 0]);
                seg.push(rel);
                last = rel;
            }
        }
        pts.push(seg);
    }
    return pts;
}

var fonts = [];
$('glyph').each(function(i, elem) {
    var name = $(elem).attr('glyph-name');
    var data = $(elem).attr('d');
    if (!data) return;
    var tokens = tokenize(data);
    fonts.push({
        name: name,
        data: resolve(tokens)
    });
});

fs.writeFileSync('font.json', JSON.stringify(fonts));
