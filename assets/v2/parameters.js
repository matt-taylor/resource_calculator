$(function() {
  attemptUsingUrlParams();
});

function copyURLToClipboard() {
  navigator.clipboard.writeText(createUrl());
}

function createUrl(){
  url = new URL(window.location.href);

  params = urlParameters()
  keys = Object.keys(params);
  keys.forEach((key, index) => {
     url.searchParams.set(key, params[key])
  });

  return url.href;
}

function attemptUsingUrlParams(){
  params = new URLSearchParams(window.location.search);
  if(!validateParameters(params)) {
    console.log(`Incoming parameters are inVALID`)
    return
  }

  setCountRate(params.get(`count`))
  setThreadSafe(params.get(`thread_safe`) ? "0" : "1")
  setLatency(parseFloat(params.get(`latency`)) * 1000 )
  setDefaultConcurrency(params.get(`default_concurrency`))

  setResource(params.get(`resource`)) //set resource first
  changeResourceType() // update all things onthe page to default types
  setDefaultCapacity(params.get(`capacity`)) // override default capacity with the parms
  setDefaultSkew(params.get(`skew`)) // override default skew with the parms

  updateInstance() // create base calculator for required fields

  object = assignObject()
  object.resourceConcurrency = parseInt(params.get(`concurrency`))
  object.resourceParallel = parseInt(params.get(`parallel`))
  result = calculatorInstance.primaryResourceBased(object)
  commonUpdates(result)
}

function updateMeta(){
  params = new URLSearchParams(window.location.search);
  if(!validateParameters(params)) {
    console.log(`Incoming parameters are inVALID not setting metadata`)
    return
  }
  thread_safe = params.get(`thread_safe`) ? "0" : "1"
  count = parseInt(params.get(`count`))
  latency_in_seconds = parseFloat(params.get(`latency`)) * 1000
  concurrency = params.get(`default_concurrency`)
  calculator = new Calculator(thread_safe, count, latency_in_seconds, concurrency)

  object = {
    resourceConcurrency: parseInt(params.get(`concurrency`)),
    resourceParallel: parseInt(params.get(`parallel`)),
  }
  result = calculator.primaryResourceBased(object)
  total_threads = result.resourceParallel * result.resourceConcurrency
  resource_type = defaultCapacity[params.get(`resource`)]
  ingress = calculator.input_count
  egress = total_threads * calculator.capacityPerSecond()
  capacity = parseFloat(params.get(`capacity`))
  skew = parseFloat(params.get(`skew`))
  queue_tldr = queueExpectation(egress * 1000, ingress, resource_type, skew, capacity)
  msg =`${queue_tldr.tldr}. Using ${object.resourceParallel} parrallel proceses running ${object.resourceConcurrency} concurrent threads each will yield ${total_threads} total threads. ${queue_tldr.info}`
  jQuery("meta[property='og\\:description']").attr(`content`, msg);
}


updateMeta(); // yes run this inline to modify the meta propertes

function validateParameters(params){
  keys = Object.keys(urlParameters());
  return_value = true
  keys.forEach((key, index) => {
    if(params.has(key)) {
      if(!validValue(params.get(key))){
        return_value = false
      }
    } else {
      return_value = false
    }
  });

  return return_value
}

function validValue(value) {
  if (value == "NaN" || value == "" || value == null) {
    return false
  }
  return true
}

function urlParameters(){
  return {
    count: getCountInSeconds(),
    latency: getLatencyInSeconds(),
    thread_safe: getThreadSafety(),
    parallel: getParallelCount(),
    concurrency: getConcurrencyCount(),
    resource: getResource(),
    skew: getDefaultSkew(),
    capacity: getDefaultCapacity(),
    default_concurrency: getDefaultConcurrency()
  }
}
