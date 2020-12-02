const express = require('express');
const uuid = require('uuid');
const router = express.Router();
const members = require('../../Members');

const idFilter = req => member => member.id === parseInt(req.params.id);

// Gets All Members
router.get('/', (req, res) => res.json(members));

// Get Single Member
router.get('/:id', (req, res) => {
  const found = members.some(idFilter(req));

  if (found) {
    res.json(members.filter(idFilter(req)));
  } else {
    res.status(400).json({ msg: `No member with the id of ${req.params.id}` });
  }
});

// Create Member
router.post('/', (req, res) => {
    const newMember = {
      ...req.body,
      id: uuid.v4(),
      status: 'active',
      name: req.body.name,
      email: req.body.email
    }
  
    if (!newMember.name || !newMember.email) {
      return res.status(400).json({ msg: 'Please include a name and email' });
    }
  
    members.push(newMember);
    res.json(members);
});

// Update Member
router.put('/:id', (req, res) => {
    const found = members.some(member => member.id === parseInt(req.params.id));
  
    if (found) {
        const updMember = req.body;
        members.forEach(member => {
        if (member.id === parseInt(req.params.id)) {
            member.name = updMember.name ? updMember.name : member.name;
            member.email = updMember.email ? updMember.email : member.email;

              res.json({ msg: 'Member updated', updMember });
        }
      });
    } else {
      res.status(400).json({ msg: `No member with the id of ${req.params.id}` });
    }
  });
  
  // Delete Member
  router.delete('/:id', (req, res) => {
    const found = members.some(idFilter(req));
  
    if (found) {
      res.json({
        msg: 'Member deleted',
        members: members.filter(member => !idFilter(req)(member))
      });
    } else {
      res.status(400).json({ msg: `No member with the id of ${req.params.id}` });
    }
  });
  
  module.exports = router;