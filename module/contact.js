const axios = require('axios');
const util = require('util');

exports.demo = async function () {
    return 'this is from demo';
};

const API_BASE_URL = process.env.API_BASE_URL;
const PRIVATE_APP_TOKEN = process.env.PRIVATE_APP_ACCESS_TOKEN;

exports.getContact = async function (id) {
    const getUrl = API_BASE_URL + `/crm/v3/objects/contacts/${id}?properties=company&properties=email&properties=firstname&properties=lastname&properties=phone&properties=website&properties=address&properties=city&properties=state&properties=country&properties=zip&properties=jobtitle`;
    const headers = {
        'Authorization': `Bearer ${PRIVATE_APP_TOKEN}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.get(getUrl, { headers });
        const data = response.data.results;
        //console.log('RES GET - >>>' + util.inspect(response.data, {depth: null}));
        return response.data;
        //res.render('contacts', { title: 'All Contact from Hubspot', data });
    } catch (error) {
        console.error(error);
    }

    
};

exports.addContact = async function (postdata) {
    //console.log(postdata);
    const postUrl = API_BASE_URL + '/crm/v3/objects/contacts';
    
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

exports.editContact = async function (postdata) {
    //console.log(postdata);
    const editUrl = API_BASE_URL + `/crm/v3/objects/contacts/${postdata.id}`;
    
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
    
    try {
        const response = await axios.patch(editUrl, { properties }, { headers: headers });
        //console.log('AXIOS PATCH ->>>' + util.inspect(response.data, {depth: null}));
        // If the request is successful, return the data in the response.
        return { status: true, msg: 'Contact edited successfully' };
    } catch (error) {
        // If there's an error, catch it and return an error object.
        return { status: false, msg: 'Error while edit contact' };
    }
};