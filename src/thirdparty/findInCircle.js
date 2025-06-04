// Copyright 2021-2023 Observable, Inc
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.

// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

// from https://observablehq.com/@d3/quadtree-findincircle

export function findInCircle(quadtree, x, y, radius, filter) {
  const result = [],
    radius2 = radius * radius,
    accept = filter
      ? d => filter(d) && result.push(d)
      : d => result.push(d);

  quadtree.visit(function(node, x1, y1, x2, y2) {
    if (node.length) {
      return x1 >= x + radius || y1 >= y + radius || x2 < x - radius || y2 < y - radius;
    }

    const dx = +quadtree._x.call(null, node.data) - x,
          dy = +quadtree._y.call(null, node.data) - y;
    if (dx * dx + dy * dy < radius2) {
      do { accept(node.data); } while (node = node.next);
    }
  });
  
  return result;
}
