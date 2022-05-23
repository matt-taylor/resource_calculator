var originalObject = assignObject(); // Store initial reading for the original object -- used to calculate changes
var calculatorInstance = undefined; // Initialize a top level variable for the calculator
nonRequiredSetReadProp(); // Initialize state for tooltips

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
    sla: getExpectedSla(),
    jobConcurrency: getExpectedJobConcurrencyCount(),
    resourceConcurrency: getConcurrencyCount(),
    resourceParallel: getParallelCount(),
  }
}

function updateInstance(){
  calculatorInstance = new Calculator(getThreadSafety(), getCountInSeconds(), getLatencyInSeconds())

  nonRequiredSetReadProp();
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
  $(`#update-alert`).stop( true, true ).hide();

  setExpectedJobConcurrencyCount(result.jobConcurrency)
  setParallelCount(result.resourceParallel)
  setConcurrencyCount(result.resourceConcurrency)
  total_threads = result.resourceParallel * result.resourceConcurrency
  setConcurrencyTotal(result.resourceConcurrency * total_threads * calculatorInstance.capacityPerSecond())
  setWorkingThread(total_threads)

  originalObject = assignObject();
  alert = `Updated fields based on kingpin [${result.keyChange}]`
  $(`#update-alert`).text(alert)
  $(`#update-alert`).show().delay(2000).fadeOut(500)
  return []
}

function nonRequiredSetReadProp(){
  missing = missingRequiredInputs()
  if(missing.length > 0){
    $(`.non-required-fields input`).prop('disabled', true);
    $('.non-required-fields select').prop('disabled', true);
    $(`.static-fields`).hide()
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
