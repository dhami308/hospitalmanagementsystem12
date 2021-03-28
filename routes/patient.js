const router = require('express').Router();
const verify = require('./verifyToken');
const Patient = require('../model/Patient');
const PatientMedication = require('../model/PatientMedication');
const PatientCheckup = require('../model/PatientCheckup');
const PatientRecord = require('../model/PatientRecord');
const User = require('../model/User');
const jwt_decode = require('jwt-decode');
const { patientRegisterValidation, patientMedicationValidation, patientCheckupValidation } = require('../validation/patientValidation');
const ObjectId = require('mongodb').ObjectID;

router.post('/registration', verify, async (req, res) => {
    const token = req.header('auth-token');
    const decodedToken = jwt_decode(token);
    const verified_user = await User.find({ "_id": ObjectId(decodedToken._id) });
    // doctor, staff, nurse, admin can fill in their personal details
    if(verified_user[0].user_role==="doctor" || verified_user[0].user_role==="staff" || verified_user[0].user_role==="admin" || verified_user[0].user_role==="nurse"){ 
        const {error} = patientRegisterValidation(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        // create a new user
        const patient = new Patient({
            full_name: req.body.full_name,
            gender: req.body.gender,
            dob: req.body.dob,
            occupation: req.body.occupation,
            marital_status: req.body.marital_status,
            email: req.body.email,
            registered_by: decodedToken._id,
        });
        try {
            const savedDetails = await patient.save();
            res.send('Patient saved Sucessfully.');
        }
        catch(err) { 
            res.status(400).send(err.keyValue._id + ' has already registered details' );
        }
    } else {
        res.status(400).send('You cannot fill in this details.');
    }
});

// Read all
router.get('/all', verify, async (req, res) => {
    const token = req.header('auth-token');
    const decodedToken = jwt_decode(token);
    const verified_user = await User.find({ "_id": ObjectId(decodedToken._id) });
    // admin
    if (verified_user[0].user_role === "admin" || verified_user[0].user_role==="staff" || verified_user[0].user_role==="doctor" || verified_user[0].user_role==="nurse") {
        const patientData = await Patient.find();
        try {
            res.send(patientData);
        } catch (err) {
            res.status(400).send(err);
        }
    } else { 
        res.status(400).send('Access Denied!'); 
    }
});

// Read one
router.get('/:id', verify, async (req, res) => {
    const token = req.header('auth-token');
    const decodedToken = jwt_decode(token);
    const verified_user = await User.find({ "_id": ObjectId(decodedToken._id) });
    const { id } = req.params;
    // admin
    if (verified_user[0].user_role === "doctor" || verified_user[0].user_role === "staff" || verified_user[0].user_role === "admin" || verified_user[0].user_role === "nurse") {
        const patient = await Patient.findOne({ "_id": id });
        if(!patient) return res.status(400).send('Patient not found.');
        try {
            res.send(patient);
        } catch(err) { 
            res.status(400).send(err);
        }
    }
});

// Update one
router.put('/:id', verify, async (req, res) => {
    const token = req.header('auth-token');
    const decodedToken = jwt_decode(token);
    const verified_user = await User.find({ "_id": ObjectId(decodedToken._id) });
    const { id } = req.params;
    if (verified_user[0].user_role==="doctor" || verified_user[0].user_role==="staff" || verified_user[0].user_role==="admin" || verified_user[0].user_role==="nurse") {
        //validate the request
        const value = await req.body;
        const patientData = await Patient.findOne({ "_id": id });
        if(!patientData) return res.status(400).send('Patient not found.'); 
        try {
            const updated = await Patient.update({
                _id: id,
            }, {$set: value});
            res.send(value);
        } catch(err) { 
            res.status(400).send(err);
        }
    }
    
});


// Delete one
router.delete('/:id', verify, async (req, res) => {
    const token = req.header('auth-token');
    const decodedToken = jwt_decode(token);
    const verified_user = await User.find({ "_id": ObjectId(decodedToken._id) });
    const { id } = req.params;
    if (verified_user[0].user_role === "doctor"
        || verified_user[0].user_role === "staff"
        || verified_user[0].user_role === "admin"
        || verified_user[0].user_role === "nurse") {
        const patient = await Patient.findOne({ "_id": id });
        if (!patient) return res.status(400).send('Patient not found.');
        try {
            const deleted = await Patient.remove({
                _id: id
            });
            res.send("Patient deleted sucessfully.");
        } catch (err) {
            res.status(400).send(err);
        }
    }
});


router.post('/medication/:id', verify, async (req, res) => {
    const token = req.header('auth-token');
    const decodedToken = jwt_decode(token);
    const verified_user = await User.find({ "_id": ObjectId(decodedToken._id) });
    // doctor, staff, nurse, admin can fill in their personal details
    if (verified_user[0].user_role === "doctor" || verified_user[0].user_role === "staff" || verified_user[0].user_role === "admin" || verified_user[0].user_role === "nurse") {
        const { id } = req.params;
        if (verified_user[0].user_role === "doctor") { 
            const doctor_id = verified_user[0]._id;
            const {error} = patientMedicationValidation(req.body);
            if (error) return res.status(400).send(error.details[0].message);
            const patientMedicationData = new PatientMedication({
                doctor_id: doctor_id,
                patient_id: id,
                medicine_name: req.body.medicine_name,
                usage_type: req.body.usage_type,
                morning:req.body.morning,
                afternoon:req.body.afternoon,
                night:req.body.night,
                days:req.body.days,
                quantity: req.body.quantity,
                notes: req.body.notes
            });
            try {
                const savedDetails = await patientMedicationData.save();
                console.log(savedDetails);
                res.send('Patient Medication saved Sucessfully.');
            }
            catch(err) { 
                res.status(400).send(err);
            }
        }
        // const {error} = patientRecordValidation(req.body);
        // if (error) return res.status(400).send(error.details[0].message);
        // create a new user 
    } else { 
        res.status(400).send('Access Denied!');
    }
});


// Read all
router.get('/medication/all', verify, async (req, res) => {
    const token = req.header('auth-token');
    const decodedToken = jwt_decode(token);
    const verified_user = await User.find({ "_id": ObjectId(decodedToken._id) });
    // admin
    if (verified_user[0].user_role === "admin" || verified_user[0].user_role==="doctor" || verified_user[0].user_role==="nurse") {
        const patientMedicationData = await PatientMedication.find();
        try {
            res.send(patientMedicationData);
        } catch (err) {
            res.status(400).send(err);
        }
    } else { 
        res.status(400).send('Access Denied!'); 
    }
});

// Read one
router.get('/medication/:id', verify, async (req, res) => {
    const token = req.header('auth-token');
    const decodedToken = jwt_decode(token);
    const verified_user = await User.find({ "_id": ObjectId(decodedToken._id) });
    const { id } = req.params;
    // admin
    if (verified_user[0].user_role === "doctor" || verified_user[0].user_role === "admin" || verified_user[0].user_role === "nurse") {
        const patientMedicationData = await PatientMedication.findOne({ "_id": id });
        if(!patientMedicationData) return res.status(400).send('Patient not found.');
        try {
            res.send(patientMedicationData);
        } catch(err) { 
            res.status(400).send(err);
        }
    }
});

// Update one
router.put('/medication/:id', verify, async (req, res) => {
    const token = req.header('auth-token');
    const decodedToken = jwt_decode(token);
    const verified_user = await User.find({ "_id": ObjectId(decodedToken._id) });
    const { id } = req.params;
    if (verified_user[0].user_role==="doctor" || verified_user[0].user_role==="admin" || verified_user[0].user_role==="nurse") {
        //validate the request
        const value = await req.body;
        const patientMedicationData = await PatientMedication.findOne({ "_id": id });
        if(!patientMedicationData) return res.status(400).send('Patient not found.'); 
        try {
            const updated = await PatientMedication.update({
                _id: id,
            }, {$set: value});
            res.send(value);
        } catch(err) { 
            res.status(400).send(err);
        }
    }
    
});

// Delete one
router.delete('/medication/:id', verify, async (req, res) => {
    const token = req.header('auth-token');
    const decodedToken = jwt_decode(token);
    const verified_user = await User.find({ "_id": ObjectId(decodedToken._id) });
    const { id } = req.params;
    if (verified_user[0].user_role === "doctor"
        || verified_user[0].user_role === "admin"
        || verified_user[0].user_role === "nurse") {
        const patientMedicationData = await PatientMedication.findOne({ "_id": id });
        if (!patientMedicationData) return res.status(400).send('Patient not found.');
        try {
            const deleted = await PatientMedication.remove({
                _id: id
            });
            res.send("Patient deleted sucessfully.");
        } catch (err) {
            res.status(400).send(err);
        }
    }
});

router.post('/checkup/:id', verify, async (req, res) => {
    const token = req.header('auth-token');
    const decodedToken = jwt_decode(token);
    const verified_user = await User.find({ "_id": ObjectId(decodedToken._id) });
    // doctor, staff, nurse, admin can fill in their personal details
    if (verified_user[0].user_role === "doctor" || verified_user[0].user_role === "staff" || verified_user[0].user_role === "admin" || verified_user[0].user_role === "nurse") {
        const { id } = req.params;
        if (verified_user[0].user_role === "doctor") { 
            const doctor_id = verified_user[0]._id;
            const {error} = patientCheckupValidation(req.body);
            if (error) return res.status(400).send(error.details[0].message);
            const patientCheckupData = new PatientCheckup({
                patient_id: id,
                doctor_id: doctor_id,
                complaints: req.body.complaints,
                interpretation: req.body.interpretation
            });
            try {
                const savedDetails = await patientCheckupData.save();
                console.log(savedDetails);
                res.send('Patient Checkup saved Sucessfully.');
            }
            catch(err) { 
                res.status(400).send(err);
            }
        }
        // const {error} = patientRecordValidation(req.body);
        // if (error) return res.status(400).send(error.details[0].message);
        // create a new user 
    } else { 
        res.status(400).send('Access Denied!');
    }
});

// Read all
router.get('/checkup/all', verify, async (req, res) => {
    const token = req.header('auth-token');
    const decodedToken = jwt_decode(token);
    const verified_user = await User.find({ "_id": ObjectId(decodedToken._id) });
    // admin
    if (verified_user[0].user_role === "admin" || verified_user[0].user_role==="doctor" || verified_user[0].user_role==="nurse") {
        const patientCheckupData = await PatientCheckup.find();
        try {
            res.send(patientCheckupData);
        } catch (err) {
            res.status(400).send(err);
        }
    } else { 
        res.status(400).send('Access Denied!'); 
    }
});

// Read one
router.get('/checkup/:id', verify, async (req, res) => {
    const token = req.header('auth-token');
    const decodedToken = jwt_decode(token);
    const verified_user = await User.find({ "_id": ObjectId(decodedToken._id) });
    const { id } = req.params;
    // admin
    if (verified_user[0].user_role === "doctor" || verified_user[0].user_role === "admin" || verified_user[0].user_role === "nurse") {
        const patientCheckupData = await PatientCheckup.findOne({ "_id": id });
        if(!patientCheckupData) return res.status(400).send('Patient not found.');
        try {
            res.send(patientCheckupData);
        } catch(err) { 
            res.status(400).send(err);
        }
    }
});

// Update one
router.put('/checkup/:id', verify, async (req, res) => {
    const token = req.header('auth-token');
    const decodedToken = jwt_decode(token);
    const verified_user = await User.find({ "_id": ObjectId(decodedToken._id) });
    const { id } = req.params;
    if (verified_user[0].user_role==="doctor" || verified_user[0].user_role==="admin" || verified_user[0].user_role==="nurse") {
        //validate the request
        const value = await req.body;
        const patientCheckupData = await PatientCheckup.findOne({ "_id": id });
        if(!patientCheckupData) return res.status(400).send('Patient not found.'); 
        try {
            const updated = await PatientCheckup.update({
                _id: id,
            }, {$set: value});
            res.send(value);
        } catch(err) { 
            res.status(400).send(err);
        }
    }
    
});

// Delete one
router.delete('/checkup/:id', verify, async (req, res) => {
    const token = req.header('auth-token');
    const decodedToken = jwt_decode(token);
    const verified_user = await User.find({ "_id": ObjectId(decodedToken._id) });
    const { id } = req.params;
    if (verified_user[0].user_role === "doctor"
        || verified_user[0].user_role === "admin"
        || verified_user[0].user_role === "nurse") {
        const patientCheckupData = await PatientCheckup.findOne({ "_id": id });
        if (!patientCheckupData) return res.status(400).send('Patient not found.');
        try {
            const deleted = await PatientCheckup.remove({
                _id: id
            });
            res.send("Patient deleted sucessfully.");
        } catch (err) {
            res.status(400).send(err);
        }
    }
});

router.post('/record/:id', verify, async (req, res) => {
    const token = req.header('auth-token');
    const decodedToken = jwt_decode(token);
    const verified_user = await User.find({ "_id": ObjectId(decodedToken._id) });
    // doctor, staff, nurse, admin can fill in their personal details
    if (verified_user[0].user_role === "doctor" || verified_user[0].user_role === "admin" || verified_user[0].user_role === "nurse") {
        const { id } = req.params;
        if (verified_user[0].user_role === "doctor") { 
            const doctor_id = verified_user[0]._id;
            const patientRecordData = new PatientRecord({
                doctor_id: doctor_id,
                patient_id: id
            });
            try {
                const savedDetails = await patientRecordData.save();
                console.log(savedDetails);
                res.send('Patient Record saved Sucessfully.');
            }
            catch(err) { 
                res.status(400).send(err);
            }
        }
        // const {error} = patientRecordValidation(req.body);
        // if (error) return res.status(400).send(error.details[0].message);
        // create a new user 
    } else { 
        res.status(400).send('Access Denied!');
    }
});


// Read all
router.get('/record/all', verify, async (req, res) => {
    const token = req.header('auth-token');
    const decodedToken = jwt_decode(token);
    const verified_user = await User.find({ "_id": ObjectId(decodedToken._id) });
    // admin
    if (verified_user[0].user_role === "admin" || verified_user[0].user_role==="doctor" || verified_user[0].user_role==="nurse") {
        const patientRecordData = await PatientRecord.find();
        try {
            res.send(patientRecordData);
        } catch (err) {
            res.status(400).send(err);
        }
    } else { 
        res.status(400).send('Access Denied!'); 
    }
});

module.exports = router;