const User = require('../models/user.model');
const bcrypt = require('bcrypt');

module.exports.login = (req,res) => {
    const { email, pw } = req.body;
    if(!email || !pw ) return res.status(400).json({message: "Email and Password are required!"});
    User.findOne({email:email})
    .then((user) => {
        const match = bcrypt.compareSync(pw,user.pwHash);
        if(match){
            
            res.json({message:'success'})
        } else {
            res.status(401);
        }
    })
    .catch((err) => {
        res.status(400).json({ message: "No account found", error: err});
    })

}

module.exports.createUser = (req,res) => {
    const { email, username, pw } = req.body;
    const hashedPw = bcrypt.hashSync(pw,10);
    const user = {
        email,
        username,
        pwHash: hashedPw
    } 
    User.create(user)
        .then((newUser) => {
            res.json({ User: newUser });
        })
        .catch((err) => {
            res.status(400).json({ message: "Something went wrong", error: err });
        });
}
module.exports.updateExistingUser = (req,res) => {
    User.findOneAndUpdate({_id: req.params.id }, req.body, {new: true, runValidators: true})
        .then((updatedUser) => {
            res.json({ User: updatedUser });
        })
        .catch((err) => {
            res.status(400).json({ message: "Something went wrong", error:err});
        });
}

module.exports.deleteExistingUser = (req,res) => {
    User.deleteOne({ _id: req.params.id })
        .then((result) => {
            res.json({ result: result });
        })
        .catch((err) => {
            res.json({ message: "Something went wrong", error: err });
        });
}