const Review = require('./../models/reviewModel');
// const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

exports.createReview = factory.createOne(Review);

exports.setTourUserIds = (req, res, next) => {
    // to create a review we need tour and user id
    if (!req.body.tour) {
        req.body.tour = req.params.tourId;
    }
    if (!req.body.user) {
        // req.user coming from authCtrl.protect
        req.body.user = req.user.id;
    }
    next();
};

exports.getReview = factory.getOne(Review);

exports.updateReview = factory.updateOne(Review);

exports.deleteReview = factory.deleteOne(Review);

exports.getAllReviews = factory.getAll(Review);

// exports.getAllReviews = catchAsync(async (req, res, next) => {
//     let filter = {};
//     if (req.params.tourId) {
//         filter = { tour: req.params.tourId };
//     }
//     const reviews = await Review.find(filter); //.populate('tour');

//     res.status(200).json({
//         status: 'success',
//         data: {
//             reviews
//         }
//     });
// });

// exports.createReview = catchAsync(async (req, res, next) => {
//     if (!req.body.tour) {
//         req.body.tour = req.params.tourId;
//     }
//     if (!req.body.user) {
//         // req.user coming from authCtrl.protect
//         req.body.user = req.user.id;
//     }
//     const newReview = await Review.create(req.body);

//     res.status(201).json({
//         status: 'success',
//         data: {
//             review: newReview
//         }
//     });
// });
