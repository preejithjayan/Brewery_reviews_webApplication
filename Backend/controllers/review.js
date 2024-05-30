const { Types } = require('mongoose');
const ReviewModel = require('../models/Review')

exports.list = async(req, res) => {
    const ids = req.query.ids?.split('+') || [];
    const data = await ReviewModel.aggregate([
        {$match: {brewId: {$in: ids}}},
        {$group: {_id: '$brewId', total: {$sum: '$rating'}, count: {$sum: 1}}}
    ])
    const reviews = {};
    for(let i of data)
        reviews[i._id] = {total: i.total, count: i.count}
    res.status(200).json(reviews)
}

exports.byBrew = async(req, res) => {
    const id = req.params.id;
    const reviews = await ReviewModel.aggregate([
        {$match: {brewId: id}},
        {$lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user'
        }},
        {$set: {user: {$first: '$user'}}},
        {$group: {
            _id: 1,
            total: {$sum: '$rating'},
            count: {$sum: 1},
            reviewed: {$max: {$eq: ['$user._id', req.user._id]}},
            reviews: {$addToSet: {
                user: '$user.name',
                time: '$time',
                comment: '$comment',
                rating: '$rating'
            }},
        }},
    ])
    res.status(200).json(reviews[0])
}

exports.add = async(req, res) => {
    await ReviewModel.create({
        rating: req.body.rating,
        comment: req.body.comment,
        user: req.user._id,
        brewId: req.body.brewId,
    })
    res.status(201).send()
}