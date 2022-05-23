// Assign original object on changes to the requried fields
$(`.required-fields input`).change(function(elem) {
  console.log(`selected: [${$(elem.target).attr('id')}]`)
  updateInstance();
});

$(`.required-fields select`).change(function(elem) {
  console.log(`selected: [${$(elem.target).attr('id')}]`)
  updateInstance();
});

$(`.non-required-fields input`).change(function(elem) {
  console.log(`selected: [${$(elem.target).attr('id')}]`)
  updateCalculations();
});

$(`.non-required-fields select`).change(function(elem) {
  console.log(`selected: [${$(elem.target).attr('id')}]`)
  updateCalculations();
});

