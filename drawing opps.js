
// function to make a gradient what start and end objects
function makeGradient (start, end) {
  let grad = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
  return grad;
};