import $ from 'jquery';
const host = window.location.host;
var styles = {
  position: 'absolute',
  padding: '5px 15px',
  right: '0px',
  top: '-5px',
  background: 'white',
  border: '1px solid #ccc',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '14px',
  color: '#fff',
  background: '#2d86f0',
  border: '1px solid #2d86f0',
};

if (host.includes('google.com')) {
  var searchInput = $('textarea[name="q"]').first();
  var parent = searchInput.parent();
  parent.css({ position: 'relative' });

  var btn = $('<span>转百度搜</span>');
  btn.on('click', (e) => {
    var val = searchInput.val();
    location.href = `https://www.baidu.com/s?wd=${val}`;
    e.preventDefault();
  });
  btn.css(styles);

  parent.append(btn);
}

if (host.includes('baidu.com')) {
  var searchInput = $('input[name="wd"]').first();
  var parent = searchInput.parent();
  parent.css({ position: 'relative' });

  var btn = $('<span>转谷歌搜</span>');
  btn.on('click', (e) => {
    var val = searchInput.val();
    location.href = `https://www.google.com/search?q=${val}`;
    e.preventDefault();
  });

  btn.css(styles);
  btn.css({
    marginTop: '-16px',
    top: '50%',
    right: '85px',
    background: '#4e6ef2',
    border: '1px solid #4e6ef2',
  });

  parent.append(btn);
}
