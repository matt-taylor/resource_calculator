function setExpectedJobConcurrencyCount(val_in_seconds){
  multiplier = incrementToSecond(`.resource-concurrency-container #resource-concurrency-select`)
  $(`.resource-concurrency-container #resource-concurrency-count`).val(val_in_seconds * multiplier)
}

function setParallelCount(value){
  $(`.parallel-container #parallel-count-number`).val(value)
}

function setConcurrencyCount(value){
  $(`.concurrency-container #concurrency-count`).val(value)
}

function setWorkingThread(value){
  $(`.static-fields .working-threads .card-body h2`).text(value)
}

function setCapacity(value){
  set = $(`.resource-type #resource-type-selector`).val()
  $(`.static-fields .capacity .card-body .second`).text(`${roundby(value, 3)} ${set}/second`)
  $(`.static-fields .capacity .card-body .minute`).text(`${roundby((value*60),3)} ${set}/minute`)
  $(`.static-fields .capacity .card-body .hour`).text(`${roundby((value*60*60),3)} ${set}/hour`)
}

function setConcurrencyTotal(value){
  set = $(`.resource-type #resource-type-selector`).val()
  $(`.static-fields .concurrency .card-body .second`).text(`${roundby(value, 3)} ${set}/second`)
  $(`.static-fields .concurrency .card-body .minute`).text(`${roundby((value*60),3)} ${set}/minute`)
  $(`.static-fields .concurrency .card-body .hour`).text(`${roundby((value*60*60),3)} ${set}/hour`)
}

function setTldr(value){
  $(`.static-fields .tldr .card-body`).text(value)
}
