exports.index = function(req, res) {
  res.render('index', { title: 'SuperScript Community Editor'});
}

exports.docs = function(req, res) {
  res.render('docs');
}