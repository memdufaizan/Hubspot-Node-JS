require('dotenv').config();
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const contactModule = require('./module/contact');

const app = express();

app.use(bodyParser.urlencoded({
    extended:true
  }));

app.set('view engine' , 'ejs');

const API_BASE_URL = process.env.API_BASE_URL;
const PRIVATE_APP_TOKEN = process.env.PRIVATE_APP_ACCESS_TOKEN;

app.get('/', async (req, res) => {
    const contacts = API_BASE_URL + '/crm/v3/objects/contacts?limit=20';
    const headers = {
        'Authorization': `Bearer ${PRIVATE_APP_TOKEN}`,
        'Content-Type': 'application/json'
    }

    try {
        const response = await axios.get(contacts, { headers });
        const data = response.data.results;
        // const res_demo = await contactModule.demo();
        // console.log('RES DEMO - >>>' + res_demo);
        res.render('contacts', { title: 'All Contact from Hubspot', data });
    } catch (error) {
        console.error(error);
    }

    //console.log(data)
    // data.forEach(daa => {
    //     console.log(daa);
    // });

    
})

app.get('/add-contact', (req, res) => {
    res.render('add-contact', { title: 'Add new contact', resdata: ''});
})

app.post('/add-contact', async (req,res) => {
    const { email, firstname, lastname, phone, company, website, address, city, state, country, zip, jobtitle } = req.body;

    if (email == '' || firstname == '' || lastname == '' || phone == '' || company == '') {
        const resdata = {
            status: false,
            message: 'Required fields are missing'
        }
        res.render('add-contact', {title: 'Add new contact', resdata: resdata});
    } else {
        const data = {
            email: email,
            firstname: firstname,
            lastname: lastname,
            phone: phone,
            company: company,
            website: website,
            address: address,
            city: city,
            state: state,
            country: country,
            zip: zip,
            jobtitle: jobtitle,
            submit: true
        }
        
        const contact = await contactModule.addContact(data);
        
        const resdata = {
            status: contact.status,
            message: contact.msg
        }

        console.log('Module Res->>>' + contact.status);
        res.render('add-contact', {title: 'Add new contact', resdata: resdata});
    }
})

app.listen(3000, () => console.log('App running on http://localhost:3000'));