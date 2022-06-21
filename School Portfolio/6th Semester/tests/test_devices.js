
let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;


chai.use(chaiHttp);
const url= 'https://rancho-back.mybluemix.net';


describe('Get device count: ',()=>{
    it('should return device count', (done) => {
        chai.request(url)
        .get('/countDevices')
        .end( function(err,res){
            //console.log(res.body);
            expect(res).to.have.status(200);
            expect(res.body.data.count).to.be.a('number');
            done();
        });
    });
});
   
describe('Test getting devices with pagination: ',()=>{
    it('should return first 10 devices', (done) => {
        chai.request(url)
        .post('/getDevices')
        .send({limit:10, page: 1})
        .end( function(err,res){
            //console.log(res.body)
            expect(res).to.have.status(200);
            expect(res.body.data).to.have.lengthOf(10);
            expect(res.body.data[0]['DEVICE_ID']).to.be.a('number').that.equals(1);
            expect(res.body.data[9]['DEVICE_ID']).to.be.a('number').that.equals(10);
            done();
        });
    });

    it('should return 15 devices, page 2', (done) => {
        chai.request(url)
        .post('/getDevices')
        .send({limit:15, page: 2})
        .end( function(err,res){
            //console.log(res.body)
            expect(res).to.have.status(200);
            expect(res.body.data).to.have.lengthOf(15);
            expect(res.body.data[0]['DEVICE_ID']).to.be.a('number').that.equals(16);
            expect(res.body.data[14]['DEVICE_ID']).to.be.a('number').that.equals(30);
            done();
        });
    });
});

describe('Test check device availability: ',()=>{
    it('should return 5 available, 5 unavailable', (done) => {
        chai.request(url)
        .post('/checkDeviceAvailability')
        .send([
            {"user_id": 1, "device_id": 1},
            {"user_id": 1, "device_id": 2},
            {"user_id": 1, "device_id": 3},
            {"user_id": 1, "device_id": 4},
            {"user_id": 1, "device_id": 5},
            {"user_id": 1, "device_id": 6},
            {"user_id": 1, "device_id": 7},
            {"user_id": 1, "device_id": 8},
            {"user_id": 1, "device_id": 9},
            {"user_id": 1, "device_id": 10}
        ])
        .end( function(err,res){
            //console.log(res.body)
            expect(res).to.have.status(200);
            expect(res.body.data.available).to.have.lengthOf(5);
            expect(res.body.data.available).to.eql([ 1, 2, 3, 4, 5 ]);
            expect(res.body.data.unavailable).to.eql([ 6, 7, 8, 9, 10 ]);
            done();
        });
    });
});
