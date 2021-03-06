// Generated by CoffeeScript 1.3.3
var addInsertOrRemove, diffArrays, moveLookAhead,
  __slice = [].slice;

module.exports = {
  diffArrays: function(before, after) {
    var current, inserts, items, moves, op, out, removes, _i, _j, _k, _len, _len1, _len2;
    out = [];
    current = before.slice();
    diffArrays(before, after, removes = [], moves = [], inserts = []);
    while (removes.length || moves.length || inserts.length) {
      out = out.concat(removes, moves, inserts);
      for (_i = 0, _len = removes.length; _i < _len; _i++) {
        op = removes[_i];
        current.splice(op[1], op[2]);
      }
      for (_j = 0, _len1 = moves.length; _j < _len1; _j++) {
        op = moves[_j];
        items = current.splice(op[1], op[3]);
        current.splice.apply(current, [op[2], 0].concat(__slice.call(items)));
      }
      for (_k = 0, _len2 = inserts.length; _k < _len2; _k++) {
        op = inserts[_k];
        current.splice.apply(current, [op[1], 0].concat(__slice.call(op.slice(2))));
      }
      diffArrays(current, after, removes = [], moves = [], inserts = []);
    }
    return out;
  }
};

diffArrays = function(before, after, removes, moves, inserts) {
  var a, afterLen, b, dir, end, from, fromBackward, fromForward, i, index, indexAfter, indexBefore, insert, itemAfter, itemBefore, j, move, moveFrom, num, numBackward, numForward, numInsert, numRemove, offset, op, otherItem, remove, skipA, skipB, to, toBackward, toForward, _i, _j, _k, _l, _len, _len1, _len2, _len3;
  afterLen = after.length;
  a = b = -1;
  skipA = {};
  skipB = {};
  while (a < afterLen) {
    while (skipA[++a]) {
      addInsertOrRemove(inserts, removes, after, insert, numInsert, remove, numRemove);
      insert = remove = null;
    }
    while (skipB[++b]) {
      addInsertOrRemove(inserts, removes, after, insert, numInsert, remove, numRemove);
      insert = remove = null;
    }
    itemAfter = after[a];
    itemBefore = before[b];
    if (itemAfter === itemBefore) {
      addInsertOrRemove(inserts, removes, after, insert, numInsert, remove, numRemove);
      insert = remove = null;
      continue;
    }
    indexAfter = before.indexOf(itemAfter, b);
    while (skipB[indexAfter]) {
      indexAfter = before.indexOf(itemAfter, indexAfter + 1);
    }
    if (a < afterLen && indexAfter === -1) {
      if (insert == null) {
        insert = a;
        numInsert = 0;
      }
      numInsert++;
      b--;
      continue;
    }
    indexBefore = after.indexOf(itemBefore, a);
    while (skipA[indexBefore]) {
      indexBefore = after.indexOf(itemBefore, indexBefore + 1);
    }
    if (indexBefore === -1) {
      if (remove == null) {
        remove = b;
        numRemove = 0;
      }
      numRemove++;
      a--;
      continue;
    }
    addInsertOrRemove(inserts, removes, after, insert, numInsert, remove, numRemove);
    insert = remove = null;
    fromBackward = indexAfter;
    toBackward = a;
    numBackward = moveLookAhead(before, after, skipA, skipB, afterLen, fromBackward, toBackward, itemBefore);
    fromForward = b;
    toForward = indexBefore;
    otherItem = numBackward === -1 ? NaN : itemAfter;
    numForward = moveLookAhead(before, after, skipA, skipB, afterLen, fromForward, toForward, otherItem);
    dir = numBackward === -1 ? dir = true : numForward === -1 ? dir = false : numForward < numBackward;
    if (dir) {
      from = fromForward;
      to = toForward;
      num = numForward;
      a--;
    } else {
      from = fromBackward;
      to = toBackward;
      num = numBackward;
      b--;
    }
    moves.push(['move', from, to, num]);
    end = from + num;
    while (from < end) {
      skipB[from++] = true;
      skipA[to++] = true;
    }
  }
  offset = 0;
  for (_i = 0, _len = removes.length; _i < _len; _i++) {
    op = removes[_i];
    index = op[1] += offset;
    num = op[2];
    offset -= num;
    for (_j = 0, _len1 = moves.length; _j < _len1; _j++) {
      move = moves[_j];
      if (index < move[1]) {
        move[1] -= num;
      }
    }
  }
  i = inserts.length;
  while (op = inserts[--i]) {
    num = op.length - 2;
    index = op[1];
    for (_k = 0, _len2 = moves.length; _k < _len2; _k++) {
      move = moves[_k];
      if (index <= move[2]) {
        move[2] -= num;
      }
    }
  }
  for (i = _l = 0, _len3 = moves.length; _l < _len3; i = ++_l) {
    op = moves[i];
    from = op[1];
    to = op[2];
    num = op[3];
    j = i;
    while (move = moves[++j]) {
      moveFrom = move[1];
      if (to < moveFrom && from < moveFrom) {
        continue;
      }
      move[1] = from < moveFrom ? moveFrom - num : moveFrom + num;
    }
  }
};

moveLookAhead = function(before, after, skipA, skipB, afterLen, b, a, otherItem) {
  var item, num;
  num = 1;
  if (skipB[b] || skipA[a]) {
    return -1;
  }
  while ((item = before[++b]) === after[++a] && a < afterLen) {
    if (item === otherItem || skipB[b] || skipA[a]) {
      return num;
    }
    num++;
  }
  return num;
};

addInsertOrRemove = function(inserts, removes, after, insert, numInsert, remove, numRemove) {
  if (insert != null) {
    inserts.push(['insert', insert].concat(__slice.call(after.slice(insert, insert + numInsert))));
  }
  if (remove != null) {
    removes.push(['remove', remove, numRemove]);
  }
};
