const T = require('mongoose').Schema.Types;
module.exports = {
    plugin: {
        createdmodified: {
            index: true
        }
    },
    schema: {
        body: {
            type: T.String,
            trim: true,
            text: true,
            required: true
        },
        options:{
            type: T.Mixed
        },
        correct:{
            type: T.Mixed
        }
    }
}
