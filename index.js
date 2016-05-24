import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { default as jwtAuth } from 'express-jwt';
import bodyParser from 'body-parser';

const secret = 'kazoo';

const app = express();
app.use(cors());
app.use(jwtAuth({secret: secret}).unless({path: ['/auth', '/verify']}));
app.use(bodyParser.json());

app.post("/auth", (req, res) => {
  console.log('/auth');
  const user = {
    email: req.body.email,
    organization: {
      id: 'C001',
      companyName: 'Waltco'
    }
  };
  // do authentication check...
  if(user) {
    const token = jwt.sign(user, secret, { expiresIn: "1 day" });
    console.log(token);
    res.json({user, token});
  }
  else {
    res.json({status: 'error', message: 'Error logging in. Please check your e-mail address and password and try again.'});
  }
});

app.post("/verify", (req, res) => {
  console.log('/verify');
  const claims = jwt.verify(req.body.token, secret);
  console.log(claims);
  res.json({claims});
});

app.post("/add/*", (req, res) => {
  console.log('/create', req.body);
  const gateData = req.body.gateData;
  res.json({status: 'success', message: 'Gate added successfully.'});
});

app.put("/update/*", (req, res) => {
  console.log('/patch', req.body);
  const gateData = req.body.gateData;
  res.json({status: 'success', message: 'Gate updated successfully.'});
});

const port = process.env.PORT || 3333;

const server = app.listen(port, () => {
  console.log('Service started on port :' + port);
});
