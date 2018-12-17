/* eslint-disable radix */
var _ = require('lodash'),
    prettyms = require('pretty-ms'),
    filesize = require('filesize'),

    util,

    SEP = ' / ',

    /**
     * The auxiliary character used to prettify file sizes from raw byte counts.
     *
     * @type {Object}
     */
    FILESIZE_OPTIONS = { spacer: '' };

util = {
    /**
     * A utility helper method that prettifies and returns raw millisecond counts.
     *
     * @param {Number} ms - The raw millisecond count, usually from response times.
     * @returns {String} - The prettified time, scaled to units of time, depending on the input value.
     */
    prettyms (ms) {
        return (ms < 1998) ? `${parseInt(ms, 10)}ms` : prettyms(ms || 0);
    },

    /**
     * A utility helper method to prettify byte counts into human readable strings.
     *
     * @param {Number} bytes - The raw byte count, usually from computed response sizes.
     * @returns {String} - The prettified size, suffixed with scaled units, depending on the actual value provided.
     */
    filesize (bytes) {
        return filesize(bytes || 0, FILESIZE_OPTIONS);
    },

    /**
     * Resolves the fully qualified name for the provided item
     *
     * @param {PostmanItem|PostmanItemGroup} item The item for which to resolve the full name
     * @param {?String} [separator=SEP] The separator symbol to join path name entries with
     * @returns {String} The full name of the provided item, including prepended parent item names
     * @private
     */
    getFullName (item, separator) {
        if (_.isEmpty(item) || !_.isFunction(item.parent) || !_.isFunction(item.forEachParent)) { return; }

        var chain = [];

        item.forEachParent(function (parent) { chain.unshift(parent.name || parent.id); });

        item.parent() && chain.push(item.name || item.id); // Add the current item only if it is not the collection

        // eslint-disable-next-line consistent-return
        return chain.join(_.isString(separator) ? separator : SEP);
    }
};

module.exports = util;
