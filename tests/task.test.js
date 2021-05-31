const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const { userOne, userTwo, taskOne, setupDatabase } = require('./fixtures/db')


beforeEach(setupDatabase)



// Tests for creating tasks

test('should sucsessfully create a new task for user', async () => {
    const response = await request(app)
            .post('/tasks')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send({
                description: 'test task'
            })
            .expect(201)
    
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.description).toEqual('test task')
    expect(task.completed).toEqual(false)
})


test('should not create task with invalid description/completed', async () => {
    await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: ''
        })
        .expect(400)
    
    await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            completed: ''
        })
        .expect(400)
})





// Tests for fetching tasks

test("should correctly fetch a user's tasks", async () => {
    const response = await request(app)
            .get('/tasks')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200)
    
    expect(response.body.length).toEqual(2)
})


test("should NOT fetch an unauthorized user's tasks", async () => {
    const response = await request(app)
            .get('/tasks')
            .send()
            .expect(401)
})


test("should correctly fetch a user's task by id", async () => {
    const response = await request(app)
            .get(`/tasks/${taskOne._id}`)
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200)
})


test("should NOT fetch an unauthorized user's task by id", async () => {
    const response = await request(app)
            .get(`/tasks/${taskOne._id}`)
            .send()
            .expect(401)
})


test("should not fetch other users task by id", async () => {
    await request(app)
            .get(`/tasks/${taskOne._id}`)
            .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
            .send()
            .expect(404)
})


test('should fetch only completed tasks', async () => {
    const response = await request(app)
            .get(`/tasks?completed=true`)
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200)
    
    expect(response.body.length).toBe(1)

    const response2 = await request(app)
            .get(`/tasks?completed=true`)
            .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
            .send()
            .expect(200)
    
    expect(response2.body.length).toBe(1)
})


test('should fetch only incompleted tasks', async () => {
    const response = await request(app)
            .get(`/tasks?completed=false`)
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200)
    
    expect(response.body.length).toBe(1)

    const response2 = await request(app)
            .get(`/tasks?completed=false`)
            .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
            .send()
            .expect(200)
    
    expect(response2.body.length).toBe(0)
})





// Tests for deleting tasks

test("should correctly delete a user's task", async () => {
    await request(app)
            .delete(`/tasks/${taskOne._id}`)
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200)
})


test("should NOT delete an unauthorized user's task", async () => {
    const response = await request(app)
            .delete(`/tasks/${taskOne._id}`)
            .send()
            .expect(401)
})


test("should NOT allow a user to delete another user's tasks", async () => {
    const response = await request(app)
            .delete(`/tasks/${taskOne._id}`)
            .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
            .send()
            .expect(404)

    const task = Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})





// Tests for updating tasks

test("should NOT allow a user to update another user's tasks", async () => {
    await request(app)
            .patch(`/tasks/${taskOne._id}`)
            .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
            .send({
                completed: true
            })
            .expect(404)
})


test('should successfully update a task', async () => {
    await request(app)
        .patch(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            completed: true
        })
        .expect(200)
    
    const task = await Task.findById(taskOne._id)
    expect(task.completed).toEqual(true)
})


test('should not update task with invalid description/completed', async () => {
    await request(app)
        .post(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: ''
        })
        .expect(404)
    
    await request(app)
        .post(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            completed: ''
        })
        .expect(404)
})