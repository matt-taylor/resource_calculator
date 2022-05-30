function setExpectedJobConcurrencyCount(val_in_seconds){
  multiplier = incrementToSecond(`.resource-concurrency-container #resource-concurrency-select`)
  $(`.resource-concurrency-container #resource-concurrency-count`).stop(true, true)
  $(`.resource-concurrency-container #resource-concurrency-count`).val(roundby(val_in_seconds * multiplier, 2))
  $(`.resource-concurrency-container #resource-concurrency-count`).effect( "highlight", highlightAnimationShort)

}

function setQueueSizeExpectation(object){
  console.dir(object)
  $(`.queue-size-container .card-title`).text(object.title)
  $(`.queue-size-container .ingress .rate`).text(`${prettifyNumber(object.ingress_rate)} per second`)
  $(`.queue-size-container .egress .rate`).text(`${prettifyNumber(object.egress_rate)} per second`)
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
  $(`.static-fields .tldr .card-body`).text(value)
}


///


function setDefaultCapacity(value) {
  $(`.default-capacity #default-capacity-count`).val(value)
}
