$(function() {

  originalObject = assignObject(); // Store initial reading for the original object -- used to calculate changes
  nonRequiredSetReadProp(); // Initialize state for tooltips

  $.each(defaultCapacity, function(key, value) {
    val = value.long || value.short
    if(value.default == true){
      $(`#resource-type-selector`).append($("<option></option>")
       .attr("value", key).attr("selected", true).text(val));
    } else {
      $(`#resource-type-selector`).append($("<option></option>")
       .attr("value", key).text(val));
    }
    __capacity = value.capacity * 100
    __overhead = (__capacity == 100) ? "no overhead" : `${100 - __capacity}% overhead`
    $(`#default-capacity-list`).append($("<li></li>").text(`${value.long} default capacity is ${__capacity}% leaving ${__overhead}`))
  });

  setDefaultCapacity(resourceType().capacity)
  setDefaultSkew(resourceType().skew)
  $(`.request-type-long`).text(resourceType().long)
  $(`.request-type`).text(resourceType().short)


  console.log("Loaded document ready")
});
var originalObject = null
var calculatorInstance = undefined; // Initialize a top level variable for the calculator
var highlightAnimationLong = 1500
var highlightAnimationShort = 1500
var defaultCapacity = {
  requests: { long: "HTTP Request", short: "reqs", skew: 0.00, capacity: 0.85, default: true },
  sidekiq: { long: "Sidekiq", short: "jobs", skew: 0.05, capacity: 1.0, default: false },
  hawker: { long: "Hawker", short: "msgs", skew: 0.05, capacity: 1.0, default: false },
}

function incrementToSecond(str){
  value = $(`${str}`).val()
  switch(value) {
    case "ms":
      return 0.001
    case "s":
      return 1
    case "m":
      return 60
    case "h":
      return (60 * 60)
    default:
      return 1
  }
}

function prettifyNumber(value) {
  return value.toLocaleString("en-US")
}

function resourceType() {
  return defaultCapacity[getResource()]
}

function changeResourceType() {
  setDefaultCapacity(resourceType().capacity)
  setDefaultSkew(resourceType().skew)

  $(`.request-type`).text(resourceType().short)
  $(`.request-type-long`).text(resourceType().long)

  $(`.request-type`).effect( "highlight", highlightAnimationLong)
  $(`.request-type-long`).effect( "highlight", highlightAnimationLong)
}

function requiredObject() {
  return {
    latency: getLatencyInSeconds(),
    threadSafe: getThreadSafety(),
    jobCount: getCountInSeconds(),
  }
}

function assignObject(){
  return {
    ...requiredObject(),
    jobConcurrency: getExpectedJobConcurrencyCount(),
    resourceConcurrency: getConcurrencyCount(),
    resourceParallel: getParallelCount(),
  }
}

function updateInstance(){
  calculatorInstance = new Calculator(getThreadSafety(), getCountInSeconds(), getLatencyInSeconds(), getDefaultConcurrency())
  nonRequiredSetReadProp();
}

function threadSafetiness(bool){
  if(bool){
    $(`.resource-count #concurrency-count`).prop("disabled", false)
    $(`.thread-safety-text`).hide()
  } else {
    original_val = $(`.resource-count #concurrency-count`).val()
    $(`.resource-count #concurrency-count`).val(1)
    $(`.resource-count #concurrency-count`).prop("disabled", true)
    $(`.thread-safety-text`).show()
  }
}

function updateCalculations(){
  missingCount = missingRequiredInputs()
  if(missingCount.length > 0){
    return missingCount
  }

  currentObject = assignObject();
  if(calculatorInstance == null){
    updateInstance()
  }
  result = calculatorInstance.change(originalObject, currentObject)
  commonUpdates(result)
  return []
}

function commonUpdates(result) {
  $(`.tldr-container`).show()
  $(`#update-alert`).stop(true, true).hide();

  setExpectedJobConcurrencyCount(result.jobConcurrency)
  setParallelCount(result.resourceParallel)
  setConcurrencyCount(result.resourceConcurrency)
  total_threads = result.resourceParallel * result.resourceConcurrency
  setConcurrencyTotal(total_threads * calculatorInstance.capacityPerSecond())
  setWorkingThread(total_threads)

  $(`.queue-size-container`).show()
  queue_expectation = queueExpectation(total_threads * calculatorInstance.capacityPerSecond(), calculatorInstance.input_count)
  setQueueSizeExpectation(queue_expectation)

  summary(queue_expectation, result)
  updateMetaTags()
  $(`.tldr-container .col-8`)
  originalObject = assignObject();
  alert = `Updated fields based on kingpin [${result.keyChange}]`
  $(`#update-alert`).text(alert)
  $(`#update-alert`).show().delay(2000).fadeOut(500)
}

function summary(queue_expectation, result) {
  object = {
    concurrencyPer: result.resourceConcurrency,
    parallelPer: result.resourceParallel,
    totalConcurrency: result.resourceParallel * result.resourceConcurrency,
    jobConcurrency: result.jobConcurrency,
    ingress: queue_expectation.ingress_rate,
    egress: queue_expectation.egress_rate,
    capacity: queue_expectation.current_capacity_rate,
    tldr: queue_expectation.tldr,
    tldr_color: queue_expectation.color,
    current_capacity_rate: queue_expectation.current_capacity_rate,
    capacity: queue_expectation.current_capacity_rate,
    default_capacity: queue_expectation.capacity_percent,
    needed_egress_rate: queue_expectation.needed_egress_rate
  }
  setTldr(object);
}

function nonRequiredSetReadProp(){
  missing = missingRequiredInputs()
  if(missing.length > 0){
    $(`.non-required-fields input`).prop('disabled', true);
    $('.non-required-fields select').prop('disabled', true);
    $(`.static-fields`).hide()
    $(`.queue-size-container`).hide()
    $(`.tldr-container`).hide()
    toggleTooltips(missing, true)
  } else {
    $(`.static-fields`).show()
    toggleTooltips([], false)
    $(`.non-required-fields input`).prop('disabled', false);
    $(`.non-required-fields select`).prop('disabled', false);
    setCapacity(calculatorInstance.capacityPerSecond())

    threads = 1
    if(getThreadSafety()){
      threads = getConcurrencyCount()
      threadSafetiness(true)
    } else {
      threadSafetiness(false)
    }
    setConcurrencyTotal(threads * getParallelCount() * calculatorInstance.capacityPerSecond())
  }
}

function roundby(val, round = 2) {
  return Math.round((val + Number.EPSILON) * (10**round)) / (10**round)
}

function toggleTooltips(missing, status){
  var tooltipList = configureTooltips(missing)
  if(status){
    tooltipList.map(function (tooltip) {
      tooltip.enable()
    })
  } else {
    tooltipList.map(function (tooltip) {
      tooltip.disable()
    })
  }
}

function configureTooltips(missing){
  var msg = `Please fill in all the required fields at the top before continuing.[${missing}]`
  $(`.non-required-fields .card-body`).attr("data-bs-toggle", "tooltip")
  $(`.non-required-fields .card-body`).attr("data-bs-title", msg)
  $(`.non-required-fields .card-body`).attr("data-bs-placement", `top`)

  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  return tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  })
}

function missingRequiredInputs(){
  temp = requiredObject()
  missing_keys = []
  Object.keys(temp).forEach(key => {
    if(temp[key] === undefined || temp[key] === null || isNaN(temp[key])){
      missing_keys.push(key);
    }
  });
  return missing_keys
}

function capacityCalculation(egress_rate, ingress_rate, skew = null, capacity) {
  capacity_percent = capacity || getDefaultCapacity();
  defaultSkewPercentage = skew || Math.abs(getDefaultSkew());
  additional_capacity_needed = (1 + (1 - capacity_percent));
  needed_egress_rate = ingress_rate * additional_capacity_needed;
  current_capacity_rate = egress_rate / needed_egress_rate

  within_skew = false
  within_skew_larger = false
  within_skew_smaller = false
  within_skew_perfect = false

  // Within the bounds of the defaultSkewPercentage
  if (Math.abs(1-current_capacity_rate) <= defaultSkewPercentage){
    within_skew = true
    lower_skew_bound = 1-defaultSkewPercentage
    upper_skew_bound = 1+defaultSkewPercentage
    if(1-current_capacity_rate == 0) { // Capacity is perfect with no margin of error
      within_skew_perfect = true
    } else if(1-current_capacity_rate > 0){ // Capacity is has no margin of error and under provisioned at times
      within_skew_smaller = true
    } else { // Capacity is has slight margin of error and over provisioned at times
      within_skew_larger = true
    }
  }

  return {
    current_capacity_rate: current_capacity_rate,
    needed_egress_rate: needed_egress_rate,
    skew: defaultSkewPercentage,
    within_skew: within_skew,
    within_skew_larger: within_skew_larger,
    within_skew_perfect: within_skew_perfect,
    within_skew_smaller: within_skew_smaller,
    capacity_percent: capacity_percent
  }
}

function queueExpectation(egress_rate, ingress_rate, resource_type = null, skew = null, capacity = null) {
  resource = resource_type || resourceType();
  console.log(`egress_rate: ${egress_rate} -- ingress_rate: ${ingress_rate} -- resource_type: ${resource_type} -- skew: ${skew}`)
  evaluation = capacityCalculation(egress_rate, ingress_rate, skew, capacity)
  egress_rate = roundby(egress_rate, 2)
  set = resource.short
  obj = { ...evaluation, set: set, egress_rate: egress_rate, ingress_rate: ingress_rate }

  skew_percentage = Math.abs(egress_rate-ingress_rate) / ingress_rate
  within_skew = defaultSkewPercentage >= skew_percentage

  // Within margin of error. This capacity fluttering around 100%
  if (evaluation.within_skew) {
    tldr = `Good news! This resource is within the provided skew [${roundby(defaultSkewPercentage * 100, 2)}%] of the calculated capacity.`
    msg = ""
    if(evaluation.within_skew_larger){
      msg += `The egress rate is fluttering just above the ingress rate. This can cause capacity issues during high latency ${set} or increased bursts of ingress ${set}.`
    } else if (evaluation.within_skew_perfect)  {
      msg += `The ingress rate matches the egress rate. This may not be sustainable and can cause capacity issues during high bursts or high latency for ${set}. `
    } else {
      msg += `The ingress rate is fluttering just above the egress rate. If sustained, ${set} will begin to backup. `
    }
    msg += `To provide addition capacity, increase the concurrency or parralelism.`
    return { ...obj, tldr: tldr, title: "Linear Flutter. Within Capacity bounds", info: msg, color: [255, 255, 0, 0.3] } // yellow
  }

  // This is outside the default skew. Should have plenty of capacity. Potentially over capacity
  if (egress_rate >= evaluation.needed_egress_rate) {
    tldr = "Good news! This resource is well provisioned"
    msg = `It is expected that the current settings can handle all ${set} without backing up. `
    msg += `Depending on how much capacity overhead is needed, this resource may be over provisioned`
    return { ...obj, tldr: tldr, title: "Linear Reduction. Sustainable Capacity", info: msg, color: [0, 255, 0, 0.3] } // green
  }

  tldr = "Yikes! This resource is under provisioned."
  msg = `The ingress ${set} will queue up faster than the resource can process them. `
  msg += `Please increase the concurrency or parralelism.`
  return { ...obj, tldr: tldr, title: "Linear Growth", info: msg, color: [255, 0, 0, 0.3] }
}
