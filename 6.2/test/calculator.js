const expect = require("chai").expect;
const request = require("request");
describe("Calculator API", function () {
    const baseUrl = "http://localhost:3000";
    it("returns status 200 to check if api works", function (done) {
        request(baseUrl, function (error, response, body) {
            expect(response.statusCode).to.equal(200);
            done()
        });
    });
    it("Return correct result for valid numbers", function (done) {
        request.get(`${baseUrl}/mul?n1=10&n2=5`, function (error, response, body) {
            expect(response.statusCode).to.equal(200);
            expect(body).to.include("50");
            done();
        });
    });
    it("Handle missing parameters", function (done) {
        request.get(`${baseUrl}/mul?n1=10`, function (error, response, body) {
            expect(response.statusCode).to.not.equal(200);
            done();
        });
    });
    it("Return error for non-numeric input", function (done) {
        request.get(`${baseUrl}/mul?n1=hello&n2=world`, function (error, response, body) {
            expect(response.statusCode).to.not.equal(200);
            done();
        });
    });
});
