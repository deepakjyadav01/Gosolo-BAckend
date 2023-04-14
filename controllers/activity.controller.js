const mongoose = require('mongoose');
const Activity = require('../models/activity.model')
const bd = require('../models/biodata.model');

module.exports.posts = async (req, res) => {
    try {
        let data = new Activity({
            title: req.body.title,
            category: req.body.category,
            body: req.body.body,
            price: req.body.price,
            role: req.body.role,
            company: req.body.company,
            currency: req.body.currency,
            location: req.body.location,
            Provider: req.userId,
        });
        const result = await data.save();
        res.status(200).json(result);
    } catch (error) {
        res.status(400).send(`Error when trying upload image: ${error}`);
    }
};

module.exports.addbidder = async (req, res) => {
    try {
        const find = await Activity.findById({ _id: req.params.id })
        const arr = find.bidders;

        if (!arr.includes(req.body.id)) {
            const user = await Activity.findOneAndUpdate({ _id: req.params.id },
                {
                    $push: {
                        bidders: req.body.id
                    }
                }, { new: true }).populate("bidders");;

            if (user) {
                res.status(200).json({ user })
            } else {
                res.status(400).send("couldn't update data, please try again");
            }
        } else {
            res.status(400).json({
                data: `${req.body.id} has already applied`
            })
        }

    } catch (error) {
        res.status(400).send(`Error when trying upload image: ${error}`);
    }
};

module.exports.getposts = async (req, res) => {
    try {
        const data = await Activity.find()
            .select('_id title category price currency location Provider')
            .populate({ path: 'Provider', select: 'fullname' })
            .sort({ "createdAt": 1 })
        res.status(200).json(data);
        // { title: { $regex: req.params.title, $options: 'xsi' } }
    } catch (error) {
        console.log(error)
        res.status(400).send(error);

    }
}

module.exports.getpostById = async (req, res) => {
    try {
        const data = await Activity.findById({ _id: req.params.id })
            .populate({ path: 'bidders', select: 'image fullname profileID' })
            .populate({ path: 'Selected', select: 'image fullname ' })
            .populate({ path: 'Provider', select: 'email fullname ' })
            .populate("worksample")
        res.status(200).json(data);

    } catch (error) {
        console.log(error)
        res.status(400).send(error);

    }
}

module.exports.getpostbyproviderId = async (req, res) => {
    try {
        const data = await Activity.find({ Provider: req.params.id })
            .select(' title category price currency Provider location')
            .populate("Provider bidders")
            .sort({ "createdAt": 1 })
        res.status(200).json(data);

    } catch (error) {
        console.log(error)
        res.status(400).send(error);

    }
}
module.exports.postbyselectedID = async (req, res) => {
    try {
        const data = await Activity.find({ Selected: req.params.id })
            .select(' title category')
            .sort({ "createdAt": 1 })
        res.status(200).json(data);

    } catch (error) {
        console.log(error)
        res.status(400).send(error);

    }
}

module.exports.Updatepost = async (req, res) => {
    try {
        const title = req.body.title;
        const category = req.body.category;
        const body = req.body.body;
        const price = req.body.price;
        const currency = req.body.currency;
        const updatedAt = Date.now();

        const post = await Activity.findByIdAndUpdate({ _id: req.params.id }, {
            $set: {
                title: title,
                category: category,
                body: body,
                price: price,
                currency: currency,
                createdAt: updatedAt
            }
        }, { new: true });
        res.status(200).json({
            success: true,
            post
        });

    } catch (error) {
        res.status(400).send(`Error when trying upload image: ${error}`);
    }
};

module.exports.updatefile = async (req, res) => {
    try {
        const data = await Activity.findByIdAndUpdate({ _id: req.params.id },
            {
                $set: {
                    file: req.body.filename
                }
            }, { new: true })

        if (data) {
            res.status(200).json({ data })
        }
    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }
}
module.exports.updateWS = async (req, res) => {
    try {
        const data = await Activity.findByIdAndUpdate({ _id: req.params.id },
            {
                $set: {
                    worksample: req.body.id
                }
            }, { new: true })

        if (data) {
            res.status(200).json({ data })
        }
    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }
}

module.exports.SelectBidder = async (req, res) => {
    try {
        const data = await Activity.findByIdAndUpdate({ _id: req.params.id },
            {
                $set: {
                    Selected: req.body.id
                }
            }, { new: true }).select('Selected').populate({ path: 'Selected', select: 'image fullname ' })

        if (data) {
            res.status(200).json({ data })
        }
    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }
}

module.exports.review = async (req, res) => {
    try {
        const data = await Activity.findByIdAndUpdate({ _id: req.params.id },
            {
                $set: {
                    confirm: req.body.confirm
                }
            }, { new: true });

        if (data) {
            res.status(200).json({ data })
        }
    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }
}
module.exports.resubmit = async (req, res) => {
    try {
        const data = await Activity.findByIdAndUpdate({ _id: req.params.id },
            {
                $set: {
                    worksample: null,
                    file: null
                }
            }, { new: true });

        if (data) {
            res.status(200).json({ data })
        }
    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }
}
module.exports.confirm = async (req, res) => {
    try {
        const data = await Activity.findByIdAndUpdate({ _id: req.params.id },
            {
                $set: {
                    confirm:null
                }
            }, { new: true });

        if (data) {
            res.status(200).json({ data })
        }
    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }
}

module.exports.updatepaystatus = async (req, res) => {
    try {
        const data = await Activity.findByIdAndUpdate({ _id: req.params.id },
            {
                $set: {
                    Paystatus: "paid"
                }
            }, { new: true });
        if (data) {
            res.status(200).json({ data })
        }
    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }
}

module.exports.removebidder = async (req, res) => {
    try {
        const id = req.body.id;
        const user = await Activity.findOneAndUpdate({ _id: req.params.id },
            {
                $pull: {
                    bidders: id
                }
            }, { new: true });

        if (user) {
            res.status(200).json({ user });
        } else {
            res.status(400).send("couldn't update data, please try again");
        }
    } catch (error) {
        res.status(400).send(`Error when trying upload image: ${error}`);
    }
};

module.exports.DeletePost = async (req, res) => {
    try {

        const post = await Activity.findByIdAndDelete({ _id: req.params.id });
        res.status(200).json({
            success: true,
            post
        });

    } catch (error) {
        return res.status(400).json({ error });

    }
}
