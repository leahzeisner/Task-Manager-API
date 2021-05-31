const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')


const userOneID = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneID,
    name: 'Bob',
    email: 'bob@example.com',
    password: 'examplepwd123',
    tokens: [{
        token: jwt.sign({ _id: userOneID }, process.env.JWT_SECRET)
    }]
}

const userTwoID = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoID,
    name: 'Sally',
    email: 'sally@example.com',
    password: '123abcpwd987',
    tokens: [{
        token: jwt.sign({ _id: userTwoID }, process.env.JWT_SECRET)
    }]
}



const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First task',
    completed: false,
    owner: userOneID
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second task',
    completed: true,
    owner: userOneID
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Third task',
    completed: true,
    owner: userTwoID
}




const setupDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}


module.exports = { 
    userOne,
    userTwo, 
    userOneID,
    userTwoID,
    taskOne,
    taskTwo,
    taskThree, 
    setupDatabase }