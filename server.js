const dns = require('dns');

const originalLookup = dns.lookup;
dns.lookup = function(hostname, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  if (typeof options === 'number') {
    options = { family: options };
  }
  options = options || {};
  options.family = 4;
  originalLookup.call(this, hostname, options, callback);
};

require('next/dist/bin/next');
