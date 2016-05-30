const T = require('mongoose').Schema.Types;
module.exports = {
    plugin: {
        createdmodified: {
            index: true
        }
    },
    schema: {
        title: {
            type: T.String,
            trim: true,
            index: true,
            required: true,
            unique: true
        },
        questions: [{
            type: T.ObjectId,
            ref: 'question'
        }]
    }
}
