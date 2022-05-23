function getCountInSeconds() {
  count = parseInt($(`.count-container #counter-number`).val())
  divider = incrementToSecond(`.count-container #counter-increment`)
  return (count / divider)
}

function getLatencyInSeconds() {
  count = parseInt($(`.latency-container #latency-number`).val())
  divider = incrementToSecond(`.latency-container #latency-increment`)
  return (count * divider)
}

function getThreadSafety() {
  if($(`.thread-safe-container #thread-safe-bool`).val() == "0") {
    return true
  } else {
    return false
  }
}

function getExpectedSla(){
  count = parseInt($(`.sla-container #sla-resource-count`).val())
  divider = incrementToSecond(`.sla-container #sla-resource-select`)
  return (count * divider)
}

function getExpectedJobConcurrencyCount(){
  count = parseInt($(`.resource-concurrency-container #resource-concurrency-count`).val())
  divider = incrementToSecond(`.resource-concurrency-container #resource-concurrency-select`)
  return (count / divider)
}

function getParallelCount(){
  return parseInt($(`.parallel-container #parallel-count-number`).val())
}

function getConcurrencyCount(){
  return parseInt($(`.concurrency-container #concurrency-count`).val())
}
