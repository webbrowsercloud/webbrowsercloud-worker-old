const cgroup = require("@adobe/cgroup-metrics");

const config = require("./config");
const { getDebug } = require("./utils");

const log = getDebug("hardware");

const getMachineStats = async () => {
  try {
    const cpu =
      cgroup.cpu.calculateUsage(
        cgroup.cpu.usage(),
        await new Promise((resolve) => {
          setTimeout(() => resolve(cgroup.cpu.usage()), 1000);
        })
      ) / 100;

    const memory =
      cgroup.memory.containerUsagePercentage(cgroup.memory.containerUsage()) /
      100;

    return { cpu, memory };
  } catch (err) {
    log(`Error checking machine stats`, err);
    return [null, null];
  }
};

const overloaded = async () => {
  const { cpu, memory } = await (0, exports.getMachineStats)();
  const cpuInt = cpu && Math.ceil(cpu * 100);
  const memoryInt = memory && Math.ceil(memory * 100);
  log(`Checking overload status: CPU ${cpuInt}% Memory ${memoryInt}%`);
  const cpuOverloaded = !!(cpuInt && cpuInt >= config.MAX_CPU_PERCENT);
  const memoryOverloaded = !!(
    memoryInt && memoryInt >= config.MAX_MEMORY_PERCENT
  );
  return {
    cpuOverloaded,
    memoryOverloaded,
    cpuInt,
    memoryInt,
  };
};

exports.getMachineStats = getMachineStats;
exports.overloaded = overloaded;
