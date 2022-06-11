// Assign original object on changes to the requried fields
$(`.required-fields input`).change(function(elem) {
  updateInstance();
});

$(`.settings input`).change(function(elem) {
  updateInstance();
});

$(`.required-fields select`).change(function(elem) {
  updateInstance();
});

$(`.non-required-fields input`).change(function(elem) {
  updateCalculations();
});

$(`.non-required-fields select`).change(function(elem) {
  updateCalculations();
});

$(`.resource-type #resource-type-selector`).change(function(elem) {
  changeResourceType()
});

$(`#share-link-modal`).on('show.bs.modal',function (e) {
  href = createUrl()
  setShareLink(href)
});
