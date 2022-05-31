function setExpectedJobConcurrencyCount(val_in_seconds){
  multiplier = incrementToSecond(`.resource-concurrency-container #resource-concurrency-select`)
  $(`.resource-concurrency-container #resource-concurrency-count`).stop(true, true)
  $(`.resource-concurrency-container #resource-concurrency-count`).val(roundby(val_in_seconds * multiplier, 2))
  $(`.resource-concurrency-container #resource-concurrency-count`).effect( "highlight", highlightAnimationShort)
}

function setQueueSizeExpectation(object){
  $(`.queue-size-container .card-title`).text(object.title)
  $(`.queue-size-container .ingress .rate`).text(`${prettifyNumber(object.ingress_rate)} ${object.set} per second`)
  $(`.queue-size-container .egress .rate`).text(`${prettifyNumber(object.egress_rate)} ${object.set} per second`)
  $(`.queue-size-container .message`).text(object.info)
  $(`.queue-size-container .tldr`).text(object.tldr)
  $(`.queue-size-container .card-body`).css("background", `rgb(${object.color.join(",")})`)

  $(`.queue-size-container .capacity .percent`).text(`${roundby(object.current_capacity_rate * 100, 2)}%`)
  $(`.queue-size-container .capacity .capacity-min-egress`).text(prettifyNumber(roundby(object.needed_egress_rate, 2)))
  $(`.queue-size-container .capacity .capacity-status`).text(object.capacity_satisfied)
  $(`.queue-size-container .capacity .ingress`).text(object.ingress_based_on_capacity)
}

function setParallelCount(value){
  $(`.parallel-container #parallel-count-number`).stop(true, true)
  $(`.parallel-container #parallel-count-number`).val(value)
  $(`.parallel-container #parallel-count-number`).effect( "highlight", highlightAnimationShort)
}

function setConcurrencyCount(value){
  $(`.concurrency-container #concurrency-count`).stop(true, true)
  $(`.concurrency-container #concurrency-count`).val(value)
  $(`.concurrency-container #concurrency-count`).effect( "highlight", highlightAnimationShort)
}

function setWorkingThread(value){
  $(`.static-fields .working-threads .card-body h2`).text(prettifyNumber(value))
}

function setCapacity(value){
  set = resourceType().short

  second = prettifyNumber(roundby(value, 2))
  $(`.static-fields .capacity .card-body .second`).text(`${second} ${set}/second`)

  minute = prettifyNumber(roundby((value*60)))
  $(`.static-fields .capacity .card-body .minute`).text(`${minute} ${set}/minute`)

  hour = prettifyNumber(roundby((value*60*60)))
  $(`.static-fields .capacity .card-body .hour`).text(`${hour} ${set}/hour`)
}

function setConcurrencyTotal(value){
  set = resourceType().short

  second = prettifyNumber(roundby(value, 2))
  $(`.static-fields .concurrency .card-body .second`).text(`${second} ${set}/second`)

  minute = prettifyNumber(roundby((value*60)))
  $(`.static-fields .concurrency .card-body .minute`).text(`${minute} ${set}/minute`)

  hour = prettifyNumber(roundby((value*60*60)))
  $(`.static-fields .concurrency .card-body .hour`).text(`${hour} ${set}/hour`)
}

function setTldr(value){
  $(`.tldr-container .card-body .col-8`).css("background", `rgb(${value.tldr_color.join(",")})`)

  $(`.tldr-container .card-body .tldr`).text(value.tldr)
  $(`.tldr-container .card-body .parallel`).text(value.parallelPer)
  $(`.tldr-container .card-body .concurrency`).text(value.concurrencyPer)
  $(`.tldr-container .card-body .total-treads`).text(value.totalConcurrency)

  $(`.tldr-container .card-body .ingress-rate`).text(prettifyNumber(value.ingress))
  $(`.tldr-container .card-body .egress-rate`).text(prettifyNumber(value.egress))

  $(`.tldr-container .card-body .capacity-min-egress`).text(prettifyNumber(roundby(value.needed_egress_rate, 2)))
  $(`.tldr-container .card-body .capacity`).text(roundby(value.default_capacity * 100, 2))
  $(`.tldr-container .card-body .percent`).text(`${roundby(value.current_capacity_rate * 100, 2)}%`)
}


function setShareLink(href){
  $(`#share-link-modal .click_me`).attr(`href`, href)
  $(`#share-link-modal .raw-link .click_me`).text(href)
}

function setDefaultConcurrency(value){
  $(`.default-concurrency #default-concurrency-count`).val(value)
}

function setThreadSafe(value){
  $(`.thread-safe-container #thread-safe-bool`).val()
}

function setResource(value){
  $(`.resource-type #resource-type-selector`).val(value)
}

function setCountRate(value) {
  $(`.count-container #counter-number`).val(value)
}

function setLatency(value) {
  $(`.latency-container #latency-number`).val(value)
}

function setDefaultCapacity(value) {
  $(`.default-capacity #default-capacity-count`).val(value)
}

function setDefaultSkew(value) {
  $(`.default-skew #default-skew-count`).val(value)
}
