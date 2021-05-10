'use strict'

const os = require('os')

const MILLIS = 1e3
const MICROS = 1e6
const CPUS = os.cpus().length
const SAMPLE_INTERVAL = 15 * MILLIS

let samplers = []

function Sampler(sampler, interval) {
  this.id = setInterval(sampler, interval)
  this.id.unref()
}

Sampler.prototype.stop = function stop() {
  clearInterval(this.id)
}

function getCpuSample(lastSample) {
  try {
    return process.cpuUsage(lastSample)
  } catch (e) {
    logger.debug('Could not record cpu usage', e)
    return null
  }
}

function generateCPUMetricRecorder(cpuState) {
  let lastSampleTime
  // userTime and sysTime are in seconds
  return function recordCPUMetrics(userTime, sysTime) {
    var elapsedUptime
    if (!lastSampleTime) {
      elapsedUptime = process.uptime()
    } else {
      elapsedUptime = (Date.now() - lastSampleTime) / MILLIS
    }

    var totalCpuTime = CPUS * elapsedUptime

    lastSampleTime = Date.now()

    var userUtil = userTime / totalCpuTime
    var sysUtil  = sysTime / totalCpuTime

    cpuState.cpuUser = cpuState.cpuUser + userUtil
    cpuState.cpuSystem = cpuState.cpuSystem + sysUtil
    cpuState.count = cpuState.count + 1
  }
}

function sampleCpu(cpuState) {
  var lastSample
  var recordCPU = generateCPUMetricRecorder(cpuState)
  return function cpuSampler() {
    var cpuSample = getCpuSample(lastSample)
    lastSample = getCpuSample()

    if (lastSample == null) {
      return
    }

    recordCPU(cpuSample.user / MICROS, cpuSample.system / MICROS)
  }
}

module.exports = {
  start: (cpuState) => {
    samplers.push(new Sampler(sampleCpu(cpuState), SAMPLE_INTERVAL))
  },
  stop: () => {
    samplers.forEach((s) => {
      s.stop()
    })
    samplers = []
  }
}