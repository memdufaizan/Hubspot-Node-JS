const axios = require('axios');
const util = require('util');

exports.demo = async function () {
    return 'this is from demo';
};


exports.addContact = async function (postdata) {
    //console.log(postdata);
    const postUrl = process.env.API_BASE_URL + '/crm/v3/objects/contacts';
    const PRIVATE_APP_TOKEN = process.env.PRIVATE_APP_ACCESS_TOKEN;
    
    const headers = {
        'Authorization': `Bearer ${PRIVATE_APP_TOKEN}`,
        'Content-Type': 'application/json'
    };

    const properties = {
        "email": postdata.email,
        "firstname": postdata.firstname,
        "lastname": postdata.lastname,
        "phone": postdata.phone,
        "company": postdata.company,
        "website": postdata.website,
        "address": postdata.address,
        "city": postdata.city,
        "state": postdata.state,
        "country": postdata.country,
        "zip": postdata.zip,
        "jobtitle": postdata.jobtitle,
        "hubspot_owner_id": "561241889",
    };
    
    // const result = await axios.post(postUrl, {properties},  {headers: headers},  )
    // .then(function (response) {
    //     //console.log('AXIOS RES ->>>' + util.inspect(response.data, {depth: null}));
    //     return ({'status' : true, 'msg' : response.data});
    // })
    // .catch(function (error) {
    //     //console.log('AXIOS ERR ->>>' + error);
    //     return ({'status' : false, 'msg' : error});
    // });

    try {
        const response = await axios.post(postUrl, { properties }, { headers: headers });
        // If the request is successful, return the data in the response.
        return { status: true, msg: 'Contact created successfully' };
    } catch (error) {
        // If there's an error, catch it and return an error object.
        return { status: false, msg: 'Error while create contact' };
    }
};