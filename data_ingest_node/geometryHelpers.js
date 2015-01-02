/**
* © 2014 CodeForOKC. All rights reserved.
* Author: Karl Kirch <karlkrch@gmail.com>
*/

module.exports = exports = {
  bboxToPoint: bboxToPoint
};

/**
 * Convert a bounding box to a point representing the center of the bounding box
 * @param bbox - the bounding box, array length 4 of points [x1, y1, x2, y2]
 * @returns array length 2 [x, y]
 */
function bboxToPoint(bbox) {
  var x1 = bbox[0],
      x2 = bbox[2],
      y1 = bbox[1],
      y2 = bbox[3];
  return [(x2 - x1) / 2 + x1, (y2 - y1) / 2 + y1];
}
