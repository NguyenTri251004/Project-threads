const followDivs = document.querySelectorAll('.inner-follow');

followDivs.forEach(div => {
    div.addEventListener('click', () => {
        const span = div.querySelector('span'); 
        if (span.textContent.trim() === 'Follow') {
            span.textContent = 'Following'; 
            div.classList.add('btn-following'); 
        } else {
            span.textContent = 'Follow'; 
            div.classList.remove('btn-following'); 
        }
    });
});

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