import request from 'supertest';
import { expect } from 'chai';
import express from 'express';
import bodyParser from 'body-parser';
import { describe, it } from 'mocha';

// Initialize the Express application
const app = express();
app.use(bodyParser.json());

// Define the endpoint to handle contact submissions
app.post('/submit-contact', async (req, res) => {
  const { fullName, userEmail, userMessage } = req.body;

  // Validate presence of required fields
  if (!fullName || !userEmail || !userMessage) {
    return res.status(400).json({ error: 'Please provide all required fields.' });
  }

  // Validate that fullName is a string and not numeric
  if (typeof fullName !== 'string' || /\d/.test(fullName)) {
    return res.status(400).json({ error: 'Full name should be a valid string without numbers.' });
  }

  // Basic XSS prevention
  if (/<|>/.test(userMessage)) {
    return res.status(400).json({ error: 'User message contains invalid characters.' });
  }

  // Validate email format
  const emailValidator = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailValidator.test(userEmail)) {
    return res.status(400).json({ error: 'The provided email address is not valid.' });
  }

  // Simulate saving the contact data and respond with a success message
  res.status(201).json({ status: 'Contact information saved successfully.' });
});

// Handle unsupported HTTP methods
app.all('/submit-contact', (req, res) => {
  res.set('Allow', 'POST').status(405).json({ error: `Method ${req.method} not allowed.` });
});

describe('Contact Submission API', function () {
  this.timeout(5000);

  // Test case for successful contact submission
  it('should successfully save contact information', async function () {
    const validContact = {
      fullName: "vijay zala",
      userEmail: "vijayzala@example.com",
      userMessage: "This is a test message."
    };

    const response = await request(app).post('/submit-contact').send(validContact);
    expect(response.statusCode).to.equal(201);
    expect(response.body).to.have.property('status', 'Contact information saved successfully.');
  });

  // Test case for missing fields
  it('should return 400 for missing fields', async function () {
    const incompleteContact = {
      fullName: "vijay zala",
      userEmail: "vijayzala@example.com"
      // userMessage is missing
    };

    const response = await request(app).post('/submit-contact').send(incompleteContact);
    expect(response.statusCode).to.equal(400);
    expect(response.body).to.have.property('error', 'Please provide all required fields.');
  });

  // Test case for missing email
  it('should return 400 for missing email', async function () {
    const missingEmailContact = {
      fullName: "vijay zala",
      userMessage: "This is a test message."
    };

    const response = await request(app).post('/submit-contact').send(missingEmailContact);
    expect(response.statusCode).to.equal(400);
    expect(response.body).to.have.property('error', 'Please provide all required fields.');
  });

  // Test case for missing message
  it('should return 400 for missing message', async function () {
    const missingMessageContact = {
      fullName: "vijay zala",
      userEmail: "vijayzala@example.com"
    };

    const response = await request(app).post('/submit-contact').send(missingMessageContact);
    expect(response.statusCode).to.equal(400);
    expect(response.body).to.have.property('error', 'Please provide all required fields.');
  });

  // Test case for invalid email format
  it('should return 400 for incorrect email format', async function () {
    const invalidEmailContact = {
      fullName: "vijay zala",
      userEmail: "invalid-email",
      userMessage: "This is a test message."
    };

    const response = await request(app).post('/submit-contact').send(invalidEmailContact);
    expect(response.statusCode).to.equal(400);
    expect(response.body).to.have.property('error', 'The provided email address is not valid.');
  });

  // Test case for very long message
  it('should successfully save contact with a very long message', async function () {
    const longMessageContact = {
      fullName: "vijay zala",
      userEmail: "vijayzala@example.com",
      userMessage: "A".repeat(10000)  // Extremely long message
    };

    const response = await request(app).post('/submit-contact').send(longMessageContact);
    expect(response.statusCode).to.equal(201);
    expect(response.body).to.have.property('status', 'Contact information saved successfully.');
  });

  // Test case for empty request body
  it('should return 400 for an empty request body', async function () {
    const response = await request(app).post('/submit-contact').send({});
    expect(response.statusCode).to.equal(400);
    expect(response.body).to.have.property('error', 'Please provide all required fields.');
  });

  // Test case for extra fields in request
  it('should successfully handle extra fields', async function () {
    const contactWithExtras = {
      fullName: "vijay zala",
      userEmail: "vijayzala@example.com",
      userMessage: "This is a test message.",
      additionalField: "Extra data"  // Extra field
    };

    const response = await request(app).post('/submit-contact').send(contactWithExtras);
    expect(response.statusCode).to.equal(201);
    expect(response.body).to.have.property('status', 'Contact information saved successfully.');
  });


  // Test case for numeric value in name field
  it('should return 400 for numeric fullName', async function () {
    const invalidContact = {
      fullName: 12345, // Invalid name type
      userEmail: "vijayzala@example.com",
      userMessage: "This is a test message."
    };

    const response = await request(app).post('/submit-contact').send(invalidContact);
    expect(response.statusCode).to.equal(400);
    expect(response.body).to.have.property('error', 'Full name should be a valid string without numbers.');
  });

  // Test case for XSS attack prevention
  it('should return 400 for potential XSS attack in userMessage', async function () {
    const xssAttackContact = {
      fullName: "vijay zala",
      userEmail: "vijayzala@example.com",
      userMessage: "<script>alert('XSS')</script>"
    };

    const response = await request(app).post('/submit-contact').send(xssAttackContact);
    expect(response.statusCode).to.equal(400);
    expect(response.body).to.have.property('error', 'User message contains invalid characters.');
  });


  // Test case for special characters in email
  it('should return 400 for special characters in email', async function () {
    const specialCharEmailContact = {
      fullName: "vijay zala",
      userEmail: "vijayzala@@example.com", // Invalid email
      userMessage: "This is a test message."
    };

    const response = await request(app).post('/submit-contact').send(specialCharEmailContact);
    expect(response.statusCode).to.equal(400);
    expect(response.body).to.have.property('error', 'The provided email address is not valid.');
  });

  // Test case for long fullName field
  it('should successfully handle a long fullName', async function () {
    const longNameContact = {
      fullName: "A".repeat(256), // Extremely long name
      userEmail: "vijayzala@example.com",
      userMessage: "This is a test message."
    };

    const response = await request(app).post('/submit-contact').send(longNameContact);
    expect(response.statusCode).to.equal(201);
    expect(response.body).to.have.property('status', 'Contact information saved successfully.');
  });

  // Test case for invalid email without domain
  it('should return 400 for email without domain', async function () {
    const invalidEmailContact = {
      fullName: "vijay zala",
      userEmail: "vijayzala@", // Invalid email
      userMessage: "This is a test message."
    };

    const response = await request(app).post('/submit-contact').send(invalidEmailContact);
    expect(response.statusCode).to.equal(400);
    expect(response.body).to.have.property('error', 'The provided email address is not valid.');
  });

  // Test case for PUT method not allowed
  it('should return 405 for PUT method', async function () {
    const validContact = {
      fullName: "vijay zala",
      userEmail: "vijayzala@example.com",
      userMessage: "This is a test message."
    };

    const response = await request(app).put('/submit-contact').send(validContact); // PUT request
    expect(response.statusCode).to.equal(405);
  });

  // Test case for DELETE method not allowed
  it('should return 405 for DELETE method', async function () {
    const response = await request(app).delete('/submit-contact'); // DELETE request
    expect(response.statusCode).to.equal(405);
  });

  // Test case for PATCH method not allowed
  it('should return 405 for PATCH method', async function () {
    const partialContact = {
      fullName: "vijay zala"
    };

    const response = await request(app).patch('/submit-contact').send(partialContact); // PATCH request
    expect(response.statusCode).to.equal(405);
  });

  // Test case for special characters in fullName
  it('should successfully handle special characters in fullName', async function () {
    const specialCharNameContact = {
      fullName: "vijay@zala!",
      userEmail: "vijayzala@example.com",
      userMessage: "This is a test message."
    };

    const response = await request(app).post('/submit-contact').send(specialCharNameContact);
    expect(response.statusCode).to.equal(201);
    expect(response.body).to.have.property('status', 'Contact information saved successfully.');
  });

  // Test case for too short message
  it('should successfully save contact with a very short message', async function () {
    const shortMessageContact = {
      fullName: "vijay zala",
      userEmail: "vijayzala@example.com",
      userMessage: "Hi"  // Very short message
    };

    const response = await request(app).post('/submit-contact').send(shortMessageContact);
    expect(response.statusCode).to.equal(201);
    expect(response.body).to.have.property('status', 'Contact information saved successfully.');
  });
});

