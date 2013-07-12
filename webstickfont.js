function webstickfont() {

    var typeface = {},
        wrap = Infinity,
        size = 100;

     var space = {
         name: " ",
         advx: 800,
         unicode: " ",
         data: []
     };

    var x = d3.scale.linear()
        .domain([0, 500000])
        .range([0, 1]);

    var y = d3.scale.linear()
        .domain([0, 1000])
        .range([0, size]);

    var line = d3.svg.line()
        .x(function(d) { return x(d[0]); })
        .y(function(d) { return y(-d[1]); });

    function font(selection) {
        selection.each(function(d) {
            var sel = d3.select(this);
            var ratio = size / 1000;
            var letters = d.split('').map(function(l) {
                return {
                    letter: typeface[l] || space,
                    offset: 0
                };
            });

            var width = letters.reduce(function(memo, l) {
                l.y = 0;
                return l.letter.advx + memo;
            }, 0);

            var linenum = 0, offset = 0;
            letters.forEach(function(l) {
                if ((offset + l.letter.advx) > wrap / ratio) {
                    ++linenum;
                    offset = 0;
                }
                l.line = linenum;
                l.offset = offset;
                offset += l.letter.advx;
            });

            x.range([0, 40000]);

            var g = sel.selectAll('g')
                .data(letters, function(d, i) {
                    return i;
                });

            g.exit().remove();

            g.enter()
                .append('g');

            g.attr('transform', function(d) {
                return 'translate(' + [d.offset * ratio, (d.line * 100) + 100] + ')';
            });

            var path = g.selectAll('path')
                .data(function(d) {
                    return d.letter.data;
                });

            path.enter().append('path');
            path.exit().remove();

            path
                .transition()
                .attr('d', line);
        });
    }

    font.interpolate = function(_) {
        if (!arguments.length) return line.interpolate();
        line.interpolate(_);
        return font;
    };

    font.wrap = function(_) {
        if (!arguments.length) return wrap;
        wrap = _;
        return font;
    };

    font.typeface = function(_) {
        if (!arguments.length) return typeface;
        typeface = _;
        return font;
    };

    font.size = function(_) {
        if (!arguments.length) return size;
        size = _;
        y.range([0, size]);
        return font;
    };

    return font;
}
