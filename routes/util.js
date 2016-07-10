"use strict";

exports.isUser = (req, res) => {
  if(!req.user) {
    // If the client gets a 401, it should retry with correct credentials.
    res.status(401).send('Operation requires authentication.');
    return false;
  }
  return req.user;
};

exports.isAdmin = (req, res) => {
  if(!req.user) {
    // If the client gets a 401, it should retry with correct credentials.
    res.status(401).send('Operation requires authentication.');
    return false;
  }
  if(!req.user.admin) {
    // If the client gets a 403, it has authenticated with a user that lacks
    // necessary privileges.
    res.status(403).send('Operation requires admin authentication.');
    return false;
  }
  return req.user.admin;
}
