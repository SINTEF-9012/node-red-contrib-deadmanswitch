module.exports = function(RED) {
  function DeadManSwitch(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    var timeoutId = 0;
    var delay = parseFloat(config.delay);

    if (config.delayUnit === "minutes") {
      delay *= 60 * 1000;
    } else if (config.delayUnit === "hours") {
      delay *= 60 * 60 * 1000;
    } else if (config.delayUnit === "days") {
      delay *= 24 * 60 * 60 * 1000;
    } else if (config.delayUnit !== "milliseconds") {
      delay *= 1000;
    } // Default to seconds

    node.on('input', function(msg) {
      this.status({fill:"green",shape:"dot",text:"alive"});
      clearTimeout(timeoutId);
      timeoutId = setTimeout(function() {
        node.send({
          payload: 'timeout'
        });
        timeoutId = 0;
        node.status({fill:"red",shape:"dot",text:"dead"});
      }, delay);
    });

    node.on('close', function() {
      clearTimeout(timeoutId);
      timeoutId = 0;
      this.status({});
    })
  }

  RED.nodes.registerType("dead-man-switch", DeadManSwitch);
}