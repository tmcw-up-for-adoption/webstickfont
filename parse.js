var fs = require('fs'),
    cheerio = require('cheerio'),
    $ = cheerio.load(fs.readFileSync('1CamBam_Stick_1.svg', 'utf8'));
    fonts = {};

$('glyph').each(function(i, elem) {
    var data = $(elem).attr('d');
    if (!data) return;
    var tokens = tokenize(data);
    fonts[$(elem).attr('unicode')] = {
        name: $(elem).attr('glyph-name'),
        advx: parseFloat($(elem).attr('horiz-adv-x') || 400),
        unicode: $(elem).attr('unicode'),
        data: resolve(tokens)
    };
});

fs.writeFileSync('font.json', JSON.stringify(fonts, null, 4));

function tokenize(x) {
    var pts = [], type, num = '', nums = [], segment = [];
    for (var i = 0; i < x.length; i++) {
      if (x[i].match(/[A-Za-z]/)) {
        nums.push(num);
        if (type) {
            segment.push([type, nums.map(parseFloat)]);
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

function resolve(t) {
    var pts = [];
    for (var i = 0; i < t.length; i++) {
        var seg = [], last;
        if (t[i][0]) last = t[i][0][1];
        for (var j = 0; j < t[i].length; j++) {
            if (t[i][j][0] == 'M') {
                pts.push(seg);
                seg = [];
                seg.push(last = t[i][j][1]);
            } else if (t[i][j][0] == 'q') {
                seg.push(last = relative(last, [t[i][j][1][2], t[i][j][1][3]]));
            } else if (t[i][j][0] == 't') {
                seg.push(last = relative(last, [t[i][j][1][0], t[i][j][1][1]]));
            } else if (t[i][j][0] == 'l') {
                seg.push(last = relative(last, [t[i][j][1][0], t[i][j][1][1]]));
            } else if (t[i][j][0] == 'v') {
                seg.push(last = relative(last, [0, t[i][j][1][0]]));
            } else if (t[i][j][0] == 'h') {
                seg.push(last = relative(last, [t[i][j][1][0], 0]));
            } else if (t[i][j][0] == 'z') {
                seg.push(seg[0]);
            }
        }
        pts.push(seg);
    }
    return pts;
}

function relative(a, b) { return [a[0] + b[0], a[1] + b[1]]; }
