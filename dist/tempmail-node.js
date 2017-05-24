'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('babel-polyfill');
var md5 = _interopDefault(require('blueimp-md5'));
require('isomorphic-fetch');
require('fetch-jsonp');

var IS_NODE = typeof window === 'undefined';
var API_BASE = 'https://api.temp-mail.ru/request/';
var API_FORMAT = '/format/' + (IS_NODE ? 'json' : 'jsonp?callback=messages');
var ENDPOINT_INBOX = 'mail/id';
var ENDPOINT_DOMAINS = 'domains';
var ENDPOINT_DELETE = 'delete/id';

/**
 * Format Mail
 * @param {object} message
 */
function formatMessage(msg) {
  return {
    id: msg.mail_id,
    uid: msg.mail_unique_id,
    from: msg.mail_from,
    subject: msg.mail_subject,
    preview: msg.mail_preview,
    text: msg.mail_preview.replace(/\s/g, ' ').trim(),
    text_only: msg.mail_text_only,
    html: msg.mail_html,
    timestamp: new Date(parseInt(msg.mail_timestamp + '000'))
  };
}

/**
 * Generate random tempmail address
 * @param   {array}  domains
 * @returns {string} address
 */
function randomEmail(domains) {
  var prefix = md5(Math.random() + Date() + Math.random());
  var suffix = domains[Math.floor(Math.random() * domains.length)];
  return prefix + suffix;
}

/**
 * Assemble API url
 * @param   {string} endpoint
 * @returns {string}
 */
function endpoint(endpoint) {
  return API_BASE + endpoint + API_FORMAT;
}

/**
 * Inbox Endpoint URL
 * @param  {string} address - MD5 hashed email address to fetch
 * @return {string} url
 */
function inboxURL(address) {
  return endpoint(ENDPOINT_INBOX + '/' + address);
}

/**
 * Domains Endpoint URL
 * @return {string} url
 */
function domainsURL() {
  return endpoint(ENDPOINT_DOMAINS);
}

/**
 * Delete Message Endpoint URL
 * @return {string} url
 */
function deleteMessageURL(message_id) {
  return endpoint(ENDPOINT_DELETE + '/' + message_id);
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var TempMail = function () {
  /**
   * @constructor
   */
  function TempMail() {
    classCallCheck(this, TempMail);

    this.fetch = IS_NODE ? fetch : fetchJsonp;
  }

  /**
   * Create
   * @param {string} address - A temp-mail.ru email address. Generated if not provided.
   */


  createClass(TempMail, [{
    key: 'create',
    value: function create(address) {
      var domains;
      return regeneratorRuntime.async(function create$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              this.address = address;

              if (address) {
                _context.next = 6;
                break;
              }

              _context.next = 4;
              return regeneratorRuntime.awrap(this.domains());

            case 4:
              domains = _context.sent;

              this.address = randomEmail(domains);

            case 6:
              this.address_id = md5(this.address);
              return _context.abrupt('return', this.address);

            case 8:
            case 'end':
              return _context.stop();
          }
        }
      }, null, this);
    }

    /**
     * Get Mail
     */

  }, {
    key: 'getMail',
    value: function getMail() {
      var response, messages;
      return regeneratorRuntime.async(function getMail$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return regeneratorRuntime.awrap(this.fetch(inboxURL(this.address_id)));

            case 3:
              response = _context2.sent;
              messages = response.json();

              if (!messages[0]) {
                _context2.next = 7;
                break;
              }

              return _context2.abrupt('return', messages.map(formatMessage));

            case 7:
              return _context2.abrupt('return', messages);

            case 10:
              _context2.prev = 10;
              _context2.t0 = _context2['catch'](0);

              console.error(_context2.t0);

            case 13:
              return _context2.abrupt('return', []);

            case 14:
            case 'end':
              return _context2.stop();
          }
        }
      }, null, this, [[0, 10]]);
    }

    /**
     * Address Domains
     */

  }, {
    key: 'domains',
    value: function domains() {
      var domains;
      return regeneratorRuntime.async(function domains$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              _context3.next = 3;
              return regeneratorRuntime.awrap(this.fetch(domainsURL()));

            case 3:
              domains = _context3.sent;
              return _context3.abrupt('return', domains.json());

            case 7:
              _context3.prev = 7;
              _context3.t0 = _context3['catch'](0);

              console.error(_context3.t0);

            case 10:
              return _context3.abrupt('return', []);

            case 11:
            case 'end':
              return _context3.stop();
          }
        }
      }, null, this, [[0, 7]]);
    }

    /**
     * Delete Message
     */

  }, {
    key: 'deleteMessage',
    value: function deleteMessage(message_id) {
      var deletedMessage;
      return regeneratorRuntime.async(function deleteMessage$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              _context4.next = 3;
              return regeneratorRuntime.awrap(this.fetch(deleteMessageURL(message_id)));

            case 3:
              deletedMessage = _context4.sent;
              return _context4.abrupt('return', deletedMessage.json());

            case 7:
              _context4.prev = 7;
              _context4.t0 = _context4['catch'](0);

              console.error(_context4.t0);

            case 10:
              return _context4.abrupt('return', []);

            case 11:
            case 'end':
              return _context4.stop();
          }
        }
      }, null, this, [[0, 7]]);
    }
  }]);
  return TempMail;
}();

module.exports = TempMail;
