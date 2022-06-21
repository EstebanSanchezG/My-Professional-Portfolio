require("dotenv").config()
const express = require("express");
const ibmdb = require("ibm_db");
const async = require('async');
const cors = require('cors');
const bcrypt = require("bcrypt");

const bodyParser=require('body-parser');


const app = express();
app.use(cors());
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));

const port = process.env.PORT
const host = process.env.DB_HOST
const user = process.env.DB_USER
const password = process.env.DB_PASSWORD
const dbname = process.env.DB_DATABASE
const dbport = process.env.DB_PORT


app.listen(port, 
    ()=> console.log(`Server Started on port ${port}...`))



let cn = "DATABASE="+dbname+";HOSTNAME="+host+";PORT="+dbport+";PROTOCOL=TCPIP;UID="+user+";PWD="+password+";Security=SSL;SSLServerCertificate=DigiCertGlobalRootCA.arm;";


ibmdb.open(cn, function (err,conn) {
    console.log("querying")
    if (err){
        //return response.json({success:-1, message:err});
        console.log("1")
        console.log(err)
    }
    conn.query("SELECT * FROM USER ", function (err, data) {
        if (err){
            //return response.json({success:-2, message:err});
            console.log("2")
            console.log(err)
        }
        else{
            console.log("3")
            console.log(data)
      }
    })
});


app.get('/checkLogin', function(request, response) {
    const { username, password } = request.query;
    ibmdb.open(cn, async function (err,conn) {
        //console.log("querying")
        if (err){
            //return response.json({success:-1, message:err});
            console.log(err)
            return response.json({success:-1, message:err});
        } else {
            conn.query(`SELECT * FROM USER WHERE USERNAME = '${username}'`, async(err, data) =>{
                if (err){
                    console.log(err);
                    return response.json({success:-2, message:err});
                }
                else{
                    // encrypted password
                    // console.log(data[0]['PASSWORD']);
                    // check user password with hashed password stored in the database
                    if (data.length > 0) {
                        var validPassword = await bcrypt.compare(password, data[0]['PASSWORD']);
                    }
                    else {
                        var validPassword = false;
                    }
                    console.log(validPassword)
                    // console.log(validPassword)
                    conn.close(function () {
                        if(validPassword){
                            return response.json({success:1, message:'Data Received!', data: {valid: validPassword, USER_ID: data[0]['USER_ID'], USERNAME: data[0]['USERNAME'], ROLE: data[0]['ROLE']}});
                        }else{
                            return response.json({success:1, message:'Data Received!', data: {valid: validPassword}});
                        }
                });
                }
            });
        }
    });
});

app.post('/users', function(request, response){
    var params = request.body
    var limit = params['limit']
    var offset = (params['page']-1) * limit
    ibmdb.open(cn, async function (err,conn) {
        console.log("querying")
        if (err){
            //return response.json({success:-1, message:err});
            console.log("1")
            console.log(err)
            return response.json({success:-1, message:err});
        } else {
            conn.query('SELECT USER_ID, USERNAME, ROLE FROM USER LIMIT '+ offset + "," + limit, function (err, data) {
            if (err){
                console.log(err);
                return response.json({success:-2, message:err});
            }
            else{
                conn.close(function () {
                    console.log('done');
                    return response.json({success:1, message:'Data Received!', data:data});
                });
            }
          });
        }
    });
});

app.get('/countUsers', function(request, response){
    ibmdb.open(cn, async function (err,conn) {
        console.log("querying")
        if (err){
            //return response.json({success:-1, message:err});
            console.log("1")
            console.log(err)
            return response.json({success:-1, message:err});
        } else {
            conn.query("SELECT COUNT(*) FROM USER", function (err, data) {
                if (err){
                console.log(err);
                return response.json({success:-2, message:err});
            }
            else{
                conn.close(function () {
                    console.log('done');
                    console.log(data)
                    return response.json({success:1, message:'Data Received!', data:{"count": data[0]["1"]}});
                });
            }
          });
        }
    });
});


app.post('/newPeripheral', function(request, response){
    ibmdb.open(cn, async function (err,conn) {
        console.log("posting")
        if (err){
            console.log(err)
            return response.json({success:-1, message:err});
        } else {
            var params = request.body['device_params']
            var q = "INSERT INTO DEVICES" +
                    " VALUES (DEFAULT, '" + params['device_type'] + "', '" + params['brand'] + "', '" +
                    params['model'] + "', " + params['serial_number'] + ", DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT)";
            console.log(q);
            conn.query(q, function (err, data) {
            if (err){
                console.log(err);
                return response.json({success:-2, message:err});
            }
            else{
                conn.close(function () {
                    console.log('done');
                    return response.json({success:1, message:'Data entered!'});
                });
            
            }
          });
        }
    });
});

app.post('/getDevices', function(request, response){
    var params = request.body
    var limit = params['limit']
    var offset = (params['page']-1) * limit
    // var limit = 10
    // var offset = (1-1) * limit
    ibmdb.open(cn, async function (err,conn) {
        console.log("querying")
        if (err){
            //return response.json({success:-1, message:err});
            console.log("1")
            console.log(err)
            return response.json({success:-1, message:err});
        } else {
            conn.query("SELECT * FROM DEVICES LIMIT "+ offset + "," + limit, function (err, data) {
                if (err){
                console.log(err);
                return response.json({success:-2, message:err});
            }
            else{
                conn.close(function () {
                    console.log("Using query: SELECT * FROM DEVICES LIMIT "+ offset + "," + limit)
                    console.log('done');
                    return response.json({success:1, message:'Data Received!', data:data});
                });
            }
          });
        }
    });
});

app.get('/countDevices', function(request, response){
    ibmdb.open(cn, async function (err,conn) {
        console.log("querying")
        if (err){
            //return response.json({success:-1, message:err});
            console.log("1")
            console.log(err)
            return response.json({success:-1, message:err});
        } else {
            conn.query("SELECT COUNT(*) FROM DEVICES", function (err, data) {
                if (err){
                console.log(err);
                return response.json({success:-2, message:err});
            }
            else{
                conn.close(function () {
                    console.log('done');
                    console.log(data)
                    return response.json({success:1, message:'Data Received!', data:{"count": data[0]["1"]}});
                });
            }
          });
        }
    });
});

app.post('/userToID', function(request, response){
    ibmdb.open(cn, async function (err,conn) {
        console.log("posting")
        if (err){
            console.log(err)
            return response.json({success:-1, message:err});
        } else {
            var params = request.body
            console.log(params)
            
            // Build query
            q = "SELECT USER_ID FROM USER WHERE USERNAME = " + "'" + params['username'] +"';";

            console.log(q);

            conn.query(q, function (err, data) {
                if (err){
                    console.log(err);
                    return response.json({success:-2, message:err});
                }
                else{
                    conn.close(function () {
                        console.log('done');
                        console.log(data)
                        return response.json({success:1, message:'Data received!', data: data});
                    });
                }
            });
        }
    });
});

app.post('/IDTouser', function(request, response){
    ibmdb.open(cn, async function (err,conn) {
        console.log("posting")
        if (err){
            console.log(err)
            return response.json({success:-1, message:err});
        } else {
            var params = request.body
            console.log(params)
            
            // Build query
            q = "SELECT USERNAME FROM USER WHERE USER_ID = " + params['id'] +";";

            console.log(q);

            conn.query(q, function (err, data) {
                if (err){
                    console.log(err);
                    return response.json({success:-2, message:err});
                }
                else{
                    conn.close(function () {
                        console.log('done');
                        console.log(data)
                        return response.json({success:1, message:'Data received!', data: data});
                    });
                }
            });
        }
    });
});


app.post('/newRequest', function(request, response){
    ibmdb.open(cn, async function (err,conn) {
        console.log("posting")
        if (err){
            console.log(err)
            return response.json({success:-1, message:err});
        } else {
            var params = request.body
            console.log(params)
            
            // Build queries
            request_query = "INSERT INTO REQUESTS VALUES"
            device_query =  "UPDATE DEVICES SET " + '"device_state"' + " = 'Requested' WHERE DEVICE_ID IN ("
            for (let i = 0; i < params.length-1; i++) {
                var request_query = 
                        request_query + "(DEFAULT, " + params[i]['user_id'] + "," +
                        params[i]['device_id'] +
                        ", DEFAULT, TIMESTAMP_FORMAT(" +"'"+params[i]['return_date']+"', 'YYYY-MM-DD HH24:MI:SS'), DEFAULT),";
                var device_query = 
                        device_query + params[i]['device_id'] + ', '

            }
            var request_query = 
                    request_query + "(DEFAULT, " + params[params.length-1]['user_id'] + "," +
                    params[params.length-1]['device_id'] +
                    ", DEFAULT, TIMESTAMP_FORMAT(" +"'"+params[params.length-1]['return_date']+"', 'YYYY-MM-DD HH24:MI:SS'), DEFAULT)";
            var device_query = device_query + params[params.length-1]['device_id'] + ');'
            console.log(request_query);
            console.log(device_query);

            // Create device requests
            conn.query(request_query, function (err, data) {
                if (err){
                    console.log(err);
                    return response.json({success:-2, message:err});
                }
                else{
                    // conn.close(function () {
                    console.log('done');
                    //     //return response.json({success:1, message:'Data entered!'});
                    // });
                    conn.query(device_query, function (err, data) {
                        if (err){
                            console.log(err);
                            return response.json({success:-2, message:err});
                        }
                        else{
                            conn.close(function () {
                                console.log('done');
                                return response.json({success:1, message:'Data entered and updated!'});
                            });
                        }
                    });
                }
            });

            // Update device states
            
        }
    });
});

app.post('/checkDeviceAvailability', function(request, response){
    ibmdb.open(cn, async function (err,conn) {
        console.log("posting")
        if (err){
            console.log(err)
            return response.json({success:-1, message:err});
        } else {
            var params = request.body
            console.log(params)
            
            // Build query
            q = 'SELECT "DEVICE_ID", "serial_number", "device_state" FROM DEVICES WHERE "DEVICE_ID" IN ('
            for (let i = 0; i < params.length-1; i++) {
                var q = q + params[i]['device_id'] + ",";
            }
            var q = q + params[params.length-1]['device_id'] + ");";

            console.log(q);

            conn.query(q, function (err, data) {
                if (err){
                    console.log(err);
                    return response.json({success:-2, message:err});
                }
                else{
                    conn.close(function () {
                        console.log('done');
                        console.log(data)
                        var avail = []
                        var unavail = []
                        var avail_SN = []
                        var unavail_SN = []
                        for (let i = 0; i < params.length; i++) {
                            if (data[i]["device_state"] == "Available") {
                                avail.push(data[i]["DEVICE_ID"])
                                avail_SN.push(data[i]["serial_number"])
                            }
                            else {
                                unavail.push(data[i]["DEVICE_ID"])
                                unavail_SN.push(data[i]["serial_number"])
                            }
                        }
                        res = {
                            "available_SN": avail_SN,
                            "available": avail,
                            "unavailable": unavail,
                            "unavailable_SN": unavail_SN
                        }
                        console.log(res)
                        return response.json({success:1, message:'Data received!', data: res});
                    });
                }
            });
        }
    });
});

/**
 * seleccionar devices
 * picas request
 * llama check device availability -> regresar una lista de available devices y no available devices
 * llamar make request para availables
 * mostrar no availables
 * 
 * 
 * otra forma
 *  - si estan available -> make request
 *  - no estan available -> mensaje de error diciendo que devices estan unavailable
 * 
 * 
 */


 app.post('/getDeviceInfo', function(request, response){
    var params = request.body

    ibmdb.open(cn, async function (err,conn) {
        console.log("querying")
        if (err){
            //return response.json({success:-1, message:err});
            console.log("1")
            console.log(err)
            return response.json({success:-1, message:err});
        } else {
            conn.query("SELECT * FROM DEVICES WHERE DEVICE_ID = "+ params["deviceID"] + ";", function (err, data) {
                if (err){
                console.log(err);
                return response.json({success:-2, message:err});
            }
            else{
                conn.close(function () {
                    console.log("Using query: SELECT * FROM DEVICES WHERE DEVICE_ID = "+ params["deviceID"] + ";")
                    console.log('done');
                    // console.log(data)
                    return response.json({success:1, message:'Data Received!', data:data});
                });
            }
          });
        }
    });
});

app.post('/getRequests', function(request, response){
    var params = request.body
    var limit = params['limit']
    var offset = (params['page']-1) * limit
    // var limit = 10
    // var offset = (1-1) * limit
    ibmdb.open(cn, async function (err,conn) {
        console.log("querying")
        if (err){
            //return response.json({success:-1, message:err});
            console.log("1")
            console.log(err)
            return response.json({success:-1, message:err});
        } else {
            conn.query('SELECT REQUEST_ID, USERNAME, "device_type", "brand", "model", "serial_number", "device_state", "conditions_accepted", "in_campus", "Security_Auth", "last_admission_date", "last_exit_date", DATE as REQUEST_DATE,  RETURN_DATE, DEVICE_ID, USER_ID, STATUS FROM REQUESTS FULL INNER JOIN DEVICES USING (DEVICE_ID) JOIN USER USING (USER_ID) WHERE STATUS ='+ "'" + params["STATUS"] + "' ORDER BY REQUEST_DATE LIMIT " + offset + ", " + limit, function (err, data) {
                if (err){
                console.log(err);
                return response.json({success:-2, message:err});
            }
            else{
                conn.close(function () {
                    console.log('Using query: SELECT REQUEST_ID, USERNAME, "device_type", "brand", "model", "serial_number", "device_state", "conditions_accepted", "in_campus", "Security_Auth", "last_admission_date", "last_exit_date", DATE as REQUEST_DATE,  RETURN_DATE, DEVICE_ID, USER_ID, STATUS FROM REQUESTS FULL INNER JOIN DEVICES USING (DEVICE_ID) JOIN USER USING (USER_ID) WHERE STATUS ='+ "'" + params["STATUS"] + "' ORDER BY REQUEST_DATE LIMIT "+ offset + ", " + limit)
                    console.log('done');
                    return response.json({success:1, message:'Data Received!', data:data});
                });
            }
          });
        }
    });
});

app.post('/countRequests', function(request, response){
    ibmdb.open(cn, async function (err,conn) {
        console.log("querying")
        var params = request.body
        if (err){
            //return response.json({success:-1, message:err});
            console.log("1")
            console.log(err)
            return response.json({success:-1, message:err});
        } else {
            conn.query("SELECT COUNT(*) FROM REQUESTS WHERE STATUS = '"+ params["STATUS"]+"'", function (err, data) {
                if (err){
                console.log(err);
                return response.json({success:-2, message:err});
            }
            else{
                conn.close(function () {
                    console.log('done');
                    console.log(data)
                    return response.json({success:1, message:'Data Received!', data:{"count": data[0]["1"]}});
                });
            }
          });
        }
    });
});

app.post('/acceptRequest', function(request, response){
    ibmdb.open(cn, async function (err,conn) {
        console.log("posting")
        if (err){
            console.log(err)
            return response.json({success:-1, message:err});
        } else {
            var params = request.body
            console.log(params)
            
            // Build queries
            change_accepted_Con =  'UPDATE DEVICES SET "conditions_accepted" = 1 WHERE DEVICE_ID = ' + params['device_id']
            update_REQ_status =  "UPDATE REQUESTS SET STATUS = 'Accepted' WHERE REQUEST_ID = " + params['request_id']


            // Create device requests
            conn.query(change_accepted_Con, function (err, data) {
                if (err){
                    console.log(err);
                    return response.json({success:-2, message:err});
                }
                else{
                    // conn.close(function () {
                    console.log('done');
                    //     //return response.json({success:1, message:'Data entered!'});
                    // });
                    conn.query(update_REQ_status, function (err, data) {
                        if (err){
                            console.log(err);
                            return response.json({success:-2, message:err});
                        }
                        else{
                            conn.close(function () {
                                console.log('done');
                                return response.json({success:1, message:'Data entered and updated!'});
                            });
                        }
                    });
                }
            });
        }
    });
});


app.post('/rejectRequest', function(request, response){
    ibmdb.open(cn, async function (err,conn) {
        console.log("posting")
        if (err){
            console.log(err)
            return response.json({success:-1, message:err});
        } else {
            var params = request.body
            console.log(params)
            
            // Build queries
            change_device_State =  'UPDATE DEVICES SET "device_state" = '+"'Available'"+' WHERE DEVICE_ID = ' + params['device_id']
            update_REQ_status =  "UPDATE REQUESTS SET STATUS = 'Denied' WHERE REQUEST_ID = " + params['request_id']


            // Create device requests
            conn.query(update_REQ_status, function (err, data) {
                if (err){
                    console.log(err);
                    return response.json({success:-2, message:err});
                }
                else{
                    // conn.close(function () {
                    console.log('done');
                    //     //return response.json({success:1, message:'Data entered!'});
                    // });
                    conn.query(change_device_State, function (err, data) {
                        if (err){
                            console.log(err);
                            return response.json({success:-2, message:err});
                        }
                        else{
                            conn.close(function () {
                                console.log('done');
                                return response.json({success:1, message:'Data entered and updated!'});
                            });
                        }
                    });
                }
            });
        }
    });
});

app.post('/newUser', function(request, response){
    ibmdb.open(cn, async function (err,conn) {
        console.log("posting")
        if (err){
            console.log(err)
            return response.json({success:-1, message:err});
        } else {
            var params = request.body['user_params']
            var q = "INSERT INTO USER" +
                    " VALUES (Default, '"+params['username']+"', '"+params['password']+"', "+
                    params['role']+")";
            console.log(q);
            conn.query(q, function (err, data) {
            if (err){
                console.log(err);
                return response.json({success:-2, message:err});
            }
            else{
                conn.close(function () {
                    console.log('done');
                    return response.json({success:1, message:'Data entered!'});
                });
            
            }
          });
        }
    });
});

app.post('/getUserRequests', function(request, response){
    var params = request.body

    ibmdb.open(cn, async function (err,conn) {
        console.log("querying")
        if (err){
            //return response.json({success:-1, message:err});
            console.log("1")
            console.log(err)
            return response.json({success:-1, message:err});
        } else {
            conn.query('SELECT REQUEST_ID, "device_type", "brand", "model", "serial_number", "device_state", "conditions_accepted", "in_campus", "Security_Auth", "last_admission_date", "last_exit_date", DATE as REQUEST_DATE,  RETURN_DATE, DEVICE_ID, STATUS FROM REQUESTS FULL INNER JOIN DEVICES USING (DEVICE_ID) WHERE STATUS = '+"'Accepted'"+ 'AND USER_ID ='+  params["userID"], function (err, data) {
            // conn.query("SELECT * FROM REQUESTS WHERE STATUS = 'Accepted' AND USER_ID = "+ params["userID"] + ";", function (err, data) {
                if (err){
                console.log(err);
                return response.json({success:-2, message:err});
            }
            else{
                conn.close(function () {
                    console.log('Using query: SELECT REQUEST_ID, "device_type", "brand", "model", "serial_number", "device_state", "conditions_accepted", "in_campus", "Security_Auth", "last_admission_date", "last_exit_date", DATE as REQUEST_DATE,  RETURN_DATE, DEVICE_ID, STATUS FROM REQUESTS FULL INNER JOIN DEVICES USING (DEVICE_ID) WHERE STATUS = '+"'Accepted'"+ 'AND USER_ID ='+  params["userID"])
                    console.log('done');
                    // console.log(data)
                    return response.json({success:1, message:'Data Received!', data:data});
                });
            }
          });
        }
    });
});


app.post('/editUserInfo', function(request, response){
    ibmdb.open(cn, async function (err,conn) {
        console.log("posting")
        if (err){
            console.log(err)
            return response.json({success:-1, message:err});
        } else {
            var params = request.body['user_params']
            var change = params['change']
            if (params['column'] == "PASSWORD") {
                if (change.length > 0) {
                    // generate salt to hash password
                    const salt = await bcrypt.genSalt(10);
                    // generate hashed password
                    const hashed_pass = await bcrypt.hash(change, salt);
                    change = "'" + hashed_pass + "'"
                }
                else {
                    return response.json({success:-2, message:"Passwords must not be empty"});
                }
            }
            else if(params['column'] == "USERNAME"){
                change = "'" + change + "'"
            }
            var q = "UPDATE USER SET " + params['column'] + " = " + change +
                    " WHERE USER_ID = " + params['userID'];

            console.log(q);
            conn.query(q, function (err, data) {
            if (err){
                console.log(err);
                return response.json({success:-2, message:err});
            }
            else{
                conn.close(function () {
                    console.log('done');
                    return response.json({success:1, message:'Data entered!'});
                });
            
            }
            });
        }
    });
});

app.get('/countDevicesPanel', function(request, response){
    ibmdb.open(cn, async function (err,conn) {
        console.log("posting")
        if (err){
            //return response.json({success:-1, message:err});
            console.log("1")
            console.log(err)
            return response.json({success:-1, message:err});
        } else {
            conn.query('SELECT * FROM (SELECT COUNT (*) as devicesNo FROM DEVICES), (SELECT COUNT(*) as devicesIn FROM DEVICES WHERE "in_campus" = true), (SELECT COUNT(*) as devicesOut FROM DEVICES WHERE "in_campus" = false);', function (err, data) {
                if (err){
                console.log(err);
                return response.json({success:-2, message:err});
            }
            else{
                conn.close(function () {
                    console.log('done');
                    console.log(data)
                    return response.json({success:1, message:'Data Received!', data:data[0]});
                });
            }
          });
        }
    });
});

app.post('/countPanelOut', function(request, response){
    ibmdb.open(cn, async function (err,conn) {
        console.log("querying")
        if (err){
            //return response.json({success:-1, message:err});
            console.log("1")
            console.log(err)
            return response.json({success:-1, message:err});
        } else {
            var params = request.body['days']
            conn.query('SELECT COUNT(*) FROM DEVICES WHERE "last_exit_date" BETWEEN CURRENT_DATE-'+params+' AND CURRENT_DATE+1', function (err, data) {
                if (err){
                console.log(err);
                return response.json({success:-2, message:err});
            }
            else{
                conn.close(function () {
                    console.log('done');
                    console.log(data)
                    return response.json({success:1, message:'Data Received!', data:data[0]});
                });
            }
          });
        }
    });
});

app.post('/countPanelIn', function(request, response){
    ibmdb.open(cn, async function (err,conn) {
        console.log("querying")
        if (err){
            //return response.json({success:-1, message:err});
            console.log("1")
            console.log(err)
            return response.json({success:-1, message:err});
        } else {
            var params = request.body['days']
            conn.query('SELECT COUNT(*) FROM DEVICES WHERE "last_admission_date" BETWEEN CURRENT_DATE-'+params+' AND CURRENT_DATE+1', function (err, data) {
                if (err){
                console.log(err);
                return response.json({success:-2, message:err});
            }
            else{
                conn.close(function () {
                    console.log('done');
                    console.log(data)
                    return response.json({success:1, message:'Data Received!', data:data[0]});
                });
            }
          });
        }
    });
});

app.post('/registerExit', function(request, response){
    ibmdb.open(cn, async function (err,conn) {
        console.log("posting")
        if (err){
            console.log(err)
            return response.json({success:-1, message:err});
        } else {
            var params = request.body
            console.log(params)
            
            // Build queries
            exitTime =  'UPDATE DEVICES SET "Security_Auth" = 1, "in_campus" = 0, "last_exit_date" = CURRENT_TIMESTAMP, "device_state" = '+"'Checked Out'"+' WHERE DEVICE_ID = ' + params['device_id']
            conn.query(exitTime, function (err, data) {
                if (err){
                    console.log(err);
                    return response.json({success:-2, message:err});
                }
                else{
                    // conn.close(function () {
                    console.log('done');
                    //     //return response.json({success:1, message:'Data entered!'});
                    // });
                    conn.close(function () {
                        console.log('done');
                        return response.json({success:1, message:'Data entered and updated!'});
                    });
                }
            });
        }
    });
});

app.post('/registerReturn', function(request, response){
    ibmdb.open(cn, async function (err,conn) {
        console.log("posting")
        if (err){
            console.log(err)
            return response.json({success:-1, message:err});
        } else {
            var params = request.body
            console.log(params)
            
            // Build queries
            returnTime =  'UPDATE DEVICES SET "conditions_accepted" = 0, "Security_Auth" = 0, "in_campus" = 1, "last_admission_date" = CURRENT_TIMESTAMP, "device_state" = '+"'Available'"+' WHERE DEVICE_ID = ' + params['device_id']
            update_REQ_status =  "UPDATE REQUESTS SET STATUS = 'Finished' WHERE REQUEST_ID = (SELECT REQUEST_ID FROM REQUESTS WHERE DEVICE_ID = "+params['device_id']+" AND STATUS = 'Accepted')"

            conn.query(returnTime, function (err, data) {
                if (err){
                    console.log(err);
                    return response.json({success:-2, message:err});
                }
                else{
                    // conn.close(function () {
                    console.log('done');
                    //     //return response.json({success:1, message:'Data entered!'});
                    // });
                    conn.query(update_REQ_status, function (err, data) {
                        if (err){
                            console.log(err);
                            return response.json({success:-2, message:err});
                        }
                        else{
                            conn.close(function () {
                                console.log('done');
                                return response.json({success:1, message:'Data entered and updated!'});
                            });
                        }
                    });
                }
            });
        }
    });
});