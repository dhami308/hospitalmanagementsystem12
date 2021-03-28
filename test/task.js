let chai = require('chai');
let server = require('../index');
// var request = require('supertest');
let chaiHttp = require("chai-http");

chai.should();
chai.use(chaiHttp);

//let's set up the data we need to pass to the login method

// const API = 'http://localhost:3000';
describe('API', function () {
    describe("Post /api/user/login", () => {
        it('Should success if credential is valid', function (done) {
            const userCredentials = {
                email: "dhami.singh.santosh@gmail.com",
                password: "password"
            }
            chai.request(server)
                .post('/api/user/login')
                .send(userCredentials)
                .then(function (res) {
                    expect(res).to.have.status(200);
                })
                .catch(function (err) {
                    throw err;
                });
                done();
        }); 
    })
    describe("Post /api/user/register", () => {
        it('Should success if credential is valid', function (done) {
            const userDetails = {
                name: "Chetan Inamdar",
                email: "chetan.inamdar@gmail.com",
                password: "password",
                user_role: "admin"
            }
            chai.request(server)
                .post('/api/user/login')
                .send(userDetails)
                .then(function (res) {
                    expect(res).to.have.status(200);
                })
                .catch(function (err) {
                    throw err;
                });
                done();
        }); 
    })
    describe("GET /api/user/all", () => {
        it('Should success if credential is valid', function (done) {
            
            chai.request(server)
                .get('/api/user/all')
                // .send(userDetails)
                .then(function (res) {
                    expect(res).to.have.status(200);
                    response.body.should.be.a('array');
                })
                .catch(function (err) {
                    throw err;
                });
                done();
        }); 
    })

    describe("GET /api/user/:id", () => {
        it('Should success if credential is valid', function (done) {
            const userID = "603cd7a7cf83d913187ed829";
            chai.request(server)
                .get("/api/user/" + userID)
                // .send(userDetails)
                .then(function (res) {
                    expect(res).to.have.status(200);
                    // response.body.should.be.a('array');
                })
                .catch(function (err) {
                    throw err;
                });
                done();
        }); 
    })

    describe("GET /api/user/:id", () => {
        it('Should success if credential is valid', function (done) {
            const userID = "603cd7a7cf83d913187ed829";
            chai.request(server)
                .get("/api/user/" + userID)
                // .send(userDetails)
                .then(function (res) {
                    expect(res).to.have.status(200);
                    // response.body.should.be.a('array');
                })
                .catch(function (err) {
                    throw err;
                });
                done();
        }); 
    })

    describe("POST /api/user-detail/registration", () => {
        it('Should success if credential is valid', function (done) {
            const userDetails = {
                name: "Chetan Inamdar",
                email: "chetan.inamdar@gmail.com",
                password: "password",
                user_role: "admin"
            }
            chai.request(server)
                .post("/api/user-detail/registration")
                .send(userDetails)
                .then(function (res) {
                    expect(res).to.have.status(200);
                    // response.body.should.be.a('array');
                })
                .catch(function (err) {
                    throw err;
                });
                done();
        }); 
    })

    describe("GET /api/user-detail/all", () => {
        it('Should success if credential is valid', function (done) {
            // const userDetails = {
            //     name: "Chetan Inamdar",
            //     email: "chetan.inamdar@gmail.com",
            //     password: "password",
            //     user_role: "admin"
            // }
            chai.request(server)
                .get("/api/user-detail/all")
                // .send(userDetails)
                .then(function (res) {
                    expect(res).to.have.status(200);
                    // response.body.should.be.a('array');
                })
                .catch(function (err) {
                    throw err;
                });
                done();
        }); 
    })

    describe("Update /api/user-detail/:id", () => {
        it('Should success if credential is valid', function (done) {
            const userDetails = {
                name: "Chetan Inamdar",
                email: "chetan.inamdar@gmail.com",
                password: "password",
                user_role: "admin"
            }
            const userID = "603cd7a7cf83d913187ed829";
            chai.request(server)
                .put("/api/user-detail/" + userID)
                .send(userDetails)
                .then(function (res) {
                    expect(res).to.have.status(200);
                    // response.body.should.be.a('array');
                })
                .catch(function (err) {
                    throw err;
                });
                done();
        }); 
    })
    
    describe("Delete /api/user-detail/:id", () => {
        it('Should success if credential is valid', function (done) {
            // const userDetails = {
            //     name: "Chetan Inamdar",
            //     email: "chetan.inamdar@gmail.com",
            //     password: "password",
            //     user_role: "admin"
            // }
            const userID = "603cd7a7cf83d913187ed829";
            chai.request(server)
                .delete("/api/user-detail/" + userID)
                // .send(userDetails)
                .then(function (res) {
                    expect(res).to.have.status(200);
                    // response.body.should.be.a('array');
                })
                .catch(function (err) {
                    throw err;
                });
                done();
        }); 
    })
    
});
