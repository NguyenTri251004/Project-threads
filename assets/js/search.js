//get cookie
function getCookie(cname) {
  const name = cname + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1);
    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
  }
  return null; 
}
//xu ly follow va unfollow
const followDivs = document.querySelectorAll('.inner-follow');

followDivs.forEach(div => {
    const span = div.querySelector('span'); 
    const userId = getCookie('userId');
    const followedId = div.dataset.id;
    if (span.textContent.trim() === 'Following') {
        div.classList.add('btn-following');
    }
    div.addEventListener('click', async () => {
        if (span.textContent.trim() === 'Follow') {
            span.textContent = 'Following'; 
            div.classList.add('btn-following'); 
            fetch('/search', {
              method: 'POST',
              body: JSON.stringify({
                  followerId: userId,  
                  followedId: followedId   
              }),
              headers: { 'Content-Type': 'application/json' }
          });
        } else {
            span.textContent = 'Follow'; 
            div.classList.remove('btn-following'); 
            fetch('/search', {
              method: 'DELETE',
              body: JSON.stringify({
                  followerId: userId,  
                  followedId: followedId   
              }),
              headers: { 'Content-Type': 'application/json' }
          });
        }
    });
});
//search theo ten
document.querySelector('.search-input').addEventListener('input', function () {
    const query = this.value.toLowerCase();  
    const userItems = document.querySelectorAll('.container-post');  
    
    userItems.forEach(item => {
      const username = item.querySelector('.user-name').textContent.toLowerCase();  
      const subname = item.querySelector('.sub-name').textContent.toLowerCase();   
    
      if (username.includes(query) || subname.includes(query)) {
        item.style.display = 'flex';  
      } else {
        item.classList.remove('d-flex');  
        item.style.display = 'none';  
      }
    });
});

