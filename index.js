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
        const data = response.data.results.slice(2); //removed first two sample contact
        // const res_demo = await contactModule.demo();
        //console.log('RES DEMO - >>>' + data.properties);
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
            message: 'Required fields are missing - Email, Firstname, Lastname, Phone, Company'
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

app.get('/delete/:id', (req, res) => {
    //console.log(req.params.id);
	const ContactIdToDelete = req.params.id;
	
	const delete_contacts_url = API_BASE_URL + `/crm/v3/objects/contacts/${ContactIdToDelete}`;
    const headers = {
        'Authorization': `Bearer ${PRIVATE_APP_TOKEN}`,
        'Content-Type': 'application/json'
    }

	axios.delete(delete_contacts_url, { headers })
	.then(response => {
		console.log(`Deleted contact with ID ${ContactIdToDelete}`);
	})
	.catch(error => {
		console.error(error);
	});
    res.redirect('back');
})

app.get('/edit-contact/:id', async (req, res) => {
	//console.log(req.params.id);
	const ContactIdToEdit = req.params.id;
	if(ContactIdToEdit != '') {
		const contact = await contactModule.getContact(ContactIdToEdit);
		if (contact) {
			const data = {
				id: req.params.id,
				email: contact.properties.email,
				firstname: contact.properties.firstname,
				lastname: contact.properties.lastname,
				phone: contact.properties.phone,
				company: contact.properties.company,
				website: contact.properties.website,
				address: contact.properties.address,
				city: contact.properties.city,
				state: contact.properties.state,
				country: contact.properties.country,
				zip: contact.properties.zip,
				jobtitle: contact.properties.jobtitle
			}

			res.render('edit-contact', { title: 'Edit contact', data: data, resdata: ''});
		} else {
			console.log('Contact not found.');
		}
		
	} else {
		
	}
    
})

app.post('/edit-contact/:id', async (req, res) => {
    const ContactIdToEdit = req.params.id;
	if(ContactIdToEdit != '') {
		const { email, firstname, lastname, phone, company, website, address, city, state, country, zip, jobtitle } = req.body;

        if (email == '' || firstname == '' || lastname == '' || phone == '' || company == '') {
            const resdata = {
                status: false,
                message: 'Required fields are missing - Email, Firstname, Lastname, Phone, Company'
            }
            const data = {
                id: req.params.id,
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
                submit: false
            }
            res.render('edit-contact', { title: 'Edit contact', data: data, resdata: resdata});
        } else {
            const data = {
                id: req.params.id,
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
            
            const contact = await contactModule.editContact(data);
            
            const resdata = {
                status: contact.status,
                message: contact.msg
            }

            //console.log('Module Res->>>' + contact.status);
            res.render('edit-contact', {title: 'Edit contact', data: data, resdata: resdata});
        }
		
	} else {
		console.log('Edit ID not found.');
	}
})

app.listen(3000, () => console.log('App running on http://localhost:3000'));