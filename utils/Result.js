class Result {
  constructor(status = false, errors = [], value = {}) {
    this.status = status;
    this.errors = errors;
    this.value = value;
  }
}

module.exports = Result;
