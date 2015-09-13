var current_board = [0,0,0,0,0,0,0,0,0]
var turn = true;
var finished = false;

window.onload = function () {
  update_console();
}

var run = function () {
  var next_boards = get_boards(current_board, turn);
  var evals = {};
  for (var index in next_boards) {
    var next_board = next_boards[index]
    var evaluation = evaluate(next_board, !turn)
    evals[next_board[9]] = evaluation;
  }

  update_console();
  colorize_squares(evals);
}

var draw = function (s) {
  if(!finished && current_board[s] === 0) {
    document.getElementById('s' + s).style.backgroundColor = turn? '#22718C':'#D9503C';
    document.getElementById('s' + s).style.borderColor = turn? '#22718C':'#D9503C';

    current_board[s] = turn? 1:-1;
    turn = !turn;
    finished = finished_game(current_board);

    run();
  }
}

var colorize_squares = function (evals) {
  if(!finished){
    for (var square in evals) {
      var color;
      if (evals[square] === 1)
        color = '#22718C';
      else if (evals[square] === -1)
        color = '#D9503C';
      else
        color = '#D9CAB8';
      document.getElementById('s' + square).style.borderColor = color;
    }
  } else {
    var status = get_status(current_board);
    for (var square in evals) {
      document.getElementById('s' + square).style.borderColor = (status > 0)? '#22718C':'#D9503C';
    }
  }
}

var update_console = function () {
  if(!finished){
    document.getElementById('board').style.borderColor = turn? '#22718C':'#D9503C';
    document.getElementById('new').style.backgroundColor = turn? '#22718C':'#D9503C';
  }
}

var evaluate = function (b, turn) {
  var status = get_status(b);
  if (status) {
    return status;
  } else if (full_board(b)){
    return 0;
  } else {
    var boards = get_boards(b,turn);
    var max = -2;
    var min = 2;
    for (var board in boards) {
      var val = evaluate(boards[board], !turn);
      max = Math.max(max,val);
      min = Math.min(min,val);
    }
    return turn? max:min;
  }
}

var get_boards = function (board, turn) {
  var boards = [];
  for (var b = 0; b < board.length; b++) {
    if (board[b] === 0) {
      var new_board = get_board_with_change(board, b, turn);
      new_board.push(b); //Info om last changed square
      boards.push(new_board)
    }
  }
  return boards;
}

var get_board_with_change = function (board, square, turn) {
  var new_board = [];
  for (var s = 0; s < board.length; s++) {
    new_board.push(board[s]);
  }
  new_board[square] = turn? 1:-1;

  return new_board;
}

var full_board = function (b) {
  for (var i = 0; i < b.length; i++) {
    if (b[i] === 0) return false;
  }
  return true;
}

var get_status = function (b) {
  var h1 = b[0] + b[1] + b[2]
  var h2 = b[3] + b[4] + b[5]
  var h3 = b[6] + b[7] + b[8]

  if (h1 == 3 || h2 === 3 || h3 === 3) return 1;
  if (h1 == -3 || h2 === -3 || h3 === -3) return -1;

  var v1 = b[0] + b[3] + b[6]
  var v2 = b[1] + b[4] + b[7]
  var v3 = b[2] + b[5] + b[8]

  if (v1 == 3 || v2 === 3 || v3 === 3) return 1;
  if (v1 == -3 || v2 === -3 || v3 === -3) return -1;

  var d1 = b[0] + b[4] + b[8]
  var d2 = b[2] + b[4] + b[6]

  if (d1 == 3 || d2 === 3) return 1;
  if (d1 == -3 || d2 === -3) return -1;

  return 0;
}

var finished_game = function (b) {
  if (full_board(b)) return true;
  if (get_status(b) !== 0) return true;
  return false;
}

var reset = function () {
  current_board = [0,0,0,0,0,0,0,0,0];
  turn = true;
  finished = false;

  var x = document.getElementsByClassName('square');
  for (var i = 0; i < x.length; i++) {
      x[i].style.backgroundColor = 'transparent';
      x[i].style.borderColor = '#D9CAB8';
  }

  update_console();
}
