/*
  Dataset SDK
*/

// Modifiers
var append = require('./modifiers/append'),
    del = require('./modifiers/delete'),
    filter = require('./modifiers/filter'),
    insert = require('./modifiers/insert'),
    select = require('./modifiers/select'),
    sort   = require('./modifiers/sort'),
    update = require('./modifiers/update');

// Utils
var analyses = require('./utils/analyses'),
    extend = require('../utils/extend'),
    parsers = require('./utils/parsers');

// Constructor
function Dataset(){
  this.matrix = [
    ['Index']
  ];
}

Dataset.prototype.data = function(arr){
  if (!arguments.length) return this.matrix;
  this.matrix = (arr instanceof Array ? arr : null);
  return this;
};

Dataset.prototype.set = function(coords, value){
  if (arguments.length < 2 || coords.length < 2) {
    throw Error('Incorrect arguments provided for #set method');
  }

  var colIndex = 'number' === typeof coords[0] ? coords[0] : this.matrix[0].indexOf(coords[0]),
      rowIndex = 'number' === typeof coords[1] ? coords[1] : select.selectColumn.call(this, 0).indexOf(coords[1]);

  var colResult = select.selectColumn.call(this, coords[0]),
      rowResult = select.selectRow.call(this, coords[1]);

  // Column doesn't exist, create and reset colIndex
  if (colResult.length < 1) {
    append.appendColumn.call(this, coords[0]);
    colIndex = this.matrix[0].length - 1;
  }

  // Row doesn't exist, create and reset rowIndex
  if (rowResult.length < 1) {
    append.appendRow.call(this, coords[1]);
    rowIndex = this.matrix.length - 1;
  }

  // Set provided value
  this.matrix[ rowIndex ][ colIndex ] = value;
  return this;
}

extend(Dataset.prototype, append);
extend(Dataset.prototype, del);
extend(Dataset.prototype, filter);
extend(Dataset.prototype, insert);
extend(Dataset.prototype, select);
extend(Dataset.prototype, sort);
extend(Dataset.prototype, update);

extend(Dataset.prototype, analyses);
Dataset.parser = parsers(Dataset);

module.exports = Dataset;