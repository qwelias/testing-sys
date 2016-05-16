const T = require('mongoose').Schema.Types;
const user = require('../../config').db.user.model;
module.exports = {
    plugin: {
        createdmodified: {
            index: true
        }
    },
    schema: {
        user:{
            type: T.ObjectId,
            ref: user
        },
        question: {
            type: T.ObjectId,
            ref: 'question'
        },
        body:{
            type: T.Mixed
        }
    }
}
