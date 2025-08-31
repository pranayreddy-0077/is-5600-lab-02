document.addEventListener('DOMContentLoaded', () => {
  const stocksData = JSON.parse(stockContent);
  const userData = JSON.parse(userContent);

  const userListEl = document.querySelector('.user-list');
  const portfolioListEl = document.querySelector('.portfolio-list');
  const saveButton = document.querySelector('#saveButton');
  const deleteButton = document.querySelector('#deleteButton');

  function generateUserList(users) {
    if (!userListEl) return;
    userListEl.innerHTML = '';
    users.forEach(({ user, id }) => {
      const li = document.createElement('li');
      li.innerText = `${user.lastname}, ${user.firstname}`;
      li.setAttribute('id', id);
      userListEl.appendChild(li);
    });
  }

  function populateForm(data) {
    const { user, id } = data;
    const idEl = document.querySelector('#userID');
    const fn = document.querySelector('#firstname');
    const ln = document.querySelector('#lastname');
    const addr = document.querySelector('#address');
    const city = document.querySelector('#city');
    const email = document.querySelector('#email');
    if (idEl) idEl.value = id;
    if (fn) fn.value = user.firstname || '';
    if (ln) ln.value = user.lastname || '';
    if (addr) addr.value = user.address || '';
    if (city) city.value = user.city || '';
    if (email) email.value = user.email || '';
  }

  function renderPortfolio(user) {
    if (!portfolioListEl) return;
    portfolioListEl.innerHTML = '';
    ['Symbol', '# Shares', 'Actions'].forEach(txt => {
      const h = document.createElement('h3');
      h.textContent = txt;
      portfolioListEl.appendChild(h);
    });
    (user.portfolio || []).forEach(({ symbol, owned }) => {
      const symbolEl = document.createElement('p');
      const sharesEl = document.createElement('p');
      const btn = document.createElement('button');
      symbolEl.innerText = symbol;
      sharesEl.innerText = owned;
      btn.innerText = 'View';
      btn.setAttribute('id', symbol);
      portfolioListEl.appendChild(symbolEl);
      portfolioListEl.appendChild(sharesEl);
      portfolioListEl.appendChild(btn);
    });
  }

  function viewStock(symbol) {
    const stockArea = document.querySelector('.stock-form');
    if (!stockArea) return;
    const stock = stocksData.find(s => s.symbol == symbol);
    if (!stock) return;
    const nameEl = document.querySelector('#stockName');
    const sectorEl = document.querySelector('#stockSector');
    const industryEl = document.querySelector('#stockIndustry');
    const addressEl = document.querySelector('#stockAddress');
    const logoEl = document.querySelector('#logo');
    if (nameEl) nameEl.textContent = stock.name || '';
    if (sectorEl) sectorEl.textContent = stock.sector || '';
    if (industryEl) industryEl.textContent = stock.subIndustry || '';
    if (addressEl) addressEl.textContent = stock.address || '';
    if (logoEl) logoEl.src = `logos/${symbol}.svg`;
  }

  function handleUserListClick(event) {
    if (event.target.tagName !== 'LI') return;
    const userId = event.target.id;
    const user = userData.find(u => u.id == userId);
    if (!user) return;
    populateForm(user);
    renderPortfolio(user);
  }

  if (userListEl) userListEl.addEventListener('click', handleUserListClick);

  if (portfolioListEl) {
    portfolioListEl.addEventListener('click', (event) => {
      if (event.target.tagName === 'BUTTON') viewStock(event.target.id);
    });
  }

  if (deleteButton) {
    deleteButton.addEventListener('click', (event) => {
      event.preventDefault();
      const userId = document.querySelector('#userID')?.value;
      const idx = userData.findIndex(u => u.id == userId);
      if (idx >= 0) {
        userData.splice(idx, 1);
        generateUserList(userData);
        portfolioListEl?.replaceChildren();
        document.querySelector('#userForm')?.reset?.();
      }
    });
  }

  if (saveButton) {
    saveButton.addEventListener('click', (event) => {
      event.preventDefault();
      const id = document.querySelector('#userID')?.value;
      for (let i = 0; i < userData.length; i++) {
        if (userData[i].id == id) {
          userData[i].user.firstname = document.querySelector('#firstname')?.value || '';
          userData[i].user.lastname = document.querySelector('#lastname')?.value || '';
          userData[i].user.address = document.querySelector('#address')?.value || '';
          userData[i].user.city = document.querySelector('#city')?.value || '';
          userData[i].user.email = document.querySelector('#email')?.value || '';
          generateUserList(userData);
          break;
        }
      }
    });
  }

  generateUserList(userData);
});

