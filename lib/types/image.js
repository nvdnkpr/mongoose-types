var mongoose = require('mongoose');

module.exports.loadType = function(mongoose) {
    var SchemaTypes = mongoose.SchemaTypes || mongoose.Schema.Types,
    BaseSchemaType = mongoose.SchemaType;

    /**
   * Image schema type constructor
   *
   * @inherits Buffer schema type
   * @param {String} key
   * @param {Object} [options]
*/

    function Image(path, options) {
        this.allowedContentTypes = ['image/gif', 'image/jpeg', 'image/png'];
        this.maxSize = -1;
        BaseSchemaType.call(this, path, options, 'Image');
    };

    /*!
    * inherits
*/

    Image.prototype.__proto__ = SchemaTypes.Buffer.prototype;

    /**
     * Adds content type values and a coinciding validator.
     *
     * @param {String} [args...] contentType values
     * @api public
*/
    Image.prototype.contentTypes = function() {
        var len = arguments.length;
        if (!len || undefined === arguments[0] || false === arguments[0]) {
            if (this.contentTypeValidator){
                this.contentTypeValidator = false;
                this.validators = this.validators.filter(function(v){
                    return v[1] != 'contentTypes';
                });
            }
            return;
        }

        this.allowedContentTypes = [];
        for (var i = 0; i < len; i++) {
            if (typeof arguments[i] === 'string' && undefined !== arguments[i] && this.allowedContentTypes.indexOf(arguments[i]) === -1) {
                this.allowedContentTypes.push(arguments[i]);
            }
        }

        if (!this.contentTypeValidator) {
            var values = this.allowedContentTypes;
            this.contentTypeValidator = function(v){
                return undefined === v || ~values.indexOf(v);
            };
            this.validators.push([this.contentTypeValidator, 'contentTypes']);
        }
    };

    /**
   * Expose
*/

    SchemaTypes.Image = Image;
    mongoose.Types.Image = Buffer;
};
