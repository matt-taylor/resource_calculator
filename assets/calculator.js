class Calculator {
  constructor(thread_safe, input_count, latency, threads){
    this.thread_safe = thread_safe; // boolean if the jobs are thread safe
    this.input_count = input_count; //expected count of jobs per second
    this.latency = latency; // p95 for a job in seconds
    this.constraint_threads = threads; // Max threads and process can have
  }

  capacityPerSecond(){
    return (1 / this.latency)
  }

  change(original, current){
    var change = this.key_change(original, current)
    switch(change){
      case "resourceParallel": // resourceParallel and resourceConcurrency use the same base
      case "resourceConcurrency":
        return this.primaryResourceBased(current);
      case "jobConcurrency":
        return this.primaryJobConcurrency(current)
      default:
        return null
    }
  }

  primaryJobConcurrency(object){
    // take floor since we cant have more than concurrency rate -- less than is okay
    var total_threads_needed = Math.floor(this.latency * object.jobConcurrency)
    var threads = 1
    var processes = 1
    var extra_concurrency = 0
    if(this.thread_safe){
      var value = this.decipher_resources(total_threads_needed)
      threads = value.concurrency
      processes = Math.max(value.parallel, 1) // process must be at least 1
      extra_concurrency = value.extra_concurrency
    } else {
      threads = 1
      processes = total_threads_needed
    }
    return this.returnObject(total_threads_needed, processes, threads, object.jobConcurrency, extra_concurrency, "Job Concurrency")
  }

  primaryResourceBased(object){
    var jobConcurrency = this.jobs_per_second(object)
    return this.returnObject(this.totalThreadsNeeded(jobConcurrency), object.resourceParallel, object.resourceConcurrency, jobConcurrency, 0, "Resource Based")
  }

  totalThreadsNeeded(job_concurrency){
    // need at least 1 thread
    return Math.max(Math.floor(this.latency * job_concurrency), 1)
  }

  returnObject(optimal_threads, parallel, concurrency, job_concurrency, extra_concurrency = 0, change = null){
    return {
      capacityPerSecond: this.capacityPerSecond(),
      extra_concurrency: extra_concurrency,
      jobConcurrency: job_concurrency,
      optimalThreads: optimal_threads,
      resourceConcurrency: concurrency,
      resourceParallel: parallel,
      keyChange: change,
    }
  }

  decipher_resources(total_threads_needed){
    var extra_concurrency = 0
    var concurrency = this.constraint_threads
    var parallel = Math.floor(total_threads_needed / this.constraint_threads)
    if(total_threads_needed > this.constraint_threads){
      extra_concurrency = this.constraint_threads - (total_threads_needed % this.constraint_threads)
    } else {
      concurrency = 1
    }
    return { extra_concurrency: extra_concurrency, concurrency: concurrency, parallel: parallel}
  }

  jobs_per_second(object){
    var capacity = this.capacityPerSecond()
    var total_threads = object.resourceParallel
    if (this.thread_safe == true) {
      total_threads *= object.resourceConcurrency
    }

    return (capacity * total_threads)
  }

  key_change(original, current){
    var keyFound = false;
    Object.keys(original).forEach(key => {
      if(original[key] !== current[key]){
        return keyFound = key;
      }
    });
    return keyFound || -1;
  }
};
