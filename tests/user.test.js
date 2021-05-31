const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOne, userOneID, setupDatabase } = require('./fixtures/db')


beforeEach(setupDatabase)


// Tests for creating users

test('should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: "Leah",
        email: 'leah@example.com',
        password: '123abc456'
    }).expect(201)

    const user = await User.findById(response.body.user._id)

    expect(user).not.toBeNull()
    expect(response.body).toMatchObject({
        user: {
            name: "Leah",
            email: 'leah@example.com'
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('123abc456')
})


test('should not signup user with invalid name', async () => {
    await request(app).post('/users').send({
        name: "",
        email: 'leah@example.com',
        password: '123abc456'
    }).expect(400)
})


test('should not signup user with invalid email', async () => {
    await request(app).post('/users').send({
        name: "Leah",
        email: 'leah',
        password: '123abc456'
    }).expect(400)
})


test('should not signup user with invalid password', async () => {
    await request(app).post('/users').send({
        name: "Leah",
        email: 'leah',
        password: 'password'
    }).expect(400)

    await request(app).post('/users').send({
        name: "Leah",
        email: 'leah',
        password: 'Password'
    }).expect(400)

    await request(app).post('/users').send({
        name: "Leah",
        email: 'leah',
        password: 'abc'
    }).expect(400)
})





// Tests for logging in users

test('should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(response.body.user._id)
    expect(response.body).toMatchObject({
        token: user.tokens[1].token
    })
})


test('should NOT login non-existent user', async () => {
    await request(app).post('/users/login').send({
        email: 'leahzeisner@gmail.com',
        password: userOne.password
    }).expect(400)
})





// Tests for fetching user's profile

test('should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})


test('should NOT get profile for unauthorized user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})





// Tests for deleting users

test('should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    
    const user = await User.findById(userOneID)
    expect(user).toBeNull()
})


test('should NOT delete account for unauthorized user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})





// Tests for updating user's info

test('should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)
    
    const user = await User.findById(userOneID)
    expect(user.avatar).toEqual(expect.any(Buffer))
})


test('should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: "Jess"
        })
        .expect(200)
    
    const user = await User.findById(userOneID)
    expect(user.name).toEqual('Jess')
})


test('should NOT update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            birthday: "January 1"
        })
        .expect(400)
})


test('should NOT update invalid name', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: ""
        })
        .expect(400)
})


test('should NOT update invalid email', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            email: "leah"
        })
        .expect(400)
})


test('should NOT update invalid password', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            password: "password"
        })
        .expect(400)
    
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            password: "Password"
        })
        .expect(400)
    
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            password: "abc"
        })
        .expect(400)
})


test('should NOT update unauthorized user', async () => {
    await request(app)
        .patch('/users/me')
        .send({
            name: "Jess"
        })
        .expect(401)
})