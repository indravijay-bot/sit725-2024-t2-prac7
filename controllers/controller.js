import Contact from '../models/model.js';

const addTwoNumber = (n1, n2) => {
    return n1 + n2;
};

const saveContact = async (req, res) => {
    try {
        const n1 = parseInt(req.query.n1);
        const n2 = parseInt(req.query.n2);
        const result = addTwoNumber(n1, n2);
        res.status(200).json({ data: result });
    } catch (error) {
        res.status(400).json({ error: 'Error: ' + error.message });
    }
};

const addTwoNumberFn = async (req, res) => {
    try {
        res.status(200).json({ message: 'Hurray!!! your Email and message saved successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Error saving email and message: ' + error.message });
    }
};

export { saveContact, addTwoNumberFn };
